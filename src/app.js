const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

app.use("/repositories/:id", validateId);
app.use("/repositories/:id", findRepository);

// REPOSITORIES
const repositories = [];

// MIDDLEWARES
function validateId(request, response, next) {
  const { id } = request.params;
  if (!id) {
    return response.status(400).json({ message: "id not passed" });
  }
  if (!isUuid(id)) {
    return response.status(400).json({ message: "invalid id value" });
  }
  return next();
}

function findRepository(request, response, next) {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (repositoryIndex < 0) {
    return response.status(400).json({ message: "repository does not exist" });
  }
  request.body = { ...request.body, repositoryIndex };
  return next();
}

// ROUTES
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs, repositoryIndex } = request.body;
  const newRepository = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs,
  };
  repositories[repositoryIndex] = newRepository;
  return response.json(newRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { repositoryIndex } = request.body;
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { repositoryIndex } = request.body;
  repositories[repositoryIndex].likes++;
  response.json(repositories[repositoryIndex]);
});

module.exports = app;
