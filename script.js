var map;

require([
  "esri/map",
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/layers/ImageParameters",
  "dojo/dom",
  "dojo/on",
  "dojo/query",
  "dojo/domReady!"
],
  function (Map, ArcGISDynamicMapServiceLayer, ImageParameters, dom, on, query) {
    var layer, visibleLayerIds = [];

    map = new Map("map", {
      center: [-98.35, 39.50],
      zoom: 4,
      basemap: "topo"
    });

    //Use the ImageParameters to set the visibleLayerIds layers in the map service during ArcGISDynamicMapServiceLayer construction.
    var imageParameters = new ImageParameters();
    imageParameters.layerIds = [];
    imageParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
    //can also be: LAYER_OPTION_EXCLUDE, LAYER_OPTION_HIDE, LAYER_OPTION_INCLUDE

    layer = new ArcGISDynamicMapServiceLayer("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer",
      {"imageParameters": imageParameters});
    map.addLayer(layer);

    on(dom.byId("layer0CheckBox"), "change", updateLayerVisibility);
    on(dom.byId("layer1CheckBox"), "change", updateLayerVisibility);

    function updateLayerVisibility () {
      var inputs = query(".list_item");
      var inputCount = inputs.length;
      //in this application layer 2 is always on.
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
