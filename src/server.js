const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

// Middlewares
function checkProjectExists(request, response, next) {
  const { id } = request.params;

  const project = projects.find(e => e.id === id);

  if (!project) {
    return response.status(400).json({ error: 'Project does not exists.' });
  }

  return next();
}

function logNumberOfRequests(request, response, next) {
  console.count('# Request made');

  return next();
}

// Rotas
server.post('/projects', logNumberOfRequests, (request, response) => {
  const { id, title } = request.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return response.json(project);
});

server.get('/projects', logNumberOfRequests, (request, response) => {
  return response.json(projects);
});

server.put('/projects/:id', logNumberOfRequests, checkProjectExists, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;

  const project = projects.find(e => e.id === id);

  project.title = title;

  return response.json(project);
});

server.delete('/projects/:id', logNumberOfRequests, checkProjectExists, (request, response) => {
  const { id } = request.params;

  const index = projects.findIndex(e => e.id === id);

  projects.splice(index, 1);

  return response.send();
});

server.post('/projects/:id/tasks', logNumberOfRequests, checkProjectExists, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;

  const project = projects.find(e => e.id === id);

  project.tasks.push(title);

  return response.json(project);
});

server.listen(3333);