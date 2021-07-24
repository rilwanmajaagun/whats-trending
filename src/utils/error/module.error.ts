import constants from '../constants';

const { MODULE_ERROR, MODULE_ERROR_STATUS } = constants;

export default class ModuleError extends Error {
  status: number | string;

  errors!: Array<any[]>;

  constructor(options: Record<string, any> = {}) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = options.message || MODULE_ERROR;
    this.status = options.status || MODULE_ERROR_STATUS;
    if (options.errors) this.errors = options.errors;
  }
}
