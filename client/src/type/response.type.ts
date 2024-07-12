export interface ResponseType<T = any> {
  statusCode: number;
  message: string;
  data?: T;
}
