import { useNavigate, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import axios from "../../../utils/axiosInstance";
import moment from "moment";

const DetailPost = () => {
  const [postDetail, setPostDetail] = useState({});
  const [signeUrl, setSignedUrl] = useState(null);
  const [load, setLoad] = useState(false);
  // const [postId, setPostId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const params = useParams();
  const postId=params.id;

  useEffect(() => {
    const getPostList = async () => {
      try {
        setLoad(true);
        // api request
        const response = await axios.get(`/post/detail-post/${postId}`);
        const data = response.data.data;
        setPostDetail(data.post);

        setLoad(false);
      } catch (error) {
        const response = error.response;
        const data = response.data;
        toast.error(data.message, {
          position: "top-right",
          autoClose: true,
        });
        setLoad(false);
      }
    };

    getPostList();
  }, [postId]);

  useEffect(() => {
    if (postDetail && postDetail?.file) {
      const fileKey = postDetail.file.public_id;
      const getFile = async () => {
        try {
          const response = await axios.get(
            `/file/signed-url?publicId=${fileKey}`
          );
          const url = response.data.url;
          setSignedUrl(url);
        } catch (error) {
          const response = error.response;
          const data = response.data;
          toast.error(data.message, {
            position: "top-right",
            autoClose: true,
          });
        }
      };
      getFile();
    }
  }, [postDetail]);

  const handleDelete= async()=>{
    try{
      const response=await axios.delete(`/post/delete-post/${postId}`)
      const data=response.data
      setShowModal(false)
      console.log(data)
      toast.success(data.message,{
        position:"top-right",
        autoClose:true
      })
      navigate(-1)
    }catch(error){
      const response = error.response;
      const data = response.data;
      toast.error(data.message, {
        position: "top-right",
        autoClose: true,
      });
      setShowModal(false);
    }
  }

  console.log(postDetail);

  const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => navigate(-1)} className="button button-block">
        Go back
      </button>
      <button
        onClick={() => navigate(`/posts/update-post/${postDetail._id}`)}
        className="button button-block"
      >
        Update post
      </button>
      <button onClick={()=>(
        setShowModal(true)
      )} className="button button-block">Delete post</button>
      {load ? (
        <div>Loading..</div>
      ) : (
        <div className="detail-container">
          <h2 className="post-title">Title: {postDetail?.title}</h2>
          <h5 className="post-category">
            Category: {postDetail?.category?.title}
          </h5>
          <h5 className="post-category">
            Created at:{" "}
            {moment(postDetail?.createdAt).format("YYYY-MM-DD HH:mm:ss")}
          </h5>
          <h5 className="post-category">
            Updated at:{" "}
            {moment(postDetail?.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
          </h5>
          <p className="post-desc">{postDetail?.desc}</p>

          <img src={signeUrl} alt="mern" />
        </div>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to delete this post ?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <div style={{ margin: "0 auto" }}>
            <Button onClick={()=>(
              setShowModal(false)
            )} className="no-button">No</Button>
            <Button onClick={handleDelete} className="yes-button">Yes</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DetailPost;
