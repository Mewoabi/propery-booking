export class HttpError extends Error {
  readonly statusCode: number;
  readonly body: { statusCode: number; message: string | string[]; error: string };

  constructor(statusCode: number, message: string | string[], errorName?: string) {
    const text = Array.isArray(message) ? message.join(', ') : message;
    super(text);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    const error =
      errorName ??
      (statusCode === 400
        ? 'Bad Request'
        : statusCode === 404
          ? 'Not Found'
          : statusCode === 409
            ? 'Conflict'
            : 'Error');
    this.body = {
      statusCode,
      message,
      error,
    };
  }
}
