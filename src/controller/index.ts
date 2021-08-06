import googleTrends from 'google-trends-api';
import { Request, Response, NextFunction } from 'express';
import { Helper, ModuleError } from '@src/utils';
import client from '@src/config/twitter';

const { successResponse, moduleErrLogMessager } = Helper;

class Controller {
  twitterTrends = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { countryWoeid, location } = req;
      const data = await client.get('trends/place', { id: countryWoeid });
      const newData = data[0].trends.map((el: Record<string, string>) => el.name);

      return successResponse(res, {
        message: `${location} trends`,
        data: newData,
      });
    } catch (e) {
      const status = e.response ? e.response.status : 500;
      const error = new ModuleError({ message: e.message, status });
      moduleErrLogMessager(error);
      return next(error);
    }
  };

  news = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { news, location } = req;
      return successResponse(res, {
        message: `${location} news`,
        data: news,
      });
    } catch (error) {
      return next(error);
    }
  };

  googleTrends = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { alpha2Code, location } = req;
      const data = await googleTrends.dailyTrends({
        geo: alpha2Code,
      });
      const {
        default: { trendingSearchesDays },
      } = JSON.parse(data);
      const [{ trendingSearches }] = trendingSearchesDays;
      const trendList = trendingSearches.map((el: Record<string, Record<string, string>>) => el.title.query);

      return successResponse(res, {
        message: `${location} google trends`,
        data: trendList,
      });
    } catch (error) {
      return next(error);
    }
  };
}

export default new Controller();
