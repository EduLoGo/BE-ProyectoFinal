import sessionsRepository from "../repositories/sessions.repository.js";
import cartsRepository from "../repositories/carts.repository.js";
import { createHash, isValidPassword } from "../utils/hashbcrypt.js";
import UserDTO from "../dto/user.dto.js";

class UserService {
  async userCreate(user) {
    const existMail = await sessionsRepository.userByEmail(user.email);
    if (existMail !== null) {
      throw new Error(`The Email ${user.email} already exists in Database`);
    }
    const cart = await cartsRepository.cartCreate();
    user.password = createHash(user.password);
    user.cartId = cart._id;
    const newUser = new UserDTO(await sessionsRepository.userCreate(user));
    return newUser;
  }

  async userLogin(email, password) {
    const user = await sessionsRepository.userByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    if (!isValidPassword(password, user)) {
      throw new Error("Wrong password");
    }
    return user;
  }

  async userExist(email) {
    const user = await sessionsRepository.userByEmail(email);
    return user;
  }

  async userById(id) {
    const user = await sessionsRepository.userById(id);
    return user;
  }
}

export default new UserService();
