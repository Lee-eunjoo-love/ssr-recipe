const Sample = ({ loadingPost, loadingUsers, post, users }) => {
  return (
    <div>
      <section>
        <h2>포스트</h2>
        {loadingPost && "로딩중..."}
        {!loadingPost && post && (
          <div>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </div>
        )}
      </section>
      <section>
        <h2>사용자</h2>
        {loadingUsers && "로딩중..."}
        {!loadingUsers && users && (
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.name} ({user.username})
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Sample;
