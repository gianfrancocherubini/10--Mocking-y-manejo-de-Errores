
import passport from 'passport';
import { RegistroController} from '../controller/registro.controller.js';


import { Router } from 'express';
export const router=Router()

router.get('/errorRegistro',RegistroController.registroError);
router.post('/', passport.authenticate('registro', {failureRedirect: '/api/registro/errorRegistro'}), RegistroController.registro);

