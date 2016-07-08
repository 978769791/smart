
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

                this.bookmarks = lang.clone(this.config.bookmarks);

                this.displayBookmarks();
            },

            onClose: function () {
                // summary:
                //    see description in the BaseWidget
                this.bookmarks = [];
                this.currentIndex = -1;
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
                array.forEach(this.bookmarks, function (bookmark) {
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

            _onBookmarkClick: function (bookmark) {
                // summary:
                ////    set the map extent or camera, depends on it's 2D/3D map
                //array.some(this.bookmarks, function (b, i) {
                //    if (b.name === bookmark.name) {
                //        this.currentIndex = i;
                //        return true;
                //    }
                //}, this);
                //
                //var ext = bookmark.extent;
                //
                //var west = ext.xmin;
                //var south = ext.ymin;
                //var east = ext.xmax
                //var north = ext.ymax;
                //
                ////有动画效果的
                //setTimeout(lang.hitch(this,function(){
                //    this.map.camera.flyTo({
                //        destination : Cesium.Rectangle.fromDegrees(west, south, east, north)
                //    });
                //}),100);
                ////无动画的
                //setTimeout(lang.hitch(this, function () {
                //    this.map.camera.viewRectangle(Rectangle.fromDegrees(west, south, east, north));
                //}), 100);
if(bookmark.name=="卫星云图"){

    layer.open({
        type: 2,
        title: false,
        shadeClose: true,
        shade: false,
        maxmin: true, //开启最大化最小化按钮
        area: ['800px', '600px'],
        offset: ['230px', '400px'], //右下角弹出
        //offset: 'rb', //右下角弹出
        shift: 2,

        content: ['./widgets/Weather forecast/timeFocus/index.html', 'no']//iframe的url；no代表不显示滚动条

    });

}else if(bookmark.name=="雷达图"){

    layer.open({
        type: 2,
        title: false,
        shadeClose: true,
        shade: false,
        maxmin: true, //开启最大化最小化按钮
        area: ['800px', '600px'],
        offset: ['230px', '400px'], //右下角弹出
        //offset: 'rb', //右下角弹出
        shift: 2,

        content: ['./widgets/Weather forecast/time/index.html', 'no']//iframe的url；no代表不显示滚动条

    });

}if(bookmark.name=="台风路径"){
                    layer.open({
                        type: 2,
                        title: false,
                        shadeClose: true,
                        shade: false,
                        maxmin: true, //开启最大化最小化按钮
                        area: ['800px', '600px'],
                        offset: ['230px', '400px'], //右下角弹出
                        //offset: 'rb', //右下角弹出
                        shift: 2,

                        content: ['./widgets/Weather forecast/timetaifeng/index.html', 'no']//iframe的url；no代表不显示滚动条

                    });
                }

            }

        });
    });