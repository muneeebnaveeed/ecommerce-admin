// @flow
import { CHANGE_SIDEBAR_TYPE } from './constants';

import * as layoutConstants from '../../constants/layout';

const INIT_STATE = {
    leftSideBarType: layoutConstants.LEFT_SIDEBAR_TYPE_FIXED,
};

const Layout = (state = INIT_STATE, action) => {
    switch (action.type) {
        case CHANGE_SIDEBAR_TYPE:
            return {
                ...state,
                leftSideBarType: action.payload,
            };
        default:
            return state;
    }
};

export default Layout;
