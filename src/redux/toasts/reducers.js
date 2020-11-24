import { CREATE_TOAST, REMOVE_TOAST } from './actions';
import _ from 'lodash';
import { v4 as uuid } from 'uuid';
const initialState = [];

const Toasts = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_TOAST: {
            // changes reference by spreading the state (rerender will occur only on change of reference)
            let updatedToasts = [...state];
            let inputToast = _.pick(action.payload, ['type', 'title', 'message', 'duration']);
            const toastId = uuid().substr(0, 4);
            inputToast._id = toastId;
            if (inputToast.duration == null) inputToast.duration = 3000;

            updatedToasts.push(inputToast);

            return updatedToasts;
        }

        case REMOVE_TOAST: {
            const filteredToasts = state.filter((toast) => toast._id !== action.payload);
            return filteredToasts;
        }

        default: {
            return state;
        }
    }
};

export default Toasts;
