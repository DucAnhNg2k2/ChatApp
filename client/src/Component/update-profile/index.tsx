import React from "react";
import ReactLoading from "react-loading";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Store";
import "./index.scss";
import { colors } from "../../const/colors";
import { getAvatar } from "../../utils/avatar.utils";
import { requestUploadFile } from "../../api/file";
import { isResponseSuccess } from "../../helper/reponse.success";
import { requestUpdateProfile } from "../../api/auth";
import { ProfileType } from "../../type/profile-type";
import { setProfile } from "../../Store/Profile";
import { toast } from "react-toastify";
import { toastObject } from "../../config/toast";

interface UpdateProfileProps {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateProfile = ({ setIsVisible }: UpdateProfileProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.token).value;
  const profile = useSelector((state: RootState) => state.profile).data;
  const [isLoading, setIsLoading] = React.useState(false);
  const [name, setName] = React.useState(profile.name);
  const [avatarPath, setAvatarPath] = React.useState(profile.avatar);
  const [file, setFile] = React.useState<File | null>(null);
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
    setIsLoading(true);
    let avatarPath = profile.avatar;
    if (file) {
      const responseUpload = await requestUploadFile(token, file);
      if (isResponseSuccess(responseUpload) && responseUpload.data) {
        avatarPath = responseUpload.data.url;
      }
    }

    const body: ProfileType = {
      id: profile.id,
      userId: profile.userId,
      name: name,
      address: profile.address,
      avatar: avatarPath,
    };
    const resUpdate = await requestUpdateProfile(token, body);
    if (isResponseSuccess(resUpdate)) {
      dispatch(setProfile(body));
      toast.success("Cập nhật thông tin thành công !!", toastObject);
    }
    setIsLoading(false);
  };

  return (
    <div className="update-profile-container">
      <div className="update-profile">
        <input type="file" style={{ display: "none" }} ref={refFile} onChange={handleFile} accept="image/*" />
        <img src={file ? URL.createObjectURL(file) : getAvatar(profile.avatar)} onClick={handleOnClickAvatar} className="update-profile-container-img" />
        <input value={name} type="text" onChange={e => setName(e.target.value)} className="update-profile-container-input" />
        {!isLoading ? (
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
