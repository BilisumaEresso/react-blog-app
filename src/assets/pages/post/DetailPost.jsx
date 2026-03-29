import { useNavigate, useParams } from "react-router-dom";
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
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Beautiful Go Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-all duration-300 font-medium border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm hover:shadow-md flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300"
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
        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-800 p-8 mb-8 shadow-sm transition-colors duration-300">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-2 tracking-tight">
              Post Details
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">View your blog post in detail</p>
          </div>
        </div>

        {/* Loading State */}
        {load ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center shadow-sm animate-pulse transition-colors duration-300">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-md w-1/3 mx-auto mb-6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-1/2 mx-auto mb-4"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl w-full max-w-2xl mx-auto mt-8"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Post Details Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-8 sm:p-10 transition-colors duration-300">
              <div className="space-y-8">
                {/* Title Section */}
                <div className="border-b border-gray-100 dark:border-gray-800 pb-8">
                  <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
                    {postDetail?.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    {postDetail?.category && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold ring-1 ring-blue-600/10 dark:ring-blue-400/20">
                        {postDetail?.category?.title}
                      </span>
                    )}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {moment(postDetail?.createdAt).format("MMM D, YYYY")}
                      </div>
                      {postDetail?.updatedAt && postDetail?.updatedAt !== postDetail?.createdAt && (
                         <div className="flex items-center italic opacity-80">
                           (Updated: {moment(postDetail?.updatedAt).format("MMM D, YYYY")})
                         </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="prose prose-lg prose-blue dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                    {postDetail?.desc}
                  </p>
                </div>

                {/* Image Section */}
                {signedUrl && (
                  <div className="mt-10 overflow-hidden rounded-2xl shadow-lg ring-1 ring-gray-900/5 dark:ring-white/10 group cursor-pointer relative">
                    <img
                      src={signedUrl}
                      alt={postDetail?.title}
                      className="w-full h-auto object-cover max-h-[600px] transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                )}

                {/* No Image Message */}
                {!signedUrl && postDetail?.file && (
                  <div className="bg-yellow-50/50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-xl p-6 mt-8">
                    <div className="flex items-center">
                      <svg
                        className="h-6 w-6 text-yellow-500 flex-shrink-0 mr-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <h3 className="text-sm font-bold text-yellow-800 dark:text-yellow-400">
                          Image Processing
                        </h3>
                        <p className="mt-1 text-sm text-yellow-700/80 dark:text-yellow-500/80 font-medium">
                          The high-resolution featured image is currently being prepared. Please wait a moment.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm transition-colors duration-300">
              <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4">
                <button
                  onClick={() => setShowModal(true)}
                  className="group bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-6 py-3 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 font-bold flex items-center justify-center space-x-2 border border-red-200 dark:border-red-900/30"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete Post</span>
                </button>
                <button
                  onClick={() =>
                    navigate(`/posts/update-post/${postDetail._id}`)
                  }
                  className="group bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300 font-bold shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit Post</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-300">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden text-left align-middle transition-all transform scale-100">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center text-gray-900 dark:text-white bg-white dark:bg-gray-900">
              <h3 className="text-xl font-bold">Confirm Deletion</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {/* Body */}
            <div className="px-6 py-8 bg-white dark:bg-gray-900">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-red-100 dark:bg-red-900/30 p-3 rounded-full mr-4">
                  <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Post</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Are you sure you want to delete the post "<span className="font-semibold text-gray-900 dark:text-white">{postDetail?.title}</span>"? This action <span className="font-bold text-red-500">cannot be undone</span>.
                  </p>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex space-x-3 w-full justify-end">
              <button onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-colors shadow-sm">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-6 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 border-0 transition-colors shadow-sm">
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailPost;
