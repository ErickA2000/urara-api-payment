import { Router } from "express";
import routes from "./routes";

class IndexRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get( '/', (req, res) => {
            res.send("Inicio")
        } );
        
        this.router.use( '/api', routes );

        this.router.get( '/docs', (req, res) => {
            res.send("Docs")
        } );
    }
}

const indexRoutes = new IndexRoutes();
export default indexRoutes.router;