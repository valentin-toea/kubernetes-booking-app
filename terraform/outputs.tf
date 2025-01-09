output "cluster_name" {
  description = "The name of the Kind cluster"
  value       = var.cluster_name
}

output "kubeconfig_path" {
  description = "The path to the kubeconfig file for the Kind cluster"
  value       = "${pathexpand("~/.kube/config")}"
}