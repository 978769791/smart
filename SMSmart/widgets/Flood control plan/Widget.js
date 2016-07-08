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
        './scroll/scroll'

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
              scroll


              ) {
        return declare([BaseWidget], {
            //these two properties is defined in the BaseWidget
            baseClass: '',
            name: '',
            startup: function () {
                this.inherited(arguments);

                $(function(){
                    $('.myscroll').myScroll({
                        speed: 40, //数值越大，速度越慢
                        rowHeight: 30//li的高度
                    });
                });

                //应急预案信息    微博   微信点击事件
                $(".click li").click(function () {
                    alert(1111)
                })



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
            }




        });
    });