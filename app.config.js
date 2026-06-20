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
    extra: {
      eas: {
        projectId: "2e0861a2-6192-4e27-800d-e3d8b90ddeb8",
      },
    },
  },
};
