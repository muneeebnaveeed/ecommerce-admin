import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, CardBody, Form, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import api from '../../helpers/api';
import { Loader } from '../../components/Loader';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import * as stateActions from '../../redux/stateActions';
import { titleValidation } from '../../constants/validation';

const CreateCollection = (props) => {
    const dispatch = useDispatch();

    const [inputTitle, setInputTitle] = useState('');
    const [inputTitleError, setInputTitleError] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isCreatingCollection, setIsCreatingCollection] = useState(false);

    const resetErrorTimeout = useRef(null);
    const resetFeedbackTimeout = useRef(null);

    const createCollection = async () => {
        try {
            setIsCreatingCollection(true);
            const request = await api.post('/collections', { title: inputTitle });

            const newCollection = {
                ...request.data,
                title: inputTitle,
            };

            dispatch(
                stateActions.updateKeyInCache('collections', 'collections', { [newCollection._id]: newCollection })
            );

            setFeedback('Collection created successfully');
            if (resetFeedbackTimeout.current) clearTimeout(resetFeedbackTimeout.current);
            resetFeedbackTimeout.current = setTimeout(() => {
                setFeedback('');
                resetFeedbackTimeout.current = null;
            }, 2000);
        } catch (error) {
            if (error.response) {
                setInputTitleError(error.response.data.value);
                if (resetErrorTimeout.current) clearTimeout(resetErrorTimeout.current);
                resetErrorTimeout.current = setTimeout(() => {
                    setInputTitleError('');
                    resetErrorTimeout.current = null;
                }, 1500);
                return;
            }
            setInputTitleError(error.message);
            if (resetErrorTimeout.current) clearTimeout(resetErrorTimeout.current);
            resetErrorTimeout.current = setTimeout(() => {
                setInputTitleError('');
                resetErrorTimeout.current = null;
            }, 1500);
        } finally {
            setIsCreatingCollection(false);
        }
    };

    const handleTitleChange = (event) => {
        const input = event.target.value;
        setInputTitle(input);
    };

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
            createCollection();
        }
    };

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
                <Form onSubmit={handleSubmit} className="collection-form align-items-start" autoComplete="off" inline>
                    <InputGroup className="flex-grow-1">
                        <InputGroupAddon addonType="prepend">Title</InputGroupAddon>
                        <Input
                            invalid={Boolean(inputTitleError)}
                            type="text"
                            name="title"
                            onChange={handleTitleChange}
                            value={inputTitle}
                        />

                        {inputTitleError && <p className="feedback invalid">{inputTitleError}</p>}
                        {feedback && <p className="feedback valid">{feedback}</p>}
                    </InputGroup>

                    <Button color="primary" className="submit-button">
                        {!isCreatingCollection ? 'Create Collection' : <Loader />}
                    </Button>
                </Form>
            </CardBody>
        </Card>
    );
};
export default CreateCollection;
