output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}

output "container_app_url" {
  value = azurerm_container_app.app.latest_revision_fqdn
}