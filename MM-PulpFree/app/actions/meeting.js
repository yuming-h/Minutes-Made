const { hashPass } = require("../utils/hashPass");
const conf = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");

/**
 * Forms the container information given a meetingId
 * @param Int meetingId
 */
function GetContainerInfo(meetingId) {
  const meetingManagerDomain = "http://mm404manager:5000";
  const containerHostName = "mm-meeting-" + meetingInfo.meetingId;
  const containerUrl = meetingManagerDomain + "/" + containerHostName;

  return {
    meetingManagerDomain: meetingManagerDomain,
    containerHostName: containerHostName,
    containerUrl: containerUrl
  };
}

/**
 * Creates a meeting and preps a 404 container instance to use with it
 * body: {
 *  scheduledMeetingStart: UTC Epoch Timestamp,
 *  scheduledMeetingEnd: UTC Epoch Timestamp,
 *  host: user_id,
 *  org: org_id
 * }
 * @param Object body
 */
const schedule = async body => {
  try {
    // Make the request to write to the db writer server
    const res = await axios.post("http://mmkoolaid:5050/meetings/create", {
      scheduled_meeting_start: body.scheduledMeetingStart,
      scheduled_meeting_end: body.scheduledMeetingEnd,
      host_id: body.host,
      org_id: body.org
    });

    // Get the meeting information back from the db writer service
    const meetingInfo = res.data;
    const containerInfo = GetContainerInfo(meetingInfo.meetingId);

    // Make the request to the 404-Manager to create the 404 Container
    const dockerEnginePayload = {
      Hostname: containerInfo.containerHostName,
      Domainname: containerInfo.containerHostName,
      Image: "docker.minutesmade.com/mm404:latest",
      NetworkingConfig: {
        EndpointsConfig: {
          mm_404_net: {}
        }
      }
    };
    const createRes = await axios.post(
      containerInfo.meetingManagerDomain + "/containers/create ",
      dockerEnginePayload
    );
    const containerId = createRes.data.Id;

    // Write the containerId into the database
    await axios.post("http://mmkoolaid:5050/meetings/containerid", {
      meetingId: meetingInfo.meetingId,
      containerId: containerId
    });

    // Return the meeting information
    console.log("Meeting created with id: " + ontainerInfo.containerHostName);
    return {
      meetingId: meetingInfo.meetingId
    };
  } catch (e) {
    console.log(e);
    throw new Error("Error creating meeting, please try again.");
  }
};

/**
 * Starts the 404 container instance
 * body: {
 *  meetingId: Int
 * }
 * @param Object body
 */
const start = async body => {
  try {
    const containerInfo = GetContainerInfo(body.meetingId);

    // Get the container id from the database
    const res = await axios.get("http://mmkoolaid:5050/meetings/containerid", {
      meetingId: body.meetingId
    });
    const containerId = res.data.containerId;

    // Start the 404 Container
    await axios.post(
      containerInfo.meetingManagerDomain +
        "/containers/" +
        containerId +
        "/start"
    );

    // Set the meeting as active
    await axios.put("http://mmkoolaid:5050/meetings/active", {
      meetingId: body.meetingId,
      active: true
    });

    // Return the meeting information
    console.log(
      "Meeting " +
        containerInfo.containerHostName +
        " started at: " +
        containerInfo.containerUrl
    );
    return {
      meetingId: body.meetingId,
      meetingUrl: containerInfo.containerUrl
    };
  } catch (e) {
    console.log(e);
    throw new Error("Error starting meeting, please try again.");
  }
};

/**
 * Returns the container url given a meetingId
 * body: {
 *  meetingId: Int
 * }
 * @param Object body
 */
const connect = async body => {
  try {
    const containerInfo = GetContainerInfo(body.meetingId);

    return {
      meetingId: body.meetingId,
      meetingUrl: containerInfo.containerUrl
    };
  } catch (e) {
    console.log(e);
    throw new Error("Error finding meeting url, please try again.");
  }
};

/**
 * Triggers a 404 instance to do it's finishing actions, signaling the end of a meeting
 * body: {
 *  meetingId: Int
 * }
 * @param Object body
 */
const finish = async body => {
  try {
    const containerInfo = GetContainerInfo(body.meetingId);

    // Send the finish meeting signal
    const finishres = await axios.post(
      containerInfo.containerUrl + "/finish-meeting"
    );

    // Set the meeting as inactive
    await axios.put("http://mmkoolaid:5050/meetings/active", {
      meetingId: body.meetingId,
      active: false
    });

    // Return the meeting information
    console.log("Sent finish meeting signal to " + containerInfo.containerUrl);
    return { success: true };
  } catch (e) {
    console.log(e);
    throw new Error("Error finishing meeting, please try again.");
  }
};

/**
 * Deletes the 404 container, called by the 404 instance itself
 * body: {
 *  meetingId: Int
 * }
 * @param Object body
 */
const end = async body => {
  try {
    const containerInfo = GetContainerInfo(body.meetingId);

    // Check that the meeting has been sent the shutdown signal first
    const activeRes = await axios.get("http://mmkoolaid:5050/meetings/active", {
      meetingId: body.meetingId
    });
    if (activeRes.data.active === true) {
      throw new Error(
        "Cannot delete meeting in progress, please finish the meeting first."
      );
    }

    // Get the container id from the database
    const res = await axios.get("http://mmkoolaid:5050/meetings/containerid", {
      meetingId: body.meetingId
    });
    const containerId = res.data.containerId;

    // Delete the 404 Container
    await axios.delete(
      containerInfo.meetingManagerDomain + "/containers/" + containerId
    );

    // Return the meeting information
    console.log(containerInfo.containerHostName + " 404 container deleted");
    return { success: true };
  } catch (e) {
    console.log(e);
    throw new Error("Error ending meeting, please try again.");
  }
};

module.exports = {
  schedule,
  start,
  connect,
  finish,
  end
};
