import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};

const ThemeProvider = ({ children }) => {
  const [themeObject, setThemeObject] = useState({});
  const [themeValue, setThemeValue] = useState("Default");
  const [darkMode, setDarkMode] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [screenReader, setScreenReader] = useState(false);

  const [textColor, setTextColor] = useState("black");
  const [backgroundColor, setBackgroundColor] = useState("white");
  const setTheme = async (value) => {
    setThemeValue(value);
    switch (value) {
      case "Default":
        setThemeObject({
          gradientColor1: "#ffffffba",
          gradientColor2: "#edededa9",
          unfocusColor: "#000000ff",
          focusColor: "#9f9f9fff",
          fadeColor1: "#ffffffff",
          fadeColor2: "#ffffff01",
        });
        break;
      case "Iridescent":
        setThemeObject({
          gradientColor1: "#ffffff46",
          gradientColor2: "#00eaffa9",
          unfocusColor: "#ab9fffff",
          focusColor: "#e6fcff",
          fadeColor1: "#ffffff92",
          fadeColor2: "#ffffff01",
        });
        break;
      case "Soft Pearl":
        setThemeObject({
          gradientColor1: "#cfc7fb46",
          gradientColor2: "#e2c6eea9",
          unfocusColor: "#ced9ef",
          focusColor: "#f0a4d0ff",
          fadeColor1: "#d7e9dc92",
          fadeColor2: "#ffffff01",
        });
        break;
      case "Prism":
        setThemeObject({
          gradientColor1: "#d7c9ff66",
          gradientColor2: "#c6f2ffaa",
          unfocusColor: "#cedff6",
          focusColor: "#f7b2ff",
          fadeColor1: "#dfffe492",
          fadeColor2: "#ffffff05",
        });
        break;
      case "Comet":
        setThemeObject({
          gradientColor1: "#ffffff72",
          gradientColor2: "#0195f1aa",
          unfocusColor: "#1d1640ff",
          focusColor: "#ffffffff",
          fadeColor1: "#ffffffff",
          fadeColor2: "rgba(35, 213, 253, 0.03)",
        });
        break;
      case "Monochrome":
        setThemeObject({
          gradientColor1: "#9ba8ae72",
          gradientColor2: "#a9b8c2ff",
          unfocusColor: "#707a7eff",
          focusColor: "#bccad0",
          fadeColor1: "#e3e8ea",
          fadeColor2: "rgba(0, 0, 0, 0.03)",
        });
        break;
    }
  };

  const getSavedSettings = async () => {
    const jsonValue = await AsyncStorage.getItem("settings");

    if (!jsonValue) {
      setTheme("Default");
      setThemeValue("Default");
      return;
    }

    const settings = JSON.parse(jsonValue);
    const theme = settings.themeValue ?? "Default";
    setThemeValue(theme);
    setTheme(theme);
    setHapticFeedback(settings.hapticFeedback ?? true);
    setDarkMode(settings.darkMode ?? false);
    setScreenReader(settings.screenReader ?? false);
    setBackgroundColor(settings.darkMode ? "#262626ff" : "white");
    setTextColor(settings.darkMode ? "white" : "black");
  };

  useEffect(() => {
    getSavedSettings();
  }, []);

  useEffect(() => {
    saveSettings();
  }, [themeValue, darkMode, hapticFeedback, screenReader]);

  useEffect(() => {
    setBackgroundColor(darkMode ? "#262626ff" : "white");
    setTextColor(darkMode ? "white" : "black");
  }, [darkMode]);

  const saveSettings = async () => {
    try {
      let settings = {
        hapticFeedback: hapticFeedback,
        themeValue: themeValue,
        darkMode: darkMode,
        screenReader: screenReader,
      };
      await AsyncStorage.setItem("settings", JSON.stringify(settings));
    } catch (error) {
      console.log("Error saving item:", error);
    }
  };

  const value = {
    themeObject,
    setTheme,
    themeValue,
    setThemeValue,
    textColor,
    backgroundColor,
    darkMode,
    setDarkMode,
    hapticFeedback,
    setHapticFeedback,
    screenReader,
    setScreenReader,
    saveSettings,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
