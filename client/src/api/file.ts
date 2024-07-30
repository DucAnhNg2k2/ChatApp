import instanceAxios from ".";
import { ResponseType } from "../type/response.type";

const endPoint = {
  upload: "files/upload",
  download: "files/download",
};

interface ResponseUpload {
  url: string;
}

const requestUploadFile = (token: string, file: File): Promise<ResponseType<ResponseUpload>> => {
  const formData = new FormData();
  formData.append("file", file);
  return instanceAxios
    .post(endPoint.upload, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then(res => res.data);
};

export { requestUploadFile };
