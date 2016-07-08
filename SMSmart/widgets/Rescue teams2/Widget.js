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
        'dijit/Dialog',
        'dojo/parser',
        'dijit/form/Button',
        'dijit/_TimePicker',
        'dijit/MenuBar',
        'dijit/PopupMenuBarItem',
        'dijit/Menu',
        'dijit/MenuItem',
        'dijit/DropDownMenu',
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
              Dialog,
              parser,
              Button,
              _TimePicker,
              MenuBar,
              PopupMenuBarItem,
              Menu,
              MenuItem,
              DropDownMenu,
              layer) {
        return declare([BaseWidget], {
            //these two properties is defined in the BaseWidget
            baseClass: '',
            name: '',
            startup: function () {
                this.inherited(arguments);

                //=================时间列表=========================
                new _TimePicker({
                    name: "progval", value: new Date(),
                    constraints: {
                        timePattern: 'HH:mm:ss',
                        clickableIncrement: 'T00:15:00',
                        visibleIncrement: 'T00:15:00',
                        visibleRange: 'T01:00:00',
                        style: "height: 200px; width: 200px;"
                    }
                }, "progval");


                //dojo本身弹出框
                myDialog = new Dialog({

                    title: "<div id='ai' style='height: 300px;width: 600px;margin-top: -33px'>" +
                    "<ul style='padding: 0px'>" +
                    "<li>实时雨情" +
                    "<div class='children'>" +
                    "<ul style='padding: 0px'>" +
                    "<li>haha" +
                    "</li>" +
                    "</ul>" +
                    "</div>" +
                    "</li>" +
                    "<li>实时水情" +
                    "<div class='children'>" +
                    "<ul style='padding: 0px'>" +
                    "<li>haha" +
                    "</li>" +
                    "<li>haha" +
                    "</li>" +
                    "<li>haha" +
                    "</li>" +
                    "<li>haha" +
                    "</li>" +
                    "<li>haha" +
                    "</li>" +
                    "</ul>" +
                    "</div>" +
                    "</li>" +
                    "<li>径流预报" +
                    "<div class='children'>" +
                    "<ul style='padding: 0px'>" +
                    "<li>haha" +
                    "</li>" +
                    "</ul>" +
                    "</div>" +
                    "</li>" +
                    "<li>历史数据" +
                    "<div class='children'>" +
                    "<ul style='padding: 0px'>" +
                    "<li>haha" +
                    "</li>" +
                    "<li>haha" +
                    "</li>" +
                    "</ul>" +
                    "</div>" +
                    "</li>" +
                    "</ul>" +
                    "</div>",
                    style: ""
                });


            },

            onOpen: function () {
                // summary:

            },
            onClose: function () {
                // summary:

            },
            onMinimize: function () {

            },
            onMaximize: function () {

            },
            destroy: function () {
                this.bookmarkList.destroy();
                this.inherited(arguments);
            },
            _onBookmarkClick: function (bookmark) {
                layer.closeAll();
                layer.open({
                    type: 2, //page层
                    area: ['600px', '450px'],
                    title: '视频1',
                    shade: false,
                    //shade: 0.6, //遮罩透明度
                    moveType: 1, //拖拽风格，0是默认，1是传统拖动
                    shift: 2, //0-6的动画形式，-1不开启
                    content: ['./widgets/Rescue teams2/html.html', 'no']
                });
            },
            _onBookmarkClicks: function (bookmark) {
                layer.closeAll();
                layer.open({
                    type: 2, //page层
                    area: ['600px', '450px'],
                    title: '视频2',
                    shade: false,
                    //shade: 0.6, //遮罩透明度
                    moveType: 1, //拖拽风格，0是默认，1是传统拖动
                    shift: 2, //0-6的动画形式，-1不开启
                    content: ['./widgets/Rescue teams2/html2.html', 'no']
                });
            },
            _onBookmarkClicksv: function (bookmark) {
                layer.closeAll();
                layer.open({
                    type: 2, //page层
                    area: ['600px', '450px'],
                    title: '视频3',
                    shade: false,
                    //shade: 0.6, //遮罩透明度
                    moveType: 1, //拖拽风格，0是默认，1是传统拖动
                    shift: 2, //0-6的动画形式，-1不开启
                    content: ['./widgets/Rescue teams2/html3.html', 'no']
                });
            },
            _onBookmarkClicksm: function (bookmark) {
                layer.open({
                    type: 2, //page层
                    area: ['600px', '450px'],
                    title: '视频4',
                    shade: false,
                    //shade: 0.6, //遮罩透明度
                    moveType: 1, //拖拽风格，0是默认，1是传统拖动
                    shift: 2, //0-6的动画形式，-1不开启
                    content: ['./widgets/Rescue teams2/html4.html', 'no']
                })
            }
        });
    });