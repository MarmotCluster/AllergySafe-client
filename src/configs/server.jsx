import axios from 'axios';

const server = axios.create({
  baseURL: 'https://allergysafe.life/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
server.defaults.headers.post['Content-Type'] = `application/x-www-form-urlencoded`;

export default server;
