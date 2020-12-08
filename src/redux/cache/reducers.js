import _ from 'lodash';

const {
    UPDATE_CACHE_KEY,
    UPDATE_CACHE_HEADER,
    REMOVE_CACHE_KEY,
    REMOVE_FROM_CACHE,
    UPDATE_CACHE_VALUE,
} = require('./actions');
const initialState = {};

const cacheReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_CACHE_HEADER: {
            const { header, data } = action.payload;
            return {
                ...state,
                [header]: {
                    ...state[header],
                    ...data,
                },
            };
        }
        case UPDATE_CACHE_KEY: {
            const { header, key, data } = action.payload;
            const updatedState = {
                ...state,
                [header]: {
                    ...state[header],
                    [key]: {
                        ...state[header][key],
                        ...data,
                    },
                },
            };
            return updatedState;
        }
        case REMOVE_CACHE_KEY: {
            const { header, key } = action.payload;
            const updatedState = {
                ...state,
                [header]: {
                    ...state[header],
                    [key]: {},
                },
            };
            return updatedState;
        }
        case REMOVE_FROM_CACHE: {
            const { id, header, key } = action.payload;
            const oldKeyData = state[header][key];
            const updatedKeyData = _.filter(oldKeyData, (data) => data._id !== id);
            const updatedState = {
                ...state,
                [header]: {
                    ...state[header],
                    [key]: updatedKeyData,
                },
            };
            return updatedState;
        }

        case UPDATE_CACHE_VALUE: {
            const { header, key, id, data } = action.payload;
            const oldKeyData = state[header][key];
            const oldIdData = oldKeyData[id];
            const updatedKeyData = {
                ...oldKeyData,
                [id]: {
                    ...oldIdData,
                    ...data,
                },
            };
            const updatedState = {
                ...state,
                [header]: {
                    ...state[header],
                    [key]: updatedKeyData,
                },
            };
            return updatedState;
        }

        default: {
            return state;
        }
    }
};

export default cacheReducer;
