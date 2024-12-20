// /src/components/InitiativesMap.js
import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import axios from 'axios';
import './InitiativesMap.css';

const libraries = ['places'];
const mapContainerStyle = {
    width: '100%',
    height: '600px',
};
const defaultCenter = {
    lat: 42.6977,
    lng: 23.3219,
};
const options = {
    disableDefaultUI: false,
    zoomControl: true,
};

const InitiativesMap = ({ initiatives: propInitiatives }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [initiatives, setInitiatives] = useState([]);
    const [selectedInitiative, setSelectedInitiative] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (propInitiatives && propInitiatives.length > 0) {
                setInitiatives(propInitiatives);
            } else {
                try {
                    const res = await axios.get('/initiatives');
                    setInitiatives(res.data);
                } catch (err) {
                    console.error('Error fetching initiatives:', err);
                    setInitiatives([]);
                }
            }
        };
        fetchData();
    }, [propInitiatives]);

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    // Prepare initiatives
    const preparedInitiatives = initiatives.map((i) => {
        let lat = i.latitude;
        let lng = i.longitude;

        // Ensure latitude and longitude are numbers
        if (typeof lat === 'string') {
            lat = parseFloat(lat.replace(',', '.'));
        }
        if (typeof lng === 'string') {
            lng = parseFloat(lng.replace(',', '.'));
        }

        // If invalid, fallback to default
        if (isNaN(lat) || isNaN(lng)) {
            lat = defaultCenter.lat;
            lng = defaultCenter.lng;
        }

        return { ...i, latitude: lat, longitude: lng };
    });

    let mapCenter = defaultCenter;

    // If only one initiative is provided, we force display a pin,
    // even if the coordinates are invalid, by defaulting to defaultCenter.
    if (preparedInitiatives.length === 1) {
        mapCenter = {
            lat: preparedInitiatives[0].latitude || defaultCenter.lat,
            lng: preparedInitiatives[0].longitude || defaultCenter.lng,
        };
    } else if (preparedInitiatives.length > 1) {
        // If multiple, find the first valid coords
        const firstValid = preparedInitiatives.find(
            (i) => i.latitude !== defaultCenter.lat || i.longitude !== defaultCenter.lng
        );
        mapCenter = firstValid
            ? { lat: firstValid.latitude, lng: firstValid.longitude }
            : defaultCenter;
    }

    return (
        <div className="initiatives-map">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={12}
                center={mapCenter}
                options={options}
            >
                {preparedInitiatives.length === 1 ? (
                    // Force a single pin in the detail page scenario
                    <Marker
                        position={{ lat: mapCenter.lat, lng: mapCenter.lng }}
                        onClick={() => setSelectedInitiative(preparedInitiatives[0])}
                    />
                ) : (
                    // Otherwise render markers for all initiatives
                    preparedInitiatives.map((initiative, index) => (
                        <Marker
                            key={initiative.id || index}
                            position={{ lat: initiative.latitude, lng: initiative.longitude }}
                            onClick={() => setSelectedInitiative(initiative)}
                        />
                    ))
                )}

                {selectedInitiative && (
                    <InfoWindow
                        position={{ lat: selectedInitiative.latitude, lng: selectedInitiative.longitude }}
                        onCloseClick={() => setSelectedInitiative(null)}
                    >
                        <div style={{ maxWidth: '200px' }}>
                            {selectedInitiative.imageUrl && (
                                <img
                                    src={selectedInitiative.imageUrl}
                                    alt={selectedInitiative.title || 'Инициатива'}
                                    style={{
                                        width: '100%',
                                        height: '100px',
                                        objectFit: 'cover',
                                        borderRadius: '4px',
                                        marginBottom: '8px'
                                    }}
                                />
                            )}
                            <h6>{selectedInitiative.title}</h6>
                            <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}>
                                {(selectedInitiative.description || '').substring(0, 80)}...
                            </p>
                            {selectedInitiative.id && (
                                <a href={`/initiatives/${selectedInitiative.id}`} className="btn btn-sm btn-primary">
                                    Виж повече
                                </a>
                            )}
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
};

export default InitiativesMap;
