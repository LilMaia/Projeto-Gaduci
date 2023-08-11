// Importando os módulos necessários
import express from "express";
import helmet from "helmet";
import { PORT } from "./config/config.js";
import sequelize from "./db.js";
import routes from "./routes/user-routes.js";

// Criando uma instância do aplicativo Express
const app = express();

// Middleware: Configurando o uso do módulo Helmet para melhorar a segurança do aplicativo
app.use(helmet());

// Middleware: Habilitando o parser de JSON para lidar com dados JSON nas requisições
app.use(express.json());

// Middleware: Habilitando o parser de dados enviados através de formulários (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Middleware: Configurando o cabeçalho CORS para permitir requisições de qualquer origem (*), com quaisquer métodos (*),
// e especificando quais cabeçalhos podem ser usados na requisição
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Request-With, Content-Type, Accept"
  );
  next();
});

// Middleware: Configurando as rotas do aplicativo, agrupadas no módulo routes
app.use(routes);

// Iniciando o servidor para escutar na porta especificada
app.listen(PORT, (err) => {
  if (err) {
    console.error("Erro ao iniciar o servidor:", err);
  } else {
    console.log(`Servidor está rodando na porta ${PORT}`);
  }
});

// Iniciando a conexão com o banco de dados
sequelize.sync().then(
  () => {
    console.log("Conectado ao banco de dados");
  },
  (error) => {
    console.error("Erro ao conectar ao banco de dados");
  }
);
