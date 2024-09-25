import mongoose from "mongoose";
import configObject from "../config/config.js";

export const connectionMongo = async () => {
  try {
    await mongoose.connect(configObject.mongoURL);
    console.log(`Conectado a la base de datos correctamente`);
  } catch (error) {
    console.log(`No se pudo conectar a la base de datos: ${error.message}`);
  }
};
