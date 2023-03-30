// NOTE - 跨網域設定
const headers = require('./headers')

exports.errHandle = (res, massage) => {
  res.writeHead(400, headers);
  let msg = '';
  msg = massage ? massage : '欄位未填寫正確或無此 id';

  res.write(
    JSON.stringify({
      "status": "false",
      msg
    })
  )
  res.end();
}

exports.notHandle = (res, massage) => {
  res.writeHead('404', headers);
  res.write(
    JSON.stringify({
      "status": "error",
      massage
    })
  )
  res.end();
}