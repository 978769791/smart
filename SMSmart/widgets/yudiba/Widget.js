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
              layer

              ) {
        return declare([BaseWidget], {
            //these two properties is defined in the BaseWidget
            baseClass: '',
            name: '',
            startup: function () {
                this.inherited(arguments);

                $(".video li").on('click', function () {
                    layer.closeAll();
                    layer.open({
                        type: 2, //page层
                        area: ['600px', '450px'],
                        title: '视频',
                        shade: false,
                        //shade: 0.6, //遮罩透明度
                        moveType: 1, //拖拽风格，0是默认，1是传统拖动
                        shift: 2, //0-6的动画形式，-1不开启
                        content: ['./widgets/yudiba/html4.html', 'no']
                    });
                    //alert(123)
                    //var id=$(this).attr("id");
                    //$.ajax({
                    //    type:"post",
                    //    url:"http://192.168.1.120:8080/jeefw/sys/videoMonitorImages/getCurrentImages",
                    //    data:{
                    //        id:id
                    //    },
                    //    success: function (data) {
                    //
                    //    }
                    //
                    //})
                });

                $("Fydb").click(function () {
                    $(".video").css("style","display:block")
                })

            },


            _onBookmarkClick: function (bookmark) {


            },




            onOpen: function () {
                // summary:
                //    see description in the BaseWidget

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
                this.bookmarkList.destroy();
                this.inherited(arguments);
            },



        });
    });