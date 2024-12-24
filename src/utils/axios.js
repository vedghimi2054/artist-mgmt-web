import axios from 'axios';

export const baseUrl = process.env.REACT_APP_API_BASE_URL
export const getAuthToken = () => {
  const userJson= localStorage.getItem("user");
  const user = JSON.parse(userJson);
  return user?.token;

}
const axiosClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization':'Bearer '+ getAuthToken()

  },
});

export default axiosClient;
