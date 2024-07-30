import { ProfileType } from "../type/profile-type";

const profileKey: (keyof ProfileType)[] = ["id", "name", "avatar"];
const profileValidate = (profile: ProfileType): boolean => {
  if (!profile) {
    return false;
  }

  for (const key of profileKey) {
    if (!profile[key]) {
      return false;
    }
  }

  return true;
};

export { profileValidate };
