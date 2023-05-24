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
   yarn install
   ```

2. [Create a new Management Application](https://portal.basistheory.com/applications/create?name=Terraform&permissions=application%3Acreate&permissions=application%3Aread&permissions=application%3Aupdate&permissions=application%3Adelete&permissions=proxy%3Acreate&permissions=proxy%3Aread&permissions=proxy%3Aupdate&permissions=proxy%3Adelete&type=management) with full `application` and `proxy` permissions.

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
   echo "BACKEND_APPLICATION_KEY=$(terraform output -raw backend_application_key)\nLITHIC_PROXY_KEY=$(terraform output -raw lithic_proxy_key)\nLITHIC_API_KEY=" > .env
   ```

7. Add your Lithic API Key to the `.env` file:

   ```text
   LITHIC_API_KEY=faf069d7-05ff-4d0e-b041-6c0d4d3c6f21
   ```
   You can find more information on how to get your Lithic Sandbox API Keys
   [here](https://docs.lithic.com/docs/quick-start-generate-api-key).
   
8. Run `yarn start`
