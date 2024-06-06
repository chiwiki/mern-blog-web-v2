import axios from "axios";

export const filterPaginationData = async ({
  created_new_arr = false,
  state,
  page,
  data,
  data_to_send = {},
  countRoute,
  user,
}) => {
  let obj;
  let headers = {};
  if (user) {
    headers.headers = {
      Authorization: "Bearer " + user,
    };
  }
  if (state !== null && !created_new_arr) {
    // console.log("State not null", page);
    obj = { ...state, results: [...state.results, ...data], page: page };
  } else {
    await axios
      .post(
        import.meta.env.VITE_SERVER + `${countRoute}`,
        data_to_send,
        headers
      )
      .then(({ data: { totalDocs } }) => {
        obj = { results: data, page: 1, totalDocs, deletedDocCount: 0 };
        console.log("manaa blogs: ", obj);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  return obj;
};
