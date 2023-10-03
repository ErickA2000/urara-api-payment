import mercadopago from "mercadopago";
import { PayMercadopago } from "@Interfaces/payment.interfaces";
import { usuarioDao } from "@DAO/Usuario.dao";

class MercadoPagoService {
    
    constructor(){
        mercadopago.configure({
            access_token: process.env.ACCESS_TOKEN_MERCADO_PAGO || ""
        });
    }

    public async createOrder( req: PayMercadopago, numFactura: string ){

        const user = await usuarioDao.getOneById(req.cliente);

        const resutl = await mercadopago.preferences.create({
            items: req.products,
            payment_methods: {
                default_installments: 1,
                installments: 1
            }, 
            payer: {
                address: {
                    street_name: `${req.direccionFacturacion.pais}, ${req.direccionFacturacion.departamento}, ${req.direccionFacturacion.ciudad}, ${req.direccionFacturacion.direccion}, ${req.direccionFacturacion.especificacionOpcional}`
                },
                email: user.email,
                name: user.nombre
                
                
            },                            
            notification_url: `${process.env.API_URL}/v1/api/payment/webhook-mercadopago/${numFactura}`,
            expires: true
        });

        return resutl;
    }

    public async findPayment( id: number ): Promise<any>{
        try {
            
            const data = await mercadopago.payment.findById( id );
            return data.body;
        } catch (error) {
            return {
                success: false,
                message: error
            }
        }
    }

}

export const mercadoPagoService = new MercadoPagoService();