require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

async function startServer() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
    })
  );
  app.use(express.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.get('/health', (_, res) => {
    res.json({ status: 'ok' });
  });

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => ({
        requestId: req.headers['x-request-id'] || null,
      }),
    })
  );

  const port = Number(process.env.PORT || 4000);
  app.listen(port, () => {
    console.log(`GraphQL API ready at http://localhost:${port}/graphql`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
