layui.define('table',function (exports) {
    "use strict";
    var $ = layui.$
        ,table = layui.table
        ,MOD_NAME = 'transfer',LEFT_TABLE = 'left-table-',RIGHT_TABLE = 'right-table-',LEFT_BTN = 'left-btn-',RIGHT_BTN = 'right-btn-',FILTER= 'test'
        ,DISABLED = 'layui-btn-disabled',BTN = 'button',BTN_STLY='btn',MD5='layui-col-md5',MD2='layui-col-md2'
        ,transfer = {
            index:layui.transfer?(layui.transfer+1000):0
            ,idData:[] //ID池
            ,update:function (data,filed) {
                if(filed=='' && data && data.length > 0){
                    var d = [];
                    $.each(data,function (k,v) {
                        delete v.LAY_TABLE_INDEX
                        delete v.LAY_CHECKED
                        d.push(v)
                    })
                    return d
                }else if(filed && data && data.length > 0){
                    d = '';
                    $.each(data,function (k,v) {
                        if( k === 0 ){
                            d += v[filed]
                        }else{
                            d += ','+ v[filed]
                        }
                    })
                    return d
                }else{
                    return [];
                }
            }
            ,get:function (option,type,field='') {

                var index = option.index
                if(!index){
                    return [];
                }
                if(type==='all'){
                    var d = [];
                    var d1 = table.cache[LEFT_TABLE+index],d2 = table.cache[RIGHT_TABLE+index];
                    d1 = this.update(d1,field);
                    d2 = this.update(d2,field)
                    d.push({left:d1})
                    d.push({right:d2})
                    return d
                }else if(type==='left' || type==='l'){
                    return this.update(table.cache[LEFT_TABLE+index],field)
                }else if(type === 'right' || type==='r'){
                    return this.update(table.cache[RIGHT_TABLE+index],field)
                }
            }
        }
        ,thisRate = function () {
            var that = this
            return {
                index:that.index
            }
        }
        ,Class = function (options) {
            var that = this
            that.index = ++transfer.index
            that.config = options
            that.createHTMLDocument()
            that.render()
        };
    Class.prototype.createHTMLDocument = function () {
        var that = this
            ,elem  = that.config.elem
            ,index= that.index;
        //创建页面元素
        var html = '<div class="layui-container">\
                    <div class="layui-row">\
                      <div class="'+MD5+'">\
                        <table class="layui-hide" id="'+LEFT_TABLE+index+'" lay-filter="'+FILTER+'"></table>\
                      </div>\
                      <div class="'+MD2+'" style="text-align: center;">\
                        <div id="'+LEFT_BTN+index+'"  style="margin-bottom: 10px;"><button data-type="0" data-index="'+index+'" class="layui-btn  '+DISABLED+' '+BTN_STLY+'"> <i class="layui-icon">&#xe602;</i></button></div>\
                        <div id="'+RIGHT_BTN+index+'" ><button data-type="1" data-index="'+index+'" class="layui-btn '+DISABLED+' '+BTN_STLY+'"> <i class="layui-icon">&#xe603;</i></button></div>\
                      </div>\
                      <div class="'+MD5+'">\
                        <table class="layui-hide" id="'+RIGHT_TABLE+index+'" lay-filter="'+FILTER+'"></table>\
                      </div>\
                    </div>\
                  </div>';
        $(elem).html(html)
    }
    //初始化表格
    Class.prototype.render = function () {
        var that = this,options = that.config;
        var d1_c = {
            elem: '#'+LEFT_TABLE+that.index
            ,cols: [options.cols]
            ,data: (options.data[0]?options.data[0]:[])
            ,id:LEFT_TABLE+that.index
        }
        var d2_c = {
            elem: '#'+RIGHT_TABLE+that.index
            ,cols: [options.cols]
            ,data: (options.data[1]?options.data[1]:[])
            ,id:RIGHT_TABLE+that.index
        }
        if(options.tabConfig){
            d1_c = $.extend(d1_c,options.tabConfig)
            d2_c = $.extend(d2_c,options.tabConfig)
        }
        transfer.idData.push(that.index)
        table.render(d1_c)
        table.init()
        table.render(d2_c)

        that.move()
        that.click()
    };
    //左右移动按钮根据左表格居中
    Class.prototype.move = function () {
        var that = this
            ,elem = $('#'+LEFT_TABLE+that.index)
            ,h = elem.parent().height();
        h =  h / 2 - 44;
        elem.parents('.layui-row').find('.'+MD2).css('padding-top',h+'px')
    }
    //点击事件
    Class.prototype.click = function () {
        var that = this,option = that.config;
        $(option.elem).find('.'+BTN_STLY).each(function () {
            var othis = $(this)
            othis.on('click',function () {
                if(!$(this).hasClass(DISABLED)){
                    var type = $(this).data('type'),index = $(this).data('index');
                    var checkStatus = table.checkStatus((type==0?LEFT_TABLE+index:RIGHT_TABLE+index)),data = checkStatus.data;
                    var d1 = table.cache[LEFT_TABLE+index]
                    var d2 = table.cache[RIGHT_TABLE+index]
                    if(type==0 && data){
                        //左边的数据移动到右表
                        that.shiftData(d1,d2,data,type)
                    }else if(type==1 && data){
                        //右表的数据移动到左表
                        that.shiftData(d2,d1,data,type)
                    }
                }
            })
        })
    }
    //数据处理
    Class.prototype.shiftData = function (data1,data2,data,type) {
        var da = [];//未选中的数据
        // d1.reverse();
        $.each(data1,function(k,v){
            if(!v.LAY_CHECKED){
                da.push(v)
            }
        })
        // dd.reverse();
        $.each(data,function(kk,vv){
            data2.unshift(vv)
        })
        var d = [];
        if(type==0){
            d.push(da)
            d.push(data2)
            $('#'+LEFT_BTN+this.index).children(BTN).addClass(DISABLED);
        }else if(type==1){
            d.push(data2)
            d.push(da)
            $('#'+RIGHT_BTN+this.index).children(BTN).addClass(DISABLED);
        }
        this.config.data = d
        this.render()
    }
    //选中状态
    table.on('checkbox('+FILTER+')', function(obj){
        var idData = transfer.idData,lenght = idData.length;
        if(lenght > 0){
            for (var i=0;i<=lenght-1;i++){
                var checkStatus1 = table.checkStatus(LEFT_TABLE+idData[i])
                    ,data_1 = checkStatus1.data
                    ,checkStatus2 = table.checkStatus(RIGHT_TABLE+idData[i])
                    ,data_2 = checkStatus2.data;
                if(data_1.length >0){
                    $('#'+LEFT_BTN+idData[i]).children(BTN).removeClass(DISABLED);
                }else{
                    $('#'+LEFT_BTN+idData[i]).children(BTN).addClass(DISABLED);
                }
                if(data_2.length >0){
                    $('#'+RIGHT_BTN+idData[i]).children(BTN).removeClass(DISABLED);
                }else{
                    $('#'+RIGHT_BTN+idData[i]).children(BTN).addClass(DISABLED);
                }
            }
        }
    });

    transfer.render = function (options) {
        var inst = new Class(options)
        return thisRate.call(inst)
    }
    exports(MOD_NAME,transfer)
})