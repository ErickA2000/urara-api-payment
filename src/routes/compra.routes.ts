import { Router } from "express";
import { autenticacion, cleanRequest, readRequest, validacion } from "@Middlewares/index";
import { compraController } from "@Controllers/compra.controller";

class CompraRouter{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get( '/', [ autenticacion.TokenValidation, autenticacion.isAdminOrModerador ], compraController.getAllSellsAndBuys );
        this.router.get('/p',[ autenticacion.TokenValidation, autenticacion.isAdminOrModerador ], compraController.getAllSellsAndBuysPaginate);
        this.router.get('/numpedido', compraController.getNumPedido );
        this.router.get('/one/:compraID', [ autenticacion.TokenValidation ], compraController.getOneBuysById);
        this.router.get('/user', [ autenticacion.TokenValidation ], compraController.getAllShoppingByUserPaginate);
         
        this.router.post('/', [ autenticacion.TokenValidation, autenticacion.isModerador, readRequest.decryptRequest, cleanRequest.cleanCompra, 
            validacion.verificarCampoObligatoriosCompra ], compraController.createCompra);

        this.router.put( '/cambio-estado/:compraID', [ autenticacion.TokenValidation, autenticacion.isAdminOrModerador, validacion.verificarLongitud_id, 
            cleanRequest.cleanCompra ], compraController.cambioEstadoCompra );
        this.router.get('/factura-pdf/:compraID', [ autenticacion.TokenValidation, validacion.verificarLongitud_id ], compraController.generarPDF);
    }

}

const compraRouter = new CompraRouter();
export default compraRouter.router;