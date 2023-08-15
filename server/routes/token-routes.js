// Importando o módulo Router do Express
import { Router } from "express";
import User from "../models/user.js";
import {
    getUserTokenValidator
  } from "../validators/token-routes-validator.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

// Criando uma instância do roteador
const tokenRoutes = Router();

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
};

tokenRoutes.post("/get-user-by-token", getUserTokenValidator, handleValidationErrors, async (req, res) => {
    try {
        const user = await User.findOne({ where: { token: req.body.token } });
        if (user) {
            delete user.dataValues.password;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

tokenRoutes.post("/verify-token", async (req, res) => {
    const token = req.body.token;
  
    if (!token) {
      return res.status(401).json({ message: "Token não fornecido" });
    }
  
    try {
      jwt.verify(token, "ssEFwssf"); // Verifique o token com a chave secreta
      res.status(200).json({ message: "Token válido", token: token });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        res.status(401).json({ message: "Token expirado", token: null });
      } else {
        res.status(403).json({ message: "Token inválido", token: null });
      }
    }
  });

// Exporta o roteador para ser utilizado em outros módulos
export default tokenRoutes;