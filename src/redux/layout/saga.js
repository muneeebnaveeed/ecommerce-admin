// @flow
import { all, call, fork, takeEvery } from 'redux-saga/effects';

import { CHANGE_SIDEBAR_TYPE } from './constants';
import * as layoutConstants from '../../constants';
/**
 * Toggle the class on body
 * @param {*} cssClass
 */
function manageBodyClass(cssClass, action = 'toggle') {
    switch (action) {
        case 'add':
            if (document.body) document.body.classList.add(cssClass);
            break;
        case 'remove':
            if (document.body) document.body.classList.remove(cssClass);
            break;
        default:
            if (document.body) document.body.classList.toggle(cssClass);
            break;
    }

    return true;
}

/**
 * Changes the left sidebar type
 * @param {*} param0
 */
function* changeLeftSidebarType({ payload: type }) {
    try {
        switch (type) {
            case layoutConstants.LEFT_SIDEBAR_TYPE_CONDENSED:
                yield call(manageBodyClass, 'left-side-menu-condensed', 'add');
                break;
            case layoutConstants.LEFT_SIDEBAR_TYPE_SCROLLABLE:
                yield call(manageBodyClass, 'left-side-menu-condensed', 'remove');
                yield call(manageBodyClass, 'scrollable-layout', 'add');
                break;
            default:
                yield call(manageBodyClass, 'left-side-menu-condensed', 'remove');
                yield call(manageBodyClass, 'scrollable-layout', 'remove');
                break;
        }
    } catch (error) {}
}

/**
 * Watchers
 */
export function* watchChangeLeftSidebarType() {
    yield takeEvery(CHANGE_SIDEBAR_TYPE, changeLeftSidebarType);
}

function* LayoutSaga() {
    yield all([fork(watchChangeLeftSidebarType)]);
}

export default LayoutSaga;
