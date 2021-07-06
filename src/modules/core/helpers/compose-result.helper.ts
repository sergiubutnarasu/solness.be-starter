import { GenericResponse } from '../objects';

type ComposeResult<T> = Partial<GenericResponse<T>> & {
  [key: string]: unknown;
};

const composeResult = <T>({
  data,
  success = true,
  message,
  ...restOptions
}: ComposeResult<T> = {}): GenericResponse<T> => ({
  success,
  message,
  data,
  ...restOptions,
});

export default composeResult;
