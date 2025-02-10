import { Router } from 'express';
import { morning } from '../controller/morning.ollama.controller';
import rateLimit from "express-rate-limit";

const morningOllamaRoutes = Router();

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 5, // Cada usuário pode fazer 5 requisições por minuto
    message: "Muitas requisições, tente novamente em 1 minuto.",
    // keyGenerator: (req) => req.user?.id || req.ip, // Limita por ID do usuário autenticado (se existir)
});

// morningOllamaRoutes.use(limiter);
morningOllamaRoutes.post("/quest", morning);

export default morningOllamaRoutes;