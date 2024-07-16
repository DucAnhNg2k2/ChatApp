import { ProfileType } from "../type/profile-type";

const CheckProfile = (profile: ProfileType): boolean => {
  if (!profile.id || profile.id === 0) {
    return false;
  }
  if (!profile.name || profile.name.length === 0) {
    return false;
  }
  if (!profile.address || profile.address.length === 0) {
    return false;
  }
  return true;
};

export { CheckProfile };
