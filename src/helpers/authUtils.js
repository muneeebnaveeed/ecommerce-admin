// @flow
import jwtDecode from 'jwt-decode';
import { Cookies } from 'react-cookie';

export const setSession = (user) => {
    let cookies = new Cookies();
    if (user) cookies.set('user', user, { path: '/' });
    else cookies.remove('user', { path: '/' });
};

/**
 * Checks if user is authenticated
 */
export const isUserAuthenticated = () => {
    const user = getLoggedInUser();
    if (!user) return false;
    // const decoded = jwtDecode(user);
    // const currentTime = Date.now() / 1000;
    // console.log(decoded);
    // if (decoded.exp < currentTime) return false;
    return true;
};

/**
 * Returns the logged in user
 */
export const getLoggedInUser = () => {
    const cookies = new Cookies();
    const user = cookies.get('user');
    if (!user) return null;
    return jwtDecode(user);
};
