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
        './ImageNode',
        'jimu/dijit/TileLayoutContainer',
        'jimu/utils',
        'libs/storejs/store'
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
              Rectangle) {
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

                this.own(on(this.bookmarkName, 'keydown', lang.hitch(this, function (evt) {
                    var keyNum = evt.keyCode !== undefined ? evt.keyCode : evt.which;
                    if (keyNum === 13) {
                        this._onAddBtnClicked();
                    }
                })));
            },

            onOpen: function () {
                // summary:
                //    see description in the BaseWidget
                // description:
                //    this function will check local cache first. If there is local cache,
                //    use the local cache, or use the bookmarks configured in the configbak.json
                var localBks = this._getLocalCache();
                if (localBks.length > 0) {
                    this.bookmarks = localBks;
                } else {
                    this.bookmarks = lang.clone(this.config.bookmarks);
                }

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
                this._switchDeleteBtn();
                this.resize();
            },


            _switchDeleteBtn: function () {
                if (this.currentIndex > -1 && !this.bookmarks[this.currentIndex].isInWebmap) {
                    html.removeClass(this.btnDelete, 'jimu-state-disabled');
                    this._canDelete = true;
                } else {
                    html.addClass(this.btnDelete, 'jimu-state-disabled');
                    this._canDelete = false;
                }
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
                // summary:
                //    if user add/delete a bookmark, we will save all of the bookmarks into the local storage.

                var keys = [];
                //clear
                array.forEach(store.get(this._getKeysKey()), function (bName) {
                    store.remove(bName);
                }, this);

                array.forEach(this.bookmarks, function (bookmark) {
                    if (bookmark.isInWebmap) {
                        return;
                    }
                    var key = this._getKeysKey() + '.' + bookmark.name;
                    keys.push(key);
                    store.set(key, bookmark);
                }, this);

                store.set(this._getKeysKey(), keys);
            },

            _getLocalCache: function () {
                var ret = [];
                if (!store.get(this._getKeysKey())) {
                    return ret;
                }
                array.forEach(store.get(this._getKeysKey()), function (bName) {
                    if (bName.startWith(this._getKeysKey())) {
                        ret.push(store.get(bName));
                    }
                }, this);
                return ret;
            },


            _onAddBtnClicked: function () {
                if (string.trim(this.bookmarkName.value).length === 0) {
                    html.setStyle(this.errorNode, {visibility: 'visible'});
                    this.errorNode.innerHTML = this.nls.errorNameNull;
                    return;
                }
                if (array.some(this.bookmarks, function (b) {
                        if (b.name === this.bookmarkName.value) {
                            return true;
                        }
                    }, this)) {
                    html.setStyle(this.errorNode, {visibility: 'visible'});
                    this.errorNode.innerHTML = this.nls.errorNameExist;
                    return;
                }

                this._createBookmark();

                html.setStyle(this.errorNode, {visibility: 'hidden'});
                this.errorNode.innerHTML = '&nbsp;';
                this.bookmarkName.value = '';

                this.displayBookmarks();
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

                if (!this._canDelete || this.currentIndex === -1) {
                    return;
                }

                array.some(this.bookmarks, function (b, i) {
                    if (i === this.currentIndex) {
                        this.bookmarks.splice(i, 1);
                        return true;
                    }
                }, this);

                this._saveAllToLocalCache();

                this.resize();

                this.currentIndex = -1;
                this.displayBookmarks();
            },

            _onBookmarkClick: function (bookmark) {
                // summary:
                //    set the map extent or camera, depends on it's 2D/3D map
                array.some(this.bookmarks, function (b, i) {
                    if (b.name === bookmark.name) {
                        this.currentIndex = i;
                        return true;
                    }
                }, this);

                this._switchDeleteBtn();

                var ext = bookmark.extent;

                var west = ext.xmin;
                var south = ext.ymin;
                var east = ext.xmax
                var north = ext.ymax;

                //有动画效果的
                setTimeout(lang.hitch(this,function(){
                    this.map.camera.flyTo({
                        destination : Cesium.Rectangle.fromDegrees(west, south, east, north)
                    });
                }),100);
                ////无动画的
                //setTimeout(lang.hitch(this, function () {
                //    this.map.camera.viewRectangle(Rectangle.fromDegrees(west, south, east, north));
                //}), 100);
            }

        });
    });