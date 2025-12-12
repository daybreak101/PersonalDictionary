import { createContext, useContext, useState, useMemo } from "react";

const ThemeContext = createContext(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};

const ThemeProvider = ({ children }) => {
  const [gradientColor1, setGradientColor1] = useState("#ffffffba");
  const [gradientColor2, setGradientColor2] = useState("#ffffffa9");
  const [unfocusColor, setUnfocusColor] = useState("#000000ff");
  const [focusColor, setFocusColor] = useState("#ffffffff");
  const [fadeColor1, setFadeColor1] = useState("#ffffffff");
  const [fadeColor2, setFadeColor2] = useState("#ffffff01");
  const [themeValue, setThemeValue] = useState("Default");
  const [darkMode, setDarkMode] = useState(false);

  const [textColor, setTextColor] = useState("black");
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [moduleColor, setModuleColor] = useState("lightgray");

  const setTheme = (value) => {
    switch (value) {
      case "Default":
        setGradientColor1("#ffffffba");
        setGradientColor2("#ffffffa9");
        setUnfocusColor("#000000ff");
        setFocusColor("#ffffffff");
        setFadeColor1("#ffffffff");
        setFadeColor2("#ffffff01");
        break;
      case "Iridescent":
        setGradientColor1("#ffffff46");
        setGradientColor2("#00eaffa9");
        setUnfocusColor("#ab9fffff");
        setFocusColor("#e6fcff");
        setFadeColor1("#ffffff92");
        setFadeColor2("#ffffff01");
        break;
      case "Soft Pearl":
        setGradientColor1("#cfc7fb46");
        setGradientColor2("#e2c6eea9");
        setUnfocusColor("#ced9ef");
        setFocusColor("#f0a4d0ff");
        setFadeColor1("#d7e9dc92");
        setFadeColor2("#ffffff01");
        break;
      case "Prism":
        setGradientColor1("#d7c9ff66");
        setGradientColor2("#c6f2ffaa");
        setUnfocusColor("#cedff6");
        setFocusColor("#f7b2ff");
        setFadeColor1("#dfffe492");
        setFadeColor2("#ffffff05");
        break;
      case "Comet":
        setGradientColor1("#ffffff72");
        setGradientColor2("#0195f1aa");
        setUnfocusColor("#1d1640ff");
        setFocusColor("#ffffffff");
        setFadeColor1("#ffffffff");
        setFadeColor2("rgba(35, 213, 253, 0.03)");
        break;
      case "Monochrome":
        setGradientColor1("#9ba8ae72");
        setGradientColor2("#4950540c");
        setUnfocusColor("#707a7eff");
        setFocusColor("#bccad0");
        setFadeColor1("#e3e8ea");
        setFadeColor2("rgba(0, 0, 0, 0.03)");
        break;
    }
  };

  const toggleDarkMode = () => {
    //better to update darkMode after since state change isn't immediate
    setBackgroundColor(darkMode ? "white" : "#262626ff");
    setTextColor(darkMode ? "black" : "white");
    setDarkMode((prev) => !prev);
  };

  const value = useMemo(
    () => ({
      gradientColor1,
      gradientColor2,
      focusColor,
      unfocusColor,
      textColor,
      backgroundColor,
      fadeColor1,
      fadeColor2,
      setTheme,
      themeValue,
      setThemeValue,
      moduleColor,
      darkMode,
      toggleDarkMode,
    }),
    [
      gradientColor1,
      gradientColor2,
      focusColor,
      unfocusColor,
      textColor,
      backgroundColor,
      fadeColor1,
      fadeColor2,
      themeValue,
      moduleColor,
      darkMode,
    ]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
