import { Router } from "express";
import { morning_prompt, morning_whatsapp, morning_quest} from "../controller/morning.gmini.controller";
import rateLimit from "express-rate-limit";

const morningGminiRoutes = Router();

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 5, // Cada usuário pode fazer 5 requisições por minuto
    message: "Muitas requisições, tente novamente em 1 minuto.",
    // keyGenerator: (req) => req.user?.id || req.ip, // Limita por ID do usuário autenticado (se existir)
});

// morningGminiRoutes.use(limiter);
morningGminiRoutes.post("/quest", morning_quest);
morningGminiRoutes.post("/prompt", morning_prompt);
morningGminiRoutes.post("/webhook", morning_whatsapp);

export default morningGminiRoutes;
