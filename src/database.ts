import mongoose from 'mongoose';

export const connectDB = () => {
    mongoose.set('strictQuery', false)
    mongoose.connect(`${process.env.DATABASECONECTION}`)
        .then(db => console.log("Db is connected"))
        .catch( error => console.log( "Error conexion",error ) )}

export const disconnectDB = () => {
    mongoose.disconnect();
    mongoose.connection.close();
}