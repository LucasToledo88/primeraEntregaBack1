import { Router } from 'express';

const router = Router();

// Mensaje iniciar de la api
router.get('/', (req, res) => {
    res.status(200).json({status: 'success', message: 'v0.0.1 online.'});
});

export default router;
