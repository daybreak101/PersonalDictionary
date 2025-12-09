import "dotenv/config";

export default {
  expo: {
    name: "PersonalDictionary",
    slug: "PersonalDictionary",
    version: "1.0.0",
    android: {
      package: "com.anonymous.PersonalDictionary",
    },
    plugins: ["expo-sqlite", "expo-asset"],
  },
};
