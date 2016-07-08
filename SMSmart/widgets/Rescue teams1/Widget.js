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
        'dojo/resources/LICENSE',
        'dijit/form/RadioButton',
        'dojo/dom-style',
        'dojo/dom'

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
              LICENSE,
              RadioButton,
              domStyle,
              dom

              ) {
        return declare([BaseWidget], {
            //these two properties is defined in the BaseWidget
            baseClass: '',
            name: '',
            startup: function () {
                this.inherited(arguments);
               var  myDialog = new Dialog({
                    title: "My Dialog",
                    content: "Test content.",
                    style: "width: 300px"
                });

                //$("#nav").mouseover(function () {
                //    layer.open({
                //        type: 1, //page层
                //        area: ['500px', '300px'],
                //        title: '雨情',
                //        shade: 0, //遮罩透明度
                //        moveType: 4, //拖拽风格，0是默认，1是传统拖动
                //        shift: 4, //0-6的动画形式，-1不开启
                //        content: '<div class="tan"><ul>' +
                //        '<li></li>' +
                //        '<li></li>' +
                //        '<li></li>' +
                //        '</ul></div>'
                //    });
                //});


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