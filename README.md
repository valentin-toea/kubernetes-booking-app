You need to have installed:

- Docker
- Terraform
- KIND
- kubectl

Configure Terraform

- cd ./terraform
- terraform init
- terraform plan
- terraform apply
  verificare: - kubectl get nodes

Configure portainer:

- kubectl apply -f ./monitoring/portainer.yaml
- Expose portainer to local machine: kubectl port-forward service/portainer 9000:9000 -n portainer
- Service available at localhost:9000
  username: admin
  password: adminadmin1234

Configure database:

- kubectl apply -f k8s/namespaces/db-namespace.yaml
- kubectl apply -f k8s/deployments/db-deployment.yaml
- kubectl apply -f k8s/services/db-service.yaml

       Check:
        - kubectl get pods -n database
        - kubectl get services -n database

Configure auth service

- cd ./services/auth
- docker build -t auth-service:latest .
- kind load docker-image auth-service:latest --name booking-app-cluster

- kubectl apply -f k8s/namespaces/auth-namespace.yaml
- kubectl apply -f k8s/deployments/auth-deployment.yaml
- kubectl apply -f k8s/services/auth-service.yaml

- To expose the auth service to local machine: kubectl port-forward service/auth-service 8080:80 -n auth
- service will be exposed on http://localhost:8080/
