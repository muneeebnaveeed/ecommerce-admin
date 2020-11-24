import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { getCollections } from '../../constants';
import useFetch from '../../helpers/fetch';
import _ from 'lodash';
import ErrorDialog from './ErrorDialog';
import Loader from '../../components/Loader';
import { Edit, Delete } from 'react-feather';
import api from '../../helpers/api';
import * as stateActions from '../../redux/stateActions';
import { useDispatch } from 'react-redux';
import TooltipContainer from 'react-tooltip';
import { titleValidation } from '../../constants/validation';

const EditCollectionModal = ({ isOpen, toggle, collection }) => {
    const dispatch = useDispatch();

    const [inputTitle, setInputTitle] = useState('');
    const [inputTitleError, setInputTitleError] = useState('');
    const [isEditingCollection, setIsEditingCollection] = useState(false);
    const [feedback, setFeedback] = useState('');

    const resetErrorTimeout = useRef(null);
    const resetFeedbackTimeout = useRef(null);

    const toggleModal = () => {
        if (inputTitle != '') setInputTitle('');
        if (inputTitleError != '') setInputTitleError('');
        toggle();
    };

    const editCollection = async () => {
        if (inputTitle.trim() == collection.title) {
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
            await api.put(`/collections/${collection._id}`, { title: inputTitle });
            // dispatch(
            //     stateActions.createToast({
            //         type: 'success',
            //         title: 'Dispatched Successfully!',
            //         message: 'Collection has been edited',
            //     })
            // );

            setFeedback('Collection has been edited successfully');

            if (resetFeedbackTimeout.current) clearTimeout(resetFeedbackTimeout.current);
            resetFeedbackTimeout.current = setTimeout(() => {
                setFeedback('');
                resetFeedbackTimeout.current = null;
            }, 1500);
        } catch (error) {
            let toastError = error.message;
            if (error.response) toastError = error.response.data.value;
            // dispatch(
            //     stateActions.createToast({
            //         type: 'danger',
            //         title: 'Oh noes!',
            //         message: 'Failed to edit collection: ' + toastError,
            //     })
            // );
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

    const handleTitleChange = (event) => setInputTitle(event.target.value);
    const handleTitleValidation = () => {
        const error = titleValidation.validate(inputTitle?.trim());
        if (error) {
            setInputTitleError(error);
            if (resetErrorTimeout.current) clearTimeout(resetErrorTimeout.current);
            resetErrorTimeout.current = setTimeout(() => {
                setInputTitleError('');
                resetErrorTimeout.current = null;
            }, 1500);
            return false;
        }
        return true;
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        const isValid = handleTitleValidation();

        if (isValid) {
            setInputTitleError('');
            editCollection();
        }
    };
    return (
        <Modal isOpen={isOpen} toggle={toggleModal} className="modal-dialog-centered" size="sm">
            <ModalHeader toggle={toggleModal}>Edit Collection</ModalHeader>
            <ModalBody>
                <Form className="collection-form align-items-start" autoComplete="off" inline>
                    <InputGroup className="flex-grow-1">
                        <InputGroupAddon addonType="prepend">Title</InputGroupAddon>
                        <Input
                            invalid={Boolean(inputTitleError)}
                            type="text"
                            name="title"
                            onChange={handleTitleChange}
                            value={inputTitle}
                        />
                    </InputGroup>
                </Form>
                {inputTitleError && <p className="feedback invalid">{inputTitleError}</p>}
                {feedback && <p className="feedback valid">{feedback}</p>}
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleSubmit}>
                    Edit Collection
                </Button>
                <Button color="secondary" className="ml-1" onClick={toggleModal}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
};

const CollectionsTable = (props) => {
    const [fetchCollections, isCollectionsLoading, collections, collectionsError, resetCollections] = useFetch(
        getCollections,
        {
            isCached: true,
        }
    );

    const [isDeletingCollection, setIsDeletingCollection] = useState(false);

    const [srCollections, setSrCollections] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editCollection, setEditCollection] = useState(null);

    const dispatch = useDispatch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchCollections(null, { isCached: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const srColl = _.map(collections, (collection, index) => ({ ...collection, sr: index + 1 }));
        setSrCollections(srColl);
    }, [collections]);

    const toggleModal = useCallback(() => {
        setIsModalOpen((prevState) => !prevState);
    }, [setIsModalOpen]);

    const handleEditCollection = async (collection) => {
        setEditCollection(collection);
        toggleModal();
    };

    const handleDeleteCollection = async (id) => {
        setIsDeletingCollection(true);
        try {
            await api.delete(`/collections/${id}`);
            dispatch(stateActions.removeFromCache(id, 'collections', 'collections'));
            dispatch(
                stateActions.createToast({
                    type: 'success',
                    title: 'Dispatched successfully!',
                    message: 'Collection deleted successfully',
                })
            );
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
        } finally {
            setIsDeletingCollection(false);
        }
    };

    return (
        <React.Fragment>
            <Card data-component="CollectionsTable">
                <CardBody>
                    <h4>Manage Collections</h4>
                    {(isCollectionsLoading || isDeletingCollection) && <Loader />}
                    <ErrorDialog error={collectionsError} onRetry={() => fetchCollections(null, { isCached: true })} />
                    {!collectionsError && !isCollectionsLoading && (
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
                                {_.map(srCollections, ({ _id, sr, title, products }, index) => (
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
                                                onClick={() => handleDeleteCollection(_id)}
                                                className="button-icon"
                                                color="#e83e8c"
                                            />
                                            <TooltipContainer type="dark" effect="solid" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                    {!srCollections.length && !collectionsError && (
                        <p className="text-center">No Collections Recorded</p>
                    )}
                </CardBody>
            </Card>
            <EditCollectionModal isOpen={isModalOpen} toggle={toggleModal} collection={editCollection} />
        </React.Fragment>
    );
};
export default CollectionsTable;
