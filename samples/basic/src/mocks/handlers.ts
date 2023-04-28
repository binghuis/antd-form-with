import { rest } from "msw";
import { User } from "../types/user";

const users: User[] = [
  { id: 1, name: "Alice", age: 18 },
  { id: 2, name: "Bob", age: 24 },
  { id: 3, name: "Charlie", age: 32 },
];

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
