export class ResponseDto<T> {
  status: number;
  message: string;
  data: Promise<T>;

  constructor(status: number, message: string, data: Promise<T>) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  static createWithoutData<T>(status: number, message: string): ResponseDto<T> {
    return new ResponseDto<T>(status, message, null);
  }
}