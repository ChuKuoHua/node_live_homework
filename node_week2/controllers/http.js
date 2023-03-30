const headers = require('../helpers/headers');
const { notHandle } = require('../helpers/errHandle');

const http = {
  cors(res, req) {
    res.writeHead('200', headers);
    res.end();
  },
  notFound(res, req) {
    notHandle(res, '無此網站路由')
    res.end();
  },
};

module.exports = http;
