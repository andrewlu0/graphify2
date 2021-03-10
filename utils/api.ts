import axios from "axios";

export const get = async (url, endpoint, config) => {
  const result = await axios.get(url + endpoint, config);
  return result.data;
}