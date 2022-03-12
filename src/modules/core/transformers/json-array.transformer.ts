import { ValueTransformer } from 'typeorm';

const JsonArrayTransform: ValueTransformer = {
  from(value: any) {
    if (!value) {
      return [];
    }

    try {
      return JSON.parse(value) ?? [];
    } catch {
      return [];
    }
  },
  to(value: any) {
    if (!value) {
      return;
    }

    try {
      return JSON.stringify(value);
    } catch {
      return;
    }
  },
};

export default JsonArrayTransform;
