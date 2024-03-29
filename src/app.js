import  express  from 'express';
import path from 'path';
import mongoose from 'mongoose';
import sessions from 'express-session';
import mongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import __dirname from './utils.js';
import passport from 'passport';
import { engine } from 'express-handlebars';
import { config } from './config/config.commander.js';
import { inicializarPassport } from './config/config.passport.js';
import { router as routerCarrito } from './routes/carrito.router.js';
import { router as routerProducts } from './routes/products.router.js';
import { router as routerRegistro } from './routes/registro.router.js';
import { router as routerLogin } from './routes/login.router.js';
import { router as routerPerfil } from './routes/perfil.router.js';
import { router as vistasRouter } from './routes/vistas.router.js';
import { router as routerMock } from './routes/mocking.router.js';
import { errorHandler } from './middlewares/errorHandler.js';


const PORT = config.PORT;
const app = express();

app.use(sessions(
    {
        secret:"codercoder123",
        resave: true, 
        saveUninitialized: true,
        store: mongoStore.create(
            {
                // se cambia la url y dbname con la variables de entorno
                mongoUrl: config.MONGO_URL,
                mongoOptions:{ dbName: config.DBNAME},
                ttl:3600
            }
        )
    }
))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

inicializarPassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

app.use('/', vistasRouter);
app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarrito);
app.use('/api/registro', routerRegistro);
app.use('/api/perfil', routerPerfil);
app.use('/api/login', routerLogin);
app.use('/mockingproducts', routerMock);
app.use(errorHandler);


async function connectToDatabase() {
    try {
        // se usan las variables de entorno
        await mongoose.connect(config.MONGO_URL, { dbName: config.DBNAME });
        console.log(`DB Online...!!! Base: ${config.DBNAME}`);
    } catch (error) {
        console.log(error.message);
    }
}

connectToDatabase();


const server = app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${config.PORT}`);
});

