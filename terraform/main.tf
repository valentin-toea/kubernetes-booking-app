terraform {
  required_providers {
    null = {
      source  = "hashicorp/null"
      version = "3.2.1"
    }
  }
}

provider "null" {}

resource "null_resource" "create_kind_cluster" {
  provisioner "local-exec" {
    command = <<EOT
    kind create cluster --name ${var.cluster_name} --config ${var.kind_config_file}
    EOT
  }

  triggers = {
    always_run = timestamp()
  }
}

resource "null_resource" "delete_kind_cluster" {
  count = 0
  provisioner "local-exec" {
    command = "kind delete cluster --name ${var.cluster_name}"
  }

  lifecycle {
    prevent_destroy = false
  }
}