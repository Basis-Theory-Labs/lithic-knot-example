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
      "BT-PROXY-URL": "https://echo.basistheory.com/anything",
      // 'BT-PROXY-URL': 'https://secure.development.knotapi.com/user/update',
    },
    body: {
      client_id: "c9c4c5aa7b4e4ad7af073e8e39b1c7cf",
      secret: "cf819749c0574616ba93b5935b8cf108",
      card: {
        number: `{{${virtualCard.cardToken.id} | json: '$.number'}}`,
        expiration: `{{${virtualCard.cardToken.id} | json: '$.expiration_month'}}/{{${virtualCard.cardToken.id} | json: '$.expiration_year'}}`,
        cvv: `{{${virtualCard.cardToken.id} | json: '$.cvc'}}`,
      },
    },
  });
}

async function makeCards() {
  const bt = await new BasisTheory().init(process.env.BACKEND_APPLICATION_KEY);

  const virtualCard = await makeVirtualCard(bt);

  console.log("");
  console.log("---RESPONSE FROM LITHIC----------------------------");
  console.log("---$.cardToken is the Basis Theory Token-----------");
  console.log(virtualCard);

  const knotResponse = await makeKnotCardSwap(bt, virtualCard);

  console.log("");
  console.log("---RESPONSE FROM ECHO----------------------------");
  console.log("---THIS SHOWS WHAT WOULD BE SENT TO KNOT---------");
  console.log(knotResponse.json);
}

makeCards();
