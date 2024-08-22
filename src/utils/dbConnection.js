
import mongoose from "mongoose";

export const connectionMongo = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://edulogo:CoderCoder@coderproject.wuypshy.mongodb.net/?retryWrites=true&w=majority&appName=CoderProject",
      { dbName: "ecommerce" }
    );
    console.log(`Conectado a la base de datos correctamente`);
  } catch (error) {
    console.log(`No se pudo conectar a la base de datos: ${error.message}`);
  }
}