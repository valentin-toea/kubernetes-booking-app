# Booking System Project

Kubernetes-based booking system application.

## Overview

This application is designed for booking various services. Users can:

- Register and authenticate.
- Post services they offer.
- Search for available services.
- Schedule appointments for different services.

## Tools Used

The project utilizes the following tools and technologies:

- **Docker**: For containerization of services.
- **Terraform**: For infrastructure automation.
- **KIND**: For creating and managing Kubernetes clusters locally.
- **kubectl**: For managing Kubernetes resources.
- **Node.JS and Nest.JS**: For authentication and backend services.
- **React**: For the frontend service.
- **Prothemeus and Grafana**: For monitoring.

## Preview

| **Screenshots**                                                                                                                                                                                                                                                  |                                                                                                                                                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **HomePage (Categories)** <br> <div style="width: 300px; height: 200px; background-color: white; display: flex; justify-content: center; align-items: center;"><img src="https://i.imgur.com/5YK1TFU.png" style="max-width: 100%; max-height: 100%;" /> </div>   | **Services** <br> <div style="width: 300px; height: 200px; background-color: white; display: flex; justify-content: center; align-items: center;"><img src="https://i.imgur.com/i10YvJ8.png" style="max-width: 100%; max-height: 100%;" /> </div>                   |
| **Service Booking** <br> <div style="width: 300px; height: 200px; background-color: white; display: flex; justify-content: center; align-items: center;"><img src="https://i.imgur.com/DCUa3Er.png" style="max-width: 100%; max-height: 100%;" /> </div>         | **Booking Confirmation** <br> <div style="width: 300px; height: 200px; background-color: white; display: flex; justify-content: center; align-items: center;"><img src="https://i.imgur.com/flJ0R5t.png" style="max-width: 100%; max-height: 100%;" /> </div>       |
| **Add a New Service** <br> <div style="width: 300px; height: 200px; background-color: white; display: flex; justify-content: center; align-items: center;"><img src="https://i.imgur.com/h1pIC3u.png" style="max-width: 100%; max-height: 100%;" /> </div>       | **User Profile (Bookings)** <br> <div style="width: 300px; height: 200px; background-color: white; display: flex; justify-content: center; align-items: center;"><img src="https://i.imgur.com/PiRWYH0.png" style="max-width: 100%; max-height: 100%;" /> </div>    |
| **User Profile (Services)** <br> <div style="width: 300px; height: 200px; background-color: white; display: flex; justify-content: center; align-items: center;"><img src="https://i.imgur.com/JGlDI8A.png" style="max-width: 100%; max-height: 100%;" /> </div> | **View Booking (and Actions)** <br> <div style="width: 300px; height: 200px; background-color: white; display: flex; justify-content: center; align-items: center;"><img src="https://i.imgur.com/lvkYUvX.png" style="max-width: 100%; max-height: 100%;" /> </div> |

## Project Structure

### Root Directory

