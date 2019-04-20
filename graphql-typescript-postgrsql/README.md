
# Graphql Typescript Node Postgresql Sequelize

> npm update

> npm install -g gulp

> gulp

> npm start

* Caso queira criar o schema

> sequelize db:create


 Criar usuário

```javascript
mutation {
  createUser(input: {name: "Eduardo", email: "eduardok.fx@gmail.com", password: "123456"}) {
    id
  }
}
```

JWT

```javascript
mutation {
  createToken(email:"eduardok.fx@gmail.com",password:"123456"){
  token
  }
}
```

Salvar dados na tabela

* Abrir pelo Isomnia ou postman


```javascript
mutation {
  createPost(input: {title: "Titulo", content: "Descrição",
  photo: "https://cdn-images-1.medium.com/max/2600/0*5WsW82sZj2yuVHOt"}) {
    title
    author {
      name
      email
    }
    createdAt
  }
}


```




Consumir / Javascript Puro

```javascript
const consumirAPI = async (graphqlEndpoint, query, variables = {}) => {
  const response = await fetch(graphqlEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  });

  return response.json();
}

const GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql'

const consultarTodosQuery = `
query{
  posts{
    id
    title
    content
    author{
      name
    }
  }
}
`;

consumirAPI(GRAPHQL_ENDPOINT, consultarTodosQuery).then(console.log);
```