// import { CarritoMongoDao } from "../dao/carritoDao.js";
// const cm = new CarritoMongoDao();
import { ticketMongoDao } from "../dao/ticketDao.js";
import { CarritoService } from "../repository/carrito.service.js";
const carritoService = new CarritoService();
const ticketDao = new ticketMongoDao();

 export class CarritoController {
    constructor(){}

    static async createCart(req, res) {
        try {
            const newCart = await carritoService.createCart();
            console.log('Carrito creado:', newCart);
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json({ success: true, message: 'Carrito creado correctamente.', cart: newCart });
        } catch (error) {
            console.error(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Error al crear el carrito.' });
        }
    }

    static async getCartById(req,res){
        try {
            const cartId = req.params.cid;
            
            if (!cartId) {
                res.setHeader('Content-Type', 'application/json');
                res.status(400).json({ error: 'Se debe proporcionar un ID de carrito válido.' });
                console.log('Se debe proporcionar un ID de carrito válido.');
                return;
            }
            
            const cart = await carritoService.cartById(cartId);
            
            if (!cart) {
                res.setHeader('Content-Type', 'application/json');
                res.status(404).json({ error: 'Carrito no encontrado.' });
                return;
            }
            let usuario = req.session.usuario;
            res.setHeader('Content-Type', 'text/html');
            res.status(200).render('carrito', {carts : cart, usuario, login : true}) ;
            console.log('Carrito:', cart._id , 'con los items:', cart.items)
        } catch (error) {
            console.error(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Error al obtener el carrito.' });
        }
    }

    static async addProductToCart(req,res){

        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const quantity = req.body.quantity || 1;
        
            if (!cartId || !productId) {
              res.setHeader('Content-Type', 'application/json');
              res.status(400).json({ error: 'Se deben proporcionar un ID de carrito y un ID de producto válidos.' });
              return;
            }
        
            const updatedCart = await carritoService.addProduct(cartId, productId, quantity);
            console.log(`Producto : ${productId} agregado correctamente a Carrito : ${cartId}`)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(updatedCart);
          } catch (error) {
            console.error(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Error al agregar el producto al carrito.' });
          }       
    }

    static async deleteProductToCart(req,res){
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
    
            if (!cartId || !productId) {
                res.setHeader('Content-Type', 'application/json');
                res.status(400).json({ error: 'Se deben proporcionar un ID de carrito y un ID de producto válidos.' });
                return;
            }
    
            const deleteProductToCart = await carritoService.deleteProduct(cartId, productId);
            console.log(`Producto : ${productId} eliminado de ${cartId} correctamente`)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({message: `Producto : ${productId} eliminado de ${cartId} correctamente`});
        } catch (error) {
            console.error(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Error al eliminar el producto del carrito.' });
        }
    }

    static async deletedCart (req,res){
        try {
            const cartId = req.params.cid;
                
            if (!cartId) {
                res.setHeader('Content-Type', 'application/json');
                res.status(400).json({ error: 'Se deben proporcionar un ID de carrito válido.' });
                return;
            }
    
            const deletedCart = await carritoService.cartDelete(cartId);
            console.log(`Carrito: ${cartId} eliminado correctamente`)
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(`Carrito : ${cartId} eliminado correctamente`);
        } catch (error) {
            console.error(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Error al eliminar el producto del carrito.' });
        }
    }

    static async purchaseTicket(req, res){
        try{
            const cartId = req.params.cid;
            const cart = await carritoService.cartById(cartId)

            if (!cart) {
                res.setHeader('Content-Type', 'application/json');
                res.status(404).json({ error: 'Carrito no encontrado.' });
                return;
            }
            let usuario = req.session.usuario;
            const productsPurchased = [];
            let totalAmount = 0;

            for (const item of cart.items) {
                const product = item.product;
    
                if (!product || !product.price) {
                    continue;
                }

                if (item.quantity <= product.stock) {
                    product.stock -= item.quantity;
                    await product.save();
    
                    productsPurchased.push({
                        id: product._id,
                        quantity: item.quantity,
                        price: product.price 
                    });

                    totalAmount += product.price * item.quantity;

                    if (product.stock === 0) {
                        product.deleted = true;
                        await product.save();
                    }
                }
            }

            const ticket = await ticketDao.createTicket(usuario.email, totalAmount);
            const ticketDetails = {
            purchaser: usuario.email,
            code: ticketCode,
            purchase_datetime: new Date(),
            amount: totalAmount
            };

            cart.items = [];
            await cart.save();
    
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(`Ticket : ${ticketDetails}, generado correctamente`);
            console.log(ticketDetails);

        }catch{
            console.error(error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Error para generar ticket.' });
        }

    }

}
