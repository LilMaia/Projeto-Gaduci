import { fa, faker } from "@faker-js/faker";
import moment from "moment";

export function generateUser(amount) {
  let users = [];

  for (let i = 0; i < amount; i++) {
    users.push({
      name: faker.person.fullName(),
      cpf: faker.phone.number("###.###.###-##"),
      phone: faker.phone.number("(##) #####-####"),
      email: faker.internet.email(),
      login: faker.internet.userName(),
      password: faker.internet.password(),
      role: faker.helpers.arrayElement(["admin", "user"]),
    });
  }

  return users;
}

export function generateAdminUser() {
  let users = [];
  users.push({
    name: "admin",
    cpf: faker.phone.number("###.###.###-##"),
    phone: faker.phone.number("(##) #####-####"),
    email: "admin@gmail.com",
    login: "admin",
    password: "admin",
    role: faker.helpers.arrayElement(["admin"]),
  });

  return users;
}

export function generateGrupo(amount) {
  let grupos = [];

  for (let i = 0; i < amount; i++) {
    grupos.push({
      codEstadoIbge: faker.datatype.number(),
      estado: faker.address.state(),
      abreviacaoEstado: faker.address.stateAbbr(),
      codMunicipioIbge: faker.datatype.number(),
      municipio: faker.address.city(),
      nomeDoGrupo: faker.name.jobArea(),
    });
  }

  return grupos;
}

export function generateAtividade(amount, grupoId) {
  let atividades = [];

  for (let i = 0; i < amount; i++) {
    atividades.push({
      codigoDoServico: faker.datatype.number(),
      classificacao: faker.datatype.number(),
      nomeAtividade: faker.name.jobType(),
      aliquotaISS: faker.datatype.number(),
      grupoId: grupoId,
    });
  }

  return atividades;
}
