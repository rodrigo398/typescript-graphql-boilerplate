import { request } from 'graphql-request';
import { User } from '../entity/User';
import { startServer } from '../startServer';

let getHost = () => '';

beforeAll(async () => {
  const app = startServer();
  const { port } = (await app).address();
  getHost = () => `http://127.0.0.1:${port}`;
});

const email = 'bob1@bob1.com';
const password = 'adminadmin';

const mutation = `
mutation{
  register(email: "${email}", password: "${password}")
}
`;

describe('Register/query user', () => {
  test('Register user', async () => {
    const response = await request(getHost(), mutation);
    expect(response).toEqual({ register: true });
  });

  test('Query user', async () => {
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
  });
});
