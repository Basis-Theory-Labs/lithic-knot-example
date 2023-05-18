const fetch = require('node-fetch');

const LITHIC_API_KEY = ''; // REPLACE WITH LITHIC API KEY
const credentials = {} // REPLACE WITH YOUR TERRAFORM OUTPUT
 
async function makeVirtualCard() {
  return await fetch(`https://api.basistheory.com/proxy?bt-proxy-key=${credentials.inbound_proxy_key.value}`, 
{
  method: 'POST',
  headers: {
    "BT-API-KEY": credentials.proxy_application.value,
    "Authorization": LITHIC_API_KEY,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "type": "VIRTUAL",
    "memo": "New Card",
    "spend_limit": 1000,
    "spend_limit_duration": "TRANSACTION",
    "state": "OPEN",
    "digital_card_art_token": "cc907ab5-541e-44ce-8fed-340ca1f00da0"
  }),
})
  .then(response => response.json())
}

async function makeKnotCardSwap(virtualCard) {
  return await fetch('http://api.basistheory.com/proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'BT-API-KEY': credentials.proxy_application.value,
      'BT-PROXY-URL': 'https://echo.basistheory.com/anything',
      // 'BT-PROXY-URL': 'https://secure.development.knotapi.com/user/update',
    },
    body: JSON.stringify({
      "client_id": "c9c4c5aa7b4e4ad7af073e8e39b1c7cf",
      "secret": "cf819749c0574616ba93b5935b8cf108",
      "card": {
          "number": `{{${virtualCard.cardToken.id} | json: '$.number'}}`,
          "expiration": `{{${virtualCard.cardToken.id} | json: '$.expiration_month'}}/{{${virtualCard.cardToken.id} | json: '$.expiration_year'}}`,
          "cvv": `{{${virtualCard.cardToken.id} | json: '$.cvc'}}`
      },
    })
  })
    .then(response => response.json());
}

async function makeCards() {
  const virtualCard = await makeVirtualCard();

  console.log("")
  console.log("---RESPONSE FROM LITHIC----------------------------")
  console.log("---$.cardToken is the Basis Theory Token-----------")
  console.log(virtualCard)

  const knotResponse = await makeKnotCardSwap(virtualCard);

  console.log("")
  console.log("---RESPONSE FROM ECHO----------------------------")
  console.log("---THIS SHOWS WHAT WOULD BE SENT TO KNOT---------")
  console.log(knotResponse.json);
}


makeCards();