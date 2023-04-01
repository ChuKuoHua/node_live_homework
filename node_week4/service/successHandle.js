function successHandle(res, data) {
  // res.json({
  //   status: "success",
  //   data
  // });
  // res.end();
  // 傳入型別來決定回傳格式
  // 會自動帶 res.end()
  // 也可以不寫 status 成功會自動帶入 200
  res.status(200).send({
    "status": "success",
    data
  });
}

module.exports = successHandle