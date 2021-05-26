import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloWorldResolver } from "./resolvers/HelloWorldResolver";
import { SnippetResolver } from "./resolvers/SnippetResolver";
import { verify } from "jsonwebtoken"
import { UserResolver } from "./resolvers/UserResolver";
import { AuthResolver } from "./resolvers/AuthResolver";

(async () => {
  const app = express();

  app.use((req, _, next) => {
    const accessToken = req.headers.authorization?.split('')[1] as string;
    try {
      console.log('This is the access Token')
      console.log(accessToken)
      const data = verify(accessToken, '123456789') as any;
      (req as any).userId = data.userId;  
    } catch {}
    next();
  })

  const options = await getConnectionOptions(
    process.env.NODE_ENV || "development"
  );
  await createConnection({ ...options, name: "default" });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloWorldResolver, SnippetResolver, UserResolver, AuthResolver],
      validate: true
    }),
    context: ({ req, res }: any) => ({ req, res })
  });

  apolloServer.applyMiddleware({ app, cors: false });

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`server started at http://localhost:${port}/graphql`);
  });
})();
