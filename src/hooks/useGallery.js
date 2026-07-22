import { useState, useCallback } from 'react';
import { galleryService } from '../services/galleryService';

export const useGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGallery = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await galleryService.getGallery();
      setGallery(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addImage = async (imageData) => {
    try {
      await galleryService.addImage(imageData);
      await fetchGallery();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const deleteImage = async (id) => {
    try {
      await galleryService.deleteImage(id);
      await fetchGallery();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const updateImageShape = async (id, gridShape, objectPosition = '50% 50%') => {
    try {
      await galleryService.updateImage(id, { gridShape, objectPosition });
      await fetchGallery();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return {
    gallery,
    isLoading,
    error,
    fetchGallery,
    addImage,
    updateImageShape,
    deleteImage
  };
};
