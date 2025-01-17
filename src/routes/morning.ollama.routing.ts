import { Router } from 'express';
import { morning } from '../controller/morning.ollama.controller';

const morningOllamaRoutes = Router();

morningOllamaRoutes.post("/quest", morning);

export default morningOllamaRoutes;