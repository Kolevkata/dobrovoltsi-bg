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
const center = {
    lat: 42.6977,
    lng: 23.3219,
};
const options = {
    disableDefaultUI: false,
    zoomControl: true,
};

const InitiativesMap = () => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [initiatives, setInitiatives] = useState([]);
    const [selectedInitiative, setSelectedInitiative] = useState(null);

    useEffect(() => {
        const fetchInitiatives = async () => {
            try {
                const res = await axios.get('/initiatives');
                setInitiatives(res.data.filter(i => i.latitude && i.longitude));
            } catch (err) {
                console.error(err);
            }
        };
        fetchInitiatives();
    }, []);

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps</div>;

    return (
        <div className="initiatives-map">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={8}
                center={center}
                options={options}
            >
                {initiatives.map((initiative) => (
                    <Marker
                        key={initiative.id}
                        position={{ lat: initiative.latitude, lng: initiative.longitude }}
                        onClick={() => {
                            setSelectedInitiative(initiative);
                        }}
                    />
                ))}

                {selectedInitiative && (
                    <InfoWindow
                        position={{ lat: selectedInitiative.latitude, lng: selectedInitiative.longitude }}
                        onCloseClick={() => {
                            setSelectedInitiative(null);
                        }}
                    >
                        <div>
                            <h5>{selectedInitiative.title}</h5>
                            <p>{selectedInitiative.description.substring(0, 100)}...</p>
                            <a href={`/initiatives/${selectedInitiative.id}`} className="btn btn-sm btn-primary">
                                Виж повече
                            </a>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
};

export default InitiativesMap;
