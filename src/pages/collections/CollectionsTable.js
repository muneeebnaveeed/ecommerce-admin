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
    ButtonDropdown,
    UncontrolledDropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    Row,
} from 'reactstrap';
import _ from 'lodash';
import ErrorDialog from '../../components/ErrorDialog';
import Loader, { Loader as ButtonLoader } from '../../components/Loader';
import { Edit, Delete, ChevronsLeft, ChevronsRight } from 'react-feather';
import api from '../../helpers/api';
import * as stateActions from '../../redux/stateActions';
import { useDispatch } from 'react-redux';
import TooltipContainer from 'react-tooltip';
import { collectionValidation } from '../../constants/validation';
import { ArrowLeft, ArrowRight, ChevronDown, Mail, Printer, File } from 'react-feather';
import classnames from 'classnames';

import { useFormik } from 'formik';

import { getCollections, collectionsCache } from 'helpers/query';
import { usePaginatedQuery } from 'react-query';
import { CollectionsContext } from 'helpers/context';
import usePagination from 'helpers/pagination';
import { When, If, Then, Unless, Else } from 'react-if';
import { API_ENDPOINT } from 'constants/global';

const EditCollectionModal = ({ isOpen, toggle, collection }) => {
    const [inputTitleError, setInputTitleError] = useState('');
    const [isEditingCollection, setIsEditingCollection] = useState(false);

    const { reviewContext, tableContext } = useContext(CollectionsContext);

    const resetErrorTimeout = useRef(null);

    const toggleModal = useCallback(() => {
        if (inputTitleError !== '') setInputTitleError('');
        toggle();
    }, [inputTitleError, setInputTitleError, toggle]);

    const editCollection = useCallback(
        async (title) => {
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
        },
        [collection._id, collection.title, reviewContext, tableContext, toggleModal]
    );

    const handleValidation = useCallback(
        (values) => {
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
        },
        [inputTitleError]
    );

    const handleSubmit = useCallback(
        (values) => {
            editCollection(values.title);
        },
        [editCollection]
    );

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
                <When condition={inputTitleError}>
                    <p className="feedback invalid">{inputTitleError}</p>
                </When>
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

    const tablePagination = usePagination({ context: tableContext, data: collections.resolvedData });

    // useful for showing loader on table
    const [isDeletingCollection, setIsDeletingCollection] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isExportDropdown, setIsExportDropdown] = useState(false);

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

    const toggleExportDropdown = useCallback(() => {
        setIsExportDropdown((prevState) => !prevState);
    }, [setIsExportDropdown]);

    const handleDeleteCollection = useCallback(
        async ({ id, sr }) => {
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

                const { page, pageSize, queryKey } = reviewContext.getReviewData();

                // update collections table
                collectionsCache.table.remove();

                // update review collections
                collectionsCache.review.remove({
                    id,
                    sr,
                    page,
                    pageSize,
                    queryKey,
                });
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
        },
        [setIsDeletingCollection, dispatch, reviewContext]
    );

    const handleExport = async (mode) => {
        let query = '';
        if (mode === 'current') {
            const { page, pageSize } = tableContext.getTableData();
            query = `?page=${page}&pageSize=${pageSize}`;
        }

        const url = API_ENDPOINT + '/collections/download' + query;

        window.open(url);
    };

    return (
        <React.Fragment>
            <Card data-component="CollectionsTable">
                <CardBody>
                    <When
                        condition={
                            collections.isLoading ||
                            isDeletingCollection ||
                            (!collections.isFetched && collections.resolvedData)
                        }>
                        <Loader />
                    </When>
                    <Unless condition={collections.error}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4>Manage Collections</h4>
                            <div className="d-flex">
                                <UncontrolledDropdown>
                                    <DropdownToggle color="light" className="dropdown-toggle mr-2">
                                        <i className="uil uil-book-open vertical-align mr-1"></i>Page Size
                                        <i className="icon ml-1">
                                            <ChevronDown />
                                        </i>
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem
                                            onClick={() => tablePagination.setPageSize(5)}
                                            active={tablePagination.pageSize == 5}>
                                            <span>5</span>
                                        </DropdownItem>
                                        <DropdownItem
                                            onClick={() => tablePagination.setPageSize(10)}
                                            active={tablePagination.pageSize == 10}>
                                            <span>10</span>
                                        </DropdownItem>
                                        <DropdownItem
                                            onClick={() => tablePagination.setPageSize(25)}
                                            active={tablePagination.pageSize == 25}>
                                            <span>25</span>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                                <ButtonDropdown isOpen={isExportDropdown} toggle={toggleExportDropdown}>
                                    <DropdownToggle
                                        disabled={!collections.resolvedData?.docs?.length}
                                        color="primary"
                                        className="dropdown-toggle">
                                        <i className="uil uil-file-alt vertical-align mr-1"></i>Export
                                        <i className="icon ml-1">
                                            <ChevronDown />
                                        </i>
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem onClick={() => handleExport('current')}>
                                            <File className="icon-dual icon-xs mr-2"></File>
                                            <span>Current</span>
                                        </DropdownItem>
                                        <DropdownItem onClick={() => handleExport('all')}>
                                            <Printer className="icon-dual icon-xs mr-2"></Printer>
                                            <span>All</span>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </div>
                        </div>
                    </Unless>
                    {/* show table when we have fetched data with no errors */}
                    <When condition={!collections.error && !collections.isLoading}>
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
                    </When>
                    {/* data is empty */}
                    <If condition={!collections.data?.docs?.length && !collections.error}>
                        {/* display no data message */}
                        <Then>
                            <p className="text-center">No Collections Recorded</p>
                        </Then>
                        {/* if there is data */}
                        <Else>
                            {/* if total pages is not 1 then show pagination */}
                            <Unless condition={tablePagination.currentPage === 1 && tablePagination.pages === 1}>
                                <div className="flex-center">
                                    <ChevronsLeft
                                        className={classnames('button-icon', { disabled: tablePagination.isFirstPage })}
                                        onClick={tablePagination.firstPage}
                                    />
                                    <ArrowLeft
                                        className={classnames('button-icon', { disabled: tablePagination.isFirstPage })}
                                        onClick={tablePagination.decrementPage}
                                    />
                                    <span className="mx-1">
                                        {`Page ${tablePagination.currentPage} of ${tablePagination.pages}`}
                                    </span>
                                    <ArrowRight
                                        className={classnames('button-icon', { disabled: tablePagination.isLastPage })}
                                        onClick={tablePagination.incrementPage}
                                    />
                                    <ChevronsRight
                                        className={classnames('button-icon', { disabled: tablePagination.isLastPage })}
                                        onClick={tablePagination.lastPage}
                                    />
                                </div>
                            </Unless>
                        </Else>
                    </If>
                    <ErrorDialog error={collections.error} onRetry={collections.refetch} />
                    <TooltipContainer type="dark" effect="solid" />
                </CardBody>
            </Card>
            <EditCollectionModal isOpen={isModalOpen} toggle={toggleModal} collection={currentCollection.current} />
        </React.Fragment>
    );
};
export default CollectionsTable;
