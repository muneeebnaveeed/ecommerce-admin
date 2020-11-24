import axios from 'axios';
import { API_ENDPOINT } from '../constants';

/**
 * Fetch data from given url
 * @param {*} url
 * @param {*} options
 */
export const fetchJSON = (url, options = {}) => {
    return fetch(url, options)
        .then((response) => {
            if (!response.status === 200) {
                throw response.json();
            }
            return response.json();
        })
        .then((json) => {
            return json;
        })
        .catch((error) => {
            throw error;
        });
};

const api = axios.create({
    baseURL: API_ENDPOINT,
    timeout: 5000,
    headers: { 'X-Auth-Token': 'foobar' },
});

export default api;
