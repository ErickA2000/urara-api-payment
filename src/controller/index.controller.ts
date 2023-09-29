import { Request, Response } from "express";

class IndexController {
    public index( req: Request, res: Response ){
        res.json({
            success: true,
            message: "App principal"
        })
    }
}

export const indexController = new IndexController();