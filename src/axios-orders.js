import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-builder-dc691.firebaseio.com/'
});

export default instance;