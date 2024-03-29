import React, { useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import Picker from "emoji-picker-react";
import {
  addNewComment,
  CancelReplyCmd,
  createNotification,
} from "../homeSlice";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import useCloseOutSideToClose from "../../../hooks/useCloseOutSideToClose";
import { socket } from "../../../App";
import { BsEmojiLaughing } from "react-icons/bs";

const AddComment = ({ postId, userPostId }) => {
  const current = JSON.parse(localStorage.getItem("LoginUser"));
  const { replingCmt, isLoadingAddCmt, editingCmt } = useSelector(
    (state) => state.home
  );

  // useEffect(() => {
  //   console.log(editingCmt);
  // }, [editingCmt]);
  const dispatch = useDispatch();
  const [showEmoji, setshowEmoji] = useState(false);
  const [inputValue, setinputValue] = useState(editingCmt?.content);

  const submitComment = async () => {
    const message = {
      postId,
      parentId: null,
      message: inputValue,
    };

    let params = {
      content: inputValue,
      postId: postId,
      commentId: replingCmt.CmtID,
    };

    let paramsCreate = {};

    if (
      params.commentId != null &&
      params.commentId != "" &&
      params.commentId != undefined
    ) {
      //tiếp tục kiểu tra xem
      if (replingCmt.CmtUserId == userPostId) {
        //thằng được phản hồi chính là thằng chủ post
        if (current._id != replingCmt.CmtUserId) {
          let notification1 = {
            postId,
            userId: replingCmt.CmtUserId,
            type: 4,
            senderName: current.name,
            img: current.avatar,
          };
          socket.emit("send_notificaton", notification1);
          paramsCreate = {
            receiver: replingCmt.CmtUserId,
            notiType: 4,
            desId: postId,
          };
          const actionCreateNoti = createNotification(paramsCreate);
          dispatch(actionCreateNoti);
        }
      } else {
        //thằng được phản hồi không phải là chủ post
        let notification1 = {
          postId,
          userId: replingCmt.CmtUserId,
          type: 4,
          senderName: current.name,
          img: current.avatar,
        };
        paramsCreate = {
          receiver: replingCmt.CmtUserId,
          notiType: 4,
          desId: postId,
        };
        const actionCreateNoti = createNotification(paramsCreate);
        dispatch(actionCreateNoti);
        socket.emit("send_notificaton", notification1);
        if (current._id != userPostId) {
          let notification = {
            postId,
            userId: userPostId, // cái này là id của thằng cần gửi thông báo tới
            type: 1,
            senderName: current.name,
            img: current.avatar,
          };
          socket.emit("send_notificaton", notification);
          const paramsCreate1 = {
            receiver: userPostId,
            notiType: 1,
            desId: postId,
          };
          const actionCreateNoti1 = createNotification(paramsCreate1);
          dispatch(actionCreateNoti1);
        }
      }
    } else {
      if (current._id != userPostId) {
        let notification = {
          postId,
          userId: userPostId, // cái này là id của thằng cần gửi thông báo tới
          type: 1,
          senderName: current.name,
          img: current.avatar,
        };
        socket.emit("send_notificaton", notification);

        paramsCreate = {
          receiver: userPostId,
          notiType: 1,
          desId: postId,
        };
        const actionCreateNoti = createNotification(paramsCreate);
        dispatch(actionCreateNoti);
      }
    }

    const action = addNewComment(params);
    //const action1 = getCommentsByPostID(postId);

    //trước khi gửi emmit thì gọi api add comment vào trong backend
    try {
      await dispatch(action).unwrap();
      // await dispatch(action1).unwrap();
    } catch (err) {
      console.log(err);
    }

    socket.emit("send_message", message);

    setinputValue("");
    setshowEmoji(false);
  };

  const handleEmojiClick = (event, emojiObject) => {
    setinputValue((a) => a + emojiObject.emoji);
    //setshowEmoji(false);
  };

  const DeleteReply = () => {
    const action = CancelReplyCmd();
    dispatch(action);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      submitComment();
    }
  };

  let domNode = useCloseOutSideToClose(() => {
    setshowEmoji(false);
  });

  return (
    <Row className="addComment">
      <div
        className="load"
        style={{ display: isLoadingAddCmt == true ? "" : "none" }}
      >
        <Spinner animation="border" variant="primary" size="sm" />
      </div>
      <Col md={1}>
        <BsEmojiLaughing onClick={() => setshowEmoji(!showEmoji)} />
      </Col>
      {showEmoji && (
        <Picker
          ref={domNode}
          className="addComment_emoji"
          onEmojiClick={handleEmojiClick}
          pickerStyle={{
            width: "100%",
            outerHeight: "100%",
            innerHeight: "100px",
          }}
        ></Picker>
      )}
      <Col md={9} className="reply">
        {replingCmt.CmtUserName == "" ? (
          ""
        ) : (
          <span className="replyName">
            <span>{replingCmt.CmtUserName}</span>
            <FontAwesomeIcon onClick={DeleteReply} icon={faCircleXmark} />
          </span>
        )}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setinputValue(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
          placeholder="Thêm bình luận..."
        ></input>
      </Col>
      <Col md={2}>
        <p
          style={{ textAlign: "right" }}
          className="addComment_btn"
          onClick={submitComment}
        >
          Đăng
        </p>
      </Col>
      {/* <ErrToast /> */}
    </Row>
  );
};

export default AddComment;
