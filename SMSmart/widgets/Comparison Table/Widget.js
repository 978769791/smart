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
        'dojox/charting/Chart',
        'dojox/charting/axis2d/Default',
        //'dojox/charting/plot2d/Lines'


        'dojox/charting/plot2d/StackedAreas', 'dojox/charting/themes/Wetland'
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
              utils,Chart,Default,StackedAreas,Wetland

              ) {
        return declare([BaseWidget], {
            //these two properties is defined in the BaseWidget
            baseClass: '',
            name: '',
            startup: function () {
                this.inherited(arguments);
                //添加echart表格
                var c = new Chart("simplechart",{
                      title: "福建三明市2015年(上)地下水资源",
                       titlePos: "top",
                     titleGap: 25,
                     titleFont: "normal normal normal 15pt Arial",
                        titleFontColor: "#25B693"
                    });
                c.addPlot("default", {type: StackedAreas, tension:3})
                    .addAxis("x", {fixLower: "major", fixUpper: "major"})
                    .addAxis("y", {vertical: true, fixLower: "major", fixUpper: "major", min: 0})
                    .setTheme(Wetland)
                    .addSeries("Series A", [1, 2, 0.5, 1.5, 1, 2.8, 0.4])
                    .addSeries("Series B", [2.6, 1.8, 2, 1, 1.4, 0.7, 2])
                    .addSeries("Series C", [6.3, 1.8, 3, 0.5, 4.4, 2.7, 2])
                    .render();
                var d = new Chart("simplechar",{
                    title: "福建三明市2015年(下)地下水资源",
                    titlePos: "top",
                    titleGap: 25,
                    titleFont: "normal normal normal 15pt Arial",
                    titleFontColor: "#25B693"
                });
                d.addPlot("default", {type: StackedAreas, tension:3})
                    .addAxis("x", {fixLower: "major", fixUpper: "major"})
                    .addAxis("y", {vertical: true, fixLower: "major", fixUpper: "major", min: 0})
                    .setTheme(Wetland)
                    .addSeries("Series A", [1, 2, 0.6, 1.0, 1, 2.3, 0.9])
                    .addSeries("Series B", [2.0, 1.0, 1.2, 1, 1.4, 0.7, 1.5])
                    .addSeries("Series C", [3.3, 1.8, 3, 0.5, 4.4, 2.7, 2])
                    .render();
            },

            onOpen: function () {


            },

            onClose: function () {
                // summary:



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