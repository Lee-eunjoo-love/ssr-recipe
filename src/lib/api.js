import axios from "axios";

export const getPost = (id) =>
  axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);

export const getUsers = () => {
  axios.get(`https://jsonplaceholder.typicode.com/users`);
};

export const getUser = (id) => {
  axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
};
