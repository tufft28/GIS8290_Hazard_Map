//var map;

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
  "esri/Color",
  "dojo/dom-class",
  "dojo/dom",
  "dojo/dom-construct",
  "dojo/on",
  "dojox/charting/Chart",
  "dojox/charting/themes/Dollar",
  "dojo/query",
  "dojo/NodeList-traverse",
  "dojo/domReady!"
],
  function (Map, ArcGISDynamicMapServiceLayer, FeatureLayer, ImageParameters, Popup, PopupTemplate, InfoWindow, InfoTemplate, SimpleFillSymbol, Color, domClass, dom, domConstruct, on, Chart, theme, query) {

  var fill = new SimpleFillSymbol("solid", null, new Color("#A4CE67"));
  var popup = new Popup({
      fillSymbol: fill,
      titleInBody: false
  }, domConstruct.create("div"));
  domClass.add(popup.domNode, "dark");

    var layer, visibleLayerIds = [];
    var infoWindow = new InfoWindow({}, domConstruct.create("div"));
    infoWindow.startup();
    var infoTemplate = new InfoTemplate("Testing", "${*}");

    var map = new Map("map", {
      center: [-98, 37],
      zoom: 5,
      basemap: "dark-gray",
      infoWindow: popup
    });

    var template = new PopupTemplate({
      title: "{NAME}, County",
      description: "Natural Hazard Risk",
      fieldInfos: [{ //define field infos so we can specify an alias
        fieldName: "freq",
        label: "Wildfire"
      },{
        fieldName: "freq",
        label: "Hurricane"
      },{
        fieldName: "freq",
        label: "Flood"
      }],
      mediaInfos:[{ //define the bar chart
        caption: "",
        type:"barchart",
        value:{
          theme: "Dollar",
          fields:["freq","freq","freq"]
        }
      }]
    });

    var featureLayer = new FeatureLayer("http://services.arcgis.com/8df8p0NlLFEShl0r/arcgis/rest/services/AllRisks_Popup/FeatureServer/0",{
      mode: FeatureLayer.MODE_ONDEMAND,
      outFields: ["*"],
      infoTemplate: template
    });
    map.addLayer(featureLayer);
    // map.infoWindow.setTitle("Testing");
    // map.infoWindow.setContent("This county is fucked");
    //
    // function showInfoWindow(evt){
    //   map.infoWindow.show(evt.mapPoint, map.getInfoWindowAnchor(evt.screenPoint));
    // }
    // map.on("click", showInfoWindow)

    //Use the ImageParameters to set the visibleLayerIds layers in the map service during ArcGISDynamicMapServiceLayer construction.
    var imageParameters = new ImageParameters();
    imageParameters.layerIds = [0,1,3,4,5,6,7,8,9,10,11];
    imageParameters.layerOption = ImageParameters.LAYER_OPTION_HIDE;
    //can also be: LAYER_OPTION_EXCLUDE, LAYER_OPTION_HIDE, LAYER_OPTION_INCLUDE

    layer = new ArcGISDynamicMapServiceLayer("https://gis.uspatial.umn.edu/arcgis/rest/services/CrisisMappingFinal/MapServer",
        {"imageParameters": imageParameters});
    map.addLayer(layer);

    on(dom.byId("layer4CheckBox"), "change", function(){
      var box = dom.byId("layer4CheckBox");
      var visible = [];
      if (box.checked){
        var not_visible = query(".nuclear").siblings();
        for (var i = 0; i < not_visible.length; i++) {
          not_visible[i].checked = false;
        }
        visible.push(box.value);
        layer.setVisibleLayers(visible);
      }
      else {
        visible.push(-1);
        layer.setVisibleLayers(visible);
      }
    }
  );

    on(dom.byId("layer5CheckBox"), "change", function(){
      var box = dom.byId("layer5CheckBox");
      var visible = [];
      if (box.checked){
        var not_visible = query(".earthquakes").siblings();
        for (var i = 0; i < not_visible.length; i++) {
          not_visible[i].checked = false;
        }
        visible.push(box.value);
        layer.setVisibleLayers(visible);
      }
      else {
        visible.push(-1);
        layer.setVisibleLayers(visible);
      }
    }
  );

  on(dom.byId("layer6CheckBox"), "change", function(){
    var box = dom.byId("layer6CheckBox");
    var visible = [];
    if (box.checked){
      var not_visible = query(".hurricanes").siblings();
      for (var i = 0; i < not_visible.length; i++) {
        not_visible[i].checked = false;
      }
      visible.push(box.value);
      layer.setVisibleLayers(visible);
    }
    else {
      visible.push(-1);
      layer.setVisibleLayers(visible);
    }
  }
);

on(dom.byId("layer7CheckBox"), "change", function(){
  var box = dom.byId("layer7CheckBox");
  var visible = [];
  if (box.checked){
    var not_visible = query(".volcanoes").siblings();
    for (var i = 0; i < not_visible.length; i++) {
      not_visible[i].checked = false;
    }
    visible.push(box.value);
    layer.setVisibleLayers(visible);
  }
  else {
    visible.push(-1);
    layer.setVisibleLayers(visible);
  }
}
);

on(dom.byId("layer8CheckBox"), "change", function(){
  var box = dom.byId("layer8CheckBox");
  var visible = [];
  if (box.checked){
    var not_visible = query(".floods").siblings();
    for (var i = 0; i < not_visible.length; i++) {
      not_visible[i].checked = false;
    }
    visible.push(box.value);
    layer.setVisibleLayers(visible);
  }
  else {
    visible.push(-1);
    layer.setVisibleLayers(visible);
  }
}
);

on(dom.byId("layer9CheckBox"), "change", function(){
  var box = dom.byId("layer9CheckBox");
  var visible = [];
  if (box.checked){
    var not_visible = query(".winter").siblings();
    for (var i = 0; i < not_visible.length; i++) {
      not_visible[i].checked = false;
    }
    visible.push(box.value);
    layer.setVisibleLayers(visible);
  }
  else {
    visible.push(-1);
    layer.setVisibleLayers(visible);
  }
}
);

on(dom.byId("layer10CheckBox"), "change", function(){
  var box = dom.byId("layer10CheckBox");
  var visible = [];
  if (box.checked){
    var not_visible = query(".wildfires").siblings();
    for (var i = 0; i < not_visible.length; i++) {
      not_visible[i].checked = false;
    }
    visible.push(box.value);
    layer.setVisibleLayers(visible);
  }
  else {
    visible.push(-1);
    layer.setVisibleLayers(visible);
  }
}
);

on(dom.byId("layer11CheckBox"), "change", function(){
  var box = dom.byId("layer11CheckBox");
  var visible = [];
  if (box.checked){
    var not_visible = query(".tornadoes").siblings();
    for (var i = 0; i < not_visible.length; i++) {
      not_visible[i].checked = false;
    }
    visible.push(box.value);
    layer.setVisibleLayers(visible);
  }
  else {
    visible.push(-1);
    layer.setVisibleLayers(visible);
  }
}
);
    //on(dom.byId("layer0CheckBox"), "change", updateLayerVisibility);
    //on(dom.byId("layer1CheckBox"), "change", updateLayerVisibility);

    // function updateLayerVisibility () {
    //   var inputs = query(".list_item");
    //   var inputCount = inputs.length;
    //   visibleLayerIds = [];
    //
    //   for (var i = 0; i < inputCount; i++) {
    //     if (inputs[i].checked) {
    //       visibleLayerIds.push(inputs[i].value);
    //     }
    //   }
    //
    //   if (visibleLayerIds.length === 0) {
    //     visibleLayerIds.push(-1);
    //   }
    //
    //   layer.setVisibleLayers(visibleLayerIds);
    // }
  });
