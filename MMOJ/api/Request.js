import axios from "axios";

const API_HOST = process.env.PULPFREE_URL;

const getUrl = endpoint => API_HOST + endpoint;

export const post = async (endpoint, data) => {
  try {
    const url = getUrl(endpoint);
    return axios.post(url, data);
  } catch (e) {
    console.log("Something went wrong with the network");
  }
};

export const get = async endpoint => {
  try {
    const url = getUrl(endpoint);
    return axios.get(url);
  } catch (e) {
    console.log("Something went wrong with the network");
  }
};
