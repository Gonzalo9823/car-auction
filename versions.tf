terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region     = "us-east-1"
  access_key = "AKIAWWLVFZTMVMF4EEE5"
  secret_key = "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"

  default_tags {
    tags = {
      Name = "car-auction"
    }
  }
}

variable "app_count" {
  type    = number
  default = 1
}
