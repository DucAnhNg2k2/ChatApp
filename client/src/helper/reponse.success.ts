import { HttpStatusCode } from "axios";
import { ResponseType } from "../type/response.type";

export const isResponseSuccess = (response: ResponseType) => {
  return [HttpStatusCode.Ok, HttpStatusCode.Created].includes(response.statusCode);
};
