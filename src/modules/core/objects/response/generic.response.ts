export class GenericResponse<TItem> {
  public data?: TItem;
  public success: boolean;
  public message?: string;
  [key: string]: unknown;
}
