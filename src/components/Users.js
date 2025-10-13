import { Link } from "react-router-dom";

const Users = (users) => {
  if (!users || !users.users) return;

  return (
    <div>
      <section>
        {users && users.users && (
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
    </div>
  );
};

export default Users;
