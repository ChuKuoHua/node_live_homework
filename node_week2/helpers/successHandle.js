// NOTE - 跨網域設定
const headers = require('./headers')

function successHandle(res, massage) {
  res.writeHead(200, headers);
  res.write(
    JSON.stringify({
      "status": "success",
      massage
    })
  )
  res.end();
}

module.exports = successHandle