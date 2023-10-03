import { pagoController } from "@Controllers/pago.controller";
import { autenticacion } from "@Middlewares/index";
import { Router } from "express";

class PagoRoutes{

    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get('/', [ autenticacion.TokenValidation ], pagoController.getAll);
        this.router.get('/p', [ autenticacion.TokenValidation ], pagoController.getAllPaginate);
        this.router.get('/one', [ autenticacion.TokenValidation ], pagoController.getPagoByCliente);
    }
}

const pagoRoutes = new PagoRoutes();
export default pagoRoutes.router;