terraform {
  required_providers {
    basistheory = {
      source  = "basis-theory/basistheory"
      version = ">= 0.7.0"
    }
  }
}

variable "management_api_key" {}

provider "basistheory" {
  api_key = var.management_api_key
}

resource "basistheory_application" "proxy_application" {
  name        = "Proxy Application"
  type        = "private"
  permissions = [
    "token:use",
  ]
}

resource "basistheory_application" "card_tokenizer_application" {
  name        = "Card Tokenizer Application"
  type        = "private"
  permissions = [
    "token:create",
  ]
}

resource "basistheory_proxy" "inbound_proxy" {
  name               = "Lithic Tokenizer"
  destination_url    = "https://sandbox.lithic.com/v1/cards" // replace this with your API endpoint
  require_auth       = true
  response_transform  = {
    code = file("./proxy/lithic-proxy-response-transform.js")
  }
  application_id = basistheory_application.card_tokenizer_application.id
}

output "inbound_proxy_key" {
  value       = basistheory_proxy.inbound_proxy.key
  description = "Inbound Proxy API Key"
  sensitive   = true
}

output "proxy_application" {
  value       = basistheory_application.proxy_application.key
  description = "Proxy API Key"
  sensitive   = true
}