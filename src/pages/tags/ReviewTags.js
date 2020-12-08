import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Col, Card, CardBody } from 'reactstrap';
import Loader from '../../components/Loader';
import _ from 'lodash';
import classnames from 'classnames';

import Label from '../../components/Label';
import { getTags, getProductsByTag } from '../../constants';
import DropdownPanel from '../../components/DropdownPanel';
import { Trash } from 'react-feather';
import TooltipContainer from 'react-tooltip';
import api from '../../helpers/api';
import { useDispatch } from 'react-redux';
import * as stateActions from '../../redux/stateActions';
import ErrorDialog from '../../components/ErrorDialog';

const ReviewTags = () => <div>Hello</div>;

// const ReviewTags = (props) => {
//     const [fetchTags, isTagsLoading, tags, tagsError, resetTags] = useFetch(getTags, {
//         isCached: true,
//     });

//     const [
//         fetchProductsByTag,
//         isProductsByTagLoading,
//         productsByTag,
//         productsByTagError,
//         resetProductsByTag,
//     ] = useFetch(getProductsByTag, { isCached: true });

//     const [isDeletingTags, setIsDeletingTags] = useState(false);

//     const fetchedTagId = useRef(null);
//     const fetchedTagName = useRef(null);

//     const dispatch = useDispatch();

//     const handleFetchProductsByTag = useCallback(
//         ({ _id, title }) => {
//             props.setBlackOverlay(true);
//             resetProductsByTag.result();
//             if (fetchedTagId.current === _id) {
//                 fetchedTagId.current = null;
//                 fetchedTagName.current = null;
//                 props.setBlackOverlay(false);
//                 return;
//             }

//             let delay = 0;

//             if (productsByTag) delay = 500;

//             setTimeout(() => {
//                 props.setBlackOverlay(true);
//                 fetchedTagId.current = _id;
//                 fetchedTagName.current = title;
//                 fetchProductsByTag(_id);
//             }, delay);
//         },
//         [resetProductsByTag, fetchProductsByTag, productsByTag]
//     );

//     const handleGoBack = useCallback(() => {
//         fetchedTagId.current = null;
//         fetchedTagName.current = null;
//         resetProductsByTag.error();
//     }, [resetProductsByTag]);

//     const handleRetry = useCallback(() => {
//         if (tagsError) {
//             fetchTags();
//             return;
//         }

//         fetchProductsByTag(fetchedTagId.current);
//     }, [tagsError, fetchTags, fetchProductsByTag]);

//     const handleDeleteTags = async () => {
//         setIsDeletingTags(true);
//         try {
//             await api.delete('/tags');
//             resetTags.result();
//             resetTags.cache();
//             dispatch(
//                 stateActions.createToast({
//                     type: 'success',
//                     title: 'Dispatched successfully!',
//                     message: 'Tags have been deleted',
//                 })
//             );
//         } catch (error) {
//             let toastError = error.message;
//             if (error.response) toastError = error.response.data.value;
//             dispatch(
//                 stateActions.createToast({
//                     type: 'danger',
//                     title: 'Oh noes!',
//                     message: 'Cannot delete tags: ' + toastError,
//                 })
//             );
//         } finally {
//             setIsDeletingTags(false);
//         }
//     };

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     useEffect(() => {
//         fetchTags(null, { isCached: true });
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);
//     useEffect(() => console.log('productsByTag', productsByTag), [productsByTag]);
//     return (
//         <Col xl={6}>
//             <div className="position-relative">
//                 <Card>
//                     {(isTagsLoading || isProductsByTagLoading || isDeletingTags) && <Loader />}
//                     <CardBody
//                         className={classnames('card--review', {
//                             'd-flex flex-column align-items-center justify-content-center': !(
//                                 tags?.length || tagsError
//                             ),
//                         })}>
//                         {tags?.length ? (
//                             <React.Fragment>
//                                 <div className="d-flex justify-content-between">
//                                     <h4 className="mb-3">Review Tags</h4>
//                                     <Trash
//                                         onClick={handleDeleteTags}
//                                         className="button-icon"
//                                         data-tip="Delete all tags"
//                                     />
//                                     <TooltipContainer place="left" type="dark" effect="solid" />
//                                 </div>
//                                 <ErrorDialog data={tags} error={tagsError} onRetry={handleRetry} />
//                                 <ErrorDialog
//                                     data={productsByTag}
//                                     goBack
//                                     error={productsByTagError}
//                                     onRetry={handleRetry}
//                                     onGoBack={handleGoBack}
//                                 />
//                                 <div className="collections-container">
//                                     {!productsByTagError &&
//                                         _.map(tags, ({ value, _id }, index) => (
//                                             <Label
//                                                 key={`tag-${index + 1}`}
//                                                 value={value}
//                                                 rest={{
//                                                     onClick: () => handleFetchProductsByTag({ value, _id }),
//                                                 }}
//                                             />
//                                         ))}
//                                 </div>
//                             </React.Fragment>
//                         ) : tagsError ? (
//                             <ErrorDialog error={tagsError} onRetry={() => fetchTags(null, { isCached: true })} />
//                         ) : (
//                             <React.Fragment>
//                                 <h5 className="text-center mb-1">No tags recorded!</h5>
//                                 <h5 className="text-center mt-0">Create new tags to review them.</h5>
//                             </React.Fragment>
//                         )}
//                     </CardBody>
//                 </Card>

//                 <DropdownPanel collection={fetchedTagName.current} products={productsByTag} />
//             </div>
//         </Col>
//     );
// };

export default ReviewTags;
