
define([
        'dojo/_base/declare',
        'dojo/_base/html',
        'dojo/query',
        'jimu/BaseWidget',
        "dojo/dom-construct",
        "dojo/dom-style",
        "dojo/dom-attr",
        "dojo/dom-class",
        'dojo/_base/lang',
        "dojo/on",
        'dojo/topic',
        "dojo/_base/fx",
        'dojo/dnd/move',
        'jimu/dijit/CheckBox',
        "dijit/Tooltip"
    ],
    function(
        declare,
        html,
        query,
        BaseWidget,
        domConstruct,
        domStyle,
        domAttr,
        domClass,
        lang,
        on,
        topic,
        fx,
        Move,
        CheckBox,
        Tooltip
    ) {
        var clazz = declare([BaseWidget], {

            name: 'MapLegend',
            baseClass: 'jimu-widget-maplegend',
            normalHeight: 0,
            maplegendDiv:null,
            templateString:
            '<div class="jimu-widget-maplegend-main"  data-dojo-attach-point="boxNode" style="font-family: 微软雅黑">' +
                '<div style="width: 30px;height:100%;vertical-align: bottom;float: left">' +
                   '<img src="images/tuli_btn.png" style="margin-top: 180px;float:left;cursor:pointer;width: 30px;height:30px" data-dojo-attach-point="icon_img" data-dojo-attach-event="click:changeState"/>'+
                '</div>'+

                '<div style="width: 230px;height:100%;padding-bottom: 3px;float:left; box-shadow: 0 0 2px #9296a1;background-color: rgba(255, 255, 255, 0.75);" data-dojo-attach-point="tulicontainer">' +
                   ' 放置任意东西' +

                '</div>'+
            "</div>",

            startup: function() {
                this.inherited(arguments);

                this.initLayout();

                this.changeState();

            },


            panelWidth:300,//面板的宽度
            panelHeight:300,//面板的高度
            panelMiniHeight:30,
            panelLeft:0,
            panelRight:0,
            panelTop:0,
            panelBottom:0,
            initLayout:function(){

                if (this.position.width) {
                    this.panelWidth = this.position.width;
                }
                if (this.position.height) {
                    this.panelHeight = this.position.height;
                }
                if (this.position.left) {
                    this.panelLeft = this.position.left;
                }
                if (this.position.right) {
                    this.panelRight = this.position.right;
                }
                if (this.position.top) {
                    this.panelTop = this.position.top;
                }
                if (this.position.bottom) {
                    this.panelBottom = this.position.bottom;
                }

                domStyle.set(this.domNode, "width", this.panelWidth+"px");
                domStyle.set(this.domNode, "height", this.panelHeight+"px");
                domStyle.set(this.domNode, "top", this.panelTop);
                domStyle.set(this.domNode, "left", this.panelLeft);
                domStyle.set(this.domNode, "right",  this.panelRight);
                domStyle.set(this.domNode, "bottom",this.panelBottom);
                domStyle.set(this.domNode, "position", "absolute");

                domStyle.set(this.domNode, "height", this.panelHeight+"px");
                domStyle.set(this.domNode, "width", this.panelWidth+"px");

                new Tooltip({
                    connectId: this.tuli_node,
                    label:"图例面板控制"
                });
            },

            destroy: function() {
                this.inherited(arguments);
            },
            onOpen: function() {
            },
            onClose: function() {
            },
            isBig:true,
            changeState:function(){
                if(this.isBig){
                    fx.animateProperty(
                        {
                            node: this.tulicontainer,
                            properties: {
                                opacity: {start: 1, end: 0}
                            },
                            duration: 500
                        }).play();
                    html.setStyle(this.tulicontainer, 'display', 'none');

                    html.setStyle(this.domNode, 'width', '30px');
                    html.setStyle(this.domNode, 'height', '30px');
                    html.setStyle(this.icon_img, 'margin-top', '0px');

                    this.isBig = false;
                }else{
                    html.setStyle(this.tulicontainer, 'display', 'block');

                    html.setStyle(this.domNode, 'width', this.panelWidth+'px');
                    html.setStyle(this.domNode, 'height', this.panelHeight+'px');
                    html.setStyle(this.icon_img, 'margin-top', '210px');
                    fx.animateProperty(
                        {
                            node: this.tulicontainer,
                            properties: {
                                opacity: {start: 0, end: 1}
                            },
                            duration: 500
                        }).play();

                    this.isBig = true;
                }

            }
        });

        clazz.inPanel = false;
        clazz.hasUIFile = false;
        return clazz;
    });