import { Router } from 'express';
import Library from './library.model.js';
import { sendSuccess, sendError } from '../../core/response/apiResponse.js';

const router = Router();

const defaultBooks = [
  { title: 'Introduction to Algorithms (CLRS 4th Ed)', author: 'Thomas H. Cormen, Charles E. Leiserson', isbn: '978-0262046305', copies: 12, available: 8, location: 'Shelf A-1 (CS)' },
  { title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell & Peter Norvig', isbn: '978-0134610993', copies: 10, available: 6, location: 'Shelf A-3 (AI)' },
  { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', isbn: '978-1449373320', copies: 15, available: 11, location: 'Shelf B-2 (Sys)' },
  { title: 'Clean Architecture: A Craftsman\'s Guide', author: 'Robert C. Martin (Uncle Bob)', isbn: '978-0134494166', copies: 8, available: 4, location: 'Shelf B-4 (SE)' },
  { title: 'Computer Networking: A Top-Down Approach', author: 'James Kurose & Keith Ross', isbn: '978-0136681557', copies: 14, available: 9, location: 'Shelf C-1 (Net)' },
  { title: 'Deep Learning with Python', author: 'François Chollet', isbn: '978-1617296864', copies: 6, available: 5, location: 'Shelf A-4 (AI)' },
  { title: 'Database System Concepts (7th Edition)', author: 'Abraham Silberschatz & Henry F. Korth', isbn: '978-0078022159', copies: 16, available: 12, location: 'Shelf C-3 (DB)' },
  { title: 'Principles of Neural Science', author: 'Eric Kandel & James Schwartz', isbn: '978-0071390118', copies: 5, available: 3, location: 'Shelf D-2 (Bio)' }
];

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
    let books = await Library.find(filter).sort({ title: 1 }).lean();
    if (books.length === 0 && !search) {
      await Library.insertMany(defaultBooks);
      books = await Library.find().sort({ title: 1 }).lean();
    }
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
