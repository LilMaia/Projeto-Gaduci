import { param } from "express-validator";

export const getUserTokenValidator = [
    param("token").isEmpty().withMessage("Token inválido"),
  ];
  