

define([
        'dojo/_base/declare',
        'dojo/_base/html',
        'dojo/query',
        'dijit/_WidgetsInTemplateMixin',
        'jimu/BaseWidget',
        'jimu/PoolControllerMixin',
        "dijit/layout/ContentPane",
        'jimu/utils',
        "dojo/dom-construct",
        "dojo/dom-style",
        "dojo/dom-attr",
        "dojo/dom-class",
        "dojo/Deferred",
        "dojo/promise/all",
        'dojo/_base/lang',
        "dojo/on"
    ],
    function (declare,
              html,
              query,
              _WidgetsInTemplateMixin,
              BaseWidget,
              PoolControllerMixin,
              ContentPane,
              utils,
              domConstruct,
              domStyle,
              domAttr,
              domClass,
              Deferred,
              all,
              lang,
              on
    ) {
        var clazz = declare([BaseWidget, PoolControllerMixin], {
            /* global apiUrl */
            name: 'mapswitch',
            baseClass: 'jimu-widget-mapswitch',
            normalHeight: 0,
            bottomPosition: 0,
            facepanelDiv: null,
            openHeight: 28,
            templateString: '<span data-dojo-attach-point="boxNode">' +
            '<span title="" style="top: 2px; cursor: pointer; width: 37px; height: 39px; z-index: 99; position: absolute; font-size: 12px; border: 1px solid rgb(128, 128, 128); visibility: visible; display: block; background-color: rgb(255, 255, 255);">' +
            '<img data-dojo-attach-point="imgNode" src="images/basemaps/arcgis.png" style="width: 31px; height: 33px; position: absolute; margin: 2px; border: 1px solid rgb(128, 128, 128);">' +
            '<span style="position: absolute; top: 20px; width: 35px; height: 16px; opacity: 0.5; background-color: rgb(128, 128, 128);"></span>' +
            '<span data-dojo-attach-point="labelNode"  style="position: absolute; top: 20px; width: 31px; color: white; text-align: center; line-height: 12px; ">地图</span>' +
            '</img>' +
            '</span>' +
            "</span>",

            startup: function () {
                this.inherited(arguments);

                this.initLayout();
                this.createDiv();

                this.own(on(this.boxNode, 'click', lang.hitch(this, this.changeMap)));

            },
            currentMap: null,
            baseMaps: [],
            otherMaps: [],
            createDiv: function () {

                this.baseMaps = this.appConfig.map.basemaps;
                for (var i = 0; i < this.baseMaps.length; i++) {
                    if (this.baseMaps[i].visible) {
                        this.imgNode.src = this.baseMaps[i].icon;
                        this.labelNode.innerHTML = this.baseMaps[i].label;
                        this.currentMap = this.baseMaps[i];
                    } else {
                        this.otherMaps.push(this.baseMaps[i]);
                    }
                }
            },
            changeMap: function () {
                if (this.otherMaps.length > 0) {
                    this.imgNode.src = this.otherMaps[0].icon;
                    this.labelNode.innerHTML = this.otherMaps[0].label;

                    var newMap = this.otherMaps.splice(0, 1);
                    this.currentMap.visible = false;
                    this.otherMaps.push(this.currentMap);
                    this.currentMap = newMap[0];
                    this.currentMap.visible = true;

                    this.changeTrueMap(this.currentMap);
                }

            },
            changeTrueMap: function (item) {
                console.log(item);
            },

            currentHeight: 30,

            panelWidth: 300,//面板的宽度
            panelHeight: 300,//面板的高度
            panelMiniHeight: 30,
            panelLeft: 0,
            panelTop: 0,
            panelBottom: 0,
            panelRight: 0,

            initLayout: function () {

                if (this.position.width) {
                    this.panelWidth = this.position.width;
                }
                if (this.position.height) {
                    this.panelHeight = this.position.height;
                }
                if (this.position.left) {
                    this.panelLeft = this.position.left;
                }
                if (this.position.top) {
                    this.panelTop = this.position.top;
                }
                if (this.position.bottom) {
                    this.panelBottom = this.position.bottom
                }
                if (this.position.right) {
                    this.panelRight = this.position.right;
                }

                domStyle.set(this.domNode, "width", this.panelWidth + "px");
                domStyle.set(this.domNode, "height", this.panelHeight + "px");
                domStyle.set(this.domNode, "top", this.panelTop + "px");
                //domStyle.set(this.domNode, "left", this.panelLeft + "px");
                //domStyle.set(this.domNode, "top", "auto");
                domStyle.set(this.domNode, "left", "auto");
                domStyle.set(this.domNode, "right", this.panelRight + "px");
                domStyle.set(this.domNode, "bottom", "auto");
                domStyle.set(this.domNode, "position", "absolute");
            }
        });

        clazz.inPanel = false;
        clazz.hasUIFile = false;
        return clazz;
    });