const axios = require('axios');
const {
  CustomHttpResponseError,
} = require('@basis-theory/basis-theory-reactor-formulas-sdk-js');

const retrieveLithicCard = async ({ lithicCardToken, LITHIC_API_KEY }) => {
  const { data } = await axios.get(
    `https://sandbox.lithic.com/v1/cards/${lithicCardToken}`,
    {
      headers: {
        Authorization: LITHIC_API_KEY,
      },
    },
  );
  return data;
};

const postCardToKnot = async ({ payload, KNOT_CLIENT_ID, KNOT_API_SECRET }) => {
  const { data } = await axios.post(
    `https://development.knotapi.com/card/test`,
    payload,
    {
      headers: {
        'Knot-Version': '2.0',
      },
      auth: {
        username: KNOT_CLIENT_ID,
        password: KNOT_API_SECRET,
      },
    },
  );

  return data;
};

module.exports = async function (req) {
  const {
    args: { lithicCardToken, ...knotPayload },
    configuration: { LITHIC_API_KEY, KNOT_CLIENT_ID, KNOT_API_SECRET },
  } = req;

  try {
    const { pan, cvv, exp_month, exp_year } = await retrieveLithicCard({
      lithicCardToken,
      LITHIC_API_KEY,
    });

    const knotResponse = await postCardToKnot({
      payload: {
        card: {
          number: pan,
          expiration: `${exp_month}/${exp_year}`,
          cvv,
        },
        ...knotPayload,
      },
      KNOT_CLIENT_ID,
      KNOT_API_SECRET,
    });

    return {
      raw: knotResponse,
    };
  } catch (error) {
    if (error.response) {
      throw new CustomHttpResponseError({
        status: error.response.status,
        body: error.response.data,
        headers: error.response.headers,
      });
    }
    if (error.request) {
      throw new CustomHttpResponseError({
        status: 400,
        body: {
          error: 'Request malformed',
          // this exposes the request containing PAN, only use during development
          // error: error.toJSON()
        },
      });
    }
    throw new CustomHttpResponseError({
      status: 500,
      body: {
        error: error.message,
      },
    });
  }
};
