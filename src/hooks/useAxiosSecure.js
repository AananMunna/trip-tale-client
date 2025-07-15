import axios from 'axios';

const axiosSecure = axios.create({
  baseURL: 'https://trip-tale-server.vercel.app',
  // No auth headers yet because token not setup
});

export default function useAxiosSecure() {
  return axiosSecure;
}
