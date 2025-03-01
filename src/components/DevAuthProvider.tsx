import React, { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { userPhotoAtom } from '../atoms/userAtom';

interface DevAuthProviderProps {
  children: React.ReactNode;
}

export const DevAuthProvider: React.FC<DevAuthProviderProps> = ({ children }) => {
  const setUserPhotoAtom = useSetAtom(userPhotoAtom);

  useEffect(() => {
    // Set a default user photo in development
    setUserPhotoAtom('https://source.unsplash.com/random/100x100?avatar');
  }, [setUserPhotoAtom]);

  return <>{children}</>;
};
