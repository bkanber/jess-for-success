import React, { useEffect, useState } from 'react';
import { Image as RNImage, ActivityIndicator } from 'react-native';
import { useAuth } from '@/components/useAuth';

/**
 * Usage: <Image imageId="abc123" ...otherImageProps />
 * If imageId is not provided, falls back to normal Image behavior.
 */
export default function Image({ imageId, imageWidth=50, ...props }) {
    const { fetch } = useAuth();
    const [uri, setUri] = useState(null);
    const [loading, setLoading] = useState(!!imageId);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        if (!imageId) return;
        setLoading(true);
        setError(null);
        fetch(`http://localhost:7777/api/images/${imageId}/data?width=${imageWidth}`)
            .then(async res => {
                if (!res.ok) throw new Error(await res.text() || 'Failed to fetch image');
                return res.blob();
            })
            .then(blob => {
                if (isMounted) setUri(URL.createObjectURL(blob));
            })
            .catch(err => {
                if (isMounted) setError(err.message);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });
        return () => { isMounted = false; };
    }, [imageId, fetch]);

    if (loading) return <ActivityIndicator />;
    if (error) return null;
    if (imageId && uri) return <RNImage {...props} source={{ uri }} />;
    return <RNImage {...props} />;
}

