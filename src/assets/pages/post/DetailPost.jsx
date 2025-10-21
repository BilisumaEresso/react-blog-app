import { useNavigate, useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "../../../utils/axiosInstance";
import moment from "moment";

const DetailPost = () => {
  const [postDetail, setPostDetail] = useState({});
  const [signedUrl, setSignedUrl] = useState(null);
  const [load, setLoad] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const params = useParams();
  const postId = params.id;

  useEffect(() => {
    const getPostList = async () => {
      try {
        setLoad(true);
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

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/post/delete-post/${postId}`);
      const data = response.data;
      setShowModal(false);
      toast.success(data.message, {
        position: "top-right",
        autoClose: true,
      });
      navigate(-1);
    } catch (error) {
      const response = error.response;
      const data = response.data;
      toast.error(data.message, {
        position: "top-right",
        autoClose: true,
      });
      setShowModal(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Beautiful Go Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="group bg-white text-gray-700 px-6 py-3 rounded-3 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium border border-gray-300 hover:border-blue-300 shadow-sm hover:shadow-md flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Posts</span>
          </button>
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Post Details
            </h1>
            <p className="text-gray-600">View your blog post in detail</p>
          </div>
        </div>

        {/* Loading State */}
        {load ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="text-gray-600">Loading post details...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Post Details Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="space-y-6">
                {/* Title Section */}
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    {postDetail?.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 mr-2">
                        Category:
                      </span>
                      {postDetail?.category?.title}
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 mr-2">
                        Created:
                      </span>
                      {moment(postDetail?.createdAt).format(
                        "MMM D, YYYY [at] h:mm A"
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 mr-2">
                        Updated:
                      </span>
                      {moment(postDetail?.updatedAt).format(
                        "MMM D, YYYY [at] h:mm A"
                      )}
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Content
                  </h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {postDetail?.desc}
                    </p>
                  </div>
                </div>

                {/* Image Section */}
                {signedUrl && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Featured Image
                    </h3>
                    <div className="flex justify-center">
                      <img
                        src={signedUrl}
                        alt={postDetail?.title}
                        className="max-w-full h-auto rounded-lg shadow-sm max-h-96 object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* No Image Message */}
                {!signedUrl && postDetail?.file && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-3 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Image Loading
                        </h3>
                        <div className="mt-1 text-sm text-yellow-700">
                          <p>
                            The featured image is currently being processed.
                            Please wait a moment.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons - Moved beneath post details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() =>
                    navigate(`/posts/update-post/${postDetail._id}`)
                  }
                  className="group bg-blue-600 text-white px-8 py-3 rounded-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>Update Post</span>
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="group bg-red-500 text-white px-8 py-3 rounded-3 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>Delete Post</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-b border-gray-200">
          <Modal.Title className="text-lg font-semibold text-gray-900">
            Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete Post
              </h3>
              <p className="text-gray-700">
                Are you sure you want to delete the post "
                <span className="font-semibold">{postDetail?.title}</span>"?
                This action cannot be undone and all associated data will be
                permanently removed.
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-t border-gray-200">
          <div className="flex space-x-3 w-full justify-end">
            <Button
              onClick={() => setShowModal(false)}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-3 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 border-0 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-500 text-white px-6 py-2 rounded-3 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 border-0 transition-colors"
            >
              Delete Post
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DetailPost;
