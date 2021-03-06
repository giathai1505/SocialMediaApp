import React, { useState } from 'react';
import { Col, Modal, Row, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { ShowReportModal, HideDetailEdit, deletePost, HideDetailReducer } from '../homeSlice';
import { addActiveId, getPostsByUserId } from '../../user/profileSlice';
import { useNavigate, Link } from 'react-router-dom';
import { DeleteForever, BorderColor } from '@material-ui/icons';
const PostHeader = ({ postId, postUser }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const currentPost = useSelector((state) => state.home.post);

    const userInfoId = useSelector((state) => state.auth.current._id);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    //show report modal
    const showModal = (id) => {
        console.log(id);
        const action = ShowReportModal();
        dispatch(action);
        // setIsShowDialog(!isShowDialog);
    };

    const hanldeShowProfile = (id) => {
        const action = addActiveId(id);
        dispatch(action);
        navigate('/account');
    };

    const hideDetail = () => {
        const action = HideDetailReducer();
        dispatch(action);
    };

    const handleEditPost = () => {
        hideDetail();
    };
    const handleDeletePost = () => {
        setShowDeleteModal(true);
    };

    const closeDialog = () => {
        setShowDeleteModal(false);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const action1 = deletePost(postId);
        await dispatch(action1);
        const action2 = getPostsByUserId(postUser._id);
        await dispatch(action2);
        closeDialog();
        hideDetail();
    };

    return (
        <Row>
            <Col md={1} onClick={() => hanldeShowProfile(postUser._id)}>
                <img src={postUser?.avatar} alt="" />
            </Col>
            <Col md={9} onClick={() => hanldeShowProfile(postUser._id)}>
                <h6>{postUser?.name}</h6>
            </Col>
            {
                //check if user is not the owner of the post
                userInfoId === postUser._id && (
                    <Col className="edit_container" md={2}>
                        <div className="dialog_container">
                            {/* <FontAwesomeIcon
                icon={faEllipsis}
                id="more"
                onClick={() => showModal(postId)}
              /> */}
                            <Link
                                to={`/new`}
                                state={{
                                    post: currentPost,
                                }}
                                className="button edit_btn"
                            >
                                <BorderColor className="editposst" />
                            </Link>
                            <div className="button delete_btn" onClick={() => handleDeletePost()}>
                                <DeleteForever className="deleteposst" />
                            </div>
                        </div>
                    </Col>
                )
            }
            {
                // check show delete modal
                <Modal centered show={showDeleteModal} onHide={closeDialog}>
                    <Modal.Header closeButton>
                        <Modal.Title>X??a b??i vi???t?</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={onSubmit}>
                        <Modal.Body>B??i vi???t s??? ???????c x??a v??nh vi???n!</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={closeDialog}>
                                H???y
                            </Button>
                            <Button variant="secondary" type="submit">
                                X??a
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            }
        </Row>
    );
};

export default PostHeader;
