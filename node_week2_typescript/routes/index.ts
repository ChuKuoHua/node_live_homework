import { IncomingMessage, ServerResponse } from "http";
import HttpControllers from '../controllers/http';
import PostsHttpControllers from '../controllers/posts';

const routes = async (req: IncomingMessage, res: ServerResponse) => {
  const { url, method } = req;
  let body = '';
  req.on('data', (chunk: string) => {
    body += chunk;
  })
  if(url === "/posts" && method === "GET") {
    PostsHttpControllers.getPosts(req, res);
  } else if (url === "/posts" && method === "POST") {
    req.on('end', () => {
      PostsHttpControllers.createPost(req, res, body);
    });
  } else if (url === "/posts" && method === "DELETE") {
    req.on('end', () => {
      PostsHttpControllers.deleteOnePost(req, res, body);
    });
  } else if (url === "/posts/all" && method === "DELETE") {
    PostsHttpControllers.deleteAllPost(req, res);
  } else if (url === "/posts" && method === "PATCH") {
    req.on('end', () => {
      PostsHttpControllers.editPost(req, res, body);
    });
  } else if (url === '/posts' && method === 'OPTIONS') {
    HttpControllers.cors(req, res);
  } else {
    HttpControllers.notFound(req, res);
  }
}

export default routes;