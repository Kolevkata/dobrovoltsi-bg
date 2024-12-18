// /src/contexts/LoadingContext.js
import React, { createContext, useState, useEffect } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';

export const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingCount, setLoadingCount] = useState(0);
    const [minimumDelay, setMinimumDelay] = useState(null);

    const startLoading = () => {
        setLoadingCount((prev) => prev + 1);
    };

    const stopLoading = () => {
        setLoadingCount((prev) => Math.max(prev - 1, 0));
    };

    useEffect(() => {
        if (loadingCount > 0) {
            if (!isLoading) {
                setIsLoading(true);
                setMinimumDelay(Date.now());
            }
        } else {
            if (isLoading) {
                const elapsed = Date.now() - minimumDelay;
                const randomDelay = Math.random() * (1000 - 100) + 100; 
                const remaining = randomDelay - elapsed;

                if (remaining > 0) {
                    const timer = setTimeout(() => {
                        setIsLoading(false);
                    }, remaining);
                    return () => clearTimeout(timer);
                } else {
                    setIsLoading(false);
                }
            }
        }
    }, [loadingCount, isLoading, minimumDelay]);

    return (
        <LoadingContext.Provider value={{ startLoading, stopLoading }}>
            {children}
            <LoadingOverlay isLoading={isLoading} />
        </LoadingContext.Provider>
    );
};
