terraform {
  required_providers {
    basistheory = {
      source  = "basis-theory/basistheory"
      version = ">= 0.8.0"
    }
  }
}

variable "management_api_key" {}

provider "basistheory" {
  api_key = var.management_api_key
}

resource "basistheory_application" "backend_application" {
  name        = "Backend Application"
  type        = "private"
  permissions = [
    "token:use",
  ]
}

resource "basistheory_application" "lithic_proxy_application" {
  name        = "Lithic Proxy Application"
  type        = "private"
  permissions = [
    "token:create",
  ]
}

resource "basistheory_proxy" "lithic_proxy" {
  name               = "Lithic Tokenizer"
  destination_url    = "https://sandbox.lithic.com/v1/cards"
  require_auth       = true
  response_transform  = {
    code = file("./proxy/lithic-proxy-response-transform.js")
  }
  application_id = basistheory_application.lithic_proxy_application.id
}

output "lithic_proxy_key" {
  value       = basistheory_proxy.lithic_proxy.key
  description = "Lithic Proxy Key"
  sensitive   = true
}

output "backend_application_key" {
  value       = basistheory_application.backend_application.key
  description = "Backend API Key"
  sensitive   = true
}