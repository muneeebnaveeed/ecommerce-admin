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
        // pre: (_id, )
    },
};
