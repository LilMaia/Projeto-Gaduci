import moment from "moment";
import sequelize from "../db.js";
import { DATE, INTEGER, STRING } from "sequelize";
import Atividade from "./atividade.js"; 

const Grupo = sequelize.define("grupo", {

  grupoId: {
    type: INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  codEstadoIbge: {
    type: INTEGER,
    allowNull: false,
    unique: false,
  },

  estado: {
    type: STRING,
    allowNull: false,
    unique: false,
  },

  abreviacaoEstado: {
    type: STRING,
    allowNull: false,
    unique: false,
  },

  codMunicipioIbge: {
    type: INTEGER,
    allowNull: false,
    unique: false,
  },

  municipio: {
    type: STRING,
    allowNull: false,
    unique: false,
  },

  nomeDoGrupo:{
    type: STRING,
    allowNull: false,
    unique: false,
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

});

// Establish a one-to-many relationship between Grupo and Atividade
Grupo.hasMany(Atividade, { foreignKey: "grupoId" }); // Assuming "grupoId" is the foreign key in the Atividade table
Atividade.belongsTo(Grupo, { foreignKey: "grupoId" });// Define the association to the Grupo model

export default Grupo;
