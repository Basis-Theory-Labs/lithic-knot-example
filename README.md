# Lithic / Knot Example

This repository shows how to create and tokenize credit cards with the
[Lithic Create Card API](https://docs.lithic.com/docs/cards#create-card) and
forward this card to another API, for example
[Knot Card Swap](https://docs.knotapi.com/docs/user-update), using
[Basis Theory Proxy](https://docs.basistheory.com/#proxy).

In this example we take 2 simple steps:

1. Use Basis Theory Proxy to call tokenize card data returned from Lithic
2. Use Basis theory Proxy to forward the tokenized card data to KnotAPI

## Run this POC

1. Install dependencies

```bash
yarn || npm install
```

2. Get your Lithic API Keys

You can find more information on how to get your Lithic Sandbox API Keys
[here](https://docs.lithic.com/docs/quick-start-generate-api-key).

3. Add Lithic API key to `index.js`

```javascript
const LITHIC_API_KEY = "<API_KEY>";
```

4. [Create a new Management Application](https://portal.basistheory.com/applications/create?name=Terraform&permissions=application%3Acreate&permissions=application%3Aread&permissions=application%3Aupdate&permissions=application%3Adelete&permissions=proxy%3Acreate&permissions=proxy%3Aread&permissions=proxy%3Aupdate&permissions=proxy%3Adelete&type=management)
   with full `application` and `proxy` permissions.

5. Paste the API key to a new `secret.tfvars` file at this repository root:

```terraform
management_api_key = "key_W8wA8CmcbwXxJsomxeWHVy"
```

6. Initialize Terraform:

```shell
terraform init
```

7. And run Terraform to provision all the required resources:

```shell
terraform apply -var-file=secret.tfvars
```

8. Output your secrets as a json and update `credentials` in index.js with the
   JSON.

   ```shell
   terraform output -json
   ```

   ```js
   const credentials = {
     "inbound_proxy_key": {
       "sensitive": true,
       "type": "string",
       "value": "<sensitive value>",
     },
     "proxy_application": {
       "sensitive": true,
       "type": "string",
       "value": "<sensitive value>",
     },
   };
   ```

9. Run `node index.js`
