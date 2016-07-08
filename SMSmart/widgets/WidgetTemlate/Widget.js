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
        'dojo/parser',
        'dijit/form/DateTextBox',
        'dijit/form/TimeTextBox',
        'dojox/grid/DataGrid',
        'dojo/data/ItemFileWriteStore',
        'dojo/data/ItemFileReadStore',
        'dojo/dom',
        'dojo/request',
        'dojo/io/script',
        'dojo/json',
        'dojo/topic'
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
              utils,parser,DateTextBox,TimeTextBox,DataGrid, ItemFileWriteStore,ItemFileReadStore,dom,request,script,json,topic

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

                //获取数据
                script.get({
                    url : "http://210.13.204.19:8083/smfxbServlets/servlet/STPPTNRServletMany?stcds='"+stcds+"'&stm="+starttime+"&etm="+endtime,

                    jsonp: "jsoncallback", //由flickr指定
                    content: {format: "json"},
                    load: function(data){

                        //var list = dojo.toJson(data, true);
                        topic.publish('rainData',data);
                        return data;
                    }
                })
            },
            onOpen: function () {


                topic.subscribe("rainData", lang.hitch(this,this.addDataToGrid));



            },
                onClose: function () {
                // summary:
                //    see description in the BaseWidget

            },

            onMinimize: function () {

            },

            _onAddBtnClicked: function () {

                alert("onaaddBtn");
                this.inherited(arguments);
                var starttime=dijit.byId("myShortYear").get('displayedValue')+" "+dijit.byId("progval").get('displayedValue');

                var endtime=dijit.byId("myShortYears").get('displayedValue')+" "+dijit.byId("progvals").get('displayedValue');
               // alert(endtime);
                var stcds=dijit.byId("ssyqstcd").get('displayedValue');

                script.get({
                    url : "http://210.13.204.19:8083/smfxbServlets/servlet/STPPTNRServletMany?stcds='"+stcds+"'&stm="+starttime+"&etm="+endtime,

                    jsonp: "jsoncallback", //由flickr指定
                    content: {format: "json"},
                    load: function(data){

                        //var list = dojo.toJson(data, true);
                        topic.publish('rainData',data);





                        return data;
                    }
                }).then(function(data){

                    topic.subscribe("rainData", this.addDataToGrid);


                    console.log(data);


                    return data.results;

                });
            },

            destroy: function () {
                this.bookmarkList.destroy();
                this.inherited(arguments);
            },

            addDataToGrid:function(data){

                 console.log(data);
                 console.log("========================llllllll");

                var data1 = {
                    identifier: "STCD",
                    items: data
                };

                var store = new  ItemFileReadStore({data: data1});

                var layout = [[

                    {'name': '站点', 'field': 'STNM'},
                    {'name': '雨量', 'field': 'DRP'},
                    {'name': '时间', 'field': 'TM'}
                ]];

                grid = new DataGrid({
                        id: 'grid',
                        store: store,
                        structure: layout,
                        rowSelector: '20px',
                        autoWidth: true,
                        rowsPerPage: 10
                    },
                    this.gridDivcsl);

                grid.startup();

            }

        });
    });