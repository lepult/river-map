import React, { useState, useEffect } from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import bigRiversData from "./data/bigRivers.json";
import smallRiversData from "./data/smallRivers.json";
import { getRiverColor } from "./utils/color";

const Map = ({
  inputGWK = null
}) => {
  const [geoJsonLayerData] = useState([
    ...bigRiversData.features.filter((element) => element.properties.OBJART === '44001' && element.properties.GWK),
    ...smallRiversData.features,
  ]);

  if (geoJsonLayerData) {
    console.log(geoJsonLayerData[0]);
  }

  const [viewState, setViewState] = useState({
    latitude: 51.5,
    longitude: 10.5,
    zoom: 5,
    bearing: 0,
    pitch: 0,
    maxZoom: 20,
    minZoom: 3,
  });

  const [hoveredObject, setHoveredObject] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);

  const handleColor = (f) => {
    const { OBJID: objId, GWK: gwk, OBJART_TXT: objType } = f?.properties || {};
    const { OBJID: selectedObjId, GWK: selectedGwk } = selectedObject?.properties || {};
    const { GWK: hoveredGwk } = hoveredObject?.properties || {};

    return getRiverColor(objId, selectedObjId, gwk, selectedGwk, hoveredGwk, inputGWK, objType);  
  };

  const layer = new GeoJsonLayer({
    id: "geojson-layer",
    //coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    //data:'https://pizzaaa.chayns.site/space/Private_Projekte/River_Map/rivers.json',
    data: geoJsonLayerData,
    extruded: false,
    filled: true,
    getElevation: 0,
    getFillColor: (f) => handleColor(f),
    getLineColor: (f) => handleColor(f),
    getLineWidth: (f) => f.properties.BRG || 3,
    getPointRadius: 4,
    getText: (f) => f.properties.NAM,
    getTextSize: 12,
    lineWidthMinPixels: 2,
    pointRadiusUnits: "pixels",
    pointType: "text",
    stroked: true,
    pickable: true,
    onClick: (e, p) => {
      if (e?.layer?.id === "geojson-layer" && e?.object) {
        setSelectedObject(e.object);
      } else {
        setSelectedObject(null);
      }
    },
    updateTriggers: {
      getLineColor: [hoveredObject, selectedObject, inputGWK],
      getFillColor: [hoveredObject, selectedObject, inputGWK],
    },
  });

  useEffect(() => {
    console.log("selectedObject", selectedObject);
    console.log("GWK", selectedObject?.properties?.GWK);
  }, [selectedObject]);

  const handleNewViewState = (viewStateChangeParameters) => {
    setViewState(viewStateChangeParameters.viewState);
  };

  return (
    <DeckGL
      //viewState={viewState}
      //mapStyle={'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'}
      viewState={viewState}
      onViewStateChange={handleNewViewState}
      controller={true}
      getTooltip={({ object }) => {
        return object?.properties?.NAM;
      }}
      onHover={(e, p) => {
        if (e?.layer?.id === "geojson-layer" && e?.object) {
          setHoveredObject(e.object);
        } else {
          setHoveredObject(null);
        }
      }}
      layers={[/*tileLayer,*/ layer]}
      //getTooltip={({object}) => object && (object.properties.name || object.properties.station)}
    />
  );
};

export default Map;
