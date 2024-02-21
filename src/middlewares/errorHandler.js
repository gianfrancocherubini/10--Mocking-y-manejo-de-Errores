import { CustomError } from "../utils/CustomError.js";

export const errorHandler = (error, req, res, next) => {
    console.log(error instanceof CustomError)
    if (error instanceof CustomError) {
        console.log(`(Error código: ${error.codigoInterno}). Detalle: ${error.descripcion}`);
        res.setHeader('Content-Type', 'application/json');
        return res.status(error.codigo).json({ 
            error: {
                codigo: error.codigo,
                codigoInterno: error.codigoInterno,
                descripcion: error.descripcion
            }
        });
    } else {
        console.error(error); // Loguea el error en la consola para propósitos de depuración
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador` });
    }
};