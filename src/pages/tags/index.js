import React, { useState, useEffect, useCallback, useRef } from 'react';
import classnames from 'classnames';
import { Row, Col, Card, CardBody } from 'reactstrap';
import PageTitle from '../../components/PageTitle';
import performingBg from '../../assets/images/collections/performing-bg.jpg';
import BlackOverlay from '../../components/BlackOverlay';
import ReviewTags from './ReviewTags';
import CreateTag from './CreateTag';

const Tags = () => {
    const [areProductsByCollectionExtended, setAreProductsByCollectionExtended] = useState(false);
    return (
        <div data-component="Tags">
            <BlackOverlay className={classnames({ visible: areProductsByCollectionExtended })} />
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle breadCrumbItems={[{ label: 'Tags', path: '/tags', active: true }]} title={'Tags'} />
                </Col>
            </Row>
            <Row>
                <ReviewTags setBlackOverlay={setAreProductsByCollectionExtended} />
                <Col xl={6}>
                    <Card className="card--performing">
                        <img alt="Performing Collections" src={performingBg} />
                        <div className="overlay" />
                        <div className="content">
                            <h1>Tags</h1>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col xl={4}>
                    <CreateTag />
                </Col>
                <Col xl={8}>{/* <CollectionsTable /> */}</Col>
            </Row>
        </div>
    );
};

export default Tags;
