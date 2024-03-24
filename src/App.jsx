import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import geoJson from './rivers.json';
import DeckGL from '@deck.gl/react';
import {GeoJsonLayer,BitmapLayer,PathLayer} from '@deck.gl/layers';
import {COORDINATE_SYSTEM} from '@deck.gl/core';
import {TileLayer} from '@deck.gl/geo-layers';

const getColor = (number) => {
  const string = `${number || 0}`;
  if (string[0] === '9' && string[1] === '2') {
    return [50, 136, 189];
  }
  switch (string[0]) {
    case '1': return [158, 1, 66];
    case '2': return [213, 62, 79];
    case '3': return [244, 109, 67];
    case '4': return [253, 174, 97];
    case '5': return [254, 224, 139];
    case '6': return [230, 245, 152];
    case '7': return [171, 221, 164];
    case '8': return [102, 194, 165];
    default: return [94, 79, 162];
  }
}

const App = () => {
  const [hoveredObject, setHoveredObject] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [inputGWK, setInputGWK] = useState(null);

  const [data] = useState(geoJson);
  useEffect(() => {
    console.log('selectedObject', selectedObject);
    console.log('GWK', selectedObject?.properties?.GWK);
  }, [selectedObject]);
  useEffect(() => {
    console.log('inputGWK', inputGWK);
  }, [inputGWK]);

  const layer = new GeoJsonLayer({
    id: 'geojson-layer',
    //coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    //data:'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart.geo.json',
    data: data.features,
    extruded: false,
    filled: true,
    getElevation: 0,
    getFillColor: (f) => {
      if (f?.properties?.GWK && inputGWK === f?.properties?.GWK) {
        return [0, 0, 0];
      }
      if (f?.properties?.OBJID && selectedObject?.properties?.OBJID === f?.properties?.OBJID) {
        return [0, 150, 0];
      }
      if (f?.properties?.GWK && selectedObject?.properties?.GWK === f?.properties?.GWK) {
        return [0, 255, 0];
      }
      if (f?.properties?.GWK && hoveredObject?.properties?.GWK === f?.properties?.GWK) {
        return [0, 0, 255];
      }
      return getColor(f.properties.GWK || 0)
    },
    getLineColor: (f) => {
      if (f?.properties?.GWK && inputGWK === f?.properties?.GWK) {
        return [0, 0, 0];
      }
      if (f?.properties?.OBJID && selectedObject?.properties?.OBJID === f?.properties?.OBJID) {
        return [0, 150, 0];
      }
      if (f?.properties?.GWK && selectedObject?.properties?.GWK === f?.properties?.GWK) {
        return [0, 255, 0];
      }
      if (f?.properties?.GWK && hoveredObject?.properties?.GWK === f?.properties?.GWK) {
        return [0, 0, 255];
      }
      return getColor(f.properties.GWK || 0)
    },
    getLineWidth: (f) => f.properties.BRG || 3,
    getPointRadius: 4,
    getText: f => f.properties.NAM,
    getTextSize: 12,
    lineWidthMinPixels: 2,
    pointRadiusUnits: 'pixels',
    pointType: 'text',
    stroked: true,
    pickable: true,
    onClick: (e, p) => {
      if (e?.layer?.id === 'geojson-layer' && e?.object) {
        setSelectedObject(e.object);
      } else {
        setSelectedObject(null);
      }
    },
    updateTriggers: {
      getLineColor: [hoveredObject, selectedObject, inputGWK],
      getFillColor: [hoveredObject, selectedObject, inputGWK],
    }
  });
  
  const tileLayer = new TileLayer({
    id: 'TileLayer',
    data: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    minZoom: 0,
    renderSubLayers: props => {
      const {
        bbox: {west, south, east, north}
      } = props.tile;
  
      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [west, south, east, north]
      });
    },
    pickable: true,
  });

  const [viewState, setViewState] = useState({
    /*latitude: 37.7751,
    longitude: -122.4193,
    zoom: 11,
    bearing: 0,
    pitch: 0,
    */
    latitude: 52.519211,
    longitude: 13.379308,
    zoom: 1,
    bearing: 0,
    pitch: 0,
    maxZoom: 20,
    minZoom: 1,
  
  });

  const handleNewViewState = (viewStateChangeParameters) => {
    setViewState(viewStateChangeParameters.viewState);
  }

  return (
    <div>
      <input
        style={{ zIndex:1000, position: 'absolute' }}
        name="myInput"
        onChange={(e) => {
          setInputGWK(e.target.value);
        }}
        value={inputGWK}
      />
      <DeckGL
    	//viewState={viewState}
      //mapStyle={'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'}
      viewState={viewState}
      onViewStateChange={handleNewViewState}
      controller={true}
      getTooltip={({object}) => {
        return object?.properties?.NAM;
      }}
      onHover={(e, p) => {
        if (e?.layer?.id === 'geojson-layer' && e?.object) {
          setHoveredObject(e.object);
        } else {
          setHoveredObject(null);
        }
      }}
      layers={[/*tileLayer,*/ layer]}
      //getTooltip={({object}) => object && (object.properties.name || object.properties.station)}
    />
    </div>
  );
}

export default App;
