import validUrl from 'valid-url'
import { errorHandler } from "../middlewares/errorHandler.js";
import {STATUS_CODES,ERRORES_INTERNOS } from "../utils/tiposError.js";
import { CustomError } from "../utils/CustomError.js";
import { ProductsService } from '../repository/products.service.js';
const productsService = new ProductsService();

export class ProductsController{
    constructor(){}

    static async getProducts(req, res) {
        try {
            let category = req.query.category;
            let query = {};
    
            if (category) {
                query.category = category;
            }
            
    
            const products = await productsService.getProducts(query);
            if(!products){
                throw new CustomError(
                    STATUS_CODES.NOT_FOUND,
                    ERRORES_INTERNOS.DATABASE,
                    'No se pueden obtener los productos'
                )
            }
    
            res.setHeader('Content-Type', 'text/html');
            res.status(200).render('home', {
                products: products,
                login: req.session.usuario ? true : false,
                currentCategory: category, 
            });
    
        } catch (error) {
            console.error(error);
            errorHandler(error, req, res); 
        }
    }

    static async createProduct(req,res){
        try {
            const newProductData = req.body;
            const requiredFields = ['title', 'description', 'price', 'thumbnails', 'code', 'stock', 'category'];
    
            for (const field of requiredFields) {
                if (!newProductData[field]) {
                    throw new CustomError (
                        STATUS_CODES.ERROR_ARGUMENTOS,
                        ERRORES_INTERNOS.ARGUMENTOS,
                        `el campo ${field} es obligatorio`
                    )
                }
            }
    
            // Validar URLs de imágenes
            const validThumbnails = newProductData.thumbnails.every(url => validUrl.isUri(url));
    
            if (!validThumbnails) {
                throw new CustomError(
                    STATUS_CODES.ERROR_ARGUMENTOS,
                    ERRORES_INTERNOS.ARGUMENTOS,
                    'Se debe establecer una Url valida para las imagenes'
                )
            }
            const existingProduct = await productsService.getProductByCode(newProductData.code);

            if (existingProduct) {
                throw new CustomError(
                    STATUS_CODES.ERROR_ARGUMENTOS,
                    ERRORES_INTERNOS.ARGUMENTOS,
                    'Ya existe el producto con el codigo proporcionado'
                )
            }
            
    
            await productsService.createProduct(newProductData);
            console.log(newProductData);
            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ success: true, message: 'Producto agregado correctamente.', newProductData });
        } catch (error) {
            console.error(error);
            errorHandler(error, req, res);
        }
    }
        static async updateProduct (req,res){
        try {
            const productId = req.params.pid;
            if(!productId){
                throw new CustomError(
                    STATUS_CODES.ERROR_ARGUMENTOS,
                    ERRORES_INTERNOS.ARGUMENTOS,
                    'Debe ser un id valido del producto'
                )
            }
    
            // Buscar el producto existente por _id
            const existingProduct = await productsService.getProductById(productId)
    
            if (!existingProduct) {
                throw new CustomError(
                    STATUS_CODES.ERROR_ARGUMENTOS,
                    ERRORES_INTERNOS.ARGUMENTOS,
                    'Producto no encontrado'
                )
            }
    
            // Verificar si la propiedad _id está presente en el cuerpo de la solicitud
            if ('_id' in req.body) {
                throw new CustomError(
                    STATUS_CODES.ERROR_ARGUMENTOS,
                    ERRORES_INTERNOS.ARGUMENTOS,
                    'No puede modificarse el id del producto'
                )
            }
    
            // Actualizar el producto utilizando findByIdAndUpdate
            const updateResult = await productsService.update(productId, req.body);
    
            if (updateResult) {
                console.log('Producto actualizado:', productId,', Modificacion:',req.body);
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({ success: true, message: 'Modificación realizada.' });
            } else {
                throw new CustomError(
                    STATUS_CODES.ERROR_ARGUMENTOS,
                    ERRORES_INTERNOS.ARGUMENTOS,
                    'No se pudo modificar el producto'
                )
            }
        } catch (error) {
            console.error(error);
            errorHandler(error, req, res);
        }
    }
};
