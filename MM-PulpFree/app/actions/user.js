const axios = require("axios");
const conf = require("../config/config");
const ErrorCodes = require("../error/ErrorCodes");
const KnownError = require("../error/KnownError");

const meetings = async params => {
  try {
    const userId = params.userId;

    const meetingMetas = await axios
      .get(conf.koolaidDomain + `/users/${userId}/meetings`)
      .catch(err => {
        if (err.response && err.response.status == 404) {
          throw new KnownError("Cannot find user", ErrorCodes.USER.NOT_FOUND);
        } else {
          throw err;
        }
      });

    return meetingMetas.data;
  } catch (e) {
    if (e instanceof KnownError) {
      throw e;
    }
    console.log(e);
    throw new Error("Error fetching metadata, please try again later");
  }
};

module.exports = {
  meetings
};
