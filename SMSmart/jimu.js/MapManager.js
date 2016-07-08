///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define(['dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/html',
    'dojo/topic',
    'dojo/on',
    'dojo/aspect',
    'dojo/keys',
    'require',
    './utils',
    './dijit/LoadingShelter'
], function (declare,
             lang,
             array,
             html,
             topic,
             on,
             aspect,
             keys,
             require,
             jimuUtils,
             LoadingShelter

) {
    /* global jimuConfig */
    var instance = null,
        clazz = declare(null, {
            appConfig: null,
            mapDivId: '',
            map: null,
            previousInfoWindow: null,
            mobileInfoWindow: null,
            isMobileInfoWindow: false,

            constructor: function (/*Object*/ appConfig, mapDivId) {
                this.appConfig = appConfig;
                this.mapDivId = mapDivId;
                this.id = mapDivId;
                topic.subscribe("appConfigChanged", lang.hitch(this, this.onAppConfigChanged));
                topic.subscribe("changeMapPosition", lang.hitch(this, this.onChangeMapPosition));

                on(window, 'resize', lang.hitch(this, this.onWindowResize));

                topic.subscribe("centerAtMap", lang.hitch(this, this.centerAtMap));
            },
            centerAtMap: function (lgtd,lttd) {
                this.map.scene.camera.flyTo({
                    destination : Cesium.Cartesian3.fromDegrees(lgtd, lttd, 15000.0)
                });
            },
            showMap: function () {
                // console.timeEnd('before map');
                this._showMap(this.appConfig);
            },

            _showMap: function (appConfig) {
                // console.timeEnd('before map');
                console.time('Load Map');
                this.loading = new LoadingShelter();
                this.loading.placeAt(this.mapDivId);
                this.loading.startup();
                //for now, we can't create both 2d and 3d map
                var mode = Cesium.SceneMode.SCENE3D;//默认是3D，
                if (appConfig.map['3D']) {
                    mode = Cesium.SceneMode.SCENE3D;
                } else if(appConfig.map['2D']) {
                    mode = Cesium.SceneMode.SCENE2D;
                }else{
                    mode = Cesium.SceneMode.COLUMBUS_VIEW;
                }

                this._createMap(mode,appConfig);
            },
            _createMap: function (mode,appConfig) {

                var layer;
                this._visitConfigMapLayers(appConfig, lang.hitch(this, function(layerConfig) {

                    var layMap = {
                        'tiled': 'dojo/_base/lang',
                        //'googlemap': 'jimu/Naruto/Layers/GoogleImageryProvider',
                        'googlemap': 'dojo/_base/lang',
                        '3dmodle': 'dojo/_base/lang'
                    };

                    //以前的这个是
                    require([layMap[layerConfig.type]], lang.hitch(this, function(layerClass) {

                        var layer =new Cesium.ArcGisMapServerImageryProvider({
                                url : '//server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer'
                        });
                        this.map = new Cesium.Viewer(this.mapDivId,{
                            imageryProvider:layer,
                            baseLayerPicker: false,
                            scene3DOnly: false,
                            timeline: false,
                            geocoder: true,
                            navigationHelpButton: false,
                            animation:false,
                            selectionIndicator:false

                        });

                        var layers = this.map.imageryLayers;

                        this._processMapOptions(appConfig.map.mapOptions);
                        this._publishMapEvent(this.map);
                        //train
                        var globe = this.map.scene.globe;

                        var terrainProvider = new Cesium.CesiumTerrainProvider({
                            url: '//assets.agi.com/stk-terrain/world',
                            requestWaterMask: true,
                            requestVertexNormals: true
                        });

                        this.map.terrainProvider = terrainProvider;
                        // 初始化图层

                        //添加 界面事件监听

                    }));

                }));

            },

            onWindowResize: function () {
                if (this.map && this.map.resize) {
                  this.map.resize();
                }
            },

            onChangeMapPosition: function (position) {
                var mapStyle = html.getComputedStyle(html.byId(this.map._container.id));
                var oldPosStyle = {
                    top: mapStyle.top,
                    bottom: mapStyle.bottom
                };
                if (window.isRTL) {
                    oldPosStyle.left = mapStyle.right;
                    oldPosStyle.right = mapStyle.left;
                } else {
                    oldPosStyle.left = mapStyle.left;
                    oldPosStyle.right = mapStyle.right;
                }
                var pos = lang.mixin(oldPosStyle, position);
                var posStyle = jimuUtils.getPositionStyle(pos);
                html.setStyle(this.mapDivId, posStyle);
                if (this.map && this.map.resize) {
                    this.map.resize();
                }
            },

            _visitConfigMapLayers: function (appConfig, cb) {
                array.forEach(appConfig.map.basemaps, function (layerConfig, i) {
                    layerConfig.isOperationalLayer = false;
                    cb(layerConfig, i);
                }, this);

                array.forEach(appConfig.map.operationallayers, function (layerConfig, i) {
                    layerConfig.isOperationalLayer = true;
                    cb(layerConfig, i);
                }, this);
            },

            _publishMapEvent: function (map) {
                //add this property for debug purpose
                window._viewerMap = map;
                if (this.loading) {
                    this.loading.destroy();
                }

                console.timeEnd('Load Map');
                if (this.map) {
                    this.map = map;
                    console.log('map changed.');
                    topic.publish('mapChanged', this.map);
                } else {
                    this.map = map;
                    topic.publish('mapLoaded', this.map);
                }
                //this.resetInfoWindow();
            },

            _processMapOptions: function (mapOptions) {
                if (!mapOptions) {
                    return;
                }
                var ret = lang.clone(mapOptions);
                if (ret.extent) {
                    var west = ret.extent.xmin;
                    var south = ret.extent.ymin;
                    var east = ret.extent.xmax;
                    var north = ret.extent.ymax;

                    //有bug，如果不延迟一下平面模式报错

                    //有动画效果的
                   setTimeout(lang.hitch(this,function(){
                        this.map.camera.flyTo({
                            destination : Cesium.Rectangle.fromDegrees(west, south, east, north)
                        });
                    }),100);
                   /* //无动画的
                    setTimeout(lang.hitch(this,function(){
                        this.map.camera.viewRectangle(Cesium.Rectangle.fromDegrees(west, south, east, north));
                    }),100);*/

                }
                if (ret.infoWindow) {
                    //ret.infoWindow = new InfoWindow(ret.infoWindow, html.create('div', {}, this.mapDivId));
                }
                return ret;
            },

            createLayer: function (layerConfig) {
                var layMap = {
                    'tiled': 'Cesium/Scene/ArcGisMapServerImageryProvider',
                    'googlemap': 'Cesium/Naruto/Layers/GoogleImageryProvider',
                    '3dmodle': 'esri3d/layers/SceneLayer'
                };
                //以前的这个是
                require([layMap[layerConfig.type]], lang.hitch(this, function(layerClass) {
                    var layer = new layerClass({url:layerConfig.url});
                    return layer;
                }));

            },

            onAppConfigChanged: function (appConfig, reason, mapConfig, otherOptions) {
                if (reason !== 'mapChange') {
                    this.appConfig = appConfig;
                    return;
                }
                if (otherOptions && otherOptions.reCreateMap === false) {
                    this.appConfig = appConfig;
                    return;
                }
                if (this.map) {
                    topic.publish('beforeMapDestory', this.map);
                    this.map.destroy();
                }
                this._showMap(appConfig);
                this.appConfig = appConfig;

            }

        });

    clazz.getInstance = function (appConfig, mapDivId) {
        if (instance === null) {
            instance = new clazz(appConfig, mapDivId);
        }
        return instance;
    };

    return clazz;
});