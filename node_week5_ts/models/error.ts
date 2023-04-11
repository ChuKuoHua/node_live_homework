export interface IError extends Error {
  statusCode?: number;
  name: string;
  isOperational?: boolean;
}

export interface wwwIError {
  syscall: string;
  code: string;
}