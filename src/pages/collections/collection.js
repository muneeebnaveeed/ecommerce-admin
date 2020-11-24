import React from 'react';
import { Button, Badge } from 'reactstrap';

const Collection = ({ value, productCount, rest }) => {
    return (
        <Button data-component="Collection" color="secondary" outline {...rest}>
            {value} {productCount ? <Badge color="pink">{productCount}</Badge> : null}
        </Button>
    );
};

export default Collection;
