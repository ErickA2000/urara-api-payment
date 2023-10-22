import { productos2 } from "@Interfaces/compra.interfaces";

export const generateArrayData = (productos: productos2[]) => {
    let result = [];
    for (let producto of productos) {
        const data = [`${producto.tallasCantidadPrecio.cantidad}`, producto.productID.nombre, producto.tallasCantidadPrecio.talla,
        `${producto.tallasCantidadPrecio.precio}`, `${producto.descuento}%`]

        result.push(data)
    }
    return result;

}
