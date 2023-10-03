import { paymentController } from "@Controllers/payment.controller";
import { autenticacion, cleanRequest } from "@Middlewares/index";
import { Router } from "express";

class PaymentRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(){
        this.router.post('/create-order', [ autenticacion.TokenValidation, cleanRequest.cleanPayment ], paymentController.payment);
        this.router.post('/webhook-mercadopago/:IDorder', paymentController.recivedWebHookMercadoPago)
    }
}

const paymentRoutes = new PaymentRoutes();
export default paymentRoutes.router;