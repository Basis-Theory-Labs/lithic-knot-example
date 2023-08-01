const { BasisTheory } = require("@basis-theory/basis-theory-js");

function makeVirtualCard(bt) {
  return bt.proxy.post({
    headers: {
      Authorization: process.env.LITHIC_API_KEY,
      "BT-PROXY-KEY": process.env.LITHIC_PROXY_KEY,
    },
    body: {
      type: "VIRTUAL",
      memo: "New Card",
      spend_limit: 1000,
      spend_limit_duration: "TRANSACTION",
      state: "OPEN",
      digital_card_art_token: "cc907ab5-541e-44ce-8fed-340ca1f00da0",
    },
  });
}

function makeKnotCardSwap(bt, virtualCard) {
  return bt.proxy.post({
    headers: {
      'BT-PROXY-URL': 'https://secure.development.knotapi.com/user/create',
    },
    body: {
      client_id: process.env.KNOT_CLIENT_ID,
      secret: process.env.KNOT_API_SECRET,
      user: {
        external_user_id: "123456789",
        name: {
          first_name: "John",
          last_name: "Doe"
        },
        phone_number: "+5555555555",
        address: {
          street: "123 Main St",
          city: "San Francisco",
          region: "CA",
          postal_code: "94103",
          country: "US"
        },
      },
      card: {
          number: `{{${virtualCard.cardToken.id} | json: '$.number'}}`,
          expiration: `{{${virtualCard.cardToken.id} | json: '$.expiration_month'}}/{{${virtualCard.cardToken.id} | json: '$.expiration_year'}}`,
          cvv: `{{${virtualCard.cardToken.id} | json: '$.cvc'}}`
      },
    }
  });
}

async function makeCards() {
  console.log(process.env.BACKEND_APPLICATION_KEY)
  const bt = await new BasisTheory().init(process.env.BACKEND_APPLICATION_KEY);

  const virtualCard = await makeVirtualCard(bt);

  console.log("");
  console.log("---RESPONSE FROM LITHIC----------------------------");
  console.log("---$.cardToken is the Basis Theory Token-----------");
  console.log(virtualCard);

  const knotResponse = await makeKnotCardSwap(bt, virtualCard);

  console.log("")
  console.log("---RESPONSE FROM KNOT----------------------------")
  console.log("---THIS IS YOUR USER'S ACCESS TOKEN FOR FUTURE CALLS---------")
  console.log(knotResponse);
}

makeCards();
