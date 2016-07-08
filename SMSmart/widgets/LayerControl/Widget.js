
define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/_base/array',
        'dojo/_base/html',
        'jimu/BaseWidget',
        'dojo/on',
        'dojo/aspect',
        'dojo/string',
        './ImageNode',
        'jimu/dijit/TileLayoutContainer',
        'jimu/utils',
        'libs/storejs/store',
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
              ImageNode,
              TileLayoutContainer,
              utils,
              store,
              layer) {
        return declare([BaseWidget], {
            //these two properties is defined in the BaseWidget
            baseClass: 'jimu-widget-bookmark',
            name: 'Bookmark',

            //bookmarks: Object[]
            //    all of the bookmarks, the format is the same as the configbak.json
            bookmarks: [],

            //currentIndex: int
            //    the current selected bookmark index
            currentIndex: -1,

            //use this flag to control delete button
            _canDelete: false,

            //use this flag to control play button
            //play function work only in 3D map
            _canPlay: false,

            //the status can be: stop, playing, none
            _playStatus: 'none',
            _smjcLayer:'' ,
            _imageryLayers:[],
            _layerIsShow:true,
            videoBasicPositions:[],
            videoNames:[],
            positoins:[],

            startup: function () {
                this.inherited(arguments);

                this.bookmarkList = new TileLayoutContainer({
                    strategy: 'fixCols',
                    itemSize: {height: ((110 / 130) * 100) + '%'},
                    maxCols: 2
                }, this.bookmarkListNode);

                this.bookmarkList.startup();

            },
            onOpen: function () {

                this.ImageryLayers = lang.clone(this.config.ImageryLayers);

                this.displayBookmarks();
            },

            onClose: function () {
                // summary:
                //    see description in the BaseWidget
                var romovedLayer = this._imageryLayers.get(1);
                this._imageryLayers.remove(romovedLayer,true);
                this.ImageryLayers = [];
                this.currentIndex = -1;
                //this._imageryLayers.removeAll();

            },

            onMinimize: function () {
                this.resize();
            },

            onMaximize: function () {
                this.resize();
            },

            resize: function () {
                var box = html.getMarginBox(this.domNode);
                var listHeight = box.h - 37 - 21 - 61;
                html.setStyle(this.bookmarkListNode, 'height', listHeight + 'px');
                if (this.bookmarkList) {
                    this.bookmarkList.resize();
                }
            },

            destroy: function () {
                this.bookmarkList.destroy();
                this.inherited(arguments);
            },

            displayBookmarks: function () {
                var items = [];
                this.bookmarkList.empty();
                array.forEach(this.ImageryLayers, function (bookmark) {
                    items.push(this._createBookMarkNode(bookmark));
                }, this);

                this.bookmarkList.addItems(items);

                this.resize();
            },


            _switchDeleteBtn: function () {

            },

            _createBookMarkNode: function (bookmark) {
                var thumbnail, node;

                if (bookmark.thumbnail) {
                    thumbnail = utils.processUrlInWidgetConfig(bookmark.thumbnail, this.folderUrl);
                } else {
                    thumbnail = this.folderUrl + 'images/thumbnail_default.png';
                }

                node = new ImageNode({
                    img: thumbnail,
                    label: bookmark.name
                });
                on(node.domNode, 'click', lang.hitch(this, lang.partial(this._onBookmarkClick, bookmark)));

                return node;
            },

            _getKeysKey: function () {
                // summary:
                //    we use className plus 2D/3D as the local storage key
                if (this.appConfig.map['3D']) {
                    return this.name + '.3D';
                } else {
                    return this.name + '.2D';
                }
            },

            _saveAllToLocalCache: function () {

            },

            _getLocalCache: function () {

            },


            _onAddBtnClicked: function () {

            },

            _createBookmark: function () {
                var data, b;

                b = {
                    name: this.bookmarkName.value,
                    extent: this.map.extent.toJson()
                };


                this.bookmarks.push(b);
                this._createBookMarkNode(b);

                this.resize();
            },

            _onDeleteBtnClicked: function () {


            },

            _onBookmarkClick: function (layer) {

                array.some(this.ImageryLayers, function (b, i) {
                    if (b.name === layer.name) {
                        this.currentIndex = i;
                        return true;
                    }
                }, this);

                /*var url = layer.url;

                if(this._layerIsShow&&this._smjcLayer!=""){

                    var romovedLayer = this._imageryLayers.get(1);
                    this._imageryLayers.remove(romovedLayer,true);
                    this._layerIsShow = false ;

                }else{
                    this._imageryLayers = this.map.imageryLayers;
                    this._smjcLayer = new Cesium.ArcGisMapServerImageryProvider({
                        id:'qixiang',
                        url : 'http://101.201.113.25:6080/arcgis/rest/services/SMFB_NEW/SMFB_NEW/MapServer',
                        maximumLevel : 18,
                        credit : 'Black Marble imagery courtesy NASA Earth Observatory'
                    });
                    this._imageryLayers.addImageryProvider(this._smjcLayer);

                    this._smjcLayer.alpha = 0.5; // 0.0 is transparent.  1.0 is opaque.
                    this._smjcLayer.brightness = 2.0; // > 1.0 increases brightness.  < 1.0 decreases.
                    this._layerIsShow = true ;
                }*/

                //添加视频监控点图层；
                this.addVideo();







            },
            addVideo :function(){

                console.log("add video");

            //

                var ShipinJson=    thumbnail = this.folderUrl + 'geojson/Shipinjichudian.geojson';

                var promise = Cesium.GeoJsonDataSource.load(ShipinJson);

                this.map.scene.globe.depthTestAgainstTerrain = true;

                promise.then(function(dataSource) {

                    var entities = dataSource.entities.values;

                    for (var i = 0; i < entities.length; i++) {

                        var entity = entities[i];
                        var shipinName = entity.properties.SPZD_Name;

                        var x = entity.properties.PointX;
                        var y = entity.properties.PointY;

                        //获取 该点 的 height
                        var position = new Cesium.Cartographic(Cesium.Math.toRadians(x),Cesium.Math.toRadians(y));

                        this.videoBasicPositions.push(position);
                        this.videoNames.push(shipinName);

                    }

                    //Cesium.sampleTerrain(viewer.terrainProvider,9,videoBasicPositions);
                    Cesium.when(Cesium.sampleTerrain(this.map.terrainProvider, 10, this.videoBasicPositions), this.sampleTerrainSuccess);

                    //console.log("videoBasicPositions"+this.videoBasicPositions);

                }).otherwise(function(error){
                    console.log(error);
                });

            },

            sampleTerrainSuccess:function () {

                console.log("sampleTerrainSuccess");

                var ellipsoid = Cesium.Ellipsoid.WGS84;

                this.map.scene.globe.depthTestAgainstTerrain = true;

                for (var i = 0; i < this.videoBasicPositions.length; ++i) {

                    var position = this.videoBasicPositions[i];

                    console.log(position.height);
                    // position.height =  position.height+10 ;

                    console.log(position.height);

                    this.map.entities.add({
                        name : this.videoNames[i],
                        position : ellipsoid.cartographicToCartesian(position),
                        ellipsoid : {
                            radii : new Cesium.Cartesian3(100,100,100),
                        },
                        label : {
                            text : this.videoNames[i],
                            font:55,
                            horizontalOrigin:Cesium.HorizontalOrigin.LEFT,
                            verticalOrigin:Cesium.VerticalOrigin.TOP,
                            scale : 1,
                            pixelOffset : new Cesium.Cartesian2(0, -34),
                            fillColor : Cesium.Color.RED,
                        }
                    });
                }
                this.map.entities.resumeEvents();
        }


        });
    });