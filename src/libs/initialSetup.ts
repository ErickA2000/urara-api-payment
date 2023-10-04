import Color from '@Models/Color';
import Counter from '@Models/Counter';
import Envio from '@Models/Envio';
import Roles from '@Models/Roles';

export const createCounter = async () => {
    try {
        const count = await Counter.estimatedDocumentCount();
        if( count > 0 ) return;

        await Promise.all([
            new Counter({ _id: "compraId", seq_value: 0 }).save()
        ]);

    } catch (error) {
        console.error(error);
    }
}

export const initialModels = async () => {
    try {
        await Roles.find();
        await Color.find();
        await Envio.find();
    } catch (error) {
        console.log("Initial models error: ", error);
    }
}