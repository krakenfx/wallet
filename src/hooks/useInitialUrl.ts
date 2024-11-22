import { useEffect, useState } from 'react';
import { Linking } from 'react-native';

export const useInitialUrl = () => {
  const [initialUrl, setInitialUrl] = useState<string | null>(null);
  const [processingInitialUrl, setProcessingInitialUrl] = useState(true);

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();

      setProcessingInitialUrl(false);
      setInitialUrl(initialUrl);
    };

    getUrlAsync();
  }, []);

  return { initialUrl, processingInitialUrl };
};
