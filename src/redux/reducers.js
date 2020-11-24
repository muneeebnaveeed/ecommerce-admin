// @flow

import { combineReducers } from 'redux';
import Layout from './layout/reducers';
import Auth from './auth/reducers';
import AppMenu from './appMenu/reducers';
import Toasts from './toasts/reducers';
import Cache from './cache/reducers';

export default combineReducers({
    Layout,
    Auth,
    AppMenu,
    Toasts,
    Cache,
});
