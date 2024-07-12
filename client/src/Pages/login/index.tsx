import { HttpStatusCode } from "axios";
import { IdTokenResult, UserCredential, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import ReactLoading from "react-loading";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { verifyToken } from "../../api";
import { requestGetProfile, requestLogin, requestRegister } from "../../api/auth";
import Modal from "../../Component/Modal";
import { toastObject } from "../../config/toast";
import { setProfile } from "../../Store/Profile";
import { setValueToken } from "../../Store/token";
import { ProfileDTO } from "../../type/ProfileDTO";
import { ResponseType } from "../../type/response.type";
import "./login.scss";
import { auth, FBProvider, GGProvider } from "../../config/firebase";
import { UserType } from "../../type/user-type.enum";
import { isResponseSuccess } from "../../helper/reponse.success";
import { RouterName } from "../../router";

const Login = () => {
  const refLogin = React.useRef<HTMLFormElement>(null);
  const refRegister = React.useRef<HTMLFormElement>(null);
  const refButton = React.useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [usernameLogin, setUsernameLogin] = useState<string>("");
  const [passwordLogin, setPasswordLogin] = useState<string>("");
  const [usernameRegister, setUsernameRegister] = useState<string>("");
  const [passwordRegister, setPasswordRegister] = useState<string>("");
  const [confirmPasswordRegister, setConfirmPasswordRegister] = useState<string>("");

  const handleLogin = async (accessToken: string) => {
    try {
      setIsLoading(true);
      const res: ResponseType = (await verifyToken(accessToken)).data;
      if (res.statusCode === HttpStatusCode.Ok) {
        const { token } = res.data;
        dispatch(setValueToken(token));
        const resProfile: ResponseType = (await requestGetProfile(token)).data;
        if (resProfile.statusCode === HttpStatusCode.Ok) {
          const profile: ProfileDTO = resProfile.data;
          dispatch(setProfile(profile));
          toast.success("Đăng nhập thành công !!", toastObject);
          navigate("/conversation");
        }
      } else {
        toast.error("Đăng nhập thất bại !!", toastObject);
      }
      setIsLoading(false);
    } catch (err) {
      toast.error("Đăng nhập thất bại !!", toastObject);
      toast.error(JSON.stringify(err), toastObject);
      setIsLoading(false);
    }
  };

  const handleLoginByGoogle = async () => {
    try {
      const res: UserCredential = await signInWithPopup(auth, GGProvider);
      const data: IdTokenResult = await res.user.getIdTokenResult();
      const accessToken: string = data.token;
      handleLogin(accessToken);
    } catch (err) {
      console.log(err);
      toast.error("Đăng nhập thất bại !!", toastObject);
    }
  };

  const handleLoginByFacebook = async () => {
    try {
      const res = await signInWithPopup(auth, FBProvider);
      const data: IdTokenResult = await res.user.getIdTokenResult();
      const accessToken: string = data.token;
      handleLogin(accessToken);
    } catch (err) {
      console.log(err);
      toast.error("Đăng nhập thất bại !!", toastObject);
    }
  };

  const handleSelectLogin = () => {
    if (refLogin.current && refRegister.current && refButton.current) {
      refLogin.current.style.left = "50px";
      refRegister.current.style.left = "450px";
      refButton.current.style.left = "0rem";
    }
  };
  const handleSelectRegister = () => {
    if (refLogin.current && refRegister.current && refButton.current) {
      refLogin.current.style.left = "-450px";
      refRegister.current.style.left = "50px";
      refButton.current.style.left = "6rem";
    }
  };

  // Login qua email
  const handleClickLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      setIsLoading(true);
      const responseLogin = await requestLogin(usernameLogin, passwordLogin, UserType.EMAIL);
      if (isResponseSuccess(responseLogin)) {
        const responseLoginData = responseLogin.data;
        const accessToken = responseLoginData?.accessToken;
        if (accessToken) {
          dispatch(setValueToken(accessToken));
          navigate(RouterName.CONVERSATION);
          toast.success("Đăng nhập thành công !!", toastObject);

          // const resProfile: ResponseType = (await requestGetProfile(accessToken)).data;
          // if (resProfile.statusCode === HttpStatusCode.Ok) {
          //   const profile: ProfileDTO = resProfile.data;
          //   dispatch(setProfile(profile));
          //   navigate("/conversation");
          // }
        }
      } else {
        toast.error("Đăng nhập thất bại !!", toastObject);
      }
      setIsLoading(false);
    } catch (err) {
      console.log("[Login] error: ", err);
      toast.error("Đăng nhập thất bại !!", toastObject);
      setIsLoading(false);
    }
  };

  const handleClickRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      if (passwordRegister !== confirmPasswordRegister) {
        toast.error("Mật khẩu không trùng khớp");
        return;
      }
      setIsLoading(true);
      const res: ResponseType = (await requestRegister(usernameRegister, passwordRegister)).data;
      if (res.statusCode === HttpStatusCode.Ok) {
        const { token } = res.data;
        dispatch(setValueToken(token));
        const resProfile: ResponseType = (await requestGetProfile(token)).data;
        if (resProfile.statusCode === HttpStatusCode.Ok) {
          const profile: ProfileDTO = resProfile.data;
          dispatch(setProfile(profile));
          toast.success("Đăng kí thành công !!", toastObject);
          navigate("/conversation");
        }
      } else {
        toast.error("Đăng kí thất bại !!", toastObject);
      }
      setIsLoading(false);
    } catch (err) {
      toast.error("Đăng kí thất bại !!", toastObject);
      toast.error(JSON.stringify(err), toastObject);
      setIsLoading(false);
    }
  };

  return (
    <Modal>
      {isLoading ? (
        <div>
          <ReactLoading type={"spin"} color="#FFF" width={50} height={50} />
        </div>
      ) : (
        <div className="form__box__wrap">
          <div className="button__box__wrap">
            <div className="button-background" ref={refButton}></div>
            <button className="button__box" onClick={handleSelectLogin}>
              Login
            </button>
            <button className="button__box" onClick={handleSelectRegister}>
              Register
            </button>
          </div>
          <div className="social__icons">
            <button className="social__icon__button" onClick={handleLoginByGoogle}>
              <i className="fa-brands fa-google"></i>
            </button>
            <button className="social__icon__button" onClick={handleLoginByFacebook}>
              <i className="fa-brands fa-facebook"></i>
            </button>
            <button className="social__icon__button">
              <i className="fa-brands fa-github"></i>
            </button>
          </div>
          <form id="login" className="input-group" ref={refLogin}>
            <input type="text" className="input-field" placeholder="Username" required onChange={e => setUsernameLogin(e.target.value)} />
            <input type="password" className="input-field" placeholder="Password" required onChange={e => setPasswordLogin(e.target.value)} />
            <button type="submit" className="submit-btn" onClick={e => handleClickLogin(e)}>
              Login
            </button>
          </form>
          <form id="register" className="input-group" ref={refRegister}>
            <input type="text" className="input-field" placeholder="Username" required onChange={e => setUsernameRegister(e.target.value)} />
            <input type="password" className="input-field" placeholder="Password" required onChange={e => setPasswordRegister(e.target.value)} />
            <input type="password" className="input-field" placeholder="Enter Password" required onChange={e => setConfirmPasswordRegister(e.target.value)} />
            <button type="submit" className="submit-btn" onClick={e => handleClickRegister(e)}>
              Register
            </button>
          </form>
        </div>
      )}
    </Modal>
  );
};
export default Login;
