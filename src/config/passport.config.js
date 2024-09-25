import passport from "passport";
import jwt from "passport-jwt";
import sessionsService from "../services/sessions.service.js";

const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[`coderCookieToken`];
  }
  return token;
};

const initializePassport = () => {
  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "coderhouse",
      },
      async (jwt_payload, done) => {
        try {
          const user = await sessionsService.userExist(jwt_payload.email);
          if (!user) {
            return done(null, false, { message: `Usuario inexistente` });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await sessionsService.userById(id); // Buscar usuario por su ID
    done(null, user); // Recuperas al usuario completo para la sesión
  } catch (error) {
    done(error);
  }
});

export default initializePassport;
