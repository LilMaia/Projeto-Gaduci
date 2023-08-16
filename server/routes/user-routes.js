// Importando o módulo Router do Express
import bcrypt from "bcrypt";
import { Router } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { generateAdminUser, generateUser } from "../mocker.js";
import User from "../models/user.js";
import { createUserValidator, deleteUserValidator, getUserValidator, updateUserValidator } from "../validators/user-routes-validator.js";

// Criando uma instância do roteador
const userRoutes = Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

userRoutes.post("/create-user", createUserValidator, handleValidationErrors, async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

userRoutes.get("/get-users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

userRoutes.get("/get-user/:id", getUserValidator, handleValidationErrors, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

userRoutes.put("/update-user", updateUserValidator, handleValidationErrors, async (req, res) => {
  try {
    const user = await User.findByPk(req.body.id);
    await user.update(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

userRoutes.delete("/delete-user/:id", deleteUserValidator, handleValidationErrors, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    await user.destroy();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

userRoutes.get("/generate-user/:quantity", async (req, res) => {
  try {
    const quantity = req.params.quantity;
    let users = generateUser(quantity);
    users = await User.bulkCreate(users);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

userRoutes.get("/generate-admin-user", async (req, res) => {
  try {
    let users = generateAdminUser();
    users = await User.bulkCreate(users);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//delete all users on database
userRoutes.delete("/delete-users", async (req, res) => {
  try {
    const users = await User.findAll();
    await User.destroy({ where: {} });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

userRoutes.post("/login", async (req, res) => {
  try {
    if (!req.body.login || !req.body.password || req.body.login === "" || req.body.password === "") {
      return res.status(400).json({ error: "Usuário e senha são obrigatórios!" });
    }

    const user = await User.findOne({ where: { login: req.body.login } });

    if (!user) {
      return res.status(401).json({ error: "O usuário informado não existe!" });
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Senha inválida, favor tentar novamente!" });
    }

    // Gerar um token de acesso
    const token = jwt.sign({ userId: user.id }, "ssEFwssf", { expiresIn: "2h" });

    User.update({ token: token }, { where: { id: user.id } });

    return res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exporta o roteador para ser utilizado em outros módulos
export default userRoutes;
