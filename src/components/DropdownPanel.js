import React from 'react';
import { Card, Badge } from 'reactstrap';
import _ from 'lodash';
import classnames from 'classnames';
import moment from 'moment';
import { CURRENCY } from '../constants';
import * as FeatherIcons from 'react-feather';

const Products = ({ extended, title, data = [] }) => {
    return (
        <Card
            data-component="Products"
            className={classnames({
                extended,
            })}>
            <h4 className="title">{title}</h4>
            {data?.length ? (
                _.map(data, ({ title, price, date, type, sku, tags, orders, wishlist }, index) => (
                    <div key={`product-${index + 1}`} className="product">
                        <img alt={title} src="https://via.placeholder.com/300x300" width="200" />
                        <div className={classnames('content', { last: index === data.length - 1 })}>
                            <div>
                                <div className="w-100 d-flex justify-content-between align-items-center">
                                    <h5 className="sku">{sku || 'sku not available'}</h5>
                                    <h5 className="type">{type}</h5>
                                </div>
                                <h5 className="mb-0">
                                    {title} - <span className="price">{`${CURRENCY} ${price}`}</span>
                                </h5>
                                <div className="mt-0 mb-1">
                                    {tags?.length ? (
                                        _.map(tags, (tag, index) => (
                                            <Badge color="pink" className="badge" key={`${title}-badge-${index + 1}`}>
                                                {tag}
                                            </Badge>
                                        ))
                                    ) : (
                                        <Badge>NOT TAGGED YET</Badge>
                                    )}
                                </div>
                                <h5 className="created-on">
                                    Created on {moment(date).format('Do MMMM YYYY [at] h:mm A')}
                                </h5>
                            </div>
                            <div>
                                <div className="m-0 d-flex justify-content-between">
                                    <div>
                                        <FeatherIcons.ShoppingCart className="mr-1" /> {orders}{' '}
                                        <FeatherIcons.Heart className="mx-1" /> {wishlist}
                                    </div>
                                    <div>
                                        <FeatherIcons.Edit className="mr-2 button-icon" />
                                        <FeatherIcons.Eye className="button-icon" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <h4 className="text-center my-4">NO PRODUCTS AVAILABLE</h4>
            )}
        </Card>
    );
};

export default Products;
