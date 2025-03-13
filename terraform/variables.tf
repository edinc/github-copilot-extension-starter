variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
  default     = "rg-github-copilot-extension"
}

variable "location" {
  description = "The Azure region to deploy resources"
  type        = string
  default     = "Germany West Central"
}

variable "acr_name" {
  description = "The name of the Azure Container Registry"
  type        = string
  default     = "acrgithubcopilotextension"
}

variable "env_name" {
  description = "The name of the Azure Container App Environment"
  type        = string
  default     = "envgithubcopilotextension"
}

variable "app_name" {
  description = "The name of the Azure Container App"
  type        = string
  default     = "appgithubcopilotextension"
}

variable "identity_name" {
  description = "The name of the managed identity"
  type        = string
  default     = "migithubcopilotextension"
}

variable "subscription_id" {
  description = "The subscription ID for the Azure account"
  type        = string
}

variable "github_repo" {
  description = "The GitHub repository in format owner/repo"
  type        = string
}