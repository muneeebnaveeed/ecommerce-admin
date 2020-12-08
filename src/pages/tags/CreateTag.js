import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, CardBody, Form, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import api from '../../helpers/api';
import { Loader } from '../../components/Loader';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import * as stateActions from '../../redux/stateActions';
import { tagValidation } from '../../constants/validation';

const CreateTag = (props) => {
    const dispatch = useDispatch();

    const [inputTag, setInputTag] = useState('');
    const [inputTagError, setInputTagError] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isCreatingTag, setIsCreatingTag] = useState(false);

    const resetErrorTimeout = useRef(null);
    const resetFeedbackTimeout = useRef(null);

    const createCollection = async () => {
        try {
            setIsCreatingTag(true);
            const request = await api.post('/tags', { value: inputTag });

            const newTag = {
                ...request.data,
                value: inputTag,
            };

            dispatch(stateActions.updateKeyInCache('tags', 'tags', { [newTag._id]: newTag }));

            setFeedback('Tag created successfully');
            if (resetFeedbackTimeout.current) clearTimeout(resetFeedbackTimeout.current);
            resetFeedbackTimeout.current = setTimeout(() => {
                setFeedback('');
                resetFeedbackTimeout.current = null;
            }, 2000);
        } catch (error) {
            if (error.response) {
                setInputTagError(error.response.data.value);
                if (resetErrorTimeout.current) clearTimeout(resetErrorTimeout.current);
                resetErrorTimeout.current = setTimeout(() => {
                    setInputTagError('');
                    resetErrorTimeout.current = null;
                }, 1500);
                return;
            }
            setInputTagError(error.message);
            if (resetErrorTimeout.current) clearTimeout(resetErrorTimeout.current);
            resetErrorTimeout.current = setTimeout(() => {
                setInputTagError('');
                resetErrorTimeout.current = null;
            }, 1500);
        } finally {
            setIsCreatingTag(false);
        }
    };

    const handleTitleChange = (event) => {
        const input = event.target.value;
        setInputTag(input);
    };

    const handleTitleValidation = () => {
        const error = tagValidation.value.validate(inputTag?.trim());
        if (error) {
            setInputTagError(error);
            if (resetErrorTimeout.current) clearTimeout(resetErrorTimeout.current);
            resetErrorTimeout.current = setTimeout(() => {
                setInputTagError('');
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
            setInputTagError('');
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
                <h4>Create New Tag</h4>
                <Form onSubmit={handleSubmit} className="collection-form align-items-start" autoComplete="off" inline>
                    <InputGroup className="flex-grow-1">
                        <InputGroupAddon addonType="prepend">Tag</InputGroupAddon>
                        <Input
                            invalid={Boolean(inputTagError)}
                            type="text"
                            onChange={handleTitleChange}
                            value={inputTag}
                        />

                        {inputTagError && <p className="feedback invalid">{inputTagError}</p>}
                        {feedback && <p className="feedback valid">{feedback}</p>}
                    </InputGroup>

                    <Button color="primary" className="submit-button loader-button">
                        {!isCreatingTag ? 'Create Tag' : <Loader />}
                    </Button>
                </Form>
            </CardBody>
        </Card>
    );
};

export default CreateTag;
