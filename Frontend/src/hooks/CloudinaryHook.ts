import { useState } from 'react';
import apiClient from '../apiClient';

interface ImageData {
    img_URL: string;
    img_ID: string;
}

const useSaveImageData = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const saveImage = async (data: ImageData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiClient.post('/api/image/saveImage', data);
            console.log('Image saved to Cloudinary');
            return response.data.optimizeUrl;  // Ensure this line returns the URL from the server response
        } catch (err) {
            console.error('Error saving Image:', err);
            setError(`Failed to save Image: ${err}`);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { saveImage, loading, error };
};

export default useSaveImageData;
