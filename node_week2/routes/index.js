const Http = require('../controllers/http');
const Posts = require('../controllers/posts');

const routes = async (req, res) => {
  const { url, method } = req;
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  })
  if(url === "/posts" && method === "GET") {
    Posts.getPosts({res, req});
  } else if (url === "/posts" && method === "POST") {
    req.on('end', () => {
      body = JSON.parse(body);
      Posts.createPost({ body, res, req });
    });
  } else if (url === "/posts" && method === "DELETE") {
    req.on('end', () => {
      body = JSON.parse(body);
      Posts.deleteOnePost({ body, res, req });
    });
  } else if (url === "/posts/all" && method === "DELETE") {
    Posts.deleteAllPost({ res, req });
  } else if (url === "/posts" && method === "PATCH") {
    req.on('end', () => {
      body = JSON.parse(body);
      Posts.editPost({ body, res, req });
    });
  } else if (url === '/posts' && method === 'OPTIONS') {
    Http.cors(res, req);
  } else {
    Http.notFound(res, req);
  }
}

module.exports = routes;