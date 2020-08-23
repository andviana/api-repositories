const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

app.use("/repositories/:id", validateId);

const repositories = [];

function validateId(request, response, next) {
  const { id } = request.params;
  if (!id) {
    return response.status(400).json({ message: "id not passed" });
  }
  if (!isUuid(id)) {
    return response.status(400).json({ message: "invalid id value" });
  }
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (repositoryIndex < 0) {
    return response.status(400).json({ message: "repository does not exist" });
  }
  request.body = { ...request.body, repositoryIndex };
  return next();
}

app.get("/repositories", (request, response) => {
  response.send(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repository);
  response.send(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs, repositoryIndex } = request.body;
  const { id } = request.params;
  let newRepository = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs,
  };
  repositories[repositoryIndex] = newRepository;
  response.send(newRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );
  repositories.splice(repositoryIndex, 1);
  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );
  repositories[repositoryIndex].likes++;
  response.send(repositories[repositoryIndex]);
});

module.exports = app;
