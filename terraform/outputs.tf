output "AZURE_CLIENT_ID" {
  value = azurerm_user_assigned_identity.app_identity.client_id
  description = "The client ID of the managed identity. Store this as AZURE_CLIENT_ID in GitHub secrets."
}

output "AZURE_SUBSCRIPTION_ID" {
  value = data.azurerm_client_config.current.subscription_id
  description = "The Azure subscription ID. Store this as AZURE_SUBSCRIPTION_ID in GitHub secrets."
}

output "AZURE_TENANT_ID" {
  value = data.azurerm_client_config.current.tenant_id
  description = "The Azure tenant ID. Store this as AZURE_TENANT_ID in GitHub secrets."
}

output "ACR_LOGIN_SERVER" {
  value = azurerm_container_registry.acr.login_server
  description = "The ACR login server URL. Store this as ACR_LOGIN_SERVER in GitHub secrets."
}

output "ACR_NAME" {
  value = azurerm_container_registry.acr.name
  description = "The name of the Azure Container Registry. Store this as ACR_NAME in GitHub secrets."
}

output "RESOURCE_GROUP_NAME" {
  value = azurerm_resource_group.rg.name
  description = "The name of the resource group. Store this as RESOURCE_GROUP_NAME in GitHub secrets."
}

output "CONTAINER_APP_NAME" {
  value = azurerm_container_app.app.name
  description = "The name of the container app. Store this as CONTAINER_APP_NAME in GitHub secrets."
}

output "CONTAINER_APP_ENVIRONMENT" {
  value = azurerm_container_app_environment.env.name
  description = "The name of the container app environment. Store this as CONTAINER_APP_ENVIRONMENT in GitHub secrets."
}

output "CONTAINER_APP_URL" {
  value       = "https://${azurerm_container_app.app.latest_revision_fqdn}"
  description = "The URL of the container app. This URL should be used for the GitHub App configuration."
}