import "dotenv/config";

export default {
  expo: {
    name: "PersonalDictionary",
    slug: "PersonalDictionary",
    version: "1.0.0",
    android: {
      package: "com.anonymous.PersonalDictionary",
    },
    plugins: ["expo-asset", "expo-audio"],
  },
};
