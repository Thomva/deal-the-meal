import { default as React } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { useState } from 'react';
import { mapBoxConfig } from '../../config';
import { useEffect } from 'react';
import Utils from '../../utilities/Utils';

const Map = ({
	options,
	location,
	locationQuery = 'brussel',
    onFindLocation,
    onMarkerChange,
}) => {
	const defaultOptions = {
		latitude: 50.841432,
		longitude: 4.352818,
		width: '100%',
		height: '100%',
		zoom: 6,
    };
    
	const defaultLocation = {
		latitude: defaultOptions.latitude,
		longitude: defaultOptions.longitude,
	};


	const [viewport, setViewport] = useState(options || defaultOptions);
	const [markerLocation, setMarkerLocation] = useState(
		location || defaultLocation
    );

    const [isDefaultSet, setIsDefaultSet] = useState(false);
    
    useEffect(() => {
        if (!location) return;
        if (isDefaultSet) return;
        setMarkerLocation(location);
        setIsDefaultSet(true);
        console.log('setmarkerdefault');
    }, [location]);

	const handleLocationFound = (data, beforeFinish) => {
		// if (!data || !data.features || !data.features[0]) return;
		// const currentFeature = data.features[0];
		// let locationName;
		// const context = currentFeature.context;
		// switch (true) {
		// 	case currentFeature.place_type.includes('locality'):
		// 		locationName = currentFeature.text;
		// 		break;
		// 	case currentFeature.place_type.includes('place'):
		// 		locationName = currentFeature.text;
		// 		break;
		// 	case !!context.find((c) => c.id.includes('locality')):
		// 		locationName = context.find((c) => c.id.includes('locality')).text;
		// 		break;
		// 	case !!context.find((c) => c.id.includes('place')):
		// 		locationName = context.find((c) => c.id.includes('place')).text;
		// 		break;

		// 	default:
		// 		console.log(context.find((c) => c.id.includes('locality')));
		// 		console.log(context.find((c) => c.id.includes('place')));
		// 		break;
		// }

		// const location = {
		// 	coords: {
		// 		longitude: data.features[0].center[0],
		// 		latitude: data.features[0].center[1],
		// 	},
		// 	name: locationName,
        // };
        const location = Utils.formatLocationFromResult(data);
        if (beforeFinish) beforeFinish(location);
        console.log('location');
		if (onFindLocation) onFindLocation(location);
	};

	useEffect(() => {
		(async () => {
			const data = await Utils.forwardGeocode(locationQuery);
			if (!data || !data.features || !data.features[0]) return;
			const currentFeature = data.features[0];
			const coords = currentFeature.center;
			setMarkerLocation({
				longitude: coords[0],
				latitude: coords[1],
			});
			handleLocationFound(data);
        })();
    }, [locationQuery, onFindLocation]);

	const handleMapClick = (event) => {
		const coords = {
			latitude: event.lngLat[1],
			longitude: event.lngLat[0],
        };
        
        setMarkerLocation(coords);
        
		(async () => {
			const data = await Utils.reverseGeocode(coords);
			handleLocationFound(data, onMarkerChange);
		})();
    };
    
	return (
		<ReactMapGL
			{...viewport}
			mapboxApiAccessToken={mapBoxConfig.token}
			onViewportChange={(vp) => setViewport(vp)}
			onClick={handleMapClick}
		>
			<Marker
				latitude={markerLocation.latitude}
				longitude={markerLocation.longitude}
				className="map__icon"
			></Marker>
		</ReactMapGL>
	);
};

export default Map;
