# Lithic / Knot Example

This repository shows how to create and tokenize credit cards with the
[Lithic Create Card API](https://docs.lithic.com/docs/cards#create-card) and
forward this card to another API, for example
[Knot Card Swap](https://docs.knotapi.com/docs/user-update), using
[Basis Theory Proxy]([https://docs.basistheory.com/#proxy](https://developers.basistheory.com/docs/concepts/what-is-the-proxy)).

Once you have a `Management API Key` everything else is managed in your codebase
and this example we take 2 simple steps to make issuing and card swapping
seemless:

1. Use Basis Theory
   [Pre-Configured Proxy](https://developers.basistheory.com/docs/api/proxies/pre-configured-proxies)
   to call tokenize card data returned from Lithic

   ```mermaid
   sequenceDiagram
     participant backend as Backend
     participant proxy as Pre-configured Proxy
     participant lithic as Lithic API

   backend->>proxy: createCard
   proxy->>lithic: createCard
   lithic->>proxy: response(cardDetails)
   proxy->>proxy: tokenizeCard
   proxy->>backend: response(cardToken)
   ```

2. Use Basis Theory
   [Ephemeral Proxy](https://developers.basistheory.com/docs/api/proxies/ephemeral-proxy)
   to forward the tokenized card data to KnotAPI

   ```mermaid
   sequenceDiagram
     participant backend as Backend
     participant proxy as Ephemeral Proxy
     participant knot as Knot API

   backend->>proxy: updateUser(cardToken)
   proxy->>proxy: detokenizeCard
   proxy->>knot: updateUser(cardDetails)
   knot->>proxy: response
   proxy->>backend: response
   ```

3. Store the `knot_access_token` with your user and you are free to call the
   [KnotAPI](https://docs.knotapi.com/docs/user) directly from your code without
   proxying any additioal calls through Basis Theory - avoiding any latency
   concerns!

## Run this POC

1. Install dependencies

   ```bash
   yarn install
   ```

2. [Create a new Management Application](https://portal.basistheory.com/applications/create?name=Terraform&permissions=application%3Acreate&permissions=application%3Aread&permissions=application%3Aupdate&permissions=application%3Adelete&permissions=proxy%3Acreate&permissions=proxy%3Aread&permissions=proxy%3Aupdate&permissions=proxy%3Adelete&type=management)
   with full `application` and `proxy` permissions.

3. Paste the API key to a new `terraform.tfvars` file at this repository root:

   ```terraform
   # Basis Theory Management Application Key
   management_api_key = "key_W8wA8CmcbwXxJsomxeWHVy"
   ```

4. Initialize Terraform:

   ```shell
   terraform init
   ```

5. Run Terraform to provision all the required resources:

   ```shell
   terraform apply
   ```

6. Generate a Node.js `.env` file based off Terraform outputs:

   ```shell
   echo "BACKEND_APPLICATION_KEY=$(terraform output -raw backend_application_key)\nLITHIC_PROXY_KEY=$(terraform output -raw lithic_proxy_key)\nLITHIC_API_KEY=\nKNOT_API_SECRET=\nKNOT_CLIENT_ID=" > .env
   ```

7. Add your Lithic API Key, Knot API Key, and Knot Client Id to the `.env` file:

   ```text
   BACKEND_APPLICATION_KEY=key_W8wA8CmcbwXxJsomxeWHVy
   LITHIC_PROXY_KEY=TzbxKOVFabX1YZfrZsGVN5
   LITHIC_API_KEY=faf069d7-05ff-4d0e-b041-6c0d4d3c6f21
   KNOT_API_SECRET=e6515555efc84ab097a5af7baa551982
   KNOT_CLIENT_ID=555555-aae3-4cd5-8c5e-64cd293c0451
   ```
   You can find more information on how to get your Lithic Sandbox API Keys
   [here](https://docs.lithic.com/docs/quick-start-generate-api-key).

8. Run `yarn start`
