terraform {
  required_providers {
    basistheory = {
      source  = "basis-theory/basistheory"
      version = ">= 1.0.0"
    }
  }
}

variable "management_api_key" {}
variable "lithic_api_key" {}
variable "knot_client_id" {}
variable "knot_api_secret" {}

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

resource "basistheory_reactor" "knot_reactor" {
  name          = "Knot Reactor"
  code          = file("reactor.js")
  configuration = {
    LITHIC_API_KEY  = var.lithic_api_key
    KNOT_CLIENT_ID  = var.knot_client_id
    KNOT_API_SECRET = var.knot_api_secret
  }
}

output "backend_application_key" {
  value       = basistheory_application.backend_application.key
  description = "Backend API Key"
  sensitive   = true
}

output "knot_reactor_id" {
  value = basistheory_reactor.knot_reactor.id
}
