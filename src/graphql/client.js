import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
//import { split, HttpLink } from "@apollo/client";
//import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { GET_QUEUED_SONGS } from "../graphql/queries";
/* 

const client = new ApolloClient({
  uri: process.env.REACT_APP_URI,
  cache: new InMemoryCache(),
  headers: {
    "x-hasura-admin-secret": process.env.REACT_APP_HASURA_ADMIN_SECRET,
    "content-type": "application/json",
  },
}); */

/* const httpLink = new HttpLink({
  uri: "https://forgione-music-share.hasura.app/v1/graphql",
  headers: {
    "x-hasura-admin-secret": process.env.REACT_APP_HASURA_ADMIN_SECRET,
    "content-type": "application/json",
  },
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: "wss://forgione-music-share.hasura.app/v1/graphql",
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
}); */

const wslink = new GraphQLWsLink(
  createClient({
    url: process.env.REACT_APP_URI_WS,
    connectionParams: {
      headers: {
        "x-hasura-admin-secret": process.env.REACT_APP_HASURA_ADMIN_SECRET,
        "content-type": "application/json",
      },
    },
  })
);

const typeDefs = gql`
  type Song {
    id: uuid!
    title: String!
    artist: String!
    thumbnail: String!
    url: String!
    duration: Float!
  }

  input SongInput {
    id: uuid!
    title: String!
    artist: String!
    thumbnail: String!
    url: String!
    duration: Float!
  }

  type Query {
    queue: [Song]!
  }

  type Mutation {
    addOrRemoveFromQueue(input: SongInput!): [Song]!
  }
`;

const client = new ApolloClient({
  link: wslink,
  cache: new InMemoryCache(),
  typeDefs,
  resolvers: {
    Mutation: {
      addOrRemoveFromQueue: (_, { input }, { cache }) => {
        const queryResult = cache.readQuery({
          query: GET_QUEUED_SONGS,
        });
        if (queryResult) {
          const { queue } = queryResult;
          const isInQueue = queue.some((song) => song.id === input.id);
          const newQueue = isInQueue
            ? queue.filter((song) => song.id !== input.id)
            : [...queue, input];
          cache.writeQuery({
            query: GET_QUEUED_SONGS,
            data: { queue: newQueue },
          });
          return newQueue;
        }
        return [];
      },
    },
  },
});

const hasQueue = Boolean(localStorage.getItem("queue"));

const data = {
  queue: hasQueue ? JSON.parse(localStorage.getItem("queue")) : [],
};

client.writeQuery({ query: GET_QUEUED_SONGS, data });
export default client;
