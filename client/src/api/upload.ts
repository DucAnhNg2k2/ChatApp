import instanceAxios, { endPointUpload } from ".";

const requestUploadBase64 = (token: string, base64: string) => {
  return instanceAxios.post(
    endPointUpload + "/post-base64",
    { base64 },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export { requestUploadBase64 };
