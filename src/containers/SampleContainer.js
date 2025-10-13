import { connect } from "react-redux";
import Sample from "../components/Sample";
import { getPost, getUsers } from "../modules/sample";
import { useEffect } from "react";
import { Preloader } from "../lib/PreloadContext";

const SampleContainer = ({
  post,
  users,
  error,
  loading,
  getPost,
  getUsers,
}) => {
  useEffect(() => {
    const fn = async () => {
      try {
        await getPost(1);
        await getUsers();
      } catch (e) {
        console.log(e);
      }
    };
    fn();
  }, [getPost, getUsers]);

  return (
    <>
      <Sample post={post} users={users} error={error} loading={loading} />
      <Preloader resolve={() => getPost} />
      <Preloader resolve={() => getUsers} />
    </>
  );
};

export default connect(
  ({ sample, loading }) => ({
    post: sample.post,
    users: sample.users,
    loadingPost: loading["sample/GET_POST"],
    loadingUsers: loading["sample/GET_USERS"],
    error: sample.error,
  }),
  {
    getPost,
    getUsers,
  }
)(SampleContainer);
