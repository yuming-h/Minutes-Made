import axios from "axios";

const API_HOST = process.env.BACKEND_URL;

const getUrl = endpoint => API_HOST + endpoint;

export const post = async (endpoint, data, jwt) => {
  const headers = jwt
  ? {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` }
    }
  : {headers: { 'Content-Type': 'application/json' }}
  return axios.post(getUrl(endpoint), data, headers);
};

export const get = async (endpoint, jwt) => {
  const headers = jwt
    ? {
        headers: { Authorization: `Bearer ${jwt}` }
      }
    : null;
  return axios.get(getUrl(endpoint), headers);
};