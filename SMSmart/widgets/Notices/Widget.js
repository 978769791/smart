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
              utils

              ) {
        return declare([BaseWidget], {
            //these two properties is defined in the BaseWidget
            baseClass: '',
            name: '',
            startup: function () {
                this.inherited(arguments);

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