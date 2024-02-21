import { errorHandler } from "../middlewares/errorHandler.js";
import {STATUS_CODES,ERRORES_INTERNOS } from "../utils/tiposError.js";
import { CustomError } from "../utils/CustomError.js";
import { ticketMongoDao } from "../dao/ticketDao.js";
import { CarritoService } from "../repository/carrito.service.js";
import { ProductsService } from "../repository/products.service.js";

const productService = new ProductsService();
const carritoService = new CarritoService();
const ticketDao = new ticketMongoDao();

 export class CarritoController {
    constructor(){}

    static async createCart(req, res) {
        try {
            const newCart = await carritoService.createCart();

            if(!newCart){
                throw new CustomError(
                    STATUS_CODES.NOT_FOUND,
                    ERRORES_INTERNOS.DATABASE,
                    'no se pudo crear el carrito'
                )
            }
            console.log('Carrito creado:', newCart);
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json({ success: true, message: 'Carrito creado correctamente.', cart: newCart });
        } catch (error) {
            console.error(error);
            errorHandler(error, req, res);            
        }
    }

    static async getCartById(req,res){
        try {
            const cartId = req.params.cid;
            
            if (!cartId) {
                throw new CustomError(
                    STATUS_CODES.ERROR_ARGUMENTOS,
                    ERRORES_INTERNOS.ARGUMENTOS,
                    'Debe aportar un id valido'
                )
            }
            
            const cart = await carritoService.cartById(cartId);
            
            if (!cart) {
                throw new CustomError(
                    STATUS_CODES.NOT_FOUND,
                    ERRORES_INTERNOS.DATABASE,
                    'No se encontro el carrito'
                )
            }
            const items = cart.items;

            const totalCartPrice = () => {
                let total = 0;
                items.forEach(item => {
                    total += item.product.price * item.quantity;
                });
                return total.toFixed(2);
            };
    
            let usuario = req.session.usuario;
            res.setHeader('Content-Type', 'text/html');
            res.status(200).render('carrito', {carts : cart, usuario, login : true, totalCartPrice: totalCartPrice}) ;
            console.log('Carrito:', cart._id , 'con los items:', cart.items)
        } catch (error) {
            console.error(error);
            errorHandler(error, req, res);
        }
    }

    static async addProductToCart(req,res){

        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const quantity = req.body.quantity || 1;
        
            if (!cartId || !productId) {
              throw new CustomError(
                STATUS_CODES.ERROR_ARGUMENTOS,
                ERRORES_INTERNOS.ARGUMENTOS,
                'Se deben proporcionar id de producto y id de carrito validos'
              )
            }
        
            const updatedCart = await carritoService.addProduct(cartId, productId, quantity);
            if(!updatedCart){
                throw new CustomError(
                   STATUS_CODES.NOT_FOUND,
                   ERRORES_INTERNOS.DATABASE,
                   'No se pudo agregar el producto al carrito' 
                )
            }
            console.log(`Producto : ${productId} agregado correctamente a Carrito : ${cartId}`)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(updatedCart);
          } catch (error) {
            console.error(error);
            errorHandler(error, req, res);
          }       
    }

    static async deleteProductToCart(req,res){
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
    
            if (!cartId || !productId) {
                throw new CustomError(
                  STATUS_CODES.ERROR_ARGUMENTOS,
                  ERRORES_INTERNOS.ARGUMENTOS,
                  'Se deben proporcionar id de producto y id de carrito validos'
                )
              }
    
            const deleteProductToCart = await carritoService.deleteProduct(cartId, productId);
            if(!deleteProductToCart){
                throw new CustomError(
                    STATUS_CODES.NOT_FOUND,
                    ERRORES_INTERNOS.DATABASE,
                    'No se pudo eliminar el producto del carrito'
                )
            }
            console.log(`Producto : ${productId} eliminado de ${cartId} correctamente`)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({message: `Producto : ${productId} eliminado de ${cartId} correctamente`});
        } catch (error) {
            console.error(error);
            res.setHeader('Content-Type', 'application/json');
            errorHandler(error, req, res);
        }
    }

    static async deletedCart (req,res){
        try {
            const cartId = req.params.cid;
                
            if (!cartId) {
                throw new CustomError(
                    STATUS_CODES.ERROR_ARGUMENTOS,
                    ERRORES_INTERNOS.ARGUMENTOS,
                    'Se debe proporcionar id de carrito valido'
                  )
            }
    
            const deletedCart = await carritoService.cartDelete(cartId);

            if(!deletedCart){
                throw new CustomError(
                    STATUS_CODES.NOT_FOUND,
                    ERRORES_INTERNOS.DATABASE,
                    'No se puedo eliminar de la base de datos el carrito'
                )
            }

            console.log(`Carrito: ${cartId} eliminado correctamente`)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(`Carrito : ${cartId} eliminado correctamente`);
        } catch (error) {
            console.error(error);
            errorHandler(error, req, res);
        }
    }

    static async purchaseTicket(req, res) {
        try {
            const usuario = req.session.usuario;
            const cartId = req.params.cid;
            const cart = await carritoService.cartById(cartId);
    
            if (!cart) {
                throw new CustomError(
                    STATUS_CODES.NOT_FOUND,
                    ERRORES_INTERNOS.DATABASE,
                    'No se encuentra carrito con id proporcionado'
                )
            }
    
            const productsCarts = cart.items.slice();
            let totalAmount = 0;

            productsCarts.forEach(async item => {
                totalAmount += item.product.price * item.quantity;

                if(item.quantity <= item.product.stock){
                    const updatedStock = item.product.stock - item.quantity;
                    await productService.update(item.product._id, { stock: updatedStock });
                }
                if(item.quantity === item.product.stock){
                    const updatedStock = item.product.stock - item.quantity;
                    await productService.update(item.product._id, { stock: updatedStock, deleted: true });
                }
                
            });
                

            totalAmount = totalAmount.toFixed(2); 
    
            const ticket = await ticketDao.creaTicket(usuario.email, totalAmount);
            if (!ticket){
                throw new CustomError(
                    STATUS_CODES.NOT_FOUND,
                    ERRORES_INTERNOS.DATABASE,
                    'No se pudo generar el ticket de compra'
                )
            }
    
            const ticketDetails = {
                purchaser: usuario.email,
                code: ticket.code,
                amount: totalAmount,
                purchase_datetime: ticket.purchase_datetime,
            };

            for (const item of productsCarts) {
                await carritoService.deleteProduct(cartId, item.product._id);
            }
    
    
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ ticket: ticketDetails, message: 'Ticket generado correctamente' });
            console.log(ticketDetails);
        } catch (error) {
            console.error(error);
            errorHandler(error, req, res);
        }
    }

}
