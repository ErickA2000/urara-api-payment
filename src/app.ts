import indexRoutes from "@Routes/index.routes";
import express, { Application } from "express";
import morgan from "morgan";

class App{

    public app: Application;

    constructor(){
        this.app = express();
        this.config();
        this.router();
    }

    private config(): void{
        this.app.set('port', process.env.PORT || 3100);
        this.app.use(morgan('dev'));
        // this.app.use(cors(this.corsOptions));
        this.app.use(express.json({ limit: "100MB" }));
        this.app.use(express.urlencoded({extended: false}));
        // this.app.use( queryParser({
        //     parseNull: true,
        //     parseBoolean: true,
        //     parseNumber: true,
        //     parseUndefined: true
        // }) );
        // this.app.use(compression());
        // this.app.use(helmet());
    }

    private router(): void{
        this.app.use( indexRoutes )
        // this.app.use('/api/prendas', prendaRoutes);
        // this.app.use('/api/auth', authRoutes);
        // this.app.use('/api/users', usuarioRoutes);
        // this.app.use('/api/categorias', categoriaRoutes);
        // this.app.use('/api/roles', rolesRoutes);
        // this.app.use('/api/tallas', tallaRoutes);
        // this.app.use('/api/patrones', patronRoutes);
        // this.app.use('/api/compra', compraRoutes);
        // this.app.use('/api/devices', devicesRoutes);
        // this.app.use('/api/payment', paymentRoutes);
        // this.app.use('/api/color', colorRoutes);
        // this.app.use('/api/upload', uploadRoutes);
        // this.app.use('/api/cart', carritoRoutes);
        // this.app.use('/api/payments', pagoRoutes);
        // this.app.use('/api/shipment', envioRoutes);
    }

    start(): void {
        this.app.listen( this.app.get('port'), () => {
            console.log(`Server on http://localhost:${this.app.get('port')}`)
            // showDataLog.info({ message: 'Server running' })
        })
    }
}

export default App;