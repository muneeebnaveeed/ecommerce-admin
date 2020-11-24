import React from 'react';
import { Row, Col } from 'reactstrap';

import PageTitle from '../../../components/PageTitle';
import Statistics from './Statistics';
import Profiles from './Profiles';

const Widgets = () => {
    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[
                            { label: 'Pages', path: '/ui/widgets' },
                            { label: 'Widgets', path: '/ui/widgets', active: true },
                        ]}
                        title={'Widgets'}
                    />
                </Col>
            </Row>

            <Statistics />
            <Profiles />
        </React.Fragment>
    );
};

export default Widgets;
