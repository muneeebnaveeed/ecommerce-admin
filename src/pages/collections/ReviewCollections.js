import React, { useCallback, useContext, useEffect, useState, useMemo } from 'react';
import { Col, Card, CardBody } from 'reactstrap';
import Loader, { Loader as ButtonLoader } from '../../components/Loader';
import _ from 'lodash';
import classnames from 'classnames';

import Label from 'components/Label';
import { ArrowLeft, ArrowRight, Trash } from 'react-feather';
import TooltipContainer from 'react-tooltip';
import api from 'helpers/api';
import { useDispatch } from 'react-redux';
import * as stateActions from 'redux/stateActions';
import ErrorDialog from 'components/ErrorDialog';

import { queryCache, usePaginatedQuery, useQuery } from 'react-query';
import { getCollections, getProductsByCollection } from 'helpers/query';
import { CollectionsContext } from 'helpers/context';
import { collectionsCache } from 'helpers/query';
import Products from './Products';
import usePagination from 'helpers/pagination';
import { Else, If, Then, Unless, When } from 'react-if';
const ReviewCollections = (props) => {
    const { reviewContext, tableContext } = useContext(CollectionsContext);
    const dispatch = useDispatch();

    // reference for collection whose products are fetched
    const [currentCollection, setCurrentCollection] = useState({ id: null, name: null });

    // control pagination
    // const [currentPage, setCurrentPage] = useState(1);
    // const [pageSize, setPageSize] = useState(2);

    const collections = usePaginatedQuery(reviewContext.getQueryKey(), getCollections, {
        retry: false,
    });
    const productsByCollection = useQuery(
        ['productsByCollection', { id: currentCollection.id }],
        getProductsByCollection,
        {
            enabled: false,
        }
    );

    const [isDeletingCollections, setIsDeletingCollections] = useState(false);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    // show products panel or not (triggered by click on collection)
    const [isDropdownPanel, setIsDropdownPanel] = useState(false);

    const reviewPagination = usePagination({ context: reviewContext, data: collections.resolvedData });

    const setIsLoading = useMemo(() => ({ value: isLoadingProducts, set: setIsLoadingProducts }), [
        isLoadingProducts,
        setIsLoadingProducts,
    ]);

    // @param {object} collection - which collection to fetch products of
    const handleFetchProductsByCollection = useCallback(
        ({ _id, title }) => {
            props.setBlackOverlay(true);
            setIsDropdownPanel(true);
            if (currentCollection?.id === _id) {
                setCurrentCollection({ id: null, name: null });
                props.setBlackOverlay(false);
                setIsDropdownPanel(false);
                return;
            }

            let delay = 0;

            if (productsByCollection.data) delay = 500;

            setTimeout(() => {
                props.setBlackOverlay(true);
                setIsDropdownPanel(true);
                setCurrentCollection({ id: _id, name: title });
                productsByCollection.refetch(_id);
            }, delay);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [productsByCollection]
    );

    // remove error if one category products can't be fetched
    const handleGoBack = useCallback(() => {
        setCurrentCollection({ id: null, name: null });
        productsByCollection.remove();
    }, [productsByCollection]);

    const handleRetry = useCallback(() => {
        if (collections.error) {
            collections.refetch();
            return;
        }

        productsByCollection.refetch(currentCollection.id);
    }, [collections, productsByCollection, currentCollection]);

    const handleDeleteCollections = useCallback(async () => {
        setIsDeletingCollections(true);
        try {
            await api.delete('/collections');

            collections.remove();
            collectionsCache.table.remove(tableContext.queryKey);

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
        }
        setIsDeletingCollections(false);
    }, [dispatch]);

    return (
        <Col xl={6}>
            <div className="position-relative">
                <Card>
                    {/* is loading initially or additional data is not fetched then show loader  */}
                    <When
                        condition={
                            collections.isLoading ||
                            isLoadingProducts ||
                            (!collections.isFetched && collections.resolvedData)
                        }>
                        <Loader />
                    </When>
                    <CardBody
                        className={classnames('card--review', {
                            'd-flex flex-column align-items-center justify-content-center': !(
                                collections.resolvedData?.docs?.length || collections.error
                            ),
                        })}>
                        <If condition={collections.resolvedData?.docs?.length}>
                            <Then>
                                <div className="d-flex justify-content-between">
                                    <h4 className="mb-3">Review Collections</h4>
                                    <If condition={isDeletingCollections}>
                                        <Then>
                                            <ButtonLoader color="dark" />
                                        </Then>
                                        <Else>
                                            <div className="d-flex align-items-center">
                                                <Unless
                                                    condition={
                                                        reviewPagination.currentPage === 1 &&
                                                        reviewPagination.pages === 1
                                                    }>
                                                    <ArrowLeft
                                                        className={classnames('button-icon', {
                                                            disabled: reviewPagination.isFirstPage,
                                                        })}
                                                        onClick={reviewPagination.decrementPage}
                                                    />
                                                    <span className="mx-1">
                                                        {`Page ${reviewPagination.currentPage} of ${reviewPagination.pages}`}
                                                    </span>
                                                    <ArrowRight
                                                        className={classnames('button-icon', {
                                                            disabled: reviewPagination.isLastPage,
                                                        })}
                                                        onClick={reviewPagination.incrementPage}
                                                    />
                                                </Unless>
                                                <If condition={isDeletingCollections}>
                                                    <Then>
                                                        <ButtonLoader color="dark" />
                                                    </Then>
                                                    <Else>
                                                        <Trash
                                                            onClick={handleDeleteCollections}
                                                            className="button-icon"
                                                            data-tip="Delete all collections"
                                                        />
                                                    </Else>
                                                </If>
                                            </div>
                                        </Else>
                                    </If>
                                    <TooltipContainer place="left" type="dark" effect="solid" />
                                </div>
                                <ErrorDialog
                                    data={collections.resolvedData?.docs}
                                    error={collections.error}
                                    onRetry={collections.refetch}
                                />
                                <ErrorDialog
                                    data={productsByCollection}
                                    goBack
                                    error={productsByCollection.error}
                                    onRetry={handleRetry}
                                    onGoBack={handleGoBack}
                                />
                                <div className="collections-container">
                                    {!productsByCollection.error &&
                                        _.map(collections.resolvedData?.docs, ({ title, products, _id }, index) => (
                                            <Label
                                                key={`collection-${index + 1}`}
                                                value={title}
                                                productCount={products?.length || 0}
                                                rest={{
                                                    onClick: () => handleFetchProductsByCollection({ title, _id }),
                                                }}
                                            />
                                        ))}
                                </div>
                            </Then>
                            <Else>
                                <If condition={collections.error}>
                                    <Then>
                                        <ErrorDialog error={collections.error} onRetry={collections.refetch} />
                                    </Then>
                                    <Else>
                                        <React.Fragment>
                                            <h5 className="text-center mb-1">No collections recorded!</h5>
                                            <h5 className="text-center mt-0">Create new collections to review them.</h5>
                                        </React.Fragment>
                                    </Else>
                                </If>
                            </Else>
                        </If>
                    </CardBody>
                </Card>

                <Products extended={isDropdownPanel} collection={currentCollection} isLoading={setIsLoading} />
            </div>
        </Col>
    );
};

export default ReviewCollections;
