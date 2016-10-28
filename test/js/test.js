$(function(){
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
        }, {
            id: 'circuit',
            name: '电路',
            columns: [{
                id: 'ip',
                name: 'IP 地址'
            }, {
                id: 'circuitName',
                name: '电路名称'
            }, {
                id: 'nodeName',
                name: '节点'
            }]
        }, {
            id: 'user',
            name: '通许录',
            columns: [{
                id: 'name',
                name: '名字'
            }, {
                id: 'phone',
                name: '电话号码'
            }]
        }],
        searchFunc: function(searchValue){
            console.log(searchValue);
        }
    });
});