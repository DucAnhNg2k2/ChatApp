import instanceAxios, { endPointAuth } from ".";
import { ProfileDTO } from "../type/ProfileDTO";

const endPoint = {
  getProfile: "/get-profile",
  getProfileById: "/get",
  searchProfile: "/search-profile",
  register: "/register",
  login: "/login",
  updateProfile: "/update",
};

const requestGetProfile = (token: string) => {
  return instanceAxios.get(endPointAuth + "/get-profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const requestProfileGetById = (token: string, uid: number) => {
  return instanceAxios.get(endPointAuth + `/get/${uid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const requestGetUser = (token: string, name: string) => {
  return instanceAxios.get(endPointAuth + `/search-profile?name=${name}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const requestRegister = (username: string, password: string) => {
  return instanceAxios.post(endPointAuth + "/register", {
    username,
    password,
  });
};

const requestLogin = (username: string, password: string) => {
  return instanceAxios
    .post(endPointAuth + endPoint.login, {
      username,
      password,
    })
    .then(res => res.data);
};

const requestUpdateProfile = (token: string, body: ProfileDTO) => {
  return instanceAxios.post(
    endPointAuth + "/update",
    {
      ...body,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export { requestRegister, requestLogin };
export { requestGetProfile, requestGetUser, requestProfileGetById, requestUpdateProfile };
