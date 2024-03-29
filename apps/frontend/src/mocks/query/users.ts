import { IUser } from '@beginwrite/app-graphql-codegen';
import { graphql } from 'msw';
import { GetUsersQuery } from '@/components/pages/Users/gql';

const mock: Pick<IUser, 'id' | 'name'>[] = [];

for (let i = 1; i <= 20; i++) {
  const user: Pick<IUser, 'id' | 'name'> = {
    id: i.toString(),
    name: `Name ${i}`,
  };
  mock.push(user);
}

export const users = () => {
  return graphql.query<GetUsersQuery>('users', (_, res, ctx) => {
    return res(
      ctx.data({
        users: mock,
      }),
    );
  });
};
