// SelectedAppContext.tsx
import React, { createContext, useContext, useState } from "react";

export const SelectedAppContext = createContext<{
  selectedAppId: string;
  setSelectedAppId: (id: string) => void;
}>({
  selectedAppId: '',
  setSelectedAppId: () => {},
});

export const SelectedAppProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedAppId, setSelectedAppId] = useState('');
  return (
    <SelectedAppContext.Provider value={{ selectedAppId, setSelectedAppId }}>
      {children}
    </SelectedAppContext.Provider>
  );
};

export const useSelectedApp = () => useContext(SelectedAppContext);
