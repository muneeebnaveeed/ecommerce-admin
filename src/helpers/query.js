import { queryCache } from 'react-query';

import api from './api';

export const collectionsCache = {
    review: {
        add: ({ queryKey, pageSize, collection }) => {
            let cached = queryCache.getQueryData(queryKey);
            const len = cached?.docs?.length || 0;

            if (len >= pageSize) {
                queryCache.invalidateQueries(queryKey);
                return;
            }

            const newLength = len + 1;
            cached.docs.push({ ...collection, sr: newLength });
            queryCache.setQueryData(queryKey, cached);
        },
        edit: ({ queryKey, pageSize, collection }) => {
            let cached = queryCache.getQueryData(queryKey);
            const len = cached?.docs?.length || 0;

            if (len > pageSize) return;

            const index = cached.docs.findIndex((element) => element._id === collection._id);

            if (index === -1) {
                console.error(`Unable to find updated "${queryKey}" element in cache`);
                return;
            }

            cached.docs[index] = { ...cached.docs[index], ...collection };
            queryCache.setQueryData(queryKey, cached);
        },
        // update cache and fetch only when it's required
        remove: ({ page, pageSize, queryKey, id, sr }) => {
            const isLastItemOfPage = sr === page * pageSize;

            // if last item then refetch otherwise just update the cache
            if (!isLastItemOfPage) {
                let cache = queryCache.getQueryData(queryKey);
                cache.docs = cache.docs.filter((data) => data._id !== id);
                queryCache.setQueryData(queryKey, cache);
                return;
            }

            const onNextPage = page * pageSize - (pageSize - 1) < sr;
            const onPrevPage = page * pageSize > sr;

            // no need to refetch if item is not currently visible
            if (onNextPage || onPrevPage) return;

            queryCache.invalidateQueries(queryKey);
        },
    },
    table: {
        add: ({ queryKey, currentPage, pageSize, collection }) => {
            let cached = queryCache.getQueryData(queryKey);
            const len = cached?.docs?.length || 0;

            if (len >= pageSize) {
                queryCache.invalidateQueries(queryKey);
                return;
            }

            const newLength = (currentPage - 1) * pageSize + len + 1;
            cached.docs.push({ ...collection, sr: newLength });
            queryCache.setQueryData(queryKey, cached);
        },
        edit: ({ queryKey, pageSize, collection }) => {
            let cached = queryCache.getQueryData(queryKey);
            const len = cached?.docs?.length || 0;

            if (len > pageSize) return;

            const index = cached.docs.findIndex((element) => element._id === collection._id);

            if (index === -1) {
                console.error(`Unable to find updated "${queryKey}" element in cache`);
                return;
            }

            cached.docs[index] = { ...cached.docs[index], ...collection };

            queryCache.setQueryData(queryKey, cached);
        },
        remove: (key) => queryCache.invalidateQueries(key),
    },
};

export const getCollections = (key, params) => {
    let url = '/collections';
    if (params) url += `?page=${params.page}&pageSize=${params.pageSize}`;

    return api.get(url).then((res) => {
        const { docs } = res.data;
        const serializedDocs = docs.map((collection, index) => ({
            ...collection,
            sr: (params.page - 1) * params.pageSize + index + 1,
        }));
        return { ...res.data, docs: serializedDocs };
    });
};

export const getProductsByCollection = (key, params) => {
    if (params.id) return api.get(`/products/collection/${params.id}`).then((res) => res.data);
    return null;
};

export const getPerformingCollections = () => api.get(`/collections/performing`).then((res) => res.data);
