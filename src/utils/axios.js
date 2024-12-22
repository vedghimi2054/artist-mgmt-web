import axios from 'axios';



console.log(process.env.REACT_APP_API_BASE_URL)

export const basrUrl = process.env.REACT_APP_API_BASE_URL
function getAuthToken(){
  const userJson= localStorage.getItem("user");
  const user = JSON.parse(userJson);
  return user?.token;

}
const axiosClient = axios.create({
  baseURL: basrUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization':'Bearer '+ getAuthToken()

  },
});

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger

    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response?.status === 401) {
      // clear token ...
      localStorage.removeItem('access_token');
      window.location.replace("/login");
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
