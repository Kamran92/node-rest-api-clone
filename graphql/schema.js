const {buildSchema} = require('graphql')

module.exports = buildSchema(`
  type Todo {
    id: ID!
    title: String!
    done: Boolean
    createdAt: String
    updatedAt: String
  }

  input UserInput {
    name: String!
    email: String!
  }

  input TodoInput {
    title: String!
  }

  type Query {
    getTodos: [Todo!]!
  }

  type Mutation {
    createTodo(todo: TodoInput!): Todo!
    deleteTodo(id: ID!): Boolean!
    completeTodo(id: ID!): Todo!
  }
`)