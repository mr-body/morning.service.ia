import { Router } from 'express';
import { morning } from '../controller/morning.gmini.controller';

const morningGminiRoutes = Router();

morningGminiRoutes.post("/quest", morning);

export default morningGminiRoutes;