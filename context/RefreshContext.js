import { createContext, useContext, useState, useMemo } from "react";

//refresh context is responsible to reload a screen based on certain scenarios
//This may be done several layers deep, and may be done across different navigation tabs/screens
const RefreshContext = createContext(null);

export const useRefresh = () => {
  const ctx = useContext(RefreshContext);
  if (!ctx) throw new Error("useRefresh must be used inside RefreshProvider");
  return ctx;
};

const RefreshProvider = ({ children }) => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const value = useMemo(
    () => ({
      refreshFlag, setRefreshFlag
    }),
    [refreshFlag]
  );

  return (
    <RefreshContext.Provider value={value}>
      {children}
    </RefreshContext.Provider>
  );
};

export { RefreshContext, RefreshProvider };
