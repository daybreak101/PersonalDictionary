import "dotenv/config";

export default {
  expo: {
    name: "PersonalDictionary",
    slug: "PersonalDictionary",
    version: "1.0.0",
    android: {
      package: "com.anonymous.PersonalDictionary",
    },
    extra: {
      API_NINJAS_KEY: process.env.API_NINJAS_KEY,
    },
  },
};
