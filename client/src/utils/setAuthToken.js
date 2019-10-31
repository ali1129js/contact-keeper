/**
 * @Author: Ali
 * @Date:   2019-10-31T10:32:36+01:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-31T10:32:44+01:00
 */
 import axios from 'axios';

 const setAuthToken = token => {
   if (token) {
     axios.defaults.headers.common['x-auth-token'] = token;
   } else {
     delete axios.defaults.headers.common['x-auth-token'];
   }
 };

 export default setAuthToken;
