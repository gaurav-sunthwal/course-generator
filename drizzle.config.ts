import './envConfig.ts'

const config = {
  schema: "./api/utlis/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DRIZZLE_DB_URL!,
  },
};

export default config;
