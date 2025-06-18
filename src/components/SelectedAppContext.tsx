import React, { createContext, useContext, useState, ReactNode } from "react";

interface SelectedAppContextType {
  selectedAppId: string;
  setSelectedAppId: (id: string) => void;
}

const SelectedAppContext = createContext<SelectedAppContextType | undefined>(undefined);

export const SelectedAppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAppId, _setSelectedAppId] = useState("");

  const setSelectedAppId = (id: string) => {
    // const lowercaseId = id?.trim().toLowerCase(); 
    // _setSelectedAppId(lowercaseId);
    _setSelectedAppId(id?.trim());
  };

  return (
    <SelectedAppContext.Provider value={{ selectedAppId, setSelectedAppId }}>
      {children}
    </SelectedAppContext.Provider>
  );
};

export const useSelectedApp = (): SelectedAppContextType => {
  const context = useContext(SelectedAppContext);
  if (!context) {
    throw new Error("useSelectedApp must be used within a SelectedAppProvider");
  }
  return context;
};
