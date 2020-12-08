import _ from 'lodash';

export const ACCESSOR_LIMIT = 100;

export const getCollections = {
    key: 'GET_COLLECTIONS',
    method: 'get',
    url: '/collections',
    cached: {
        key: 'collections',
        header: 'collections',
    },
    pre: (collections) =>
        _.map(collections, (collection) => ({
            ...collection,
            productCount: collection.products.length,
        })),
};

export const getProductsByCollection = {
    key: 'GET_PRODUCTS_BY_COLLECTION',
    method: 'get',
    url: '/products/collection',
    cached: {
        key: 'getProductsByCollection',
        header: 'collections',
    },
};

export const getTags = {
    key: 'GET_TAGS',
    method: 'get',
    url: '/tags',
    cached: {
        key: 'tags',
        header: 'tags',
    },
};

export const getProductsByTag = {
    key: 'GET_PRODUCTS_BY_TAG',
    method: 'get',
    url: '/products/tag',
    cached: {
        key: 'getProductsByTag',
        header: 'tags',
    },
};
