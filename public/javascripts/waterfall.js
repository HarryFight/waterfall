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
        minHeight = 0,      //当前加载了图片的高度
        itemInfos =[],
        itemCache = [],
        colsHeight = [],
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
                //当显示区域大于加载图片区域后
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
    Waterfall.prototype._render = function(data){

    };

    window.Waterfall = Waterfall;
})($,window);
