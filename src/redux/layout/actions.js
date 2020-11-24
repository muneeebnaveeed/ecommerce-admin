// @flow
import { CHANGE_SIDEBAR_TYPE } from './constants';

export const changeSidebarType = (sidebarType) => ({
    type: CHANGE_SIDEBAR_TYPE,
    payload: sidebarType,
});
