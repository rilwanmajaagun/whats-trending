import { Request, Response, NextFunction } from 'express';
import { Helper, ApiError, constants, ModuleError } from '@src/utils';
import client from '@src/config/twitter';
import config from '@src/config/setup';

const { errorResponse, makeGetRequest, moduleErrLogMessager } = Helper;
const { RESOURCE_NOT_FOUND } = constants;

class TrendMiddleware {
  getGoeCode = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const {
        params: { location },
      } = req;
      const url = `http://www.mapquestapi.com/geocoding/v1/address?key=${
        config!.MAP_REQUEST_API_KEY
      }&location=${location}`;
      const {
        data: { results },
      } = await makeGetRequest(url);
      const { lat, lng } = results[0].locations[0].latLng;
      req.long = lng;
      req.lat = lat;
      return next();
    } catch (error) {
      if (error.status === 404) {
        const apiError = new ApiError({
          status: 404,
          message: RESOURCE_NOT_FOUND('Country'),
        });
        return errorResponse(req, res, apiError);
      }
      return next(error);
    }
  };

  getCountryWoeid = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { lat, long } = req;
      const result = await client.get('trends/closest', { lat, long });
      req.countryWoeid = result[0].woeid;
      return next();
    } catch (e) {
      const status = e.response ? e.response.status : 500;
      const error = new ModuleError({ message: e.message, status });
      moduleErrLogMessager(error);
      if (error.status === 404) {
        const apiError = new ApiError({
          status: 404,
          message: RESOURCE_NOT_FOUND('Country'),
        });
        return errorResponse(req, res, apiError);
      }
      return next(error);
    }
  };
}

export default new TrendMiddleware();
