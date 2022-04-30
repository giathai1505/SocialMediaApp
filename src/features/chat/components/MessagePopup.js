import React, { useEffect, useState } from 'react';
import { Close } from '@material-ui/icons';
import { Col, Container, Row } from 'react-bootstrap';
import SingleTag from './SingleTag';
import SingleDestination from './SingleDestination';
import { createConversation, getUserContact } from '../ChatSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetTag } from '../ChatSlice';

const MessagePopup = ({ setIsShowPopup }) => {
    const currentUser = useSelector((state) => state.auth.current);
    const userContact = useSelector((state) => state.chat.userFollowing);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const tags = useSelector((state) => state.chat.tags);
    const conversations = useSelector((state) => state.chat.conversations);

    const handleClick = () => {
        let exist = [];
        if (conversations.length !== 0) {
            exist = conversations.filter((conversation) => {
                const condition1 = conversation.members.length - 1 === tags.length;
                if (condition1) {
                    const tagIds = tags.map((tag) => tag._id);
                    const condition2 = tagIds.every((tagId) => {
                        return conversation.members.includes(tagId);
                    });
                    if (condition2) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            });
        }
        if (exist.length !== 0) {
            navigate(`${exist[0]._id}`);
        } else {
            dispatch(createConversation({ users: tags }))
                .unwrap()
                .then((resultValue) => {
                    navigate(`${resultValue.newConversation._id}`);
                })
                .catch((rejectedValue) => console.log(rejectedValue));
        }

        handleClosePopup();
    };

    const handleClosePopup = () => {
        dispatch(resetTag());
        setIsShowPopup(false);
    };

    useEffect(() => {
        dispatch(getUserContact())
            .unwrap()
            .then((resultValue) => console.log(resultValue))
            .catch((rejectedValue) => console.log(rejectedValue));
        console.log(tags);
    }, []);

    return (
        <>
            <div className="messagePopupOverlay"></div>
            <div className="messagePopup">
                <div className="messagePopup__titleContainer">
                    <Close onClick={handleClosePopup} fontSize="large" style={{ cursor: 'pointer' }} />
                    <h5>New Message</h5>
                    <button
                        className={`messagePopup__titleContainer__button ${tags.length === 0 ? 'disabled' : ''}`}
                        onClick={handleClick}
                    >
                        Next
                    </button>
                </div>
                <Container className="messagePopup__destinations" fluid="md">
                    <Row style={{ padding: '10px 0' }}>
                        <Col md={2}>
                            <h5>To: </h5>
                        </Col>
                        <Col md={10}>
                            <Row className="messagePopup__destinations__tags">
                                {tags.lenght === 0
                                    ? ''
                                    : tags.map((tag, index) => {
                                          return <SingleTag key={index} tag={tag} />;
                                      })}
                            </Row>
                            <Row className="messagePopup__destinations__input">
                                <input type="text" placeholder="Tìm kiếm..." />
                            </Row>
                        </Col>
                    </Row>
                </Container>
                <div className="messagePopup__destinationList">
                    <h6 style={{ margin: '20px 0' }}>Suggested</h6>
                    {userContact.map((follow, index) => {
                        return <SingleDestination follow={follow} key={index} />;
                    })}
                </div>
            </div>
        </>
    );
};

export default MessagePopup;
