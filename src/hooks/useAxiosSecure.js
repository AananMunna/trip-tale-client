import axios from 'axios';

const axiosSecure = axios.create({
  baseURL: 'http://localhost:3000',
  // No auth headers yet because token not setup
});

export default function useAxiosSecure() {
  return axiosSecure;
}
