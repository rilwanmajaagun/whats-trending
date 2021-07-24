import constants from '../constants';
import ModuleError from './module.error';
import { OptionsDto } from '@src/dto/common.dto';

const { DB_ERROR, DB_ERROR_STATUS } = constants;
export default class DBError extends ModuleError {
  status: string | number;

  constructor(options: OptionsDto = {}) {
    super(options);
    this.name = this.constructor.name;
    this.message = options.message || DB_ERROR;
    this.status = options.status || DB_ERROR_STATUS;
  }
}
