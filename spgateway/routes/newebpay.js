const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const dotenv = require('dotenv');
const dayjs = require('dayjs');
dotenv.config({path: './.env'});

const { MerchantID, HASHKEY, HASHIV, Version, Host, RespondType, ReturnURL, NotifyURL, ClientBackURL } = process.env;
const orders = {}
// 建立訂單
router.post('/createOrder', (req, res) => {
  const data = req.body;
  const TimeStamp = Math.round(new Date().getTime() / 1000)
  const ExpireDate = '2023-05-25'

  orders[data.MerchantOrderNo] = {
    ...data,
    TimeStamp,
    ExpireDate
  };
  const order = orders[data.MerchantOrderNo]
  
  console.log(order);
  const aesEncrypt = create_mpg_aes_encrypt(order, 'create');
  // console.log('aesEncrypt:', aesEncrypt);
  const shaEncrypt = create_mpg_sha_encrypt(aesEncrypt);
  // console.log('shaEncrypt:', shaEncrypt);
  const dateStr = '2023-05-2010:23:04';
  const inputFormat = 'YYYY-MM-DDTHH:mm:ss';
  const outputFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

  const outputFormat2 = 'YYYY-MM-DD HH:mm:ss';

  // 將日期字串轉換為指定格式的日期物件
  const dateObj = dayjs(dateStr, inputFormat);

  // 將日期物件轉換為指定格式的字串
  const formattedDate = dateObj.format(outputFormat);
  console.log(formattedDate)
  const dateObj2 = dayjs(formattedDate, outputFormat);
  const formattedDate2 = dateObj2.format(outputFormat2);
  
  console.log(formattedDate2);

  return res.json({
    order: orders[data.MerchantOrderNo],
    TradeSha: shaEncrypt,
    TradeInfo: aesEncrypt,
  });
});

// 交易成功：Return （可直接解密，將資料呈現在畫面上）
router.post('/spgateway_return', function (req, res, next) {
  const response = req.body;
  // const data = create_mpg_sha_encrypt(response.TradeInfo);
  if(response.Status === 'SUCCESS') {
    res.redirect('https://musitix-south3.onrender.com/#/');
  } else {
    res.redirect('https://musitix-south3.onrender.com/#/');
  }
});

// 確認交易：Notify
router.post('/spgateway_notify', function (req, res, next) {
  console.log('req.body notify data', req.body);
  const response = req.body;

  const thisShaEncrypt = create_mpg_sha_encrypt(response.TradeInfo);
  // 使用 HASH 再次 SHA 加密字串，確保比對一致（確保不正確的請求觸發交易成功）
  if (!thisShaEncrypt === response.TradeSha) {
    console.log('付款失敗：TradeSha 不一致');
    return res.end();
  }

  // 解密交易內容
  const data = create_mpg_aes_decrypt(response.TradeInfo);
  console.log('data:', data);
  const orderId = data?.Result?.MerchantOrderNo
  // 取得交易內容，並查詢本地端資料庫是否有相符的訂單
  if (!orderId) {
    console.log('找不到訂單');
    return res.end();
  }

  // 交易完成，將成功資訊儲存於資料庫
  console.log('付款完成，訂單：', data?.Result?.MerchantOrderNo);

  res.json({
    id: data?.Result?.MerchantOrderNo
  })
});

router.post('/closeOrder', (req, res) => {
  const data = req.body;
  const TimeStamp = Math.round(new Date().getTime() / 1000)
  orders[data.MerchantOrderNo] = {
    ...data,
    TimeStamp
  };
  const order = orders[data.MerchantOrderNo]
  const aesEncrypt = create_mpg_aes_encrypt(order, 'close');

  return res.json({
    order: orders[data.MerchantOrderNo],
    PostData_: aesEncrypt,
  });
});

module.exports = router;

// 字串組合
function genDataChain(order, type) {
  const ExpireDate = order?.ExpireDate
  if(type !== 'close') {
    return `MerchantID=${MerchantID}`
      + `&RespondType=${RespondType}`
      + `&TimeStamp=${order.TimeStamp}`
      + `&Version=${Version}`
      + `&MerchantOrderNo=${order.MerchantOrderNo}`
      + `&Amt=${order.Amt}`
      + `&ItemDesc=${encodeURIComponent(order.ItemDesc)}`
      + `&Email=${encodeURIComponent(order.Email)}`
      + `&NotifyURL=${NotifyURL}`
      // + `&ReturnURL=${ReturnURL}`
      + `&ClientBackURL=${ClientBackURL}`
      + `&ExpireDate=${ExpireDate ? ExpireDate : ''}`;
  } else {
    return `MerchantID=${MerchantID}`
      +`RespondType=${RespondType}`
      + `&TimeStamp=${order.TimeStamp}`
      + `&Version=${Version}`
      + `&MerchantOrderNo=${order.MerchantOrderNo}`
      + `&Amt=${order.Amt}`
      + `&IndexType=2&CloseType=2`
      + `&NotifyURL=${NotifyURL}`
      + `&ClientBackURL=${ClientBackURL}`;
  }
}

// 對應文件 P16：使用 aes 加密
// $edata1=bin2hex(openssl_encrypt($data1, "AES-256-CBC", $key, OPENSSL_RAW_DATA, $iv));
function create_mpg_aes_encrypt(TradeInfo, type) {
  const encrypt = crypto.createCipheriv('aes256', HASHKEY, HASHIV);
  
  const enc = encrypt.update(genDataChain(TradeInfo, type), 'utf8', 'hex');
  return enc + encrypt.final('hex');
}

// 對應文件 P17：使用 sha256 加密
// $hashs="HashKey=".$key."&".$edata1."&HashIV=".$iv;
function create_mpg_sha_encrypt(aesEncrypt) {
  const sha = crypto.createHash('sha256');
  const plainText = `HashKey=${HASHKEY}&${aesEncrypt}&HashIV=${HASHIV}`;

  return sha.update(plainText).digest('hex').toUpperCase();
}

// 將 aes 解密
function create_mpg_aes_decrypt(TradeInfo) {
  const decrypt = crypto.createDecipheriv('aes256', HASHKEY, HASHIV);
  decrypt.setAutoPadding(false);
  const text = decrypt.update(TradeInfo, 'hex', 'utf8');
  const plainText = text + decrypt.final('utf8');
  const result = plainText.replace(/[\x00-\x20]+/g, '');
  return JSON.parse(result);
}
