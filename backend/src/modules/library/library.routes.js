import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, module: 'library', status: 'ready' });
});

export default router;
