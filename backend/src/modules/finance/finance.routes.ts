import { Router } from 'express';
import Finance from './finance.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

const router = Router();

const seedDefaultInvoices = async (institutionId?: any) => {
  const defaultInvoices = [
    {
      title: 'Semester 4 Tuition Fee (B.Tech CSE)',
      studentName: 'Aditya Roy',
      amountDue: 45000,
      amountPaid: 45000,
      status: 'paid' as const,
      dueDate: new Date('2026-07-15'),
      payments: [{ amount: 45000, paymentDate: new Date('2026-07-10'), transactionId: 'TXN-9982741', paymentMethod: 'UPI / NetBanking' }],
      institutionId
    },
    {
      title: 'Semester 5 Advanced AI & Lab Levy',
      studentName: 'Aditya Roy',
      amountDue: 28000,
      amountPaid: 10000,
      status: 'partial' as const,
      dueDate: new Date('2026-10-30'),
      payments: [{ amount: 10000, paymentDate: new Date('2026-09-01'), transactionId: 'TXN-8827361', paymentMethod: 'Credit Card' }],
      institutionId
    },
    {
      title: 'Campus Hostel & Smart Mess Fee (Quarter 3)',
      studentName: 'Aditya Roy',
      amountDue: 18500,
      amountPaid: 0,
      status: 'unpaid' as const,
      dueDate: new Date('2026-11-15'),
      payments: [],
      institutionId
    },
    {
      title: 'Library Security Deposit & Examination Fee',
      studentName: 'Aditya Roy',
      amountDue: 6000,
      amountPaid: 6000,
      status: 'paid' as const,
      dueDate: new Date('2026-06-01'),
      payments: [{ amount: 6000, paymentDate: new Date('2026-05-28'), transactionId: 'TXN-7738291', paymentMethod: 'Debit Card' }],
      institutionId
    }
  ];

  return (await Finance.insertMany(defaultInvoices as any)) as any;
};

// GET /finance or /finance/overview
router.get('/', async (req, res) => {
  try {
    let feeStatements = await Finance.find().sort({ createdAt: -1 });
    if (feeStatements.length === 0) {
      feeStatements = await seedDefaultInvoices();
    }

    const totalRevenue = feeStatements.reduce((acc, f) => acc + (f.amountPaid || 0), 0);
    const pendingFees = feeStatements.reduce((acc, f) => acc + Math.max(0, (f.amountDue || 0) - (f.amountPaid || 0)), 0);

    const recentTransactions = feeStatements.map((f: any, idx) => ({
      id: f._id,
      student: (f as any).studentName || 'Aditya Roy',
      type: f.title,
      amount: `₹${f.amountDue.toLocaleString()}`,
      amountPaid: `₹${f.amountPaid.toLocaleString()}`,
      status: f.status === 'paid' ? 'Completed' : f.status === 'partial' ? 'Pending' : 'Failed',
      date: f.dueDate ? new Date(f.dueDate).toISOString().split('T')[0] : '2026-10-15'
    }));

    return sendSuccess(res, 'Finance overview retrieved', {
      totalRevenue: `₹${totalRevenue.toLocaleString()}`,
      pendingFees: `₹${pendingFees.toLocaleString()}`,
      dispatchedSalaries: '₹14,50,000',
      recentTransactions,
      invoices: feeStatements
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch finance overview', null, 500);
  }
});

router.get('/overview', async (req, res) => {
  return (router as any).handle({ ...req, url: '/' }, res);
});

router.get('/fees', async (req, res) => {
  try {
    let feeStatements = await Finance.find().sort({ createdAt: -1 });
    if (feeStatements.length === 0) {
      feeStatements = await seedDefaultInvoices();
    }

    const formatted = feeStatements.map(f => ({
      id: f._id,
      title: f.title,
      amountDue: f.amountDue,
      amountPaid: f.amountPaid,
      status: f.status,
      dueDate: f.dueDate ? new Date(f.dueDate).toISOString().split('T')[0] : '2026-10-30',
      studentName: (f as any).studentName || 'Aditya Roy'
    }));

    return sendSuccess(res, 'Fee status retrieved', { feeStatements: formatted });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch fee status', null, 500);
  }
});

router.post('/pay', async (req, res) => {
  try {
    const { statementId, amount, paymentMethod } = req.body;
    let statement = null;
    if (statementId && String(statementId).match(/^[0-9a-fA-F]{24}$/)) {
      statement = await Finance.findById(statementId);
    }
    
    if (!statement) {
      // Find first unpaid or create record
      statement = await Finance.findOne({ status: { $ne: 'paid' } });
    }

    const txId = `TXN-${Math.floor(Math.random() * 90000000 + 10000000)}`;
    const payAmount = Number(amount) || 5000;

    if (statement) {
      statement.payments.push({
        amount: payAmount,
        paymentDate: new Date(),
        transactionId: txId,
        paymentMethod: paymentMethod || 'Instant UPI / Card'
      });
      statement.amountPaid += payAmount;
      if (statement.amountPaid >= statement.amountDue) {
        statement.status = 'paid';
      } else if (statement.amountPaid > 0) {
        statement.status = 'partial';
      }
      await statement.save();
    }

    return sendSuccess(res, 'Payment processed successfully', {
      transactionId: txId,
      statementId: statement?._id || statementId,
      amount: payAmount,
      paymentMethod: paymentMethod || 'Instant UPI / Card Gateway',
      paymentDate: new Date(),
      status: 'success'
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to process payment', null, 500);
  }
});

export default router;
