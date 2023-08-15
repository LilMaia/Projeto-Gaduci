import { body, param } from "express-validator";

export const createUserValidator = [
  body("name").notEmpty().withMessage("O nome é obrigatório"),
  body("email").isEmail().withMessage("Informe um email válido"),
];

export const getUserValidator = [
  param("id").isInt().withMessage("ID de usuário inválido"),
];


export const updateUserValidator = [
  body("id").isInt().withMessage("ID de usuário inválido"),
];

export const deleteUserValidator = [
  param("id").isInt().withMessage("ID de usuário inválido"),
];

export const loginValidator = [
    body("login").notEmpty().withMessage("O login é obrigatório"),
    body("password").notEmpty().withMessage("A senha é obrigatória"),
];