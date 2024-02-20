import { UsuariosModelo } from "./models/usuarios.model.js";

export class UsuariosMongoDao {

    async getUsuarioByEmail(email){
        try {
            let existe=await UsuariosModelo.findOne({email})
            return existe;
        }catch(error){
            console.log("Error al obtener el usuario por email,", error);
            throw error;
        }
    }

    async getUsuarioById(id){
        try {
            let usuario=await UsuariosModelo.findOne({id})
            return usuario;
        }catch(error){
            console.log("Error al obtener el usuario por id,", error);
            throw error;
        }
    }

    async createAdmin(nombre, email, password, rol) {
        try {
            let usuario = await UsuariosModelo.create({ nombre, email, password, rol: 'administrador' });
            return usuario;
        } catch (error) {
            console.log("Error al crear administrador,", error);
            throw error;
        }
    }

    async crearUsuarioRegular(nombre, email, password, idCarrito) {
        try {
            const usuario = await UsuariosModelo.create({ nombre, email, password,carrito: idCarrito });
            return usuario;
        } catch (error) {
            console.log("Error al crear usuario regular:", error);
            throw error;
        }
    }

    async getUsuarioByEmailLogin(email) {
        try {
            const usuario = await UsuariosModelo.findOne({ email }).lean();
            return usuario;
        } catch (error) {
            console.log("Error al obtener usuario por email:", error);
            throw error;
        }
    }


    async crearUsuarioGitHub(nombre, email) {
        try {
            const nuevoUsuario = { nombre, email };
            const usuario = await UsuariosModelo.create(nuevoUsuario);
            return usuario;
        } catch (error) {
            console.log("Error al crear usuario GitHub:", error);
            throw error;
        }
    }

}

