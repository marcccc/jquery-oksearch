# jquery-oksearch
jquery oksearch plugin

## Demo
[http://amaml.qiniudn.com/assets/jquery/oksearch/test/index.html](http://amaml.qiniudn.com/assets/jquery/oksearch/test/index.html)

## Download
[ok.search](http://amaml.qiniudn.com/assets/jquery/oksearch/js/ok.search.js) 

## Dependencies
[jQuery](http://jquery.com/download/)

## Configuration
### html
```
<link rel="stylesheet" type="text/css" href="../css/ok.search.css" />
<div id="search-box-holder"></div>
```
### javascript
searchTypes：配置搜索类别和类别关联字段；searchFunc：搜索触发回调函数
```
    $('#search-box-holder').oksearch({
        searchTypes: [{
            id: 'device',
            name: '设备',
            columns: [{
                id: 'ip',
                name: 'IP 地址'
            }, {
                id: 'deviceName',
                name: '设备名称'
            }, {
                id: 'nodeName',
                name: '设备节点'
            }]
        }],
        searchFunc: function(searchValue){
            console.log(searchValue);
        }
    });
```

