import { faker } from "@faker-js/faker";
import moment from "moment";

export function generateUser(amount) {
  let users = [];

  for (let i = 0; i < amount; i++) {
    users.push({
      id: i,
      name: faker.person.fullName(),
      cpf: faker.phone.number('###.###.###-##'),
      phone: faker.phone.number('(##) #####-####'),
      email: faker.internet.email(),
      login: faker.internet.userName(),
      password: faker.internet.password(),
      role: faker.helpers.arrayElement(["admin", "user"]),
      createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
  }

  return users;
}
