import Counter from "@Models/Counter";


const getNextSequenceValue = async ( sequenceName: string ) => {
    const query = { _id: sequenceName };
    const sequenceDocument = await Counter.findOneAndUpdate(
        query,
        {
            $inc: { seq_value: 1 }
        },
        {
            new: true
        }
    );

    return sequenceDocument?.seq_value;
}

export default getNextSequenceValue;