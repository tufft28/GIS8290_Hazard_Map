//var map;

require([
  "esri/map",
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/layers/FeatureLayer",
  "esri/layers/ImageParameters",
  "esri/dijit/Popup",
  "esri/dijit/PopupTemplate",
  "esri/dijit/InfoWindow",
  "dijit/layout/ContentPane",
  "dijit/layout/TabContainer",
  "esri/InfoTemplate",
  "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
  "esri/Color",
  "dojo/dom-class",
  "dojo/dom",
  "esri/dijit/Search",
  "dojo/_base/connect",
  "dijit/registry",
  "dojo/dom-construct",
  "esri/domUtils",
  "dojo/on",
  "dojox/charting/action2d/Tooltip",
  "dojox/charting/Chart",
  "dojox/charting/Chart2D",
  "dojox/charting/plot2d/Bars",
  "dojox/charting/themes/Grasslands",
  "dojox/charting/axis2d/Default",
  "dojo/query",
  "dojo/NodeList-traverse",
  "dojo/domReady!"
],
  function (Map, ArcGISDynamicMapServiceLayer, FeatureLayer, ImageParameters, Popup, PopupTemplate, 
  InfoWindow, ContentPane, TabContainer, InfoTemplate, SimpleFillSymbol, SimpleLineSymbol, Color, domClass, dom,
  Search, connect, registry, domConstruct, domUtils,
  on, Tooltip, Chart, Chart2D, Bars, dojoxTheme, query) {

  var fill = new SimpleLineSymbol("solid", null, new Color("#A4CE67"), 30);
  var popup = new Popup({
      fillSymbol: fill,
      titleInBody: false,
  }, domConstruct.create("div"));
   domClass.add(popup.domNode, "dark");
       
   
    var map = new Map("map", {
      center: [-98, 37],
      zoom: 4,
      basemap: "gray",
      infoWindow: popup
    });

    domClass.add(map.infoWindow.domNode, "myTheme");    
    
   

    var info_window = new esri.InfoTemplate();
    info_window.setTitle("<b>${State}   (${County})</b>");
       info_window.setContent(getWindowContent);


    function getWindowContent(graphic){
      var cp = new ContentPane ({
        style: "height:100%,width:100%"
      });

      var tc = new TabContainer({
        style: "width:100%;height:100%;border-color:#fff;background-color:#DBDBD6;color:#222327",
        useMenu: false,
        useSlider: false,
        doLayout: true,
        tabPosition: "right-h",
      }, domConstruct.create("div"));

      cp.addChild(tc);
      
      var cp1 = new ContentPane({
        title: "Details",
        content: "hello",style: "height:325px; width:475px; border-color:#fff;color:#222327; font:sans-serif;"
      });

      tc.startup();
      
      var cp2 = new ContentPane({
        title: "Vehicles" + "<br>" + "Operated",
        style: "height:325px; width:475px; border-color:#fff;color:#222327;"
      });
      
      tc.addChild(cp1);
          tc.addChild(cp2);
      tc.selectChild(cp1);
      
      var bar_chart1 = domConstruct.create("div", {id: "BarChart1"},
            domConstruct.create("div"));
            
     var BarChart1 = new Chart2D(bar_chart1, {
            title: "Risk",
            titleFont: "normal normal normal 12pt Verdana,Geneva,Arial,Helvetica,sans-serif"
          });
          domClass.add(BarChart1, "chart");

          BarChart1.setTheme(dojoxTheme);
          BarChart1.addPlot("default", {
            type: "Bars",
            markers: true,
            gap: 5,
            htmlLabels: true,
            labels: true,
            labelStyle: "outside",
            labelOffset: 25
          });
          BarChart1.addAxis("x",
            {majorTicks: true,
              minorTicks: false,
              majorTickStep: 1,
              max: 4,
              min: 0
            });
          BarChart1.addAxis("y", {vertical: true,
            labels: labels,
            majorTicks: false,
            majorTick: {length: 2},
            majorLabels: true,
            majorTickStep: 1,
            minorTicks: false,
            max: 9
          });       
          
          
          
          tc.watch("selectedChildWidget", function(name, newVal){
            if ( newVal.title === "Risk") {
              BarChart1.resize(200,200);
            }
            
            
          });
          
          
          var wf = graphic.attributes.Wildfire;
          var eq = graphic.attributes.Earthquake;
          
          
      BarChart1.addSeries("Risk", [{
            y: wf,
            tooltip: wf + " %",
            fill: "#020804",
            stroke: {color: "#fff", width: 1.2}
          },{
            y: eq,
            tooltip: eq + " %",
            fill: "#0D2427",
            stroke: {color: "#fff", width: 1.2}
          },
          ]);
          
          chart1TT = new Tooltip(BarChart1, "default");
      cp2.set("content", BarChart1.node);
      BarChart1.render();
      return cp.domNode;
        }
      ;
      
      
      
    var featureLayer = new FeatureLayer("http://services.arcgis.com/8df8p0NlLFEShl0r/arcgis/rest/services/RiskyBusiness/FeatureServer/0",{
      mode: FeatureLayer.MODE_ONDEMAND,
      outFields: ["*"],
      infoTemplate: info_window
    });
    map.addLayer(featureLayer);
    map.infoWindow.resize(555, 600);

    //Use the ImageParameters to set the visibleLayerIds layers in the map service during ArcGISDynamicMapServiceLayer construction.
    var imageParameters = new ImageParameters();
    imageParameters.layerIds = [0,1,3,4,5,6,7,8,9,10,11];
    imageParameters.layerOption = ImageParameters.LAYER_OPTION_HIDE;
    //can also be: LAYER_OPTION_EXCLUDE, LAYER_OPTION_HIDE, LAYER_OPTION_INCLUDE

    var layer = new ArcGISDynamicMapServiceLayer("http://gis.uspatial.umn.edu/arcgis/rest/services/CrisisMappingFinal2/MapServer",
        {"imageParameters": imageParameters});
    map.addLayer(layer);

    var nuclearLayer0 = new FeatureLayer("http://gis.uspatial.umn.edu/arcgis/rest/services/CrisisMappingFinal2/MapServer/0",{
      visible: false
    });
    map.addLayer(nuclearLayer0);

    var nuclearLayer1 = new FeatureLayer("http://gis.uspatial.umn.edu/arcgis/rest/services/CrisisMappingFinal2/MapServer/1",{
      visible: false
    });
    map.addLayer(nuclearLayer1);

    var nuclearLayer2 = new FeatureLayer("http://gis.uspatial.umn.edu/arcgis/rest/services/CrisisMappingFinal2/MapServer/3",{
      visible: false
    });
    map.addLayer(nuclearLayer2);

    on(dom.byId("nuclearpointscheckbox"), "change", function(){
      var box = dom.byId("nuclearpointscheckbox");
      if (box.checked){
        nuclearLayer0.show();
        nuclearLayer1.show();
        nuclearLayer2.show();
      }
      else {
        nuclearLayer0.hide();
        nuclearLayer1.hide();
        nuclearLayer2.hide();
      }
    });

    //each hazard button has a function for unchecking other hazards off when it is checked. exception: nuclear sites can be visible on top of any hazard.
    var layer_list_checkbox_spans = query('.list-item-span');
    
    
    for (var i =0; i < layer_list_checkbox_spans.length;i++){

      on(layer_list_checkbox_spans[i].querySelector("input"),"change", function(){
        //layer 2, state borders, is always visible
        var visible = [2];

        if (this.checked){

          var not_visible = query(this)
                              .parent()
                              .siblings(".list-item-span")
                              .query(".list_item");

          for (var i = 0; i < not_visible.length; i++) {
            not_visible[i].checked = false;
          }
          visible.push(this.value);
          layer.setVisibleLayers(visible);
        }

        else {
          visible.push(-1);
          layer.setVisibleLayers(visible);
        }
      });
    }
});