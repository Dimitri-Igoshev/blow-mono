export interface IncomingPayload {
  message: string;
  [key: string]: any;
}

export interface ForwardResponse {
  status: string;
  [key: string]: any;
}
