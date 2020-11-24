import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import Loader from '../../components/Loader';
import _ from 'lodash';
import classnames from 'classnames';

import PageTitle from '../../components/PageTitle';

import performingBg from '../../assets/images/collections/performing-bg.jpg';

import Collection from './collection';
import useFetch from '../../helpers/fetch';
import { getCollections, getProductsByCollection } from '../../constants';
import Products from './products';
import CreateCollection from './CreateCollection';
import CollectionsTable from './CollectionsTable';
import { Trash } from 'react-feather';
import TooltipContainer from 'react-tooltip';
import api from '../../helpers/api';
import { useDispatch } from 'react-redux';
import * as stateActions from '../../redux/stateActions';
import ErrorDialog from './ErrorDialog';

const ReviewCollections = () => {
    const [fetchCollections, isCollectionsLoading, collections, collectionsError, resetCollections] = useFetch(
        getCollections,
        {
            isCached: true,
        }
    );

    const [
        fetchProductsByCollection,
        isProductsByCollectionLoading,
        productsByCollection,
        productsByCollectionError,
        resetProductsByCollection,
    ] = useFetch(getProductsByCollection, { isCached: true });

    const [isDeletingCollections, setIsDeletingCollections] = useState(false);

    const fetchedCollection = useRef(null);
    const fetchedCollectionName = useRef(null);

    const dispatch = useDispatch();

    const handleFetchProductsByCollection = useCallback(
        ({ _id, title }) => {
            resetProductsByCollection.result();
            if (fetchedCollection.current === _id) {
                fetchedCollection.current = null;
                fetchedCollectionName.current = null;
                return;
            }

            let delay = 0;

            if (productsByCollection) delay = 500;

            setTimeout(() => {
                fetchedCollection.current = _id;
                fetchedCollectionName.current = title;
                fetchProductsByCollection(_id);
            }, delay);
        },
        [resetProductsByCollection, fetchProductsByCollection, productsByCollection]
    );

    const handleGoBack = useCallback(() => {
        fetchedCollection.current = null;
        fetchedCollectionName.current = null;
        resetProductsByCollection.error();
    }, [resetProductsByCollection]);

    const handleRetry = useCallback(() => {
        if (collectionsError) {
            fetchCollections();
            return;
        }

        fetchProductsByCollection(fetchedCollection.current);
    }, [collectionsError, fetchCollections, fetchProductsByCollection]);

    const handleDeleteCollections = async () => {
        setIsDeletingCollections(true);
        try {
            await api.delete('/collections');
            resetCollections.result();
            resetCollections.cache();
            dispatch(
                stateActions.createToast({
                    type: 'success',
                    title: 'Dispatched successfully!',
                    message: 'Collections deleted',
                })
            );
        } catch (error) {
            let toastError = error.message;
            if (error.response) toastError = error.response.data.value;
            dispatch(
                stateActions.createToast({
                    type: 'danger',
                    title: 'Oh noes!',
                    message: 'Cannot delete collections: ' + toastError,
                })
            );
            console.error(error);
        } finally {
            setIsDeletingCollections(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchCollections(null, { isCached: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => console.log('productsByCollection%o', productsByCollection), [productsByCollection]);

    return (
        <Col xl={6}>
            <div className="position-relative">
                <Card>
                    {(isCollectionsLoading || isProductsByCollectionLoading || isDeletingCollections) && <Loader />}
                    <CardBody
                        className={classnames('card--review', {
                            'd-flex flex-column align-items-center justify-content-center': !(
                                collections?.length || collectionsError
                            ),
                        })}>
                        {collections?.length ? (
                            <React.Fragment>
                                <div className="d-flex justify-content-between">
                                    <h4 className="mb-3">Review Collections</h4>
                                    <Trash
                                        onClick={handleDeleteCollections}
                                        className="button-icon"
                                        data-tip="Delete all collections"
                                    />
                                    <TooltipContainer place="left" type="dark" effect="solid" />
                                </div>
                                <ErrorDialog data={collections} error={collectionsError} onRetry={handleRetry} />
                                <ErrorDialog
                                    data={productsByCollection}
                                    goBack
                                    error={productsByCollectionError}
                                    onRetry={handleRetry}
                                    onGoBack={handleGoBack}
                                />
                                <div className="collections-container">
                                    {!productsByCollectionError &&
                                        _.map(collections, ({ title, productCount, _id }, index) => (
                                            <Collection
                                                key={`collection-${index + 1}`}
                                                value={title}
                                                productCount={productCount}
                                                rest={{
                                                    onClick: () => handleFetchProductsByCollection({ title, _id }),
                                                }}
                                            />
                                        ))}
                                </div>
                            </React.Fragment>
                        ) : collectionsError ? (
                            <ErrorDialog
                                error={collectionsError}
                                onRetry={() => fetchCollections(null, { isCached: true })}
                            />
                        ) : (
                            <React.Fragment>
                                <h5 className="text-center mb-1">No collections recorded!</h5>
                                <h5 className="text-center mt-0">Create new collections to review them.</h5>
                            </React.Fragment>
                        )}
                    </CardBody>
                </Card>

                <Products collection={fetchedCollectionName.current} products={productsByCollection} />
            </div>
        </Col>
    );
};

const Collections = () => {
    return (
        <div data-component="Collections">
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[{ label: 'Collections', path: '/collections', active: true }]}
                        title={'Collections'}
                    />
                </Col>
            </Row>
            <Row>
                <Col xl={6}>
                    <Card className="card--performing">
                        <img alt="Performing Collections" src={performingBg} />
                        <div className="overlay" />
                        <div className="content">
                            <h1>Performing Collections</h1>
                        </div>
                    </Card>
                </Col>

                <ReviewCollections />
            </Row>

            <Row>
                <Col xl={4}>
                    <CreateCollection />
                </Col>
                <Col xl={8}>
                    <CollectionsTable />
                </Col>
            </Row>
        </div>
    );
};

export default Collections;
