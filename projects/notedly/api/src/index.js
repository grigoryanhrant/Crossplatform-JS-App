const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
require('dotenv').config();
const db = require('./db');
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

let notes = [
  { id: '1', content: 'This is a note', author: 'Adam Scott' },
  { id: '2', content: 'This is another note', author: 'Harlow Everly' },
  { id: '3', content: 'Oh hey look, another note!', author: 'Riley Harrison' }
];

const typeDefs = gql`  
  type Note {
    id: ID!
    content: String!
    author: String!
 }
 
 type Query {
    notes: [Note!]!
    note(id: ID!): Note!
    demo(content: String!): Note!
 }
 type Mutation {
    newNote(content: String!): Note!
 }
`;

const resolvers = {
  Query: {
    notes: () => notes,
    note: (parent, args) => {
      return notes.find(note => note.id === args.id);
    },
  },
  Mutation: {
    newNote: (parent, args) => {
      let noteValue = {
        id: `${notes.length + 1}`,
        content: args.content,
        author: 'Adam Scott',
      };
      notes.push(noteValue)
      return noteValue
    }
  }
};

const app = express();

db.connect(DB_HOST);

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () =>
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
  )
)