import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Label,
    FormGroup,
    Button,
    InputGroup,
    InputGroupAddon,
    Form,
    Input,
} from 'reactstrap';
import { Mail, Lock, User } from 'react-feather';

import { isUserAuthenticated } from '../../../helpers/authUtils';
import Loader from '../../../components/Loader';
import logo from '../../../assets/images/logo_dark.png';
import { useFormik } from 'formik';

import { When } from 'react-if';
import { authValidation } from 'constants/validation';
import api from 'helpers/api';

const initialState = {
    fullName: '',
    email: '',
    password: '',
};

const Register = () => {
    const { user } = useSelector((state) => state.Auth);
    const isMounted = useRef(false);

    const [inputError, setInputError] = useState([]);

    const [isRegisteringUser, setIsRegisteringUser] = useState(false);

    const [feedback, setFeedback] = useState('');

    const resetFeedbackTimeout = useRef(null);

    useEffect(() => {
        isMounted.current = true;
        document.body.classList.add('authentication-bg');

        return () => {
            isMounted.current = false;
            document.body.classList.remove('authentication-bg');
        };
    }, []);

    const isAuthTokenValid = isUserAuthenticated();

    /**
     * Redirect to root
     */
    const renderRedirectToRoot = () => {
        if (isAuthTokenValid) {
            return <Redirect to="/" />;
        }
    };

    const registerUser = useCallback(async (credentials) => {
        setIsRegisteringUser(true);
        try {
            await api.post('/auth/register', credentials);
            setFeedback('Request made succesfully');
            if (resetFeedbackTimeout.current) clearTimeout(resetFeedbackTimeout.current);
            resetFeedbackTimeout.current = setTimeout(() => {
                setFeedback('');
                resetFeedbackTimeout.current = null;
            }, 5000);
        } catch (error) {
            let errorMessage = error.message;
            if (error.response) errorMessage = error.response.data;
            setInputError((prevErrors) => [...prevErrors, errorMessage]);
        }
        setIsRegisteringUser(false);
    }, []);

    const handleValidation = useCallback((values) => {
        let errors = {};
        const fullNameError = authValidation.fullName.validate(values.fullName?.trim());
        const emailError = authValidation.email.validate(values.email?.trim());
        const passwordError = authValidation.password.validate(values.password?.trim());

        if (fullNameError) errors.fullName = fullNameError;
        if (emailError) errors.email = emailError;
        if (passwordError) errors.password = passwordError;

        const errorsArray = Object.values(errors);

        if (errorsArray.length) setInputError((prevErrors) => [...prevErrors, ...errorsArray]);
        else setInputError([]);

        return errors;
    }, []);

    const handleSubmit = useCallback((values, { setErrors, validateForm }) => {
        validateForm(values);
        setErrors({});
        setInputError([]);
        registerUser(values);
    }, []);

    const formik = useFormik({
        validateOnBlur: false,
        validateOnChange: false,
        initialValues: initialState,
        enableReinitialize: true,
        onSubmit: handleSubmit,
        validate: handleValidation,
    });

    return (
        <React.Fragment>
            {renderRedirectToRoot()}

            {Object.keys(user || {}).length > 0 && renderRedirectToRoot()}

            {(isMounted.current || !isAuthTokenValid) && (
                <div className="account-pages mt-5 mb-5">
                    <Container>
                        <Row className="justify-content-center">
                            <Col xl={10}>
                                <Card className="">
                                    <CardBody className="p-0">
                                        <Row>
                                            <Col md={6} className="p-5 position-relative">
                                                {/* preloader */}
                                                {isRegisteringUser && <Loader />}

                                                <div className="mx-auto mb-5">
                                                    <a href="/">
                                                        <img src={logo} alt="" height="24" />
                                                    </a>
                                                </div>

                                                <h6 className="h5 mb-0 mt-4">Register your account!</h6>
                                                <p className="text-muted mt-1 mb-4">
                                                    Enter your credentials and submit to request access
                                                </p>

                                                <Form
                                                    onSubmit={formik.handleSubmit}
                                                    className="authentication-form align-items-start"
                                                    autoComplete="off">
                                                    <When condition={inputError.length}>
                                                        <div className="d-flex flex-column mb-4">
                                                            {inputError.map((error, index) => (
                                                                <span
                                                                    className="text-danger font-weight-bold"
                                                                    key={`error-${index + 1}`}>
                                                                    {error}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </When>

                                                    <When condition={feedback}>
                                                        <div className="d-flex flex-column mb-4">
                                                            <span className="text-primary font-weight-bold">
                                                                {feedback}
                                                            </span>
                                                        </div>
                                                    </When>

                                                    <FormGroup>
                                                        <Label for="fullname">Full Name</Label>
                                                        <InputGroup className="form-group flex-grow-1">
                                                            <InputGroupAddon addonType="prepend">
                                                                <span className="input-group-text">
                                                                    <User className="icon-dual" />
                                                                </span>
                                                            </InputGroupAddon>
                                                            <Input
                                                                type="text"
                                                                name="fullName"
                                                                id="fullName"
                                                                onChange={formik.handleChange}
                                                                value={formik.values.fullName}
                                                            />
                                                        </InputGroup>
                                                    </FormGroup>

                                                    <FormGroup>
                                                        <Label for="email">Email</Label>
                                                        <InputGroup className="form-group flex-grow-1">
                                                            <InputGroupAddon addonType="prepend">
                                                                <span className="input-group-text">
                                                                    <Mail className="icon-dual" />
                                                                </span>
                                                            </InputGroupAddon>
                                                            <Input
                                                                type="text"
                                                                name="email"
                                                                id="email"
                                                                onChange={formik.handleChange}
                                                                value={formik.values.email}
                                                            />
                                                        </InputGroup>
                                                    </FormGroup>

                                                    <FormGroup>
                                                        <Label for="password">Password</Label>
                                                        <InputGroup className="form-group flex-grow-1">
                                                            <InputGroupAddon addonType="prepend">
                                                                <span className="input-group-text">
                                                                    <Lock className="icon-dual" />
                                                                </span>
                                                            </InputGroupAddon>
                                                            <Input
                                                                type="password"
                                                                name="password"
                                                                id="password"
                                                                onChange={formik.handleChange}
                                                                value={formik.values.password}
                                                            />
                                                        </InputGroup>
                                                    </FormGroup>

                                                    <Button
                                                        type="submit"
                                                        color="primary"
                                                        className="submit-button loader-button"
                                                        block>
                                                        Request Access
                                                    </Button>
                                                </Form>
                                            </Col>

                                            <Col md={6} className="d-none d-md-inline-block">
                                                <div className="auth-page-sidebar">
                                                    <div className="overlay"></div>
                                                    <div className="auth-user-testimonial" />
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        <Row className="mt-1">
                            <Col className="col-12 text-center">
                                <p className="text-muted">
                                    Already have access?{' '}
                                    <Link to="/account/login" className="text-primary font-weight-bold ml-1">
                                        Sign In
                                    </Link>
                                </p>
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}
        </React.Fragment>
    );
};

export default Register;
