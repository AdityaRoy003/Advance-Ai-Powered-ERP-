import { Router } from 'express';
import { listDocuments, issueDocument, verifyDocumentHash } from './document.controller.js';

const router = Router();

router.get('/', listDocuments);
router.post('/', issueDocument);
router.get('/verify/:txHash', verifyDocumentHash);

export default router;
