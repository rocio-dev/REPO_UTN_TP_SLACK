import mongoose from "mongoose";
import ENVIRONMENT from "./environment.config.js";


async function connectMongoDB() {
    try {
        await mongoose.connect(
            `${ENVIRONMENT.MONGO_URI}${ENVIRONMENT.MONGO_DB_NAME}`
        )
            console.log("Se conecto la base de datos de MongoDB :D")
    } 
    catch (error) {
        console.error("No se pudo conectar la base de datos:", error.message);

    process.exit(1);
    }
}

export default connectMongoDB;