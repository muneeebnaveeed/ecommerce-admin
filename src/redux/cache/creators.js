import { REMOVE_CACHE_KEY, REMOVE_FROM_CACHE, UPDATE_CACHE_HEADER, UPDATE_CACHE_KEY } from './actions';

export const updateKeyInCache = (header, key, data) => ({
    type: UPDATE_CACHE_KEY,
    payload: { header, key, data },
});

export const updateHeaderInCache = (header, data) => ({
    type: UPDATE_CACHE_HEADER,
    payload: { header, data },
});
export const removeKeyInCache = (header, key) => ({
    type: REMOVE_CACHE_KEY,
    payload: { header, key },
});

export const removeFromCache = (id, header, key) => ({
    type: REMOVE_FROM_CACHE,
    payload: { id, header, key },
});
