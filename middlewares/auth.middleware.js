const { constant, statusCodes, tokenTypeEnum} = require('../constants');
const {ApiError} = require('../errors');
const {authService, tokenService, actionTokenService} = require('../services');

module.exports = {
  checkIsAccessToken: async (req,res,next) => {
    try {
      const access_token = req.get(constant.AUTHORISATION); // метод гет даэ можливысть дыстати щось з хедера

      if (!access_token) {
        return next (new ApiError('No token', statusCodes.UNAUTHORIZED));
      }

      tokenService.checkToken(access_token);

      const tokenInfo = await authService.getOneWithUser({access_token});

      if (!tokenInfo) {
        return next (new ApiError('Not valid token', statusCodes.UNAUTHORIZED));
      }

      req.tokenInfo = tokenInfo;
      next();
    } catch (e) {
      next(e);
    }
  },

  checkIsRefreshToken: async (req,res,next) => {
    try {
      const refresh_token = req.get(constant.AUTHORISATION); // метод гет даэ можливысть дыстати щось з хедера

      if (!refresh_token) {
        return next (new ApiError('No token', statusCodes.UNAUTHORIZED));
      }

      tokenService.checkToken(refresh_token, tokenTypeEnum.REFRESH);

      const tokenInfo = await authService.getOneByParams({refresh_token});

      if (!tokenInfo) {
        return next (new ApiError('Not valid token', statusCodes.UNAUTHORIZED));
      }

      req.tokenInfo = tokenInfo;
      next();
    } catch (e) {
      next(e);
    }
  },

  checkIsActionToken: (tokenType) => async (req,res,next) => {
    try {
      const action_token = req.get(constant.AUTHORISATION);

      if (!action_token) {
        return next (new ApiError('No action token', statusCodes.UNAUTHORIZED));
      }

      tokenService.checkToken(action_token, tokenType);

      const tokenInfo = await actionTokenService.getOneByParamsWithUser({tokenType,action_token});

      if (!tokenInfo) {
        return next (new ApiError('Not valid token', statusCodes.UNAUTHORIZED));
      }

      req.tokenInfo = tokenInfo;

      next();
    } catch (e) {
      next(e);
    }
  },

};
