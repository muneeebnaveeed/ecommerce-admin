import React, { useCallback, useEffect, useState, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
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
    Input,
    InputGroup,
    InputGroupAddon,
    Form,
} from 'reactstrap';
import { Mail, Lock } from 'react-feather';

import { loginUser, loginUserSuccess } from '../../../redux/actions';
import { isUserAuthenticated } from '../../../helpers/authUtils';
import Loader from '../../../components/Loader';
import logo from '../../../assets/images/logo_dark.png';

import { When } from 'react-if';
import api from 'helpers/api';
import { setSession } from 'helpers/authUtils';
import { authValidation } from 'constants/validation';
import { useFormik } from 'formik';

const Login = () => {
    const dispatch = useDispatch();

    const _isMounted = useRef(false);

    const [errors, setErrors] = useState([]);

    const [isLoggingUser, setIsLoggingUser] = useState(false);

    useEffect(() => {
        _isMounted.current = true;
        document.body.classList.add('authentication-bg');

        return () => {
            _isMounted.current = false;
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

    const loginUser = useCallback(
        async (credentials) => {
            setIsLoggingUser(true);
            try {
                const token = await api.post('/auth/login', credentials);
                setSession(token.data);
                dispatch(loginUserSuccess(token.data));
            } catch (err) {
                let errorMessage = err.message;
                if (err.response) errorMessage = err.response.data;
                setErrors((prevErrors) => [...prevErrors, errorMessage]);
            }
            setIsLoggingUser(false);
        },
        [dispatch]
    );

    const handleValidation = useCallback((values) => {
        let formErrors = {};
        const emailError = authValidation.email.validate(values.email?.trim());
        const passwordError = authValidation.password.validate(values.password?.trim());

        if (emailError) formErrors.email = emailError;
        if (passwordError) formErrors.password = passwordError;

        const errorsArray = Object.values(formErrors);

        if (errorsArray.length) setErrors((prevErrors) => [...prevErrors, ...errorsArray]);
        else setErrors([]);

        return formErrors;
    }, []);

    const handleSubmit = useCallback(
        (values, config) => {
            config.validateForm(values);
            config.setErrors({});
            setErrors([]);
            loginUser(values);
        },
        [loginUser]
    );

    const formik = useFormik({
        validateOnBlur: false,
        validateOnChange: false,
        initialValues: {
            email: '',
            password: '',
        },
        enableReinitialize: true,
        onSubmit: handleSubmit,
        validate: handleValidation,
    });

    return (
        <React.Fragment>
            {renderRedirectToRoot()}

            {(_isMounted.current || !isAuthTokenValid) && (
                <div className="account-pages my-5">
                    <Container>
                        <Row className="justify-content-center">
                            <Col xl={10}>
                                <Card className="">
                                    <CardBody className="p-0">
                                        <Row>
                                            <Col md={6} className="p-5 position-relative">
                                                {/* preloader */}
                                                {isLoggingUser && <Loader />}

                                                <div className="mx-auto mb-5">
                                                    <a href="/">
                                                        <img src={logo} alt="" height="24" />
                                                    </a>
                                                </div>

                                                <h6 className="h5 mb-0 mt-4">Welcome back!</h6>
                                                <p className="text-muted mt-1 mb-4">
                                                    Enter your email address and password to access admin panel.
                                                </p>

                                                <Form
                                                    onSubmit={formik.handleSubmit}
                                                    className="authentication-form align-items-start"
                                                    autoComplete="off">
                                                    <When condition={errors}>
                                                        <div className="d-flex flex-column mb-4">
                                                            {errors.map((error, index) => (
                                                                <span
                                                                    key={`error-${index + 1}`}
                                                                    className="text-danger font-weight-bold">
                                                                    {error}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </When>

                                                    <FormGroup>
                                                        <Label for="fullname">Email</Label>
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
                                                        Login
                                                    </Button>
                                                </Form>
                                            </Col>

                                            <Col md={6} className="d-none d-md-inline-block">
                                                <div className="auth-page-sidebar">
                                                    <div className="overlay"></div>
                                                    <div className="auth-user-testimonial"></div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        <Row className="mt-3">
                            <Col className="col-12 text-center">
                                <p className="text-muted">
                                    Don't have access?{' '}
                                    <Link to="/account/register" className="text-primary font-weight-bold ml-1">
                                        Request Access
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

const mapStateToProps = (state) => {
    const { user, loading, error } = state.Auth;
    return { user, loading, error };
};

export default connect(mapStateToProps, { loginUser })(Login);
