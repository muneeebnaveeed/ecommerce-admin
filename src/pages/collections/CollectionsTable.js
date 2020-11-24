import React, { useEffect, useState } from 'react';
import { Card, CardBody, Table } from 'reactstrap';
import { getCollections } from '../../constants';
import useFetch from '../../helpers/fetch';
import _ from 'lodash';
import ErrorDialog from './ErrorDialog';
import Loader from '../../components/Loader';
import { Edit, Delete } from 'react-feather';
import api from '../../helpers/api';
import * as stateActions from '../../redux/stateActions';
import { useDispatch } from 'react-redux';
import TooltipContainer from 'react-tooltip';

const CollectionsTable = (props) => {
    const [fetchCollections, isCollectionsLoading, collections, collectionsError, resetCollections] = useFetch(
        getCollections,
        {
            isCached: true,
        }
    );

    const [isDeletingCollection, setIsDeletingCollection] = useState(false);

    const [srCollections, setSrCollections] = useState([]);

    const dispatch = useDispatch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchCollections(null, { isCached: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const srColl = _.map(collections, (collection, index) => ({ ...collection, sr: index + 1 }));
        setSrCollections(srColl);
    }, [collections]);

    const handleEditCollection = async (id) => {};

    const handleDeleteCollection = async (id) => {
        setIsDeletingCollection(true);
        try {
            await api.delete(`/collections/${id}`);
            dispatch(stateActions.removeFromCache(id, 'collections', 'collections'));
            dispatch(
                stateActions.createToast({
                    type: 'success',
                    title: 'Dispatched successfully!',
                    message: 'Collection deleted successfully',
                })
            );
        } catch (error) {
            let toastError = error.message;
            if (error.response) toastError = error.response.data.value;
            dispatch(
                stateActions.createToast({
                    type: 'danger',
                    title: 'Oh noes!',
                    message: 'Unable to delete collection: ' + toastError,
                })
            );
        } finally {
            setIsDeletingCollection(false);
        }
    };

    return (
        <Card data-component="CollectionsTable">
            <CardBody>
                <h4>Manage Collections</h4>
                {(isCollectionsLoading || isDeletingCollection) && <Loader />}
                <ErrorDialog error={collectionsError} onRetry={() => fetchCollections(null, { isCached: true })} />
                {!collectionsError && !isCollectionsLoading && (
                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Products</th>
                                <th>Manage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {_.map(srCollections, ({ _id, sr, title, products }, index) => (
                                <tr key={`tabular-collection-${index + 1}`}>
                                    <td>{sr}</td>
                                    <td>{title}</td>
                                    <td>{products?.length || 0}</td>
                                    <td>
                                        <Edit
                                            data-tip="Edit Collection"
                                            data-place="bottom"
                                            className="button-icon mr-1"
                                        />
                                        <Delete
                                            data-tip="Delete Collection"
                                            onClick={() => handleDeleteCollection(_id)}
                                            className="button-icon"
                                            color="#e83e8c"
                                        />
                                        <TooltipContainer type="dark" effect="solid" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
                {!srCollections.length && !collectionsError && <p className="text-center">No Collections Recorded</p>}
            </CardBody>
        </Card>
    );
};
export default CollectionsTable;
