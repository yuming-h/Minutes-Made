const env = process.env.NODE_ENV || "local";

const local = {
  app: {
    port: 8080
  },
  meetingManagerDomain: "http://mm404manager:5000",
  koolaidDomain: "http://mmkoolaid:5050",
  tokenSecret:
    "thisIsJustATestForLocalDon-tActuallyUseHardCodedKeyLikeThis10203ButIt'sPrettyLongSoMightBeOkHeHeXd"
};

const dev = {
  app: {
    port: 8080
  },
  meetingManagerDomain: "http://mm404manager:5000",
  koolaidDomain: "http://mmkoolaid:5050",
  tokenSecret:
    "thisIsJustATestForLocalDon-tActuallyUseHardCodedKeyLikeThis10203ButIt'sPrettyLongSoMightBeOkHeHeXd"
};

const production = {
  app: {
    port: 8080
  },
  meetingManagerDomain: "http://mm404manager:5000",
  koolaidDomain: "http://mmkoolaid:5050",
  tokenSecret: process.env.JWT_SECRET_PROD
};

const config = {
  local,
  dev,
  production
};

module.exports = config[env];
