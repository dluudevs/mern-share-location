import React, { useRef, useEffect } from 'react';

import './Map.css';

const Map = (props) => {
  // useRef can be used to point at nodes, by calling the hook we created a pointer in mapRef
  // when the ref prop is used on a component and mapRef is assigned, mapRef then points to that node

  // useRef can also create variables that survive re-render cycles and dont lose their values
  const mapRef = useRef();
  const { center, zoom } = props;

  useEffect(() => {
    // https://developers.google.com/maps/documentation/javascript/overview#maps_map_simple-javascript
    // must be in useEffect otherwise when constructor runs the component will not have rendered and mapRef is null
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom,
    });

    // https://developers.google.com/maps/documentation/javascript/adding-a-google-map
    new window.google.maps.Marker({ position: center, map: map });
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
