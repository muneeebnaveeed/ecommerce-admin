import React from 'react';
import performingBg from 'assets/images/collections/performing-bg.jpg';

const PerformingItem = (props) => {
    const { item } = props;
    return (
        <div className="image-container" data-tip={item?.value || 'Collection'} data-place="top">
            <div className="overlay" />
            <img alt={item?.value || 'Collection'} src={item?.image || performingBg} />
        </div>
    );
};

export default PerformingItem;
