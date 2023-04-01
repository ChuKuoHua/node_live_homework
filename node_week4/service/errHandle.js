function errHandle(res, massage) {
  let msg = '';
  msg = massage ? massage : '欄位未填寫正確或無此 id';

  res.status(400).send({
    "status": "false",
    msg
  })
}

module.exports = errHandle