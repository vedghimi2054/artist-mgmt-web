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

axiosClient.interceptors.response.use((response) => {
 return response;
}, (error) => {
  if(error.status === 401) {
       window.location.replace("/login")
  }  
  if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
  }
  return Promise.reject(error.message);
});

export default axiosClient;
