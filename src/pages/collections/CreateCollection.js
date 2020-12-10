import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Button, Card, CardBody, Form, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import api from '../../helpers/api';
import { Loader } from '../../components/Loader';
import _ from 'lodash';
import { collectionValidation } from 'constants/validation';
import { useFormik } from 'formik';
import { CollectionsContext } from 'helpers/context';
import { collectionsCache } from 'helpers/query';
import { Else, If, Then, When } from 'react-if';

const CreateCollection = () => {
    const { reviewContext, tableContext } = useContext(CollectionsContext);
    const [inputTitleError, setInputTitleError] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isCreatingCollection, setIsCreatingCollection] = useState(false);

    const resetErrorTimeout = useRef(null);
    const resetFeedbackTimeout = useRef(null);

    const handleValidation = useCallback(
        (formValues) => {
            let errors = {};
            const error = collectionValidation.title.validate(formValues.title?.trim());
            if (error) {
                errors.title = error;
                setInputTitleError(errors.title);
                if (resetErrorTimeout.current) clearTimeout(resetErrorTimeout.current);
                resetErrorTimeout.current = setTimeout(() => {
                    setInputTitleError('');
                    resetErrorTimeout.current = null;
                }, 1500);
            } else {
                if (resetErrorTimeout.current) {
                    clearTimeout(resetErrorTimeout.current);
                    resetErrorTimeout.current = null;
                }
            }
            return errors;
        },
        [setInputTitleError]
    );

    const createCollection = useCallback(
        async (title) => {
            setIsCreatingCollection(true);
            try {
                const request = await api.post('/collections', { title });

                setFeedback('Collection created successfully');
                if (resetFeedbackTimeout.current) clearTimeout(resetFeedbackTimeout.current);
                resetFeedbackTimeout.current = setTimeout(() => {
                    setFeedback('');
                    resetFeedbackTimeout.current = null;
                }, 2000);

                setIsCreatingCollection(false);

                const newCollection = {
                    ...request.data,
                    title,
                };

                const tableData = tableContext.getTableData();
                const reviewData = reviewContext.getReviewData();

                // update in table

                collectionsCache.table.add({
                    queryKey: tableData.queryKey,
                    currentPage: tableData.page,
                    pageSize: tableData.pageSize,
                    collection: newCollection,
                });

                const isSameQuery = JSON.stringify(tableData.queryKey) == JSON.stringify(reviewData.queryKey);

                // if queries are different, then update in review

                if (!isSameQuery)
                    collectionsCache.review.add({
                        queryKey: reviewData.queryKey,
                        pageSize: reviewData.pageSize,
                        collection: newCollection,
                    });

                formik.resetForm();
            } catch (error) {
                if (error.response) setInputTitleError(error.response.data.value);
                else setInputTitleError(error.message);
                if (resetErrorTimeout.current) clearTimeout(resetErrorTimeout.current);
                resetErrorTimeout.current = setTimeout(() => {
                    setInputTitleError('');
                    resetErrorTimeout.current = null;
                }, 1500);
            }

            setIsCreatingCollection(false);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [reviewContext, tableContext]
    );

    const handleSubmit = useCallback(
        (values) => {
            setInputTitleError('');
            createCollection(values.title);
        },
        [setInputTitleError, createCollection]
    );

    const formik = useFormik({
        initialValues: {
            title: '',
        },
        enableReinitialize: true,
        onSubmit: handleSubmit,
        validate: handleValidation,
    });

    useEffect(() => {
        return () => {
            if (resetErrorTimeout.current) clearTimeout(resetErrorTimeout.current);
            if (resetFeedbackTimeout.current) clearTimeout(resetFeedbackTimeout.current);
        };
    }, []);

    return (
        <Card data-component="CreateCollection">
            <CardBody>
                <h4>Create New Collection</h4>
                <Form
                    onSubmit={formik.handleSubmit}
                    className="collection-form align-items-start"
                    autoComplete="off"
                    inline>
                    <InputGroup className="flex-grow-1">
                        <InputGroupAddon addonType="prepend">Title</InputGroupAddon>
                        <Input
                            invalid={Boolean(inputTitleError)}
                            type="text"
                            name="title"
                            id="title"
                            onChange={formik.handleChange}
                            value={formik.values.title}
                        />

                        <When condition={inputTitleError}>
                            <p className="feedback invalid">{inputTitleError}</p>
                        </When>

                        <When condition={feedback}>
                            <p className="feedback valid">{feedback}</p>
                        </When>
                    </InputGroup>

                    <Button type="submit" color="primary" className="submit-button loader-button">
                        <If condition={isCreatingCollection}>
                            <Then>
                                <Loader />
                            </Then>
                            <Else>{'Create Collection'}</Else>
                        </If>
                    </Button>
                </Form>
            </CardBody>
        </Card>
    );
};
export default CreateCollection;
