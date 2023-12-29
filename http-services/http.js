import axios from "axios";
export const ApiUrl = "https://main-app.liara.run";
export const FrontEndUrl = "http://localhost:3000";

axios.defaults.baseURL = ApiUrl;

export const http = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  patch: axios.patch,
};
