import { rest } from "msw";
import { faker } from "@faker-js/faker";
import { User } from "../types/user";

export function createRandomUser(): User {
  return {
    id:  faker.number.int(),
    name: faker.internet.userName(),
    birthdate: faker.date.birthdate(),
  };
}

export const users: User[] = faker.helpers.multiple(createRandomUser, {
  count: 35,
});

export const handlers = [
  rest.get("/api/users", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(users));
  }),

  rest.get("/api/users/:id", (req, res, ctx) => {
    const { id } = req.params;
    const user = users.find((u) => u.id === Number(id));
    if (user) {
      return res(ctx.status(200), ctx.json(user));
    } else {
      return res(ctx.status(404));
    }
  }),

  rest.post<User>("/api/users", (req, res, ctx) => {
    const user = req.body;
    users.push(user);
    return res(ctx.status(201), ctx.json(user));
  }),

  rest.put<User>("/api/users/:id", (req, res, ctx) => {
    const { id } = req.params;
    const user = req.body;
    const index = users.findIndex((u) => u.id === Number(id));
    if (index !== -1) {
      users[index] = user;
      return res(ctx.status(200), ctx.json(user));
    } else {
      return res(ctx.status(404));
    }
  }),

  rest.delete("/api/users/:id", (req, res, ctx) => {
    const { id } = req.params;
    const index = users.findIndex((u) => u.id === Number(id));
    if (index !== -1) {
      users.splice(index, 1);
      return res(ctx.status(204));
    } else {
      return res(ctx.status(404));
    }
  }),
];
