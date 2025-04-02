const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = router.db.get('users').value();

  const user = users.find((u) => u.username === username && u.password === password);
  if (user) {
    res.json({ message: 'Login successo', token: 'fake-jwt-token', user });
  } else {
    res.status(401).json({ message: 'Credenziali non valide' });
  }
});

server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running on port 3000');
});
