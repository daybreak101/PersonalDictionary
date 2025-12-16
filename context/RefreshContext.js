import { createContext, useContext, useState, useMemo } from "react";

const RefreshContext = createContext(null);

export const useRefresh = () => {
  const ctx = useContext(RefreshContext);
  if (!ctx) throw new Error("useNotif must be used inside NotifProvider");
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
