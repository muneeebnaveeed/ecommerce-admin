import React from 'react';
import { Button } from 'reactstrap';

const ErrorDialog = ({ data, error, onRetry, goBack = false, onGoBack }) =>
    error &&
    !data && (
        <div className="text-center">
            <h6>
                <b>Unable to load:</b> {error}
            </h6>
            <Button onClick={onRetry} color="danger" block>
                Retry
            </Button>
            {goBack && (
                <Button onClick={onGoBack} color="secondary" outline block>
                    Go Back!
                </Button>
            )}
        </div>
    );

export default ErrorDialog;