- **services/**: Contains three subdirectories:
  - `auth`: Authentication and authorization microservice with a Dockerfile.
  - `backend`: Backend logic microservice with a Dockerfile.
  - `frontend`: Frontend logic microservice with a Dockerfile.
- **monitoring/**: Contains files for monitoring and observability tools like Prometheus and Grafana.

### Kubernetes Resources

#### Namespaces

- `auth`: For the authentication service.
- `backend`: For the backend service.
- `frontend`: For the frontend service.
- `database`: For the database and Adminer.
- `monitoring`: For monitoring services like Prometheus and Grafana.
- `portainer`: For managing Kubernetes resources.

#### Deployments

- **Auth Service**:
  - Namespace: `auth`
  - Replicas: 2
  - Image: `auth-service:latest`
- **Backend Service**:
  - Namespace: `backend`
  - Replicas: 2
  - Image: `backend-service:latest`
- **Frontend Service**:
  - Namespace: `frontend`
  - Replicas: 2
  - Image: `frontend-service:latest`
- **Database**:
  - Namespace: `database`
  - Replicas: 1
  - Image: `postgres:latest`
- **Adminer**:
  - Namespace: `database`
  - Replicas: 1
  - Image: `adminer:latest`
- **Prometheus**:
  - Namespace: `monitoring`
  - Replicas: 1
  - Image: `prom/prometheus:latest`
- **Grafana**:
  - Namespace: `monitoring`
  - Replicas: 1
  - Image: `grafana/grafana:latest`
- **Portainer**:
  - Namespace: `portainer`
  - Replicas: 1
  - Image: `portainer/portainer-ce:2.21.5`

#### Services

- **ClusterIP Services**:
  - Auth Service: Port 80 -> 3000
  - Backend Service: Port 80 -> 3100
  - Frontend Service: Port 80 -> 3200
  - Database: Port 5432 -> 5432
  - Adminer: Port 80 -> 8080
  - Prometheus: Port 9090 -> 9090
  - Grafana: Port 3000 -> 3000
  - Portainer: Ports 9000, 9443, 30776

### Monitoring and Management Tools

- **Portainer**: Deployed for managing Kubernetes resources.
- **Prometheus**: Configured for scraping metrics with a `prometheus.yml` configuration.
- **Grafana**: Used for visualizing metrics.
- **Adminer**: Database management tool for PostgreSQL.

## Technologies Used

- Kubernetes (Managed using Kind and Terraform)
- Docker (Containerization)
- Nest.js (Backend)
- Next.js (Frontend)
- PostgreSQL (Database)
- Prometheus and Grafana (Monitoring)
- Portainer (Cluster management)
- Adminer (Database management)

## How to Run

1. **Setup Kubernetes Cluster**:

   - Use `kind-cluster-config.yaml` to create a cluster with 1 control plane and 2 worker nodes.

2. **Build Docker Images**:

   - Navigate to each project folder in `services/` (`auth`, `backend`, `frontend`).
   - Build the Docker images locally using the command:
     ```bash
     docker build -t <image-name>:<tag> .
     ```
   - Push the images to your local Docker registry or a container registry accessible by the Kubernetes cluster.

3. **Deploy Services**:

   - Apply all namespace, deployment, and service configurations from `k8s/`.

4. **Setup Monitoring**:

   - Apply configurations from `monitoring/` to deploy Prometheus and Grafana.

5. **Access Services**:
   - Use `kubectl port-forward` or NodePort configurations to access services like Portainer, Grafana, Adminer, etc.

## Extra

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

Configure adminer:

- kubectl apply -f k8s/deployments/adminer-deployment.yaml
- kubectl apply -f k8s/services/adminer-service.yaml
- kubectl port-forward service/adminer 8080:80 -n database

Configure auth service

- cd ./services/auth
- docker build -t auth-service:latest .
- kind load docker-image auth-service:latest --name booking-app-cluster

- kubectl apply -f k8s/namespaces/auth-namespace.yaml
- kubectl apply -f k8s/deployments/auth-deployment.yaml
- kubectl apply -f k8s/services/auth-service.yaml

- To expose the auth service to local machine: - kubectl port-forward service/auth-service 8090:80 -n auth
- service will be exposed on http://localhost:8080/

Configure backend service

- cd ./services/backend
- docker build -t backend-service:latest .
- kind load docker-image backend-service:latest --name booking-app-cluster

- kubectl apply -f k8s/namespaces/backend-namespace.yaml
- kubectl apply -f k8s/deployments/backend-deployment.yaml
- kubectl apply -f k8s/services/backend-service.yaml

- To expose the auth service to local machine: kubectl port-forward service/backend-service 8091:80 -n backend
- service will be exposed on http://localhost:8090/

Configure frontend service

- cd ./services/frontend
- docker build -t frontend:latest .
- kind load docker-image frontend:latest --name booking-app-cluster

- kubectl apply -f k8s/namespaces/frontend-namespace.yaml
- kubectl apply -f k8s/deployments/frontend-deployment.yaml
- kubectl apply -f k8s/services/frontend-service.yaml

- To expose the auth service to local machine: kubectl port-forward service/frontend 8092:80 -n frontend

Configure monitoring:

prometheus url: http://prometheus.monitoring.svc.cluster.local:9090

- kubectl apply -f monitoring/monitoring-namespace.yaml

- kubectl apply -f monitoring/prometheus-serviceaccount.yaml
- kubectl apply -f monitoring/prometheus-rbac.yaml

- kubectl apply -f monitoring/configmaps/prometheus-config.yaml
- kubectl apply -f monitoring/deployments/prometheus-deployment.yaml
- kubectl apply -f monitoring/services/prometheus-service.yaml

- kubectl apply -f monitoring/deployments/grafana-deployment.yaml
- kubectl apply -f monitoring/services/grafana-service.yaml
