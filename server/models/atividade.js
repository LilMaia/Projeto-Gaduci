import moment from "moment";
import sequelize from "../db.js";
import { DATE, INTEGER, STRING } from "sequelize";

const Atividade = sequelize.define("atividade", {

  atividadeId: {
    type: INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  //Código do serviço é o ID Nacional e a classificação é o ID municipal
  codigoDoServico: {
    type: INTEGER,
    allowNull: false,
    unique: false,
  },

  classificacao: {
    type: STRING,
    allowNull: false,
    unique: false,
  },

  nomeAtividade: {
    type: STRING,
    allowNull: false,
    unique: false,
  },

  aliquotaISS:{
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

export default Atividade;
