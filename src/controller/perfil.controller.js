import { enviarWs } from "../config/config.whatsApp.js";


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
            console.log(mensajeEnviado)
            res.setHeader('Content-Type', 'text/html');
            res.status(201).render('perfil',{ mensajeEnviado, usuario, login: true });
        } catch (error) {
            console.error('Error al enviar el mensaje de WhatsApp:', error);
            res.setHeader('Content-Type', 'text/html');
            res.status(500).send("Error al enviar la consulta. Por favor, inténtalo de nuevo más tarde.");
        }
    }
}


