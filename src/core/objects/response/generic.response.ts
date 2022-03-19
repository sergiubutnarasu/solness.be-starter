export interface BaseResponse {
  success: boolean;
  messages?: string[];
}

export class GenericResponse<TItem> implements BaseResponse {
  public success: boolean;
  public messages?: string[];
  public data?: TItem;
  [key: string]: unknown;
}
