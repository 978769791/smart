///////////////////////////////////////////////////////////////////////////
// Copyright © 2015 NarutoGIS. All Rights Reserved.
///////////////////////////////////////////////////////////////////////////

define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/_base/array',
        'dojo/_base/html',
        'jimu/BaseWidget',
        'dojo/on',
        'dojo/aspect',
        'dojo/string',
        'jimu/dijit/TileLayoutContainer',
        'jimu/utils',
        'dojox/grid/DataGrid',
        'dojo/data/ItemFileWriteStore',
        'dojo/data/ItemFileReadStore',
        'dojo/dom',
        'dojo/request',
        'dojo/io/script',
        'dojo/json',
        'dojo/topic',
        'dojo/parser',
        'dijit/form/DateTextBox',
        'dijit/form/TimeTextBox',
        'dijit/form/TextBox',
        './layer-v2.2/layer/layer'

    ],
    function (declare,
              lang,
              array,
              html,
              BaseWidget,
              on,
              aspect,
              string,
              TileLayoutContainer,
              utils,
              DataGrid,
              ItemFileWriteStore,
              ItemFileReadStore,
              dom,
              request,
              script,
              json,topic,parser,DateTextBox,TimeTextBox,TextBox,layer

    ) {
        return declare([BaseWidget], {
            //these two properties is defined in the BaseWidget
            baseClass: '',
            name: '',
            startup: function () {
                this.inherited(arguments);
                new TimeTextBox({name: "progval", value: new Date(),
                    constraints: {
                        timePattern: 'HH:mm:ss',
                        clickableIncrement: 'T00:15:00',
                        visibleIncrement: 'T00:15:00',
                        visibleRange: 'T01:00:00'
                    }

                }, "progval").startup();
                parser.parse();
                myShortYear.constraints.fullYear = true;
                myShortYear.set('value', myShortYear.get('value'));
                new TimeTextBox({name: "progvals", value: new Date(),
                    constraints: {
                        timePattern: 'HH:mm:ss',
                        clickableIncrement: 'T00:15:00',
                        visibleIncrement: 'T00:15:00',
                        visibleRange: 'T01:00:00'
                    }
                }, "progvals").startup();
                parser.parse();
                myShortYears.constraints.fullYear = true;
                myShortYears.set('value', myShortYears.get('value'));

                //请求服务器端数据 水情
                //console.log("sssssssssssssssssssssssss");
                // summary:
                script.get({
                    //url: "http://210.13.204.19:8083/smfxbServlets4typewwq/servlet/getData4type?type=RR",
                    url: "http://192.168.1.101:8080/jeefw/sys/ssysq/getpptnmany",
                    jsonp: "jsoncallback", //由flickr指定
                    content: {format: "json"},
                    load: function(data){
                        //将数据放入到grid中去显示
                        topic.publish('waterPositionData',data);
                        return data;
                    },
                    error: function(response){
                        console.log(response);
                        return response;
                    }
                }).then(function(data){
                    //we're only interested in data.results, so strip it off and return it
                    //console.log("skf  "+data.results);
                    return data.results;
                });
            },
            onOpen: function () {
                topic.subscribe("waterPositionData", lang.hitch(this,this.addDataToGrid));
            },
            _onBookmarkClick: function (bookmark) {
                layer.closeAll();
                layer.open({
                    type: 2, //page层
                    area: ['800px', '630px'],
                    title: '历史过程',
                    shade: false,
                    //shade: 0.6, //遮罩透明度
                    moveType: 0, //拖拽风格，0是默认，1是传统拖动
                    shift: 3, //0-6的动画形式，-1不开启
                    content: ['./widgets/RainInfo/tubiao.html', 'no']
                });
            },
            _onBookmarkClicks: function (bookmark) {
                layer.closeAll();
                layer.open({
                    type: 2, //page层
                    area: ['800px', '630px'],
                    title: '历史过程',
                    shade: false,
                    //shade: 0.6, //遮罩透明度
                    moveType: 0, //拖拽风格，0是默认，1是传统拖动
                    shift: 3, //0-6的动画形式，-1不开启
                    content: ['./widgets/RainInfo/tubiaos.html', 'no']
                });
            },

            onClose: function () {
                // summary:
                //    see description in the BaseWidget

            },

            onMinimize: function () {

            },

            onMaximize: function () {

            },

            destroy: function () {
                //this.inherited(arguments);
            },

            // 将获取到的数据添加到datagrid中去；
            addDataToGrid:function(list){

                console.log("go in addDataToGrid");
                console.log("in addDataToGrid list is :" + list);
                //var stringList = json.stringify(list);

                console.log(list);

                var data = {
                    identifier: "stcd",
                    items: list
                };

                var store = new  ItemFileReadStore({data: data});

                var layout = [[

                    {'name': '站点', 'field': 'stnm'},
                    {'name': '时间', 'field': 'tm'},
                    {'name': '雨量', 'field': 'drp'}
                ]];
                grid = new DataGrid({
                        id: 'grid',
                        store: store,
                        structure: layout,
                        rowSelector: '20px',
                        autoWidth: true,
                        rowsPerPage: 10
                    },
                    this.gridDiv);

                grid.set("onCellClick", lang.hitch(this,this.cellClickGird));

                grid.startup();

            },
            cellClickGird: function (e) {
                var item = grid.getItem(e.rowIndex);
                //console.log("sssss"+item);
                //var pt = ol.geom.Point([parseFloat(item["lgtd"]), parseFloat(item["lttd"])]);
                var location = [parseFloat(item["LGTD"]), parseFloat(item["LTTD"])];
                var  x = parseFloat(item["LGTD"]) ;
                var  y = parseFloat(item["LTTD"]);
                console.log(location);
                setTimeout(lang.hitch(this,function(){
                    this.map.camera.flyTo({
                        destination : Cesium.Cartesian3.fromDegrees(x, y, 15000.0)
                    });
                }),100);
                layer.open({
                    type: 2,
                    title: false,
                    shadeClose: true,
                    shade: false,
                    maxmin: true, //开启最大化最小化按钮
                    area: ['400px', '300px'],
                    offset: ['230px', '400px'], //右下角弹出
                    //offset: 'rb', //右下角弹出
                    shift: 2,
                    content: ['https://www.baidu.com/']//iframe的url；no代表不显示滚动条

                });


            },
            doBounce: function (location) {
                var duration = 2000;
                var start = +new Date();
                var pan = ol.animation.pan({
                    duration: duration,
                    source: /** @type {ol.Coordinate} */ (this.map.getView().getCenter()),
                    start: start
                });
                var bounce = ol.animation.bounce({
                    duration: duration,
                    resolution: 14 * this.map.getView().getResolution(),
                    start: start
                });
                this.map.beforeRender(pan, bounce);
                this.map.getView().setCenter(location);
            }


        });
    });