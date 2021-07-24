import constants from '../constants';
import ModuleError from './module.error';

const { INTERNAL_SERVER_ERROR } = constants;

export default class ApiError extends ModuleError {
  status: number;

  errors!: Array<any[]>;

  constructor(options: Record<string, string | any> = {}) {
    super(options);
    this.name = this.constructor.name;
    this.message = <string>options.message || INTERNAL_SERVER_ERROR;
    this.status = <number>options.status || 500;
    if (options.errors) this.errors = options.errors;
  }
}
