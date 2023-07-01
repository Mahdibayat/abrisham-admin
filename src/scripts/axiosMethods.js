import axios from "axios";
import Notiflix from "notiflix";

export const baseUrl = import.meta.env.VITE_SITE_BASE_URL;
export const baseUrlImage = import.meta.env.VITE_IMAGE_BASE_URL;

axios.defaults.headers.common["Content-Type"] = "multipart/form-data";

function handleError(error) {
  console.log("HANDLE ERROR FIRE : ", error);
  let errors = Object.values(error);
  let errorMsg = "";
  errors.forEach((e, i) => (i === 0 ? (errorMsg += e) : (errorMsg += `, ${e}`)));
  Notiflix.Notify.failure(errorMsg);
}

axios.interceptors.response.use(
  (res) => {
    // const token = localStorage['access_token'];
    return res;
  },
  (error) => {
    const { data, status } = error.response || error.response;
    if (status < 500 && !!data.errors) {
      handleError(data.errors);
      return Promise.reject(error);
    }

    if (status === 401) {
      localStorage.removeItem("access_token");
      Notiflix.Notify.failure("محدودیت دسترسی");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (status >= 500) {
      Notiflix.Notify.failure("خطایی در برقراری با سرور به وجود آمده است لطفا دوباره تلاش کنید");
      return Promise.reject(error);
    } else {
      return "client error";
    }
  }
);

export const http = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
