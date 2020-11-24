import React, { useEffect, useState } from 'react';
import { Toast, ToastHeader, ToastBody } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as stateActions from '../redux/stateActions';

const ToastComponent = ({ type, title, message, duration, id }) => {
    const [isShowing, setIsShowing] = useState(true);
    const dispatch = useDispatch();
    useEffect(() => {
        setTimeout(() => setIsShowing(false), duration);
        setTimeout(() => dispatch(stateActions.removeToast(id)), duration + 500);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Toast isOpen={isShowing}>
            <ToastHeader className={`text-${type}`}>{title}</ToastHeader>
            <ToastBody>{message}</ToastBody>
        </Toast>
    );
};

const ToastContainer = () => {
    const toasts = useSelector((state) => state.Toasts);

    return (
        <div data-component="ToastContainer">
            {toasts.map(({ type, title, message, duration, _id }, index) => (
                <ToastComponent
                    key={`toast-${index + 1}`}
                    type={type}
                    title={title}
                    duration={duration}
                    message={message}
                    id={_id}
                />
            ))}
        </div>
    );
};

export default ToastContainer;
