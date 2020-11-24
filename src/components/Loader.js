import React, { Component, useMemo } from 'react';

export const Loader = ({ color = 'light', size = '0.75rem', margin = '' }) => {
    const defaultStyles = useMemo(
        () => ({
            width: size,
            height: size,
            borderWidth: '0.175em',
        }),
        [size]
    );
    return <div className={`spinner-border text-${color} ${margin}`} style={defaultStyles} role="status"></div>;
};

/**
 * Renders the preloader
 */
class PreLoaderWidget extends Component {
    render() {
        return (
            <div className="preloader">
                <div className="status">
                    <Loader color="primary" avatar="sm" margin="mt-2" size="2.5rem" />
                </div>
            </div>
        );
    }
}

export default PreLoaderWidget;
