data "azurerm_client_config" "current" {}

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = true
}

resource "azurerm_container_app_environment" "env" {
  name                = var.env_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
}

resource "azurerm_container_app" "app" {
  name                = var.app_name
  resource_group_name = azurerm_resource_group.rg.name
  container_app_environment_id = azurerm_container_app_environment.env.id
  revision_mode                = "Single"

  template {
    container {
      name   = var.app_name
      image  = "nginx:latest"  # Placeholder image
      cpu    = "0.5"
      memory = "1.0Gi"
    }
  }

  ingress {
      external_enabled = true
      target_port      = 80
      traffic_weight {
        latest_revision = true
        percentage      = 100
      }
    }
}

resource "azurerm_user_assigned_identity" "identity" {
  name                = var.identity_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
}

resource "azurerm_role_assignment" "acr_pull" {
  principal_id        = azurerm_user_assigned_identity.identity.principal_id
  role_definition_name = "AcrPull"
  scope               = azurerm_container_registry.acr.id
}