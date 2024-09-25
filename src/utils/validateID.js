import mongoose from "mongoose";

const validateId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`ID ${id} not valid`);
  }
};

export { validateId };
