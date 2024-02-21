export class CustomError extends Error {

    constructor(statusCodes, codigoInterno, descripcion) {
        super();
        this.codigo = statusCodes;
        this.codigoInterno = codigoInterno;
        this.descripcion = descripcion;
    }
}
