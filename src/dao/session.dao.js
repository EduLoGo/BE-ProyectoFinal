import UserModel from "./models/users.model.js";

class SessionDao {
  async userCreate(user) {
    const newUser = await UserModel.create(user);
    return newUser;
  }

  async userByEmail(dataEmail) {
    const user = await UserModel.findOne({ email: dataEmail }).lean();
    return user;
  }

  async userById(dataId) {
    const user = await UserModel.findById(dataId).lean();
    return user;
  }
}

export default new SessionDao();
