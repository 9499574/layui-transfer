/**
 * time: 2018年11月23日 17:28:32
 * author: dbag
 * blog: http://www.cnblogs.com/phper8/
 */
layui.define('table', function(exports){
  var $ = layui.$
      ,table = layui.table
   ,e = '' //elem id
  ,c = [] //cols 表格列
  ,d = [] //data 数据
  ,id = [] //生成表格的ID
  ,tc = [] //表格配置项
  ,transfer = {
  upData:function (data,field) {
      //处理数据
      if(field=='' && data && data.length > 0){
          var d = [];
          $.each(data,function (k,v) {
              delete v.LAY_TABLE_INDEX
              delete v.LAY_CHECKED
              d.push(v)
          })
          return d
      }else if(field && data && data.length > 0){
          d = '';
          $.each(data,function (k,v) {
              if( k === 0 ){
                  d += v[field]
              }else{
                  d += ','+ v[field]
              }
          })
          return d
      }else{
          return [];
      }
  },
  get:function (type,field='') {
      //获取表格里面的数据
      if(type==='all'){
          var d1 = table.cache[id[0]],d2 = table.cache[id[1]];
          return {lt:this.upData(d1,field),rt:this.upData(d2,field)}
      }else if(type==='left' || type==='l'){
          return this.upData(table.cache[id[0]],field)
      }else if(type === 'right' || type==='r'){
          return this.upData(table.cache[id[1]],field)
      }
  },
    jth: function (id){
      //计算中间按钮的中间位置
        var h = $('#'+id).parent().height();
        h =  h / 2 - 44;
        $('#'+id).parents('.layui-row').find('.layui-col-md2').css('padding-top',h+'px') 
    },
    h: function(e){
      //构建布局代码
         var id1 = 'transfer_lt_'+Math.random().toString(36).substr(2);
         var id2 = 'transfer_rt_'+Math.random().toString(36).substr(2);
         var id3 = 'transfer_lb_'+Math.random().toString(36).substr(2);
         var id4 = 'transfer_rb_'+Math.random().toString(36).substr(2);
         var h = '<div class="layui-container">\
                    <div class="layui-row">\
                      <div class="layui-col-md5">\
                        <table class="layui-hide" id="'+id1+'" lay-filter="test"></table>\
                      </div>\
                      <div class="layui-col-md2" style="text-align: center;">\
                        <div id="'+id3+'"  style="margin-bottom: 10px;"><button data-type="0" class="layui-btn  layui-btn-disabled btn"> <i class="layui-icon">&#xe602;</i></button></div>\
                        <div id="'+id4+'" ><button data-type="1" class="layui-btn layui-btn-disabled btn"> <i class="layui-icon">&#xe603;</i></button></div>\
                      </div>\
                      <div class="layui-col-md5">\
                        <table class="layui-hide" id="'+id2+'" lay-filter="test"></table>\
                      </div>\
                    </div>\
                  </div>';
         $(e).html(h)
        return [id1,id2,id3,id4];
    },
    csh: function(){
      //生成表格
        var d1 = d[0]?d[0]:[];
        var d2 = d[1]?d[1]:[];
        var d1_c = {
            elem: '#'+id[0]
            ,cols: [c]
            ,data: d1
            ,id:id[0]
        }
        var d2_c = {
            elem: "#"+id[1]
            ,cols: [c]
            ,data: d2
            ,id:id[1]
        }
        if(tc){
            d1_c  = $.extend(d1_c,tc)
            d2_c  = $.extend(d2_c,tc)
        }
        table.render(d1_c);
        table.render(d2_c);
    },
  	render: function(p){
      //初始化代码
        if(!p || $(p.elem).length === 0){
            console.log(p.elem+':不存在');
            return false;
        }
        if(p.cols.length === 0){
           console.log('field字段不存在');
           return false; 
        }
         id = this.h(p.elem);
         e = p.elem
         c = p.cols
         d = p.data
         tc = p.tabConfig
        this.csh()
        this.jth(id[0])
    }
  }
  table.on('checkbox(test)', function(obj){
     var checkStatus1 = table.checkStatus(id[0])
      ,d1 = checkStatus1.data;
      if(!d1.length){
          $('#'+id[2]).children('button').addClass('layui-btn-disabled');
      }else if(d1.length > 0){
          $('#'+id[2]).children('button').removeClass('layui-btn-disabled');
      }
      var checkStatus2 = table.checkStatus(id[1])
          ,d2 = checkStatus2.data;
      if(!d2.length){
          $('#'+id[3]).children('button').addClass('layui-btn-disabled');
      }else if(d2.length > 0){
          $('#'+id[3]).children('button').removeClass('layui-btn-disabled');
      }
  });
  //数据左右移动 参数1 需要被删除的  参数2 需要被增加的  参数3 选中的数据  参数4 左还是右
  function shiftData(d1,d2,dd,type){
      var da = [];//未选中的数据
      // d1.reverse();
      $.each(d1,function(k,v){
          if(!v.LAY_CHECKED){
              da.push(v)
          }
      })
      // dd.reverse();
      $.each(dd,function(kk,vv){
          d2.unshift(vv)
      })
      d = [];
      if(type==0){
          d.push(da)
          d.push(d2)
      }else if(type==1){
          d.push(d2)
          d.push(da)
      }
      transfer.csh()
      $('.btn').addClass('layui-btn-disabled');
  }
  $(document).on('click','.btn',function(){
      var type = $(this).data('type');
      var checkStatus = table.checkStatus(id[type]),data = checkStatus.data;
      var d1 = table.cache[id[0]]
      var d2 = table.cache[id[1]]
      if(type==0 && data){
          //左边的数据移动到右表
          shiftData(d1,d2,data,type)
      }else if(type==1 && data){
          //右表的数据移动到左表
          shiftData(d2,d1,data,type)
      }
  })
  exports('transfer',transfer);
});