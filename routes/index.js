var express = require('express');
var router = express.Router();

//图片资源数组
var randoms = [
    '{"url":"./img/1.jpg","width":600,"height":337}',
    '{"url":"./img/2.jpg","width":600,"height":418}',
    '{"url":"./img/3.jpg","width":480,"height":320}',
    '{"url":"./img/4.jpg","width":600,"height":400}',
    '{"url":"./img/5.jpg","width":600,"height":345}',
    '{"url":"./img/6.jpg","width":600,"height":449}',
    '{"url":"./img/7.jpg","width":320,"height":480}',
    '{"url":"./img/8.jpg","width":580,"height":435}'
];

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'waterfall' });
});

//图片请求接口
router.get('/getImg',function(req,res){
    var imgInfos = [],
        i = 0;

    //每次请求发送15张随机的图片信息
    while(i < 15){
        i++;
        imgInfos.push(randoms[Math.ceil(Math.random()*7)])
    }

    imgInfos = imgInfos.join(',');
    //将返回信息包装为字符串数组
    imgInfos = "["+imgInfos+"]";

    res.writeHead(200,"text/html");
    res.write(imgInfos);
    res.end();
});


module.exports = router;
