export class LoginController {
    constructor(){}

    static async loginRender(req,res){
        let { error, message, errorGithub } = req.query;
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('login', { error, message, errorGithub, login: false });
    }

    static async loginCallBackGithub(req,res){
        console.log(req.user)
        req.session.usuario=req.user
        res.setHeader('Content-Type','application/json');
        res.status(200).redirect('/home');
    }

    static async loginErrorGitHub(req,res){
        res.setHeader('Content-Type','application/json');
        res.status(200).json({error: "Error al autenticar con Github"});
    }

    static async loginLocalError(req,res){
        return res.redirect('/login?error=Error en el proceso de login... :(')
    }

    static async loginLocal(req,res){
        console.log('Ingreso el usuario:', req.user)
        req.session.usuario = {
        nombre: req.user.nombre,
        email: req.user.email,
        rol: req.user.rol,
        carrito: req.user.carrito
    };

    res.redirect('/');
    }
}
