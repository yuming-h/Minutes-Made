const { hashPass } = require("../utils/hashPass");
const conf = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");

/**
 * Spawns 404 meeting container to start the meeting
 * body: {
 *  meetingStart: UTC Epoch Timestamp,
 *  meetingEnd: UTC Epoch Timestamp,
 *  host: user_in_org_id
 * }
 * @param Object body
 */
const create = async body => {
  // Spawn the 404 Meeting instance
  try {
    const meetingManagerDomain = "http://mm404manager:5000";

    // Make the request to write to the db writer server
    const res = await axios.post("http://mmkoolaid:5050/meeting/create", {
      meeting_start: body.meetingStart,
      meeting_end: body.metingEnd,
      host_id: body.host
    });

    // Get the meeting information back from the db writer service
    const meetingInfo = res.data;
    const meetingHostName = "mm-meeting-" + meetingInfo.meetingId;
    const containerUrl = meetingManagerDomain + "/" + meetingHostName;

    // Make the request to the 404-Manager to create the 404 Container
    const dockerEnginePayload = {
      Hostname: meetingHostName,
      Domainname: meetingHostName,
      Image: "docker.minutesmade.com/mm404:latest",
      NetworkingConfig: {
        EndpointsConfig: {
          mm_404_net: {}
        }
      }
    };
    const createRes = await axios.post(
      meetingManagerDomain + "/containers/create ",
      dockerEnginePayload
    );

    // Start the 404 Container
    const containerId = createRes.data.Id;
    const startRes = await axios.post(
      meetingManagerDomain + "/containers/" + containerId + "/start"
    );

    // Return the meeting information
    console.log("Meeting started with hotname: " + meetingHostName);
    return {
      meetingId: meetingInfo.meetingId,
      meetingUrl: containerUrl
    };
  } catch (e) {
    console.log(e);
    throw new Error("Error creating meeting, please try again.");
  }
};

const connect = null;
const end = null;

module.exports = {
  create,
  connect,
  end
};
