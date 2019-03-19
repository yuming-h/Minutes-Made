const env = process.env.NODE_ENV || "local";

const local = {
  app: {
    port: 8080
  },
  db: {
    user: "app",
    host: "minutes-made.cvt0ckrxsc9j.us-east-2.rds.amazonaws.com",
    database: "Minutes",
    password: "oZqs94JrzUTwc5l5hcA5",
    port: 5432
  },
  tokenSecret:
    "thisIsJustATestForLocalDon-tActuallyUseHardCodedKeyLikeThis10203ButIt'sPrettyLongSoMightBeOkHeHeXd"
};

const dev = {
  app: {
    port: 8080
  },
  db: {
    user: "app",
    host: "minutes-made.cvt0ckrxsc9j.us-east-2.rds.amazonaws.com",
    database: "Minutes",
    password: "oZqs94JrzUTwc5l5hcA5",
    port: 5432
  },
  tokenSecret:
    "thisIsJustATestForLocalDon-tActuallyUseHardCodedKeyLikeThis10203ButIt'sPrettyLongSoMightBeOkHeHeXd"
};

const production = {
  app: {
    port: 8080
  },
  //Account and db not initialized yet.  Initialize when we create a prod deployment
  db: {
    user: "ProdMinutes",
    host: "minutes-made.cvt0ckrxsc9j.us-east-2.rds.amazonaws.com",
    database: "Minutes-Prod",
    password: process.env.DB_PASS,
    port: 5432
  },
  tokenSecret: process.env.JWT_SECRET_PROD
};

const config = {
  local,
  dev,
  production
};

module.exports = config[env];
