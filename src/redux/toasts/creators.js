import { CREATE_TOAST, REMOVE_TOAST } from './actions';

export const createToast = ({ type, title, message }) => ({
    type: CREATE_TOAST,
    payload: { type, title, message },
});

export const removeToast = (id) => ({
    type: REMOVE_TOAST,
    payload: id,
});
