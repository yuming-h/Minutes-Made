const conf = require("../config/config");
const axios = require("axios");

/**
 * Forms the container information given a meetingId
 * @param Int meetingId
 */
const GetContainerInfo = meetingId => {
  const meetingManagerDockerDomain = conf.meetingManagerDockerDomain;
  const meetingManagerDomain = conf.meetingManagerDomain;
  const containerHostName = "mm-meeting-" + meetingId;
  const containerUrl = meetingManagerDomain + "/" + containerHostName + ":5000";

  return {
    meetingManagerDockerDomain: meetingManagerDockerDomain,
    meetingManagerDomain: meetingManagerDomain,
    containerHostName: containerHostName,
    containerUrl: containerUrl
  };
};

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
    const res = await axios.post(conf.koolaidDomain + "/meetings/create", {
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
      Env: ["MM_MEETING_ID=" + meetingInfo.meetingId, "MM_ENV=" + conf.env],
      NetworkingConfig: {
        EndpointsConfig: {
          meetingmanager_404_net: {
            Aliases: [containerInfo.containerHostName]
          }
        }
      },
      HostConfig: {
        Mounts: [
          {
            Type: "volume",
            Source: "meetingmanager_404-static-volume",
            Target: "/usr/mm/mm404/static",
            ReadOnly: false
          }
        ]
      }
    };
    const createRes = await axios.post(
      containerInfo.meetingManagerDockerDomain + "/containers/create ",
      dockerEnginePayload
    );
    const containerId = createRes.data.Id;

    // Write the containerId into the database
    await axios.post(conf.koolaidDomain + "/meetings/containerid", {
      meetingId: meetingInfo.meetingId,
      containerId: containerId
    });

    // Return the meeting information
    console.log("Meeting created with id: " + containerInfo.containerHostName);
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
    const res = await axios.get(conf.koolaidDomain + "/meetings/containerid", {
      data: {
        meetingId: body.meetingId
      }
    });
    const containerId = res.data.containerId;

    // Start the 404 Container
    await axios.post(
      containerInfo.meetingManagerDockerDomain +
        "/containers/" +
        containerId +
        "/start"
    );

    // Set the meeting as active
    await axios.put(conf.koolaidDomain + "/meetings/active", {
      meetingId: body.meetingId,
      active: true
    });

    // Set the start time of the meeting
    const d = new Date();
    const epochSeconds = Math.round(d.getTime() / 1000);
    await axios.put(conf.koolaidDomain + "/meetings/starttime", {
      meetingId: body.meetingId,
      starttime: epochSeconds
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
      meetingUrl: containerInfo.containerUrl + "/"
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
      meetingUrl: containerInfo.containerUrl + "/"
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

    // Check that the meeting has not already been finished
    const activeRes = await axios.get(conf.koolaidDomain + "/meetings/active", {
      data: {
        meetingId: body.meetingId
      }
    });
    if (activeRes.data.active === false) {
      throw new Error("Meeting already finished, can't finish again.");
    }

    // Send the finish meeting signal
    await axios.get(containerInfo.containerUrl + "/finish-meeting");

    // Set the meeting as inactive
    await axios.put(conf.koolaidDomain + "/meetings/active", {
      meetingId: body.meetingId,
      active: false
    });

    // Set the end time of the meeting
    const d = new Date();
    const epochSeconds = Math.round(d.getTime() / 1000);
    await axios.put(conf.koolaidDomain + "/meetings/endtime", {
      meetingId: body.meetingId,
      endtime: epochSeconds
    });

    // Return the meeting information
    console.log("Sent finish meeting signal to " + containerInfo.containerUrl);
    return { success: true };
  } catch (e) {
    console.log(e);
    throw new Error("Error finishing meeting, please try again.");
  }
};

module.exports = {
  schedule,
  start,
  connect,
  finish
};
