output "resource_group_name" {
  description = "The name of the resource group"
  value       = azurerm_resource_group.rg.name
}

output "container_app_environment" {
  description = "The name of the Container App Environment"
  value       = azurerm_container_app_environment.env.name
}

output "container_app_name" {
  description = "The name of the Container App"
  value       = azurerm_container_app.app.name
}

output "container_app_url" {
  description = "The URL of the latest revision of the Azure Container App"
  value       = azurerm_container_app.app.latest_revision_fqdn
}

# Required GitHub repository secrets for OIDC authentication
output "azure_subscription_id" {
  description = "Add this as AZURE_SUBSCRIPTION_ID in GitHub repository secrets"
  value       = data.azurerm_client_config.current.subscription_id
}

output "azure_tenant_id" {
  description = "Add this as AZURE_TENANT_ID in GitHub repository secrets"
  value       = data.azurerm_client_config.current.tenant_id
}

output "azure_client_id" {
  description = "Add this as AZURE_CLIENT_ID in GitHub repository secrets"
  value       = azuread_application.app.client_id
}

# Required for container deployment
output "acr_login_server" {
  description = "Azure Container Registry login server"
  value       = azurerm_container_registry.acr.login_server
}

output "acr_username" {
  description = "Azure Container Registry admin username"
  value       = azurerm_container_registry.acr.admin_username
}

output "acr_password" {
  description = "Azure Container Registry admin password"
  value       = azurerm_container_registry.acr.admin_password
  sensitive   = true
}