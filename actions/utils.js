/* eslint-disable no-underscore-dangle */
/*
 * <license header>
 */

/* This file exposes some common utilities for your actions */

/**
 * Returns a log ready string of the action input parameters.
 * The Authorization header content will be replaced by '<hidden>'.
 *
 * @param {object} params action input parameters.
 * @returns {string}
 */
function stringParameters(params) {
  // shallow copy to not override first level references
  const paramsShallowCopy = { ...params };

  // hide credentials from the include-ims-credentials annotation
  if (params.__ims_oauth_s2s?.client_secret) {
    paramsShallowCopy.__ims_oauth_s2s = {
      ...params.__ims_oauth_s2s,
      client_secret: '<hidden>',
    };
  }

  // hide authorization token
  if (params.__ow_headers?.authorization) {
    paramsShallowCopy.__ow_headers = {
      ...params.__ow_headers,
      authorization: '<hidden>',
    };
  }

  return JSON.stringify(paramsShallowCopy);
}

/**
 * Returns missing keys from an object.
 *
 * @param {object} obj object to check.
 * @param {array} required list of required keys.
 * @returns {array}
 */
function getMissingKeys(obj, required) {
  return required.filter((r) => {
    const splits = r.split('.');
    const last = splits[splits.length - 1];

    const traverse = splits.slice(0, -1).reduce((tObj, split) => {
      const currentObj = tObj || {};
      return currentObj[split] || {};
    }, obj);

    return (
      traverse[last] === undefined
      || traverse[last] === ''
    );
  });
}

/**
 * Returns missing request inputs.
 *
 * @param {object} params action input parameters.
 * @param {array} requiredParams required parameters.
 * @param {array} requiredHeaders required headers.
 * @returns {string|null}
 */
function checkMissingRequestInputs(
  params,
  requiredParams = [],
  requiredHeaders = [],
) {
  let errorMessage = null;

  // input headers are always lowercase
  requiredHeaders = requiredHeaders.map(
    (header) => header.toLowerCase(),
  );

  // check missing headers
  const missingHeaders = getMissingKeys(
    params.__ow_headers || {},
    requiredHeaders,
  );

  if (missingHeaders.length > 0) {
    errorMessage = `missing header(s) '${missingHeaders}'`;
  }

  // check missing params
  const missingParams = getMissingKeys(
    params,
    requiredParams,
  );

  if (missingParams.length > 0) {
    if (errorMessage) {
      errorMessage += ' and ';
    } else {
      errorMessage = '';
    }

    errorMessage += `missing parameter(s) '${missingParams}'`;
  }

  return errorMessage;
}

/**
 * Extract bearer token.
 *
 * @param {object} params action input parameters.
 * @returns {string|undefined}
 */
function getBearerToken(params) {
  if (
    params.__ow_headers
    && params.__ow_headers.authorization
    && params.__ow_headers.authorization.startsWith(
      'Bearer ',
    )
  ) {
    return params.__ow_headers.authorization.substring(
      'Bearer '.length,
    );
  }

  return undefined;
}

/**
 * Build error response object.
 *
 * @param {number} statusCode status code.
 * @param {string} message error message.
 * @param {*} logger optional logger.
 * @returns {object}
 */
function errorResponse(statusCode, message, logger) {
  if (
    logger
    && typeof logger.info === 'function'
  ) {
    logger.info(`${statusCode}: ${message}`);
  }

  return {
    error: {
      statusCode,
      body: {
        error: message,
      },
    },
  };
}

module.exports = {
  errorResponse,
  getBearerToken,
  stringParameters,
  checkMissingRequestInputs,
};