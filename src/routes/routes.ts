import { Router } from "express";
import carritoRoutes from "./carrito.routes";
import compraRoutes from "./compra.routes";
import pagoRoutes from "./pago.routes";
import paymentRoutes from "./payment.routes";


class Routes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.use( '/cart', carritoRoutes );
        this.router.use( '/compra', compraRoutes );
        this.router.use( '/payments', pagoRoutes );
        this.router.use( '/payment', paymentRoutes );
    }
}

const routes = new Routes();
export default routes.router;