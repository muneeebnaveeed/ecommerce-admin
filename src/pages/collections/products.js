import React, { useEffect } from 'react';
import DropdownPanel from '../../components/DropdownPanel';

import { useQuery } from 'react-query';
import { getProductsByCollection } from 'helpers/query';

const Products = ({ extended, collection, isLoading }) => {
    const products = useQuery(['productsByCollection', { id: collection?.id }], getProductsByCollection, {
        enabled: false,
    });

    useEffect(() => {
        if (extended) products.refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [extended]);

    if (products.error && !isLoading.value) {
        isLoading.set(false);
        return null;
    }

    if (products.isLoading) {
        if (!isLoading.value) isLoading.set(true);
        return null;
    } else {
        if (isLoading.value) isLoading.set(false);
    }

    return <DropdownPanel extended={extended} title={collection?.name} data={products?.data} />;
};

export default Products;
