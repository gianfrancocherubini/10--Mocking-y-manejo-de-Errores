// export const DESCRIPTION_CODES={
//     CART_CREATION_FAILED: 'Error al crear el carrito',
//     CART_FETCH_FAILED: 'Error al obtener el carrito por id',
//     CART_FAILED: 'Error al obtener el carrito',
//     CART_ADDITION_FAILED: 'Error al agregar producto al carrito',
//     CART_UPDATE_FAILED: 'Error al actualizar el carrito',
//     DELETE_PRODUCT_CARRITO_FAILED: 'Error al eliminar producto del carrito',
//     DELETE_CART_FAILED: 'Error al eliminar el carrito',
//     PRODUCT_FETCH_FAILED: 'Error al obtener el producto',
//     PRODUCT_FETCH_ID_FAILED: 'Error al obtener el producto por id',
//     PRODUCTS_FETCH_FAILED: 'Error al obtener todos los productos',
//     PRODUCT_FETCH_CODE_FAILED: 'Error al obtener el producto por codigo',
//     CREATE_PRODUCT_FAILED: 'Error al crear el producto',
//     UPDATED_PRODUCT_FAILED: 'Error al actualizar el producto',
//     DELETED_PRODUCT_FAILED: 'Error al eliminar el producto',
//     USUARIO_ID_FETCH_FAILED: 'Error al obtener usuario por id',
//     USUARIO_EMAIL_FETCH_FAILED: 'Error al obtener usuario por email',
//     CREATE_USUARIO_ADMIN_FAILED: 'Error al crear usuario administrador',
//     CREATE_USUARIO_REGULAR_FAILED: 'Error al crear usuario regular',
//     CREATE_USUARIO_GITHUB_FAILED: 'Error al crear usuario por github',
//     ERROR_AUTENTICACION: 'Error de autenticación',
//     ERROR_AUTORIZACION: 'Error de autorización'
// }

export const STATUS_CODES={
    NOT_FOUND:404,
    ERROR_ARGUMENTOS:400, 
    ERROR_DATOS_ENVIADOS:400, 
    ERROR_AUTENTICACION:401,
    ERROR_AUTORIZACION:403
}

export const ERRORES_INTERNOS={
    DATABASE:100, 
    ARGUMENTOS:200, 
    PERMISOS:300, 
    OTROS: 400
}