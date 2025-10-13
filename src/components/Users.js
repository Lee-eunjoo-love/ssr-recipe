import { Link } from "react-router-dom";

const Users = (users, user, loading) => {
  if (!users || !users.users) return <div>No data</div>;

  return (
    <div>
      {JSON.stringify(loading)}
      <section>
        {loading && "로딩중..."}
        {!loading && users && users.users && users.users.length > 0 && (
          <ul>
            {users.users.map((user) => (
              <li key={user.id}>
                <Link to={`/users/${user.id}`}>
                  {user.username} ({user.name})
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2>사용자</h2>
        {loading && "로딩중..."}
        {!loading && user && <div>{JSON.stringify(user)}</div>}
      </section>
    </div>
  );
};

export default Users;
