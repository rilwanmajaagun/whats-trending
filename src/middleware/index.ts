import { Request, Response, NextFunction } from 'express';
import { Helper, ApiError, constants, ModuleError } from '@src/utils';
import client from '@src/config/twitter';
import config from '@src/config/setup';

const { errorResponse, makeGetRequest, moduleErrLogMessager } = Helper;
const { RESOURCE_NOT_FOUND } = constants;

class Middleware {
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
      const {
        latLng: { lat, lng },
        adminArea1,
      } = results[0].locations[0];
      req.long = lng;
      req.lat = lat;
      req.location = location;
      req.alpha2Code = adminArea1;
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

  getLocationAlpha2Code = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const {
        params: { location },
      } = req;
      const { data } = await makeGetRequest(`https://restcountries.eu/rest/v2/name/${location}`);
      const [{ alpha2Code }] = data;
      req.alpha2Code = alpha2Code;
      req.location = location;
      return next();
    } catch (error) {
      return next(error);
    }
  };

  getTopHeadlines = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { alpha2Code } = req;
      const url = `https://newsapi.org/v2/top-headlines?country=${alpha2Code}&apiKey=${config!.NEW_API_KEY}`;
      const {
        data: { articles },
      } = await makeGetRequest(url);
      const news = articles.map((el: Record<string, any>) => {
        return {
          title: el.title,
          description: el.description,
          link: el.url,
        };
      });
      req.news = news;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export default new Middleware();
