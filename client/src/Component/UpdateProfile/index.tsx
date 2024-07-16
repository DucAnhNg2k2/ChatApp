import React from "react";
import ReactLoading from "react-loading";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Store";
import "./index.scss";
import { colors } from "../../const/colors";

interface UpdateProfileProps {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateProfile = ({ setIsVisible }: UpdateProfileProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.token).value;
  const profile = useSelector((state: RootState) => state.profile);
  const [name, setName] = React.useState(profile.data.name);
  const [file, setFile] = React.useState<File | null>(null);
  const [load, setLoad] = React.useState(false);
  const refFile = React.useRef<HTMLInputElement>(null);

  const handleOnClickAvatar = () => {
    if (refFile.current) {
      refFile.current.click();
    }
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (event.target.files) {
        const file = event.target.files[0];
        setFile(file);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleButton = async () => {
    // if (name) {
    //   setLoad(true);
    //   if (file) {
    //     const reader = new FileReader();
    //     reader.onloadend = async () => {
    //       const resultBase64String = reader.result as string;
    //       const res: ResponseType = (await requestUploadBase64(token, resultBase64String)).data;
    //       if (res.statusCode === HttpStatusCode.Ok) {
    //         const url = res.data;
    //         const { id,  } = profile.data;
    //         const body: ProfileDTO = { avatar: url, displayName, id, gmail };
    //         const resUpdate: ResponseType = await (await requestUpdateProfile(token, body)).data;
    //         if (resUpdate.statusCode === 200) {
    //           dispatch(setProfile(resUpdate.data));
    //           setIsVisible(false);
    //         }
    //       }
    //     };
    //     reader.readAsDataURL(file);
    //   } else if (avatar) {
    //     const { id, gmail } = profile.data;
    //     const body: ProfileDTO = { avatar, displayName, id, gmail };
    //     const resUpdate: ResponseType = await (await requestUpdateProfile(token, body)).data;
    //     if (resUpdate.statusCode === 200) {
    //       dispatch(setProfile(resUpdate.data));
    //       setIsVisible(false);
    //     }
    //   }
    //   setLoad(false);
    // }
  };

  return (
    <div className="update-profile-container">
      <div className="update-profile">
        <input type="file" style={{ display: "none" }} ref={refFile} onChange={handleFile} accept="image/*" />
        {/* <img src={file ? URL.createObjectURL(file) : AvatarDefault(avatar)} onClick={handleOnClickAvatar} className="update-profile-container-img" /> */}
        <input value={name} type="text" onChange={e => setName(e.target.value)} className="update-profile-container-input" />
        {!load ? (
          <button className="update-profile-container-button" onClick={handleButton}>
            Update Profile
          </button>
        ) : (
          <ReactLoading type={"spin"} color={colors.white} width={30} height={30} className="update-profile-load" />
        )}
      </div>
    </div>
  );
};

export default UpdateProfile;
