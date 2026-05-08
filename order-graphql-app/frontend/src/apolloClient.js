import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: '/graphql',
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Order: {
        keyFields: ['id'],
      },
    },
  }),
});

export default client;
