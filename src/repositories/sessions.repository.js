import sessionDao from "../dao/session.dao.js";

class SessionRepository {
  async userCreate(user) {
    const newUser = await sessionDao.userCreate(user);
    return newUser;
  }

  async userByEmail(email) {
    const user = await sessionDao.userByEmail(email);
    return user;
  }

  async userById(id) {
    const user = await sessionDao.userById(id);
    return user;
  }

}

export default new SessionRepository();
