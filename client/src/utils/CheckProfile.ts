const CheckProfile = (avatar: string | undefined, displayName: string | undefined): boolean => {
  if (avatar && avatar.length > 0 && displayName && displayName.length > 0) {
    return false;
  }
  return true;
};

export { CheckProfile };
