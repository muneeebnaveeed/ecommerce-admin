import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { useQuery } from 'react-query';
import { getPerformingCollections } from 'helpers/query';
import Loader from 'components/Loader';
import ErrorDialog from 'components/ErrorDialog';

import _ from 'lodash';
import PerformingItem from 'components/PerformingItem';
import { Else, If, Then, When } from 'react-if';

const PerformingCollections = () => {
    const { isLoading, error, data, refetch } = useQuery('performing-collections', getPerformingCollections, {
        retry: false,
    });
    return (
        <React.Fragment>
            <Card>
                <When condition={isLoading}>
                    <Loader />
                </When>
                <If condition={error}>
                    <Then>
                        <CardBody>
                            <ErrorDialog data={data} error={error} onRetry={refetch} />
                        </CardBody>
                    </Then>
                    <Else>
                        <div className="card--performing">
                            <div className="images-container">
                                {_.map(data, (collection) => (
                                    <PerformingItem item={collection} />
                                ))}
                            </div>
                            <div className="overlay" />
                            <div className="content">
                                <h1>Performing Collections</h1>
                            </div>
                        </div>
                    </Else>
                </If>
            </Card>
        </React.Fragment>
    );
};

export default PerformingCollections;
