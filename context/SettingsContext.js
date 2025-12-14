import { createContext, useContext, useState, useMemo } from "react";
import RNHapticFeedback from "react-native-haptic-feedback";

const SettingsContext = createContext(null);

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside NotifProvider");
  return ctx;
};

const SettingsProvider = ({ children }) => {
  const [hapticFeedback, setHapticFeedback] = useState(true)

  const value = useMemo(
    () => ({
        hapticFeedback, setHapticFeedback
    }), [hapticFeedback]
  )
};

export { SettingsContext, SettingsProvider };
