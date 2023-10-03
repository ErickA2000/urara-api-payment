import Counter from '@Models/Counter';

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
