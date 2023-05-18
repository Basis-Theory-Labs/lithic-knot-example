module.exports = async function (req) {
  const { bt, args: { body, headers } } = req;

  try {
    const cardToken = await bt.tokens.create({
      type: 'card',
      data: {
        number: body.pan,
        cvc: body.cvv,
        expiration_month: body.exp_month,
        expiration_year: body.exp_year,
      }
    });

    let returnBody = body;
    delete returnBody.pan;
    delete returnBody.cvv;
    delete returnBody.exp_month;
    delete returnBody.exp_year;
    returnBody.cardToken = cardToken;

    return {
        body: returnBody,
        headers
    }
  } catch (e) {
    return {
      body: e
    }
  }
  

};
