import { Router } from 'express';
import Finance from './finance.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

const router = Router();

router.get('/fees', async (req, res) => {
  try {
    const feeStatements = await Finance.find().populate({
      path: 'studentId',
      populate: { path: 'userId', select: 'firstName lastName' }
    });

    const formatted = feeStatements.map(f => {
      const student = f.studentId as any;
      const user = student?.userId as any;
      return {
        id: f._id,
        title: f.title,
        amountDue: f.amountDue,
        amountPaid: f.amountPaid,
        status: f.status,
        dueDate: f.dueDate.toISOString().split('T')[0],
        studentName: user ? `${user.firstName} ${user.lastName}` : 'Student'
      };
    });

    return sendSuccess(res, 'Fee status retrieved', { feeStatements: formatted });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch fee status', null, 500);
  }
});

router.post('/pay', async (req, res) => {
  try {
    const { statementId, amount, paymentMethod } = req.body;
    const statement = await Finance.findById(statementId);
    if (!statement) {
      return sendError(res, 'Statement not found', null, 404);
    }

    const txId = `TXN-${Math.floor(Math.random() * 90000000 + 10000000)}`;
    statement.payments.push({
      amount: Number(amount),
      paymentDate: new Date(),
      transactionId: txId,
      paymentMethod: paymentMethod || 'Unknown'
    });

    statement.amountPaid += Number(amount);
    if (statement.amountPaid >= statement.amountDue) {
      statement.status = 'paid';
    } else if (statement.amountPaid > 0) {
      statement.status = 'partial';
    }

    await statement.save();

    return sendSuccess(res, 'Payment processed successfully', {
      transactionId: txId,
      statementId,
      amount,
      paymentMethod,
      paymentDate: new Date(),
      status: 'success'
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to process payment', null, 500);
  }
});

export default router;
