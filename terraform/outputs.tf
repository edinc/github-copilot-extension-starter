output "resource_group_name" {
  description = "The name of the resource group"
  value       = azurerm_resource_group.rg.name
}

output "container_app_url" {
  description = "The URL of the latest revision of the Azure Container App"
  value       = azurerm_container_app.app.latest_revision_fqdn
}

output "subscription_id" {
  description = "AZURE_SUBSCRIPTION_ID"
  value       = data.azurerm_client_config.current.subscription_id
}

output "tenant_id" {
  description = "AZURE_TENANT_ID"
  value       = data.azurerm_client_config.current.tenant_id
}

output "client_id" {
  description = "AZURE_CLIENT_ID"
  value       = data.azurerm_client_config.current.client_id
}

output "acr_username" {
  description = "ACR_USERNAME"
  value       = azurerm_container_registry.acr.admin_username
}

output "acr_password" {
  description = "ACR_PASSWORD"
  value       = azurerm_container_registry.acr.admin_password
  sensitive = true
}