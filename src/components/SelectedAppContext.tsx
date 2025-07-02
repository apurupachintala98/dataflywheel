import React, { createContext, useContext, useState, ReactNode } from "react";

interface DbDetails {
  database_nm: string;
  schema_nm: string;
}

interface SelectedAppContextType {
  selectedAppId: string;
  setSelectedAppId: (id: string) => void;
  dbDetails: DbDetails;
   setDbDetails: React.Dispatch<React.SetStateAction<DbDetails>>;
}


const SelectedAppContext = createContext<SelectedAppContextType | undefined>(undefined);

export const SelectedAppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAppId, _setSelectedAppId] = useState("");
const [dbDetails, setDbDetails] = useState<DbDetails>({ database_nm: "", schema_nm: "" });

  const setSelectedAppId = (id: string) => {
    // const lowercaseId = id?.trim().toLowerCase(); 
    // _setSelectedAppId(lowercaseId);
    _setSelectedAppId(id?.trim());
  };

  return (
    <SelectedAppContext.Provider value={{ selectedAppId, setSelectedAppId, dbDetails, setDbDetails }}>
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
