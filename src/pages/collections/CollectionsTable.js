import React, { useContext, useCallback, useEffect, useRef, useState } from 'react';
import {
    Card,
    CardBody,
    Table,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Form,
    InputGroup,
    InputGroupAddon,
    Input,
} from 'reactstrap';
import _ from 'lodash';
import ErrorDialog from '../../components/ErrorDialog';
import Loader, { Loader as ButtonLoader } from '../../components/Loader';
import { Edit, Delete } from 'react-feather';
import api from '../../helpers/api';
import * as stateActions from '../../redux/stateActions';
import { useDispatch } from 'react-redux';
import TooltipContainer from 'react-tooltip';
import { collectionValidation } from '../../constants/validation';

import { useFormik } from 'formik';

import { getCollections, collectionsCache } from 'helpers/query';
import { queryCache, usePaginatedQuery } from 'react-query';
import { CollectionsContext } from 'helpers/context';

const EditCollectionModal = ({ isOpen, toggle, collection }) => {
    const [inputTitleError, setInputTitleError] = useState('');
    const [isEditingCollection, setIsEditingCollection] = useState(false);

    const { reviewContext, tableContext } = useContext(CollectionsContext);

    const resetErrorTimeout = useRef(null);

    const toggleModal = () => {
        if (inputTitleError !== '') setInputTitleError('');
        toggle();
    };

    const editCollection = async (title) => {
        if (title.trim() === collection.title) {
            setInputTitleError('Please set a new title');
            if (resetErrorTimeout.current) clearTimeout(resetErrorTimeout.current);
            resetErrorTimeout.current = setTimeout(() => {
                setInputTitleError('');
                resetErrorTimeout.current = null;
            }, 1500);
            return;
        }

        setIsEditingCollection(true);
        try {
            const updatedCollection = { _id: collection._id, title };
            await api.put(`/collections/${collection._id}`, updatedCollection);

            const reviewData = reviewContext.getReviewData();
            const tableData = tableContext.getTableData();

            collectionsCache.review.edit({
                queryKey: reviewData.queryKey,
                pageSize: reviewData.pageSize,
                collection: updatedCollection,
            });

            const isSameQuery = JSON.stringify(reviewData.queryKey) == JSON.stringify(tableData.queryKey);

            if (!isSameQuery)
                collectionsCache.table.edit({
                    queryKey: tableData.queryKey,
                    pageSize: tableData.pageSize,
                    collection: updatedCollection,
                });
            toggleModal();
        } catch (error) {
            let toastError = error.message;
            if (error.response) toastError = error.response.data.value;
            setInputTitleError(toastError);
            if (resetErrorTimeout.current) clearTimeout(resetErrorTimeout.current);
            resetErrorTimeout.current = setTimeout(() => {
                setInputTitleError('');
                resetErrorTimeout.current = null;
            }, 1500);
        } finally {
            setIsEditingCollection(false);
        }
    };

    const handleValidation = (values) => {
        let errors = {};
        const error = collectionValidation.title.validate(values.title?.trim());
        if (error) {
            errors.title = error;
            setInputTitleError(errors.title);
            if (resetErrorTimeout.current) clearTimeout(resetErrorTimeout.current);
            resetErrorTimeout.current = setTimeout(() => {
                setInputTitleError('');
                resetErrorTimeout.current = null;
            }, 1500);
        } else {
            if (inputTitleError) setInputTitleError('');
            if (resetErrorTimeout.current) {
                clearTimeout(resetErrorTimeout.current);
                resetErrorTimeout.current = null;
            }
        }
        return errors;
    };

    const handleSubmit = (values) => {
        editCollection(values.title);
    };

    const formik = useFormik({
        initialValues: {
            title: collection.title,
        },
        enableReinitialize: true,
        onSubmit: handleSubmit,
        validate: handleValidation,
    });

    useEffect(() => {
        if (isOpen) formik.setValues({ title: collection?.title || '' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} toggle={toggleModal} className="modal-dialog-centered" size="sm">
            <ModalHeader toggle={toggleModal}>Edit Collection</ModalHeader>
            <ModalBody>
                <Form
                    onSubmit={formik.handleSubmit}
                    className="collection-form align-items-start"
                    autoComplete="off"
                    inline>
                    <InputGroup className="flex-grow-1">
                        <InputGroupAddon addonType="prepend">Title</InputGroupAddon>
                        <Input
                            autoFocus
                            invalid={Boolean(inputTitleError)}
                            type="text"
                            name="title"
                            onChange={formik.handleChange}
                            value={formik.values.title}
                        />
                    </InputGroup>
                </Form>
                {inputTitleError && <p className="feedback invalid">{inputTitleError}</p>}
            </ModalBody>
            <ModalFooter>
                <Button color="primary" className="loader-button" onClick={formik.handleSubmit}>
                    {!isEditingCollection ? 'Edit Collection' : <ButtonLoader />}
                </Button>
                <Button color="secondary" className="ml-1" onClick={toggleModal}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
};

const CollectionsTable = () => {
    const { tableContext, reviewContext } = useContext(CollectionsContext);
    const collections = usePaginatedQuery(tableContext.getQueryKey(), getCollections, { retry: false });

    // useful for showing loader on table
    const [isDeletingCollection, setIsDeletingCollection] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    // passing selected collection to modal
    const currentCollection = useRef('');

    const dispatch = useDispatch();

    const toggleModal = useCallback(() => {
        setIsModalOpen((prevState) => !prevState);
    }, [setIsModalOpen]);

    const handleEditCollection = useCallback(
        (collection) => {
            currentCollection.current = collection;
            toggleModal();
        },
        [toggleModal]
    );

    const handleDeleteCollection = async ({ id, sr }) => {
        setIsDeletingCollection(true);
        try {
            await api.delete(`/collections/${id}`);
            dispatch(
                stateActions.createToast({
                    type: 'success',
                    title: 'Dispatched successfully!',
                    message: 'Collection deleted successfully',
                })
            );

            // update collections table
            collectionsCache.table.remove();
            const page = reviewContext.currentPage.value,
                pageSize = reviewContext.pageSize.value,
                queryKey = reviewContext.getQueryKey();

            // update review collections
            collectionsCache.review.remove({ id, sr, page, pageSize, queryKey });
        } catch (error) {
            let toastError = error.message;
            if (error.response) toastError = error.response.data.value;
            dispatch(
                stateActions.createToast({
                    type: 'danger',
                    title: 'Oh noes!',
                    message: 'Unable to delete collection: ' + toastError,
                })
            );
        }

        setIsDeletingCollection(false);
    };

    return (
        <React.Fragment>
            <Card data-component="CollectionsTable">
                <CardBody>
                    <h4>Manage Collections</h4>
                    {(collections.isLoading || isDeletingCollection) && <Loader />}
                    <ErrorDialog error={collections.error} onRetry={() => collections.refetch()} />
                    {!collections.error && !collections.isLoading && (
                        <Table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Products</th>
                                    <th>Manage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {_.map(collections.data?.docs, ({ _id, sr, title, products }, index) => (
                                    <tr key={`tabular-collection-${index + 1}`}>
                                        <td>{sr}</td>
                                        <td>{title}</td>
                                        <td>{products?.length || 0}</td>
                                        <td>
                                            <Edit
                                                data-tip="Edit Collection"
                                                data-place="bottom"
                                                className="button-icon mr-1"
                                                onClick={() => handleEditCollection({ _id, title })}
                                            />
                                            <Delete
                                                data-tip="Delete Collection"
                                                data-place="top"
                                                onClick={() => handleDeleteCollection({ id: _id, sr })}
                                                className="button-icon"
                                                color="#e83e8c"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                    {!collections.data?.docs?.length && !collections.error && (
                        <p className="text-center">No Collections Recorded</p>
                    )}
                    <TooltipContainer type="dark" effect="solid" />
                </CardBody>
            </Card>
            <EditCollectionModal isOpen={isModalOpen} toggle={toggleModal} collection={currentCollection.current} />
        </React.Fragment>
    );
};
export default CollectionsTable;
