const env = process.env.NODE_ENV || "local";

const local = {
  env: env,
  app: {
    port: 8080
  },
  meetingManagerDockerDomain: "http://192.168.1.86:2375",
  meetingManagerDomain: "http://192.168.1.86:5001",
  koolaidDomain: "http://mmkoolaid:5050",
  tokenSecret:
    "thisIsJustATestForLocalDon-tActuallyUseHardCodedKeyLikeThis10203ButIt'sPrettyLongSoMightBeOkHeHeXd"
};

const dev = {
  env: env,
  app: {
    port: 8080
  },
  meetingManagerDockerDomain: "http://mm404manager:2375",
  meetingManagerDomain: "http://mm404manager:5000",
  koolaidDomain: "http://mmkoolaid:5050",
  tokenSecret:
    "thisIsJustATestForLocalDon-tActuallyUseHardCodedKeyLikeThis10203ButIt'sPrettyLongSoMightBeOkHeHeXd"
};

const production = {
  env: env,
  app: {
    port: 8080
  },
  meetingManagerDockerDomain: "http://mm404manager:2375",
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
