const User = ({ user }) => {
  const { email, name, username } = user;

  return (
    <div>
      {JSON.stringify(user)}
      <h1>
        {username} ({name})
      </h1>
      <p>
        <b>e-mail: </b>
        {email}
      </p>
    </div>
  );
};

export default User;
