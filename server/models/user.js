import moment from "moment";
import { DATE, INTEGER, STRING } from "sequelize";
import sequelize from "../db.js";
import bcrypt from "bcrypt";

const User = sequelize.define("user", {

  id: {
    type: INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  name: {
    type: STRING,
    allowNull: false,
    unique: false,
  },

  cpf:{
    type: STRING,
    allowNull: false,
    unique: true,
  },

  phone: {
    type: STRING,
    allowNull: false,
    unique: true,
  },

  email: {
    type: STRING,
    allowNull: false,
    unique: true,
  },

   login: {
    type: STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: STRING,
    allowNull: false,
    set: function (value) {
      const saltRounds = 10; // Número de salt rounds para o bcrypt
      const hashedPassword = bcrypt.hashSync(value, saltRounds);
      this.setDataValue("password", hashedPassword);
    },
  },

  role: {
    type: STRING,
    allowNull: false,
  },

  createdAt: {
    type: DATE,
    allowNull: false,
    get: function () {
      let data = this.getDataValue("createdAt");
      return moment(data, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss");
    },
  },

  updatedAt: {
    type: DATE,
    allowNull: false,
    get: function () {
      let data = this.getDataValue("updatedAt");
      return moment(data, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss");
    },
  },

  token: {
    type: STRING,
    allowNull: true,
  },
});

export default User;
