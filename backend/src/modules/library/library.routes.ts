import { Router } from 'express';
import Library from './library.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

const router = Router();

// Root GET /library — returns all books (what the frontend api.js calls)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const filter: any = {};
    if (search) {
      filter.$or = [
        { title: { $regex: String(search), $options: 'i' } },
        { author: { $regex: String(search), $options: 'i' } },
        { isbn: { $regex: String(search), $options: 'i' } }
      ];
    }
    const books = await Library.find(filter).sort({ title: 1 }).lean();
    const formatted = books.map((b: any) => ({
      id: b._id,
      title: b.title,
      author: b.author,
      isbn: b.isbn,
      available: b.available,
      total: b.copies,
      location: b.location
    }));
    return sendSuccess(res, 'Library books retrieved', formatted);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch library books', null, 500);
  }
});

// GET /library/books — alias for root
router.get('/books', async (req, res) => {
  try {
    const books = await Library.find().sort({ title: 1 }).lean();
    const formatted = books.map((b: any) => ({
      id: b._id,
      title: b.title,
      author: b.author,
      isbn: b.isbn,
      available: b.available,
      total: b.copies,
      location: b.location
    }));
    return sendSuccess(res, 'Library books retrieved', { books: formatted });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch library books', null, 500);
  }
});

router.post('/issue', async (req, res) => {
  try {
    const { bookId, studentId } = req.body;
    const book = await Library.findById(bookId);
    if (!book) {
      return sendError(res, 'Book not found', null, 404);
    }
    if (book.available <= 0) {
      return sendError(res, 'No copies available for issue', null, 400);
    }

    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    book.issues.push({
      studentId,
      issueDate: new Date(),
      dueDate,
      status: 'issued',
      fineAmount: 0
    });

    book.available -= 1;
    await book.save();

    return sendSuccess(res, 'Book issued successfully', {
      issueId: book.issues[book.issues.length - 1]._id,
      bookId,
      studentId,
      issueDate: new Date(),
      dueDate
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to issue book', null, 500);
  }
});

export default router;
