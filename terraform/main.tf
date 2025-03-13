data "azurerm_client_config" "current" {}

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

# Create Azure AD Application
resource "azuread_application" "app" {
  display_name = "${var.app_name}-app"
  owners       = [data.azurerm_client_config.current.object_id]
}

# Create Service Principal
resource "azuread_service_principal" "sp" {
  client_id                    = azuread_application.app.client_id
  app_role_assignment_required = false
  owners                      = [data.azurerm_client_config.current.object_id]
}

# Configure OIDC federation
resource "azuread_application_federated_identity_credential" "github_federated" {
  application_id = azuread_application.app.id
  display_name   = "github-actions-oidc"
  description    = "GitHub Actions OIDC"
  audiences      = ["api://AzureADTokenExchange"]
  issuer         = "https://token.actions.githubusercontent.com"
  subject        = "repo:${var.github_repo}:ref:refs/heads/main"
}

# Assign Contributor role to the Service Principal at resource group level
resource "azurerm_role_assignment" "sp_role" {
  scope                = azurerm_resource_group.rg.id
  role_definition_name = "Contributor"
  principal_id         = azuread_service_principal.sp.object_id
}

resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                = "Basic"
  admin_enabled      = true
}

# Assign AcrPush role to the Service Principal
resource "azurerm_role_assignment" "acr_push" {
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "AcrPush"
  principal_id         = azuread_service_principal.sp.object_id
}

resource "azurerm_container_app_environment" "env" {
  name                = var.env_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
}

resource "azurerm_container_app" "app" {
  name                         = var.app_name
  resource_group_name         = azurerm_resource_group.rg.name
  container_app_environment_id = azurerm_container_app_environment.env.id
  revision_mode               = "Single"
  
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
      target_port     = 80
      traffic_weight {
        latest_revision = true
        percentage     = 100
      }
  }
}