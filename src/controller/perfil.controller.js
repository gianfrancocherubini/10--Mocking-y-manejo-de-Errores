import { STATES } from "mongoose";
import { enviarWs } from "../config/config.whatsApp.js";
import { errorHandler } from "../middlewares/errorHandler.js";
import { CustomError } from "../utils/CustomError.js";
import { ERRORES_INTERNOS, STATUS_CODES } from "../utils/tiposError.js";

export class PerfilController {
    constructor(){}

    static async perfilUsuario(req,res){

    let usuario = req.session.usuario;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('perfil', { usuario, login: true });
    
    }

    static async ConsultasWs(req,res){
        
        const consulta = req.body.consulta; 
        try {
            let usuario = req.session.usuario;
            let mensajeEnviado= await enviarWs(consulta);
            if(!mensajeEnviado){
                throw new CustomError(
                    STATUS_CODES.ERROR_ARGUMENTOS,
                    ERRORES_INTERNOS.ARGUMENTOS,
                    'No se pudo realizar la consulta'
                )
            }
            console.log(mensajeEnviado)
            res.setHeader('Content-Type', 'text/html');
            res.status(201).render('perfil',{ mensajeEnviado, usuario, login: true });
        } catch (error) {
            console.error('Error al enviar el mensaje de WhatsApp:', error);
            errorHandler(error, req, res);
        }
    }
}


