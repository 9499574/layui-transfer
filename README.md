# Transfer 穿梭框组件-基于layui
![2018-11-23.17.37.27-GIF1.gif](https://raw.githubusercontent.com/9499574/markdown/master/img/2018-11-23.17.37.27-GIF1.gif)

[在线体验](https://9499574.github.io/layui-transfer/)

### 如何使用:
***
```html
<div id="root"></div>
```

```script
layui.config({
  base: 'js/'
})
layui.use('transfer',function(){
        var transfer = layui.transfer;
        //数据源
		var data = [{'id':'10001','name':'杜甫','sex':'男'},{'id':'10002','name':'李白','sex':'男'},{'id':'10003','name':'王勃','sex':'男'},{'id':'10004','name':'李清照','sex':'男'}];
		//表格列
		var cols = [{type: 'checkbox', fixed: 'left'},{field: 'id', title: 'ID', width: 80, sort: true},{field: 'name', title: '用户名'},{field: 'sex', title: '性别'}]
        //表格配置文件
        var tabConfig = {'page':true,'limits':[10,50,100],'height':400}
		
		transfer.render({
			elem: "#root", //指定元素
			cols: cols, //表格列
			data: [data], //[左表数据,右表数据]
            tabConfig: tabConfig //表格配置项
		})
		//获取数据
        //transfer.get(参数1:类型,参数2:指定字段[选填])
        //获取全部数据
        transfer.get('all')
        //获取左边数据
        transfer.get('l','id');
        //获取右表数据
        transfer.get('r','id');
       
	})
```
