import instanceAxios, { endPointAuth } from ".";
import { ProfileType } from "../type/profile-type";
import { ResponseType } from "../type/response.type";
import { UserType } from "../enum/user-type.enum";

const endPoint = {
  userProfile: "/user-profile",
  getProfileById: "/get",
  searchProfile: "/search-profile",
  register: "/register",
  login: "/login",
  updateProfile: "/update",
  members: "/members",
};

interface ResponseProfile {
  id: number;
  userId: number;
  name: string;
  address: string;
}
const requestGetProfile = (token: string): Promise<ResponseType<ResponseProfile>> => {
  return instanceAxios
    .get(endPoint.userProfile, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.data);
};

const requestUpdateProfile = (token: string, body: ProfileType) => {
  return instanceAxios.put(
    endPointAuth,
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

const requestProfileGetById = (token: string, uid: number) => {
  return instanceAxios.get(endPointAuth + `/get/${uid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

interface ResponseMembers {
  _id: string;
  userId: number;
  name: string;
}
const requestGetMembers = (token: string, name: string): Promise<ResponseType<ResponseMembers[]>> => {
  return instanceAxios
    .get(endPoint.members + `/get?name=${name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.data);
};

const requestRegister = (username: string, password: string) => {
  return instanceAxios.post(endPointAuth + "/register", {
    username,
    password,
  });
};

interface ResponseLogin {
  accessToken: string;
  refreshToken: string;
}
const requestLogin = (username: string, password: string, userType?: UserType): Promise<ResponseType<ResponseLogin>> => {
  return instanceAxios
    .post(endPointAuth + endPoint.login, {
      email: username,
      password,
      type: userType ?? UserType.EMAIL,
    })
    .then(res => res.data);
};

export { requestRegister, requestLogin };
export { requestGetProfile, requestGetMembers, requestProfileGetById, requestUpdateProfile };
