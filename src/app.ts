import indexRoutes from "@Routes/index.routes";
import express, { Application } from "express";
import morgan from "morgan";
import cors, { CorsOptions } from "cors";
import { queryParser } from "express-query-parser";
import compression from "compression";
import helmet from "helmet";

class App{

    public app: Application;

    constructor(){
        this.app = express();
        this.config();
        this.router();
    }

    private corsOptions: CorsOptions = {
        exposedHeaders: ['token'],
        origin: ['http://localhost:4200', 'https://panel-urara.netlify.app', 'http://192.168.1.19:4200', 
        'http://localhost:45537', "http://localhost:8080"]

    }

    private config(): void{
        this.app.set('port', process.env.PORT || 3100);
        this.app.use(morgan('dev'));
        this.app.use(cors(this.corsOptions));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        this.app.use( queryParser({
            parseNull: true,
            parseBoolean: true,
            parseNumber: true,
            parseUndefined: true
        }) );
        this.app.use(compression());
        this.app.use(helmet());
    }

    private router(): void{
        this.app.use( indexRoutes )
        
    }

    start(): void {
        this.app.listen( this.app.get('port'), () => {
            console.log(`Server on http://localhost:${this.app.get('port')}`)
            // showDataLog.info({ message: 'Server running' })
        })
    }
}

export default App;