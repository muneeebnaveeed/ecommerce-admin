import React from 'react';
import { Button } from 'reactstrap';

const ErrorDialog = (props) => {
    const { data, error, onRetry, goBack = false, onGoBack } = props;
    return (
        error &&
        !data && (
            <div className="flex-center">
                <div className="text-center">
                    <h6>
                        <b>Unable to load:</b> {error.message}
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
            </div>
        )
    );
};

export default ErrorDialog;
