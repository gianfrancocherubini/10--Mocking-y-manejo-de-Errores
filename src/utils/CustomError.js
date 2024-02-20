export class CustomError extends Error {

    constructor(statusCode, codigoInterno, descripcion) {
        super();
        this.codigo = statusCode;
        this.codigoInterno = codigoInterno;
        this.descripcion = descripcion;
    }
}
