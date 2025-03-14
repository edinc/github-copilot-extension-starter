data "azurerm_client_config" "current" {}

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

# Create User Assigned Managed Identity
resource "azurerm_user_assigned_identity" "app_identity" {
  name                = "${var.app_name}-identity"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
}

# Configure federated identity credential for the managed identity
resource "azurerm_federated_identity_credential" "github_federated" {
  name                = "github-actions-oidc"
  resource_group_name = azurerm_resource_group.rg.name
  audience            = ["api://AzureADTokenExchange"]
  issuer              = "https://token.actions.githubusercontent.com"
  parent_id           = azurerm_user_assigned_identity.app_identity.id
  subject             = "repo:${var.github_repo}:ref:refs/heads/main"
}

# Assign Contributor role to the Managed Identity at resource group level
resource "azurerm_role_assignment" "identity_role" {
  scope                = azurerm_resource_group.rg.id
  role_definition_name = "Contributor"
  principal_id         = azurerm_user_assigned_identity.app_identity.principal_id
}

resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                = "Basic"
  admin_enabled      = true
}

# Assign AcrPush role to the Managed Identity
resource "azurerm_role_assignment" "acr_push" {
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "AcrPush"
  principal_id         = azurerm_user_assigned_identity.app_identity.principal_id
}

# Assign AcrPull role to the Container App's managed identity
resource "azurerm_role_assignment" "acr_pull" {
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_container_app.app.identity[0].principal_id
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
  
  identity {
    type = "SystemAssigned"
  }

  registry {
    server   = azurerm_container_registry.acr.login_server
    identity = "System"
  }
  
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