import { useState, useMemo, useRef, useEffect } from 'react';
import _ from 'lodash';

import { getCollections, getProductsByCollection } from '../constants';
import api from './api';

import * as stateActions from '../redux/stateActions';
import { useDispatch, useSelector } from 'react-redux';

const useFetch = (mode, { isCached }) => {
    const cached = useSelector((state) => state.Cache);
    const dispatch = useDispatch();
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const constants = useRef(null);
    const storeInCache = useRef(null);
    const fetchFromCach = useRef(null);
    const updateInCache = useRef(null);
    const urlModifier = useRef(null);
    const fetchedInitially = useRef(false);
    const [removeFromCache, setRemoveFromCache] = useState(null);

    const updateConfig = () => {
        switch (mode.key) {
            case getCollections.key: {
                constants.current = getCollections;
                storeInCache.current = (key, data) => {
                    // {
                    //     collections: {
                    //         ...collections,
                    //         5fb803c4065a3507684e61c9: product
                    //     }
                    // }
                    const objectifiedData = _.keyBy(data, '_id');
                    return {
                        [key]: objectifiedData,
                    };
                };
                fetchFromCach.current = () => {
                    let query = cached?.[constants.current.cached.header]?.[constants.current.cached.key];
                    if (!query) return null;
                    query = Object.values(query);
                    const len = query.length;
                    return len ? query : null;
                };

                updateInCache.current = (data) => Object.values(data);

                urlModifier.current = '';
                break;
            }
            case getProductsByCollection.key: {
                constants.current = getProductsByCollection;
                break;
            }
            default: {
                break;
            }
        }
        setRemoveFromCache(() => () => dispatch(stateActions.removeKeyInCache('collections', 'collections')));
    };

    const updateConfigFromParams = (params) => {
        switch (mode.key) {
            case getProductsByCollection.key: {
                storeInCache.current = (key, data) => {
                    // cached.collections.
                    return {
                        ...cached[constants.current.cached.header][key],
                        [key]: {
                            ...cached?.[constants.current.cached.header]?.[key],
                            [params]: data,
                        },
                    };
                };
                fetchFromCach.current = () => {
                    // cached.collections.productsByCollection.5fb803c4065a3507684e61c9
                    let query = (cached?.[constants.current.cached.header]?.[constants.current.cached.key] || {})[
                        params
                    ];
                    return query;
                };

                updateInCache.current = (data) => data;

                urlModifier.current = `/${params}`;
                break;
            }
            default: {
                break;
            }
        }
    };

    const cacheUpdateListener = useMemo(
        () => Object.keys(cached?.[constants.current?.cached?.header]?.[constants.current?.cached?.key] || {}).length,
        [cached]
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(updateConfig, []);
    useEffect(() => {
        const cachedResult = cached?.[constants.current?.cached?.header]?.[constants.current?.cached?.key];
        if (cachedResult && !isLoading && updateInCache.current) {
            const arrayedResult = updateInCache.current(cachedResult);
            setResult(arrayedResult);
        }
    }, [cacheUpdateListener]);

    const fetch = async (params) => {
        updateConfigFromParams(params);

        // let accessor = cached?.[constants.current.cached.header]?.accessor || 0;

        // if (accessor >= ACCESSOR_LIMIT) {
        //     accessor = 0;
        //     // cached = {
        //     //     ...cached,
        //     //     [constants.current.cached.header]: {
        //     //         ...cached[constants.current.cached.header],
        //     //         accessor,
        //     //         [constants.current.cached.key]: {},
        //     //     },
        //     // };

        //     console.log('updateHeaderInCache');

        //     dispatch(
        //         stateActions.updateHeaderInCache(constants.current.cached.header, {
        //             accessor,
        //             [constants.current.cached.key]: {},
        //         })
        //     );
        // }

        if (isCached && fetchFromCach.current() && !error) {
            // const updatedAccessor = accessor + 1;

            // // cached = {
            // //     ...cached,
            // //     [constants.current.cached.header]: {
            // //         ...cached[constants.current.cached.header],
            // //         accessor: updatedAccessor,
            // //     },
            // // };

            // console.log('updateHeaderInCache');

            // dispatch(stateActions.updateHeaderInCache(constants.current.cached.header, { accessor: updatedAccessor }));

            // console.log('setResult (cached)');
            // setResult(fetchFromCach.current);

            switch (mode.key) {
                case getProductsByCollection.key: {
                    setResult(fetchFromCach.current());
                    break;
                }
                default: {
                    return;
                }
            }

            return;
        }

        setIsLoading(true);
        fetchedInitially.current = true;

        try {
            const request = await api[constants.current.method](constants.current.url + urlModifier.current);
            setIsLoading(false);
            setError(null);

            let data = request.data;

            if (constants.current.pre) data = constants.current.pre(request.data);

            setResult(data);

            // cached = {
            //     ...cached,
            //     [constants.current.cached.header]: {
            //         ...cached[constants.current.cached.header],
            //         ...storeInCache.current(constants.current.cached.key, data),
            //     },
            // };

            dispatch(
                stateActions.updateHeaderInCache(
                    constants.current.cached.header,
                    storeInCache.current(constants.current.cached.key, data)
                )
            );
        } catch (err) {
            console.log(err.response);
            if (err.response) setError(err.response.data.vaue);
            else setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const reset = useMemo(
        () => ({
            result: () => setResult(null),
            error: () => setError(null),
            cache: removeFromCache,
        }),
        [setResult, setError, removeFromCache]
    );

    return [fetch, isLoading, result, error, reset];
};

export default useFetch;
