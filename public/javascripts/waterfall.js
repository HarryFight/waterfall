/**
 * Created by Mr.Harry on 2015/1/28.
 */
(function($,window,undefined){
    //默认配置
    var DEFAULT_OPT = {
        container:'#waterfall-container',
        colums:[200,200,200,200],
        marginRight:20,
        marginBottom:20,
        loadUrl:'./getImg'
    };

    /*    页面指定了 DOCTYPE 时，使用 document.documentElement。
        页面没有指定了 DOCTYPE，时，使用 document.body。*/
    var cw = document.documentElement.clientHeight || document.body.clientHeight,   //视口大小
        ch = document.documentElement.clientWidth || document.body.clientWidth,
        maxColCount = 20,
        colCount = 0,
        colsLeft = [],     //保存每列的left位置
        minHeight = 0,      //当前加载了图片的列最小高度
        itemInfos =[],
        itemCache = [],
        colsHeight = [],    //保存每一列的高度
        timer;

    function Waterfall(opt){
        //使用个人配置，并且使用缺省配置
        this._opt = $.extend({},DEFAULT_OPT,opt);
        this._init();
    }

    /**
     * 初始化函数
     * @private
     */
    Waterfall.prototype._init = function(){
        var self = this;

        self._initColums();
        self._addEvent();
        //开始请求一次数据并且渲染
        self._loadImgs(function(data){
            self._render(data);
        });
    };
    /**
     * 计算每一列的位置，初始化高度
     * @private
     */
    Waterfall.prototype._initColums = function(){
        var self = this,
            countWidth = 0,
            opt = self._opt;

        $.each(opt.colums,function(index,item){
            //将每列的位置保存到colsLeft
            colsLeft.push(countWidth);
            //每列高度初始化为0
            colsHeight.push(0);
            //计算下一列的起始位置
            countWidth += (item + opt.marginRight);
        });
        //计算并设置contianer宽度
        countWidth -= opt.marginRight;
        opt.container.width(countWidth);
    };
    /**
     * 注册事件
     * @private
     */
    Waterfall.prototype._addEvent = function(){
        var self = this,
            win = $(window);    //将window对象包装成jquery对象

        win.on('scroll',scrollHandler);

        function scrollHandler(){
            var scrollTop = win.scrollTop();    //取得目前滚动条的高度
            if(scrollTop + ch >= minHeight){
                //当显示高度大于最小列后，加载图片
                self._loadImgs(function(data){
                    self._render(data);
                })
            }
        }
    };
    /**
     * 使用ajax获取json对象
     * @param callback
     * @private
     */
    Waterfall.prototype._loadImgs = function(callback){
        var self = this,
            url = self._opt.loadUrl;

        $.getJSON(url,function(data){
            //将获取的json对象传送给loadImgs的回调函数
            callback(data);
        })
    };
    /**
     * 开始渲染数据
     * @param data
     * @private
     */
    Waterfall.prototype._render = function(data){
         var self = this;

        self._appendItem(data);
    };
    /**
     * 向容器中添加dom元素
     * @param data
     * @private
     */
    Waterfall.prototype._appendItem = function(data){
        var self = this,
            opt = self._opt,
            container = opt.container;

        //读取json当中每一条图片信息，并且渲染
        $.each(data,function(index,item){
           //初始化添加图片的相关信息
           var minInfo = self._getMin(),   //获取最优添加图片的一列相关信息
               i = minInfo.index,
               colWidth = opt.colums[i],   //取得添加图片列的宽度
               left = colsLeft[i],    //取得添加图片的left位置
               top =minInfo.height,    //取得添加图片的top位置
               width = item.width,      //图片原本宽度
               height = parseInt( (colWidth/width) * item.height ),   //按照原比例计算的高度
               marginBottom = opt.marginBottom,
               url = item.url,
               itemStr,target;

            itemStr = self._getItemStr(top,left,colWidth,height,marginBottom,url);
            //将字符串生成为dom节点，并且包装为jquery对象
            target = $(itemStr);

            //将dom节点添加到容器中
            container.append(target);
            //完成后序工作,更新col信息
            colsHeight[i] += (height + marginBottom);
            minHeight = Math.min.apply(Math,colsHeight);    //获取添加图片后高度最小的列
        });
    };

    //工具函数
    /**
     * 获取最优添加图片的一列
     * @returns {{height: number, index: *}}
     * @private
     */
    Waterfall.prototype._getMin = function(){
          var self = this,
              minColHeight = Math.min.apply(Math,colsHeight),//找到cols中height最小的一列（Math.min接受两个参数，使用apply可以每次取数组中前两个数比较，直到比较完）
              minColIndex = $.inArray(minColHeight,colsHeight);//找到最小高度那一列的序号

        //返回最优添加图片的那一列的相关数据
        return {
            height:minColHeight,
            index:minColIndex
        }
    };
    /**
     * 生成item的html字符串
     * @param top
     * @param left
     * @param width
     * @param height
     * @param marginBottom
     * @param url
     * @returns {string}
     * @private
     */
    Waterfall.prototype._getItemStr = function(top,left,width,height,marginBottom,url){
        var self = this,
            itemStr = [
                '<div class="waterfall-item" style="top:'+top+'px; left:'+left+'px; width:'+width+'px; height:'+height+'px;margin-bottom:'+marginBottom+'px;">',
                    '<img src="'+url+'" width="'+width+'" height="'+height+'"/>',
                '</div>'
            ].join('');

        return itemStr;
    };

    //暴露接口
    window.Waterfall = Waterfall;
})($,window);
