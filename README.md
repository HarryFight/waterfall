# waterfall
瀑布流插件实现

***注：需要jquery支持。ie8+，chrome，FF等主流浏览器皆可***


###使用方法：
提取`waterfall/public/javascripts/waterfall.js`作为插件。[这里](https://github.com/HarryFight/waterfall/blob/master/public/javascripts/waterfall.js)

`waterfall/views/index.ejs`为插件演示的html文件。[这里](https://github.com/HarryFight/waterfall/blob/master/views/index.ejs)


插件调用方式：

```javascript
var waterfall = new Waterfall({
            colums:[200,200,200,200],
            marginRight:20,
            marginBottom:40,
            container:$("#waterfall-container"),
            loadUrl:"./getImg",
            maxLoad:100
        });
```
`loadUrl`若地址在不同域中，将采取jsonp的数据获取方式，url格式则为`你的url+?callbak=?`
插件缺省配置：
```javascript
 var DEFAULT_OPT = {
        container:'#waterfall-container',
        colums:[200,200,200,200],
        marginRight:20,
        marginBottom:20,
        loadUrl:'./getImg',
        maxLoad:200
    };
```

###实现思路：
1、插件构造函数初始化

2、initColums初始化，计算每一列的位置，初始化列高

3、注册scroll事件，触发后loadImgs

4、使用ajax获取数据json

5、使用render渲染获取到的数据

6、getMin获取最优可添加item节点的列

7、渲染时，添加dom节点。首先遍历数据，生成html字符并且产生dom节点，通过比较每列高度，优先添加到最低高度的列上

8、细节优化（比如限制加载数量等）。

###小结：
源文件中waterfall对象的原型中有关于节点复用的部分，此部分尚未完善，在以后有想法后会慢慢补充完成。
