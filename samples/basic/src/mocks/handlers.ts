import { faker } from '@faker-js/faker';
import { rest } from 'msw';
import { User } from '../types/user';

export function createRandomUser(): User {
  return {
    id: faker.number.int(),
    name: faker.person.fullName(),
    sex: faker.person.sex(),
  };
}

export const users: User[] = faker.helpers.multiple(createRandomUser, {
  count: 18,
});

export const handlers = [
  rest.get('/api/users', (req, res, ctx) => {
    const current = parseInt(req.url.searchParams.get('current') ?? '1');
    const pageSize = parseInt(req.url.searchParams.get('pageSize') ?? '10');
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    const list = users.slice(start, end);
    const total = users.length;
    return res(ctx.status(200), ctx.json({ list, total }));
  }),

  rest.get('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params;
    const user = users.find((u) => u.id === Number(id));
    if (user) {
      return res(ctx.status(200), ctx.json(user));
    } else {
      return res(ctx.status(404));
    }
  }),

  rest.post<User>('/api/users', async (req, res, ctx) => {
    const body = await req.text();
    const user = JSON.parse(body);
    users.push({ ...user, id: faker.number.int() });
    return res(
      ctx.status(201),
      ctx.json({
        status: 200,
        message: 'create success',
        code: 'success',
      }),
    );
  }),

  rest.put<User>('/api/users/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const body = await req.text();
    const user = JSON.parse(body);
    const index = users.findIndex((u) => u.id === Number(id));
    if (index !== -1) {
      users[index] = user;
      return res(
        ctx.status(200),
        ctx.json({
          status: 200,
          message: 'update success',
          code: 'success',
        }),
      );
    } else {
      return res(
        ctx.status(200),
        ctx.json({
          status: 200,
          message: 'update fail',
          code: 'fail',
        }),
      );
    }
  }),

  rest.delete('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params;
    const index = users.findIndex((u) => u.id === Number(id));
    if (index !== -1) {
      users.splice(index, 1);
      return res(
        ctx.status(200),
        ctx.json({
          status: 200,
          message: 'del success',
          code: 'success',
        }),
      );
    } else {
      return res(
        ctx.status(200),
        ctx.json({
          status: 200,
          message: 'update fail',
          code: 'fail',
        }),
      );
    }
  }),
];
