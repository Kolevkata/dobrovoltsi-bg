// /src/components/LocationPicker.js
import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, useLoadScript, Autocomplete } from '@react-google-maps/api';
import './LocationPicker.css';

const libraries = ['places'];
const mapContainerStyle = {
    width: '100%',
    height: '400px',
};
const center = {
    lat: 42.6977,
    lng: 23.3219,
};
const options = {
    disableDefaultUI: true,
    zoomControl: true,
};

const LocationPicker = ({ onSelect }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [marker, setMarker] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);

    const onMapClick = useCallback((event) => {
        setMarker({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        });
        onSelect({
            latitude: event.latLng.lat(),
            longitude: event.latLng.lng(),
            address: '',
        });
    }, [onSelect]);

    const onLoad = useCallback((map) => {
        // You can store the map instance if needed
    }, []);

    const onAutocompleteLoad = (autoC) => {
        setAutocomplete(autoC);
    };

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                setMarker({
                    lat,
                    lng,
                });
                onSelect({
                    latitude: lat,
                    longitude: lng,
                    address: place.formatted_address,
                });
            }
        } else {
            console.log('Autocomplete is not loaded yet!');
        }
    };

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps</div>;

    return (
        <div className="location-picker">
            <Autocomplete
                onLoad={onAutocompleteLoad}
                onPlaceChanged={onPlaceChanged}
            >
                <input
                    type="text"
                    placeholder="Търсене на адрес"
                    className="form-control mb-3"
                />
            </Autocomplete>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={8}
                center={marker ? marker : center}
                options={options}
                onClick={onMapClick}
                onLoad={onLoad}
            >
                {marker && (
                    <Marker
                        position={{ lat: marker.lat, lng: marker.lng }}
                        draggable
                        onDragEnd={(event) => {
                            const newLat = event.latLng.lat();
                            const newLng = event.latLng.lng();
                            setMarker({
                                lat: newLat,
                                lng: newLng,
                            });
                            onSelect({
                                latitude: newLat,
                                longitude: newLng,
                                address: '',
                            });
                        }}
                    />
                )}
            </GoogleMap>
        </div>
    );
};

export default LocationPicker;
