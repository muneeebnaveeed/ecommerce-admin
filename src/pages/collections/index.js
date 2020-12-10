import React, { useState } from 'react';
import { Row, Col, Card } from 'reactstrap';
import classnames from 'classnames';

import PageTitle from 'components/PageTitle';

import performingBg from 'assets/images/collections/performing-bg.jpg';

import CreateCollection from './CreateCollection';
import CollectionsTable from './CollectionsTable';
import BlackOverlay from 'components/BlackOverlay';

import ReviewCollections from './ReviewCollections';
import { CollectionsContext } from 'helpers/context';
import useCollectionsContextValue from './useCollectionsContextValue';
import PerformingCollections from './PerformingCollections';

import TooltipContainer from 'react-tooltip';

const Collections = () => {
    const [areProductsByCollectionExtended, setAreProductsByCollectionExtended] = useState(false);
    const collectionsContextValue = useCollectionsContextValue();
    return (
        <CollectionsContext.Provider value={collectionsContextValue}>
            <div data-component="Collections">
                <BlackOverlay className={classnames({ visible: areProductsByCollectionExtended })} />
                <Row className="page-title">
                    <Col md={12}>
                        <PageTitle
                            breadCrumbItems={[{ label: 'Collections', path: '/collections', active: true }]}
                            title={'Collections'}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xl={6}>
                        <Card className="card--manage">
                            <img alt="Performing Collections" src={performingBg} />
                            <div className="overlay" />
                            <div className="content">
                                <h1>Collections</h1>
                            </div>
                        </Card>
                    </Col>

                    <ReviewCollections setBlackOverlay={setAreProductsByCollectionExtended} />
                </Row>

                <Row>
                    <Col xl={12}>
                        <PerformingCollections />
                    </Col>
                </Row>

                <Row>
                    <Col xl={4}>
                        <CreateCollection />
                    </Col>
                    <Col xl={8}>
                        <CollectionsTable />
                    </Col>
                </Row>
            </div>
            <TooltipContainer place="left" type="dark" effect="solid" />
        </CollectionsContext.Provider>
    );
};

export default Collections;
