import { Sequelize } from "sequelize";

const sequelize = new Sequelize("mysql://root:1234@localhost:3309/gaducidb");

export default sequelize;
