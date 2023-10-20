import axios from "axios";
export const ApiUrl = "http://localhost:8000";

axios.defaults.baseURL = ApiUrl;

export const http = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  patch: axios.patch,
};
