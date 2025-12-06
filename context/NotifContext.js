import { createContext, useContext, useState, useMemo } from "react";

const NotifContext = createContext(null);

export const useNotif = () => {
  const ctx = useContext(NotifContext);
  if (!ctx) throw new Error("useNotif must be used inside NotifProvider");
  return ctx;
};

const NotifProvider = ({ children }) => {
  const [notifVisible, setNotifVisible] = useState(false);
  const [notifDesc, setNotifDesc] = useState("")

  const value = useMemo(
    () => ({
      notifVisible,
      setNotifVisible,
      notifDesc,
      setNotifDesc
    }),
    [notifVisible, notifDesc]
  );

  return (
    <NotifContext.Provider value={value}>
      {children}
    </NotifContext.Provider>
  );
};

export { NotifContext, NotifProvider };
