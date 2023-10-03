import mercadopago, { Payment } from "mercadopago";
import { PayMercadopago } from "@Interfaces/payment.interfaces";
import { usuarioDao } from "@DAO/Usuario.dao";
import { PaymentCreateRequest } from "mercadopago/dist/clients/payment/create/types";

class MercadoPagoService {

    private client = new mercadopago({ accessToken: process.env.ACCESS_TOKEN_MERCADO_PAGO || "" });
    private payment = new Payment(this.client);

    constructor(){
        // mercadopago.configure({
        //     access_token: process.env.ACCESS_TOKEN_MERCADO_PAGO || ""
        // });
    }

    public async createOrder( req: PayMercadopago, numFactura: string ){

        const user = await usuarioDao.getOneById(req.cliente);

        const body: PaymentCreateRequest = {
            transaction_amount: req.total,
            payer: {
                email: user.email
            },
            notification_url: `${process.env.API_URL}/api/payment/webhook-mercadopago/${numFactura}`,
            installments: 1
        };

        const resutl = await this.payment.create({body})
        // const resutl = await mercadopago.preferences.create({
        //     items: req.products,
        //     payment_methods: {
        //         default_installments: 1,
        //         installments: 1
        //     }, 
        //     payer: {
        //         address: {
        //             street_name: `${req.direccionFacturacion.pais}, ${req.direccionFacturacion.departamento}, ${req.direccionFacturacion.ciudad}, ${req.direccionFacturacion.direccion}, ${req.direccionFacturacion.especificacionOpcional}`
        //         },
        //         email: user.email,
        //         name: user.nombre
                
                
        //     },                            
        //     notification_url: `${process.env.API_URL}/api/payment/webhook-mercadopago/${numFactura}`,
        //     expires: true
        // });

        return resutl;
    }

    public async findPayment( id: string ): Promise<any>{
        try {
            const data = await this.payment.get( { id } )
            // const data = await mercadopago.payment.findById( id );
            return data;
        } catch (error) {
            return {
                success: false,
                message: error
            }
        }
    }

}

export const mercadoPagoService = new MercadoPagoService();