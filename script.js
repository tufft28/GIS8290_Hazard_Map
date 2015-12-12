require([
  "esri/map",
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/layers/FeatureLayer",
  "esri/layers/ImageParameters",
  "esri/dijit/Popup",
  "esri/dijit/PopupTemplate",
  "esri/dijit/InfoWindow",
  "esri/InfoTemplate",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/Color",
  "esri/dijit/Search",
  "esri/domUtils",
  "dojo/dom-class",
  "dojo/dom",
  "dojo/dom-construct",
  "dojo/on",
  "dojox/charting/action2d/Tooltip",
  "dojox/charting/Chart",
  "dojox/charting/Chart2D",
  "dojox/charting/plot2d/Bars",
  "dojox/charting/themes/Grasslands",
  "dojox/charting/axis2d/Default",
  "dojo/query",
  "dijit/registry",
  "dijit/layout/TabContainer",
  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane",
  "dojo/_base/connect",
  "dojo/NodeList-traverse",
  "dojo/domReady!"
],
  function (Map, ArcGISDynamicMapServiceLayer, FeatureLayer, ImageParameters, Popup, PopupTemplate, InfoWindow, InfoTemplate, SimpleFillSymbol, SimpleLineSymbol, Color, Search, domUtils, domClass, dom, domConstruct, on, Tooltip, Chart, Chart2D, Bars, dojoxTheme, axis2d, query, registry, TabContainer, BorderContainer, ContentPane, connect) {

  var fill = new SimpleFillSymbol("solid", null, new Color("#A4CE67"));
  var popup = new Popup({
      fillSymbol: fill,
      titleInBody: false
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
      
      var cp2 = new ContentPane({
        title: "Details",
        content: "hello",style: "height:325px; width:475px; border-color:#fff;color:#222327; font:sans-serif;"
      });

      tc.startup();
      
      var cp1 = new ContentPane({
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
            tooltip: wf,
            fill: "#020804",
            stroke: {color: "#fff", width: 1.2}
          },{
            y: eq,
            tooltip: eq,
            fill: "#0D2427",
            stroke: {color: "#fff", width: 1.2}
          },
          ]);
          
          chart1TT = new Tooltip(BarChart1, "default");
      cp1.set("content", BarChart1.node);
      BarChart1.render();
      return cp.domNode;
        }
      ;
    
   
    //feature layer containing all risks and set as transparent. popup pulls from this layer for display information
    var featureLayer = new FeatureLayer("http://services.arcgis.com/8df8p0NlLFEShl0r/arcgis/rest/services/AllRisks_Popup/FeatureServer/0",{
      mode: FeatureLayer.MODE_ONDEMAND,
      outFields: ["*"],
      infoTemplate: info_window
    });
    
    map.addLayer(featureLayer);
    
    map.infoWindow.resize(555, 600);
    
    var labels = [{value: 1, text: "<b>Other Non Rail</b>"}, {value: 2,text: "<b>Other Rail</b>"}];
    //image parameters are set to be called in the map service construction
    var imageParameters = new ImageParameters();
    imageParameters.layerIds = [0,1,3,4,5,6,7,8,9,10,11];
    imageParameters.layerOption = ImageParameters.LAYER_OPTION_HIDE;

    //map service containing individual risk layers
    var layer = new ArcGISDynamicMapServiceLayer("http://gis.uspatial.umn.edu/arcgis/rest/services/CrisisMappingFinal2/MapServer",
        {"imageParameters": imageParameters});
    map.addLayer(layer);

    //3 feature layers created for the nuclear sites. 0 and 1 are the buffers. 2 is the points.
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

    //function for showing all three nuclear feature layers with one button
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