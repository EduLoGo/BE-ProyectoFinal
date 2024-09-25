export function adminCheck(req, res, next) {
  if (req.user.role === "admin") {
    next();
  } else {
    res.status(403).send({ error: `No tiene privilegios para acceder a esta sección.` });
  }
}

export function userCheck(req, res, next) {
  if (req.user.role === "user") {
    next();
  } else {
    res.status(403).send({ error: `No tiene privilegios para acceder a esta sección.` });
  }
}