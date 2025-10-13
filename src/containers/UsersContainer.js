import { connect } from "react-redux";
import Users from "../components/Users";
import { getUsers, getUser } from "../modules/users";
import { useEffect } from "react";

const UsersContainer = ({ users, user, error, loading, getUsers, getUser }) => {
  useEffect(() => {
    const fn = async () => {
      try {
        await getUser(1);
        await getUsers();
      } catch (e) {
        console.log(e);
      }
    };
    fn();
  }, [getUsers, getUser]);

  return <Users users={users} user={user} error={error} loading={loading} />;
};

export default connect(
  ({ users, loading }) => ({
    user: users.user,
    users: users.users,
    loadingPost: loading["users/GET_USER"],
    loadingUsers: loading["users/GET_USERS"],
    error: users.error,
  }),
  {
    getUsers,
    getUser,
  }
)(UsersContainer);
