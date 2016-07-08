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

define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/html',
    'dojo/topic',
    'dojo/aspect',
    'dojo/query',
    'dojo/on',
    'dojo/mouse',
    'dojo/_base/fx',
    'dojo/fx',
    'dojo/NodeList-manipulate',
    'dojo/NodeList-fx',
    'dijit/layout/_LayoutWidget',
    'jimu/BaseWidget',
    'jimu/PoolControllerMixin',
    'jimu/utils',
      "dojo/dom-construct",
      "dojo/dom-style"
  ],
  function(declare, lang, array, html, topic, aspect, query, on, mouse, baseFx, fx,
    nlm, nlfx, _LayoutWidget, BaseWidget, PoolControllerMixin, utils,domConstruct,domStyle) {

    var clazz = declare([BaseWidget, PoolControllerMixin], {

      //baseClass: 'jimu-widget-sidebar-controller jimu-main-bgcolor',
      baseClass: 'jimu-widget-sidebar-controller',

      maxWidth: 335,
      minWidth: 30,
      animTime: 200,

      stateNode: null,
      currentTab: null, // doesn't reference to more tab
      moreTab: false,
      moreTabOpened: false,
      currentOtherGroup: null,
      lastSelectedIndex: -1,

      firstLoad:true,
      tabs:null,
      constructor: function() {
        this.tabs = [];
      },

      startup: function() {
        this.inherited(arguments);
        //this.createTabs();
        //用这个是为了更改widget的状态
        this.widgetManager.minimizeWidget(this);
        //this.widgetManager.maximizeWidget(this);

        this.initEvents();

        this.getKeyWater();

        //

          setTimeout(lang.hitch(this,function(){
            var widget =  {
              "name": "About",
              "label": "书签",
              "version": "1.1",
              "uri": "widgets/Bookmark/Widget",
              "id": "widgets/Bookmark/Widget",
              "panel":{
                "uri": "themes/TabTheme2/panels/TabPanel/Panel"
              }
            };
            topic.publish("openSelectTab",widget);
          }),3000);

       /* setTimeout(lang.hitch(this,function(){
          var widget =  {
            "name": "About",
            "label": "关于",
            "version": "1.1",
            "uri": "widgets/About/Widget",
            "id": "widgets/About/Widget",
            "panel":{
              "uri": "themes/TabTheme2/panels/TabPanel/Panel"
            }
          };
          topic.publish("openSelectTab",widget);
        }),4000);*/




      },
      getKeyWater:function(){
        var allIconConfigs = this.getAllConfigs();
        for (var i = 0; i < allIconConfigs.length; i++) {
          var widget = allIconConfigs[i];
          if(widget.key&&widget.key =="KeyWater"){
            this.openSelectTab(widget);
            break;
          }
        }

      },
      //初始化一些事件
      initEvents:function(){
        topic.subscribe("openSelectTab", lang.hitch(this, this.openSelectTab));

      },

      widgets:[],
      openSelectTab:function (widget){

        //判断是否已经存在了
        var isHas = false;
        for(var k =0;k<this.widgets.length;k++){
          if(this.widgets[k].id==widget.id){
            isHas = true;
            break;
          }
        }
        if(!isHas){
          //如果不存在那么就添加上
          this.widgets.push(widget);
        }

        var index =null;
        for(var i=0;i<this.tabs.length;i++){
          if(this.tabs[i].config.id==widget.id)
          {
            index = i;
             break;
          }
        }
        if(index==null){

         var tabx = this.createTab(widget);

          for(var i=0;i<this.tabs.length;i++){
            if(this.tabs[i].config.id==widget.id)
            {
              index = i;
              break;
            }
          }
        }

        this.selectTab(index);

        if(this.windowState === 'minimized'){
          this.widgetManager.maximizeWidget(this);
        }
        domStyle.set(this.resizerNode, "display",  "block");
      },

      getOpenedIds: function() {
        this.inherited(arguments);

        var ids = [];
        if (this.currentTab && this.currentTab.config && this.currentTab.config.id) {
          ids.push(this.currentTab.config.id);
        } else if (this.currentOtherGroup && this.currentOtherGroup.id) {
          ids.push(this.currentOtherGroup.id);
        }

        return ids;
      },

      setOpenedIds: function(ids) {
        this._openLastTab(ids);
      },

      onMinimize: function() {
        this._resizeToMin();
      },

      onMaximize: function() {
        this._resizeToMax();
      },

      resize: function() {
        array.forEach(this.tabs, function(tab) {
          if (!tab.selected) {
            return;
          }
          if (tab.panel) {
            tab.panel.resize();
          }
        }, this);
      },

      onPositionChange: function() {
        this.widgetManager.minimizeWidget(this);
      },

      createTabs: function() {
        var allIconConfigs = this.getAllConfigs(),
          iconConfigs = [];

        var spliceNum = 3;//默认显示个数，这里进行控制
        if (allIconConfigs.length <= spliceNum) {
          iconConfigs = allIconConfigs;
          this.moreTab = false;
        } else {
          iconConfigs = allIconConfigs.splice(0, spliceNum);
          this.moreTab = true;
        }
        array.forEach(iconConfigs, function(iconConfig) {
          this.createTab(iconConfig);
        }, this);


        if (this.moreTab) {
          this.createTab({
            label: '+',
            flag: 'more',
            icon: 'xx',
            groups: allIconConfigs
          });
        }
      },

      hasMoreTab:false,
      widgets_bak_sub:[],
      createTab: function(g,other) {

        var spliceNum = 3;//默认显示个数，这里进行控制
        if (this.widgets.length <= spliceNum) {
          this.moreTab = false;
        } else {
          this.moreTab = true;
        }
        var tab;
        if (this.moreTab&&!other) {

          //新加的先创建出来
          //把最后的新添加的放到第一个
          this.widgets.reverse();
          //删除第一个的tab
          var index = 0;
          domConstruct.destroy(this.tabs[index].title);
          //domConstruct.destroy(this.tabs[index].content);
          this.tabs.splice(index,1);

          var contentNode = this._createContentNode(g);
          tab = {
            title: this._createTitleNode(g),
            content: contentNode,
            contentPane: query('.content-pane', contentNode)[0],
            config: g,
            selected: false,
            flag: g.flag,
            moreGroupWidgets: [],
            panels: []
          };
          this.tabs.splice(0, 0,tab);//插入到第一个
          ////再显示第一个的
          //if(this.tabs.length>0) {
          //  this.selectTab(0);//默认显示第一个出来
          //}

          /////////////////////////////////////////
          var widgets_bak = lang.clone(this.widgets);
          //创建more按钮
          if(this.hasMoreTab){
            for(var kk=0;kk<this.tabs.length;kk++){
              if(this.tabs[kk].flag=="more"){
                domConstruct.destroy(this.tabs[kk].title);
                //domConstruct.destroy(this.tabs[kk].content);
                this.tabs.splice(kk,1);

                break;
              }
            }
          }

          {
            this.widgets_bak_sub=[];
            for(var h=0;h<widgets_bak.length;h++){
              var isHavethis = false;
              for(var g=0;g<this.tabs.length;g++){

                if(widgets_bak[h].id==this.tabs[g].config.id){
                  isHavethis = true;
                  break;
                }
              }
              if(!isHavethis){
                this.widgets_bak_sub.push(widgets_bak[h]);
              }
            }
            g = {
              label: '点击查看更多~',
              flag: 'more',
              icon: 'xx',
              groups:   this.widgets_bak_sub
            };

            var contentNode = this._createContentNode(g);
            tab = {
              title: this._createTitleNode(g),
              content: contentNode,
              contentPane: query('.content-pane', contentNode)[0],
              config: g,
              selected: false,
              flag: g.flag,
              moreGroupWidgets: [],
              panels: []
            };
            this.tabs.push(tab);
            this.hasMoreTab = true;
          }

        }
        else{

          if(this.hasMoreTab&&this.widgets.length==3){
            domConstruct.destroy(this.tabs[this.tabs.length-1].title);
            //domConstruct.destroy(this.tabs[this.tabs.length-1].content);
            this.tabs.splice(this.tabs.length-1,1);
            this.hasMoreTab = false;
          }
          else if(this.hasMoreTab&&this.widgets.length>3)
          {
            var contentNode = this._createContentNode(g);
            tab = {
              title: this._createTitleNode(g),
              content: contentNode,
              contentPane: query('.content-pane', contentNode)[0],
              config: g,
              selected: false,
              flag: g.flag,
              moreGroupWidgets: [],
              panels: []
            };
            this.tabs.push(tab);

            for(var kk=0;kk<this.tabs.length;kk++){
              if(this.tabs[kk].flag=="more"){
                domConstruct.destroy(this.tabs[kk].title);
                //domConstruct.destroy(this.tabs[kk].content);
                this.tabs.splice(kk,1);

                g = {
                  label: '+',
                  flag: 'more',
                  icon: 'xx',
                  groups:   this.widgets_bak_sub
                };

                var contentNode = this._createContentNode(g);
                tab = {
                  title: this._createTitleNode(g),
                  content: contentNode,
                  contentPane: query('.content-pane', contentNode)[0],
                  config: g,
                  selected: false,
                  flag: g.flag,
                  moreGroupWidgets: [],
                  panels: []
                };
                this.tabs.push(tab);
                this.hasMoreTab = true;

                return tab;
                break;
              }
            }
          }

          var contentNode = this._createContentNode(g);
          tab = {
            title: this._createTitleNode(g),
            content: contentNode,
            contentPane: query('.content-pane', contentNode)[0],
            config: g,
            selected: false,
            flag: g.flag,
            moreGroupWidgets: [],
            panels: []
          };
          this.tabs.push(tab);
        }

        return tab;
      },

      onSelect: function(evt) {
        var node = evt.currentTarget;
        var id = node.id;
        var index =3;
        for(var i=0;i<this.tabs.length;i++){
          if(this.tabs[i].config.id==id)
          {
            index = i;
            break;
          }
        }
        this.selectTab(index);
      },

      selectTab: function(index) {
        var color;
        topic.publish("setSelectWidget",this.tabs[index].config);

        if (this.tabs[index].selected && this.tabs[index].flag !== 'more') {

          return;
        }
        if (this.tabs[this.getSelectedIndex()] === undefined ||
          this.tabs[this.getSelectedIndex()].flag !== 'more') {
          this.lastSelectedIndex = this.getSelectedIndex();
        }

        //this._showIndicator(index);

        //color = this._getIndicatorNodeByIndex(index).style('backgroundColor');
        //query('.content-title', this.tabs[index].content).style({
        //  background: "#99c6ef"
        //});
        //query('.title-node', this.tabs[index].title).style({
        //  color: "#99c6ef"
        //});

        //domStyle.set( this.tabs[index].title, "color","#8064ff");


        //switch widget and tab state
        array.forEach(this.tabs, function(tab, i) {
          if (index === i) {
            tab.selected = true;
            query('.content-title', this.tabs[i].title).addClass('content-title-select');

          } else {
            if (tab.selected) {
              tab.selected = false;
            }
            query('.content-title', this.tabs[i].title).removeClass('content-title-select');

          }
        }, this);

        if (this.tabs[index].flag === 'more') {
          this.showMoreTabContent(this.tabs[index]);
        } else {
          query('.content-node', this.domNode).style({
            display: 'none'
          });
          query(this.tabs[index].content).style({
            display: 'block'
          });

          if (query('.jimu-wc-tpc', this.tabs[index].content).length === 0) {
            this.showTabContent(this.tabs[index]);
          }
        }
        this.resize();


      },

      onAction: function(action, data) {
        /*jshint unused: false*/
        if (action === 'highLight' && data) {
          var node = query('div[settingid="' + data.widgetId + '"]', this.stateNode)[0];
          this._highLight(node);
        }
        if (action === 'removeHighLight') {
          this._removeHighLight();
        }
      },

      _openLastTab: function(ids) {
        if (ids && ids.length && ids.length > 0) {
          var configs = this.getAllConfigs();
          var configIds = array.map(configs, function(g) {
            if (g && g.id) {
              return g.id;
            }
            return null;
          });
          array.forEach(ids, lang.hitch(this, function(id) {
            var idx = configIds.indexOf(id);
            if (idx === -1) {
              return;
            }
            if (idx < 4) {
              this.selectTab(idx);
            } else {
              this._addGroupToMoreTab(configs[idx]);
            }
          }));
        }
      },

      _highLight: function(node) {
        if (this.hlDiv) {
          this._removeHighLight();
        }
        if (!node) {
          return;
        }
        var position = html.getMarginBox(node);
        var contentPosition = html.getContentBox(node);
        if (node.parentElement.firstElementChild !== node) {
          position.l = position.l + position.w - contentPosition.w;
        }

        var hlStyle = {
          position: 'absolute',
          left: (position.l) + 'px',
          top: (position.t) + 'px',
          width: (contentPosition.w) + 'px',
          height: (contentPosition.h) + 'px'
        };
        this.hlDiv = html.create('div', {
          "style": hlStyle,
          "class": 'icon-highlight'
        }, node, 'after');
      },

      _removeHighLight: function() {
        if (this.hlDiv) {
          html.destroy(this.hlDiv);
          this.hlDiv = null;
        }
      },

      _getTitleNodeByIndex: function(index) {
        var titleNode, contextNode;
        if (this.windowState === 'maximized') {
          contextNode = this.maxStateNode;
        } else {
          //contextNode = this.minStateNode;
        }
        titleNode = query('.title-node:nth-child(' + (index + 1) + ')', contextNode);
        return titleNode;
      },

      _onMouseEnter: function(evt) {
        var node = evt.currentTarget,
          index = parseInt(query(node).attr('i')[0], 10);

        if (this.windowState === 'maximized' &&
          this.tabs[index].selected && this.tabs[index].flag !== 'more') {
          return;
        }
        this._showIndicator(index);
      },

      _onMouseLeave: function(evt) {
        var node = evt.currentTarget,
          index = parseInt(query(node).attr('i')[0], 10);
        if (this.windowState === 'maximized' && this.tabs[index].selected &&
          ((this.moreTabOpened && this.tabs[index].flag === 'more') ||
            !this.moreTabOpened && this.tabs[index].flag !== 'more')) {
          return;
        }
        this._hideIndicator(index);
      },

      _getIndicatorNodeByIndex: function(index) {
        return query('.tab-indicator', this._getTitleNodeByIndex(index)[0]);
      },

      _showIndicator: function(index) {
        query('.tab-indicator', this.domNode).style({
          width: '0'
        });

        var w = html.getContentBox(this._getTitleNodeByIndex(index)[0]).w;
        this._getIndicatorNodeByIndex(index).animateProperty({
          properties: {
            width: w
          },
          duration: this.animTime,
          auto: true
        });
      },

      _hideIndicator: function(index) {
        this._getIndicatorNodeByIndex(index).animateProperty({
          properties: {
            width: 0
          },
          duration: this.animTime,
          auto: true
        });
      },

      getSelectedIndex: function() {
        var i = 0;
        for (i = 0; i < this.tabs.length; i++) {
          if (this.tabs[i].selected) {
            return i;
          }
        }
        return -1;
      },

      //can't show more tab
      showTabContent: function(tab) {
        var g = tab.config;
        this.showGroupContent(g, tab);

        this.currentTab = tab;
      },

      showGroupContent: function(g, tab) {
        var groupPane;
        if (g.widgets && g.widgets.length > 1) {
          query('.content-title', tab.content).text(g.label);
        }

        this.panelManager.showPanel(g).then(lang.hitch(this, function(panel) {
          var tabPane = panel;
          query(panel.domNode).style(utils.getPositionStyle({
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }));
          if (tab.flag === 'more') {
            groupPane = query('.more-group-pane[label="' + g.label + '"]', tab.contentPane);
            groupPane.append(tabPane.domNode);
          } else {

            query(tab.contentPane).append(tabPane.domNode);
            tabPane.domNode.style.display="block";
            console.log(tabPane.domNode.toString());
          }

          if (array.indexOf(tab.panels, panel) === -1) {
            tab.panels.push(panel);
          }
          tab.panel = panel;
          try{
            setTimeout(lang.hitch(this,function(){

              topic.publish( panel.label,true);
            }),500);

          }catch(e){

          }

        }));
      },

      showMoreTabContent: function(tab) {
        var groups = tab.config.groups,
          anim;
        query(this.otherGroupNode).empty();
        this._createOtherGroupPaneTitle();
        array.forEach(groups, function(group) {
          this._createMoreGroupNode(group);
        }, this);
        anim = fx.combine([
          query(this.maxStateNode).animateProperty({
            properties: {
              left: this.minWidth - this.maxWidth,
              right: this.maxWidth - this.minWidth
            },
            duration: this.animTime
          }),
          query(this.otherGroupNode).animateProperty({
            properties: {
              left: this.minWidth,
              right: 5
            },
            duration: this.animTime
          })
        ]);
        anim.play();
        this.moreTabOpened = true;
      },

      _createOtherGroupPaneTitle: function() {
        var node = html.create('div', {
            'class': 'other-group-pane-title'
          }, this.otherGroupNode),
          closeNode;
        html.create('div', {
          'class': 'bg'
        }, node);
        html.create('div', {
          'class': 'text',
          innerHTML: '其他'
        }, node);
        closeNode = html.create('div', {
          'class': 'close'
        }, node);
        this.own(on(closeNode, 'click', lang.hitch(this, function() {
          this._hideOtherGroupPane();
          if (this.lastSelectedIndex !== -1) {
            this.selectTab(this.lastSelectedIndex);
          }
        })));
        return node;
      },

      _createMoreGroupNode: function(group) {
        var node = html.create('div', {
            'class': 'other-group'
          }, this.otherGroupNode),
          arrowNode;
        html.create('img', {
          src: group.icon,
          'class': 'other-group-icon'
        }, node);
        html.create('div', {
          'class': 'other-group-title',
          innerHTML: group.label
        }, node);
        arrowNode = html.create('img', {
          'class': 'other-group-choose',
          style: {
            opacity: 0
          },
          src: this.folderUrl + 'images/arrow_choose.png'
        }, node);
        this.own(on(node, 'click', lang.hitch(this, this._onOtherGroupClick, group)));
        this.own(on(node, 'mousedown', lang.hitch(this, function() {
          query(node).addClass('jimu-state-active');
        })));
        this.own(on(node, 'mouseup', lang.hitch(this, function() {
          query(node).removeClass('jimu-state-active');
        })));
        this.own(on(node, mouse.enter, lang.hitch(this, function() {
          query(arrowNode).style({
            opacity: 1
          });
        })));
        this.own(on(node, mouse.leave, lang.hitch(this, function() {
          query(arrowNode).style({
            opacity: 0
          });
        })));
        return node;
      },

      _hideOtherGroupPane: function() {
        fx.combine([
          query(this.maxStateNode).animateProperty({
            properties: {
              left: 0,
              right: 5
            }
          }),
          query(this.otherGroupNode).animateProperty({
            properties: {
              left: this.maxWidth,
              right: 5 - this.maxWidth
            }
          })
        ]).play();

        this.moreTabOpened = false;
        var lastTab = this.tabs[this.getSelectedIndex()];
        if (lastTab && lastTab.flag === 'more') {
          this._hideIndicator(this.getSelectedIndex());
        }
      },

      _onOtherGroupClick: function(group) {
        //if (this.currentOtherGroup === null || this.currentOtherGroup.label !== group.label) {
        //  var anim = fx.combine([
        //    query(this.maxStateNode).animateProperty({
        //      properties: {
        //        left: 0 - this.maxWidth,
        //        right: this.maxWidth
        //      },
        //      duration: this.animTime
        //    }),
        //    query(this.otherGroupNode).animateProperty({
        //      properties: {
        //        left: 0,
        //        right: 5
        //      },
        //      duration: this.animTime
        //    })
        //  ]);
        //  this.own(aspect.after(anim, 'onEnd', lang.hitch(this, this._addGroupToMoreTab, group)));
        //  anim.play();
        //} else {
        //  this._addGroupToMoreTab(group);
        //}
        this._hideOtherGroupPane();
        this.openSelectTab(group);

      },

      _addGroupToMoreTab: function(group) {
        var tab = this.tabs[4];
        query('.content-node', this.domNode).style({
          display: 'none'
        });
        query(tab.content).style({
          display: 'block'
        });

        if (this._getGroupFromMoreTab(tab, group) === null) {
          var groupPane = html.create('div', {
            'class': 'more-group-pane',
            label: group.label
          }, tab.contentPane);
          query(tab.contentPane).append(groupPane);
          tab.moreGroupWidgets.push({
            glabel: group.label,
            widgets: []
          });
        }

        this.currentTab = null;
        this.currentOtherGroup = group;
        this.showGroupContent(group, tab);
        query('.more-group-pane', tab.contentPane).style({
          display: 'none'
        });
        query('.more-group-pane[label="' + group.label + '"]', tab.contentPane).style({
          display: 'block'
        });

        this._hideOtherGroupPane();
        this.resize();
      },

      _getGroupFromMoreTab: function(tab, group) {
        for (var i = 0; i < tab.moreGroupWidgets.length; i++) {
          if (tab.moreGroupWidgets[i].glabel === group.label) {
            return tab.moreGroupWidgets[i];
          }
        }
        return null;
      },

      _createTitleNode: function(config) {
        /*jshint unused:false*/
        var title = config.label,
          iconUrl = config.icon;
         var classNode = (iconUrl=="xx"?'title-node-more':'title-node');
         var  node = html.create('div', {
            title: title,
            'class': classNode,
            'settingid': config.id,
            'id': config.id,
            i: this.tabs.length
          }, this.titleListNode);

            if(iconUrl=="xx"){//更多的那个图标
              label = html.create('div', {
                'class': 'content-title-more'
              }, node);
            }else{
              var imgNode = html.create('img', {
                id:config.id,
                src: "images/close.png"
              }, node);

              this.own(on(imgNode, 'click', lang.hitch(this, this.closeByImg)));
              label = html.create('div', {

                'class': 'content-title',
                innerHTML: title
              }, node);
            }



        this.own(on(node, 'click', lang.hitch(this, this.onSelect)));

        //这里可以做些扩展
        //this.own(on(node, mouse.enter, lang.hitch(this, this._onMouseEnter)));
        //this.own(on(node, mouse.leave, lang.hitch(this, this._onMouseLeave)));

        //this.own(on(minNode, 'click', lang.hitch(this, this._onMinIconClick, minNode)));
        //this.own(on(minNode, mouse.enter, lang.hitch(this, this._onMouseEnter)));
        //this.own(on(minNode, mouse.leave, lang.hitch(this, this._onMouseLeave)));
        return node;
      },
      closeByImg:function(evt){
        var node = evt.currentTarget;

        console.log(node.id);
        //先删除，
        var index;
        for(var i=0;i<this.tabs.length;i++){
          if(this.tabs[i].config.id==node.id)
          {
            index = i;
            break;
          }
        }

        domConstruct.destroy(this.tabs[index].title);
        try{
          var panel =    this.tabs[index].panel;

          topic.publish( panel.label,false);
        }catch(e){

          console.log(e);
        }

        //domConstruct.destroy(this.tabs[index].content);

        this.tabs.splice(index,1);
        //删除 widget
        for(var k =0;k<this.widgets.length;k++){
          if(this.widgets[k].id==node.id){
            this.widgets.splice(k,1);
          }
        }

        //再显示第一个的
        if(this.widgets.length>0&&this.widgets.length<=2){
          this.selectTab(0);//默认显示第一个出来
        }else if(this.widgets.length>=3){
          var widget = this.widgets_bak_sub.pop();//得到第一个

          this.createTab(widget,true);
          var index =null;
          for(var i=0;i<this.tabs.length;i++){
            if(this.tabs[i].config.id==widget.id)
            {
              index = i;
              break;
            }
          }

          this.selectTab(index);

        }
        else{
          //关闭面板
          this.widgetManager.minimizeWidget(this);
          topic.publish("setSelectWidget",{id:"都关闭"});

          domStyle.set(this.resizerNode, "display",  "none");

        }

        evt.stopPropagation();
      },

      _onMinIconClick: function(minNode) {
        var index = query(minNode).attr('i')[0];
        this.widgetManager.maximizeWidget(this);
        this.selectTab(parseInt(index, 10));
      },

      _createContentNode: function(config) {
        var node = html.create('div', {
            id:config.id,
          'class': 'content-node'
        }, this.contentListNode);

        //这个节点承载widget
        html.create('div', {
          'class': 'content-pane'
        }, node);

        this.own(on(node, 'click', lang.hitch(this, function() {
          if (this.moreTabOpened) {
            this._hideOtherGroupPane();
            if (this.lastSelectedIndex !== -1) {
              this.selectTab(this.lastSelectedIndex);
            }
          }
        })));
        return node;
      },

      _doResize: function() {
        if (this.windowState === 'maximized') {
          this.widgetManager.minimizeWidget(this.id);
        } else {
          if(this.tabs.length==0)return;
          this.widgetManager.maximizeWidget(this.id);
        }
      },

      _resizeToMin: function() {
        topic.publish('relayout');
        //这块加个动画效果
        this.doDnimate(this.domNode,{  width: {start: this.maxWidth, end: this.minWidth} },500);
        this.doDnimate(this.maxStateNode, {  opacity: {start: 1, end: 0}  },400);

        //query(this.domNode).style('width', this.minWidth + 'px');
        //query(this.maxStateNode).style('display', 'none');

        //query('div', this.doResizeNode).removeClass('left-arrow').addClass('right-arrow');
        //query('div', this.doResizeNode).removeClass('right-arrow').addClass('left-arrow');

        //topic.publish('changeMapPosition', {
        //  left: 0//以前是left
        //});

        //this.stateNode = this.minStateNode;
      },
      _resizeToMax: function() {
        //if(this.tabs.length==0){
        //    //没有的话打不开
        //    this.windowState === 'minimized';
        //    return;
        //}
        topic.publish('relayout');

        this.doDnimate(this.domNode, { width: {start: this.minWidth, end: this.maxWidth}  },500);
        this.doDnimate(this.maxStateNode,{ opacity: {start: 0, end: 1} },400);

        //query(this.domNode).style('width', this.maxWidth + 'px');
        //query(this.maxStateNode).style('display', 'block');

        this.resize();

        //topic.publish('changeMapPosition', {
        //  right: this.maxWidth//以前是left
        //});
        //topic.publish('changeMapPosition', {
        //  left: this.maxWidth//以前是left
        //});

        //这块先注视掉
        //
        //if (this.currentTab) {
        //  this.showGroupContent(this.currentTab.config, this.currentTab);
        //}
        //
        //var firstOpen = array.every(this.tabs, function(tab) {
        //  return !tab.panel;
        //});
        //if (firstOpen && this.tabs) {
        //  this.selectTab(0);
        //}
        //
        this.stateNode = this.maxStateNode;

        //同时初始化多个panel
      },
      doDnimate:function(domNode,properties,duration){
        baseFx.animateProperty(
            {
              node: domNode,
              properties:properties,
              duration: duration
            }).play();
      }
    });
    return clazz;
  });