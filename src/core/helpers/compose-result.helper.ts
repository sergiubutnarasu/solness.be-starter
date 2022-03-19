import { GenericResponse } from '../objects';

type ComposeResult<T> = Partial<GenericResponse<T>> & {
  [key: string]: unknown;
};

const composeResult = <T>({
  data,
  success = true,
  messages,
  ...restOptions
}: ComposeResult<T> = {}): GenericResponse<T> => ({
  success,
  messages,
  data,
  ...restOptions,
});

export default composeResult;
