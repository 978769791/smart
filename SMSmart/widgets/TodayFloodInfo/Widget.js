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
              utils,
              DataGrid,
              ItemFileWriteStore,
              ItemFileReadStore,
              dom,
              request,
              script,
              json,
              topic
    )
    {
        return declare([BaseWidget], {
            //these two properties is defined in the BaseWidget
            baseClass: '',
            name: '',
            startup: function () {
                this.inherited(arguments);
                script.get({
                    url: "http://210.13.204.19:8083/smfxbServlets4typewwq/servlet/getData4type?type=RR",
                    jsonp: "jsoncallback", //由flickr指定
                    content: {format: "json"},
                    load: function(data){

                        //console.log(dojo.toJson(data, true));
                        var list = dojo.toJson(data, true);
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

                //===========================预警列表===============================
                //script.get({
                //    url: "http://210.13.204.19:8083/smfxbServlets4typewwq/servlet/getData4type?type=RR",
                //    jsonp: "jsoncallback", //由flickr指定
                //    content: {format: "json"},
                //    load: function(data){
                //
                //        //console.log(dojo.toJson(data, true));
                //        var list = dojo.toJson(data, true);
                //        //将数据放入到grid中去显示
                //        topic.publish('waterPositionData1',data);
                //
                //        return data;
                //
                //    },
                //    error: function(response){
                //        console.log(response);
                //        return response;
                //    }
                //}).then(function(data){
                //    //we're only interested in data.results, so strip it off and return it
                //    //console.log("skf  "+data.results);
                //    return data.results;
                //
                //});

            },

            onOpen: function () {
                // summary:
                //    see description in the BaseWidget
                topic.subscribe("waterPositionData", lang.hitch(this,this.addDataToGrid));
                //topic.subscribe("waterPositionData1", lang.hitch(this,this.addDataToGrid1));

            },
            addDataToGrid:function(list){
                console.log("go in addDataToGrid");
                console.log("in addDataToGrid list is :" + list);
                //var stringList = json.stringify(list);

                console.log(list);

                var data = {
                    identifier: "STCD",
                    items: list
                };

                var store = new  ItemFileReadStore({data: data});

                var layout = [[

                    {'name': '站点', 'field': 'STNM'},
                    {'name': '水位', 'field': 'RZ'},
                    {'name': '时间', 'field': 'TM'}
                ]];

                grid = new DataGrid({
                        id: 'grid',
                        store: store,
                        structure: layout,
                        rowSelector: '20px',
                        autoWidth: true,
                        rowsPerPage: 5
                    },
                    this.gridDiv);

                //grid.set("onCellClick", lang.hitch(this,this.cellClickGird));

                grid.startup();

            },
            //addDataToGrid1:function(list){
            //
            //
            //    console.log("go in addDataToGrid");
            //    console.log("in addDataToGrid list is :" + list);
            //    //var stringList = json.stringify(list);
            //
            //    console.log(list);
            //
            //    var data = {
            //        identifier: "STCD",
            //        items: list
            //    };
            //
            //    var store = new  ItemFileReadStore({data: data});
            //
            //    var layout = [[
            //
            //        {'name': '站点', 'field': 'STNM'},
            //        {'name': '水位', 'field': 'RZ'},
            //        {'name': '时间', 'field': 'TM'}
            //    ]];
            //
            //    grid = new DataGrid({
            //            id: 'grid',
            //            store: store,
            //            structure: layout,
            //            rowSelector: '20px',
            //            autoWidth: true,
            //            rowsPerPage: 5
            //        },
            //        this.gridDiv1);
            //
            //    grid.set("onCellClick", lang.hitch(this,this.cellClickGird1));
            //
            //    grid.startup();
            //
            //},




            onClose: function () {
                // summary:

            },

            onMinimize: function () {

            },

            onMaximize: function () {

            },

            resize: function () {

            },

            destroy: function () {
                this.bookmarkList.destroy();
                this.inherited(arguments);
            },

            displayBookmarks: function () {

            },
            _switchDeleteBtn: function () {

            },
            _createBookMarkNode: function (bookmark) {

            },

            _getKeysKey: function () {
                // summary:
                //    we use className plus 2D/3D as the local storage key

            },

            _getLocalCache: function () {

            },

            _createBookmark: function () {
                var data, b;
                b = {
                    name: this.bookmarkName.value,
                    extent: this.map.extent.toJson()
                };
                this.bookmarks.push(b);
                this._createBookMarkNode(b);
                this._saveAllToLocalCache();
                this.resize();
            },

            _onDeleteBtnClicked: function () {


            },
            _onBookmarkClick: function (bookmark) {
                // summary:


            },

        });
    });