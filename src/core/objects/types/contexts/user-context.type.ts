import { KeyValue } from '../common';

export interface UserContext {
  id: number;
  email: string;
  role: string | number;
  data: KeyValue<unknown>;
}
