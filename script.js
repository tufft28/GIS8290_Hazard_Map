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
      center: [-93, 44.9],
      zoom: 11,
      basemap: "topo",
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

    var featureLayer = new FeatureLayer("http://services.arcgis.com/8df8p0NlLFEShl0r/arcgis/rest/services/wildfire_poly/FeatureServer/0",{
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
    imageParameters.layerIds = [0,1];
    imageParameters.layerOption = ImageParameters.LAYER_OPTION_HIDE;
    //can also be: LAYER_OPTION_EXCLUDE, LAYER_OPTION_HIDE, LAYER_OPTION_INCLUDE

    layer = new ArcGISDynamicMapServiceLayer("http://localhost:6080/arcgis/rest/services/Hazards/HazardsTest/MapServer",
        {"imageParameters": imageParameters});
    map.addLayer(layer);

    //dom.byId("layer0CheckBox").addEventListener("click", toggle(this));
    //dom.byId("layer1CheckBox").addEventListener("click", toggle(this));
    //on(dom.byId("layer0CheckBox"), "change", toggle(this));
    //on(dom.byId("layer1CheckBox"), "change", toggle(this));
    on(dom.byId("layer0CheckBox"), "change", updateLayerVisibility);
    on(dom.byId("layer1CheckBox"), "change", updateLayerVisibility);

    function toggle (box) {
      var inputs = query(".list_item");
      visibleLayerIds = [];
      if(box.checked) {
        visibleLayerIds.push(box.value);
        layer.setVisibleLayers(visibleLayerIds);
        for (var i = 0; i < inputs.length; i++) {
          if (inputs[i].value != box.value) {
            inputs[i].checked === false;
          }
        }
      }
    }

    function updateLayerVisibility () {
      var inputs = query(".list_item");
      var inputCount = inputs.length;
      visibleLayerIds = [];

      for (var i = 0; i < inputCount; i++) {
        if (inputs[i].checked) {
          visibleLayerIds.push(inputs[i].value);
        }
      }

      if (visibleLayerIds.length === 0) {
        visibleLayerIds.push(-1);
      }

      layer.setVisibleLayers(visibleLayerIds);
    }
  });
