import { carritoController } from "@Controllers/carrito.controller";
import { autenticacion, cleanRequest, validacion } from "@Middlewares/index";
import { Router } from "express";

class CarritoRoutes{
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        this.router.get("/", [ autenticacion.TokenValidation, autenticacion.isAdmin ], carritoController.getAll);
        this.router.get("/p", [ autenticacion.TokenValidation, autenticacion.isAdmin ], carritoController.getAllPaginate);
        this.router.get("/one", [ autenticacion.TokenValidation ], carritoController.getOneByCliente);

        this.router.post("/add", [ autenticacion.TokenValidation, cleanRequest.cleanCarrito, validacion.verificarProductosCarrito ], 
            carritoController.addCart );

        this.router.put("/update", [ autenticacion.TokenValidation, cleanRequest.cleanCarrito ], carritoController.updateCart );
    }
}

const carritoRoutes = new CarritoRoutes();
export default carritoRoutes.router;