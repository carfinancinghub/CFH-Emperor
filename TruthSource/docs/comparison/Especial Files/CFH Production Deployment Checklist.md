🏛️ CFH Production Deployment Checklist
Version: 1.0.0
Date: August 14, 2025

This document outlines the definitive checklist for deploying the Car Financing Hub (CFH) platform to the production environment.

Phase 1: Pre-Deployment & Environment Setup
[ ] Infrastructure Provisioning:

[ ] Create production AWS EKS cluster.

[ ] Create production MongoDB Atlas cluster and Redis ElastiCache instance.

[ ] Create production S3 bucket for photo storage with strict permissions.

[ ] Configure IAM roles and permissions for CI/CD pipeline and application services.

[ ] Configuration & Secrets:

[ ] Create production .env file with all required secrets (JWT, API keys, database credentials).

[ ] Store all secrets securely in AWS Secrets Manager.

[ ] Configure Kubernetes ConfigMap and Secret objects from the environment variables.

[ ] Final Code Freeze & Audits:

[ ] Merge main branch into a release branch. No new features are allowed past this point.

[ ] Complete the full Security Audit Plan (security-audit.md). All high-priority issues must be resolved.

[ ] Run the full Load Test (locustfile.py) against the staging environment to confirm performance targets are met.

Phase 2: Deployment Execution
[ ] CI/CD Pipeline Run:

[ ] Trigger the deploy-to-production job in the ci.yml workflow from the release branch.

[ ] Monitor the pipeline to ensure all tests pass and Docker images are successfully built and pushed to ECR.

[ ] Kubernetes Deployment:

[ ] Apply the k8s-deployment.yml configuration to the production EKS cluster (kubectl apply -f k8s/k8s-deployment.yml).

[ ] Verify that all backend and frontend pods are running and healthy (kubectl get pods).

[ ] Database Seeding:

[ ] Run the initial database seed script to populate necessary data (e.g., ForumCategory, Badge definitions).

Phase 3: Post-Deployment Validation & Go-Live
[ ] Health Checks:

[ ] Access the production URL and confirm the frontend loads correctly.

[ ] Check the backend service health endpoint.

[ ] Verify that the Prometheus and Grafana monitoring stack is receiving live metrics from the production environment.

[ ] Smoke Testing:

[ ] Manually execute a "happy path" test for each of the four core vertical slices (create a user, create a listing, place a bid, finalize the transaction).

[ ] Go-Live:

[ ] Update DNS records to point the public domain to the production load balancer.

[ ] Announce the official launch!

Phase 4: Rollback & Maintenance Plan
Rollback Procedure:

In case of critical failure during deployment, the on-call engineer will immediately trigger a rollback by re-deploying the previous stable Docker image tag via the CI/CD pipeline.

The HistoryService will be monitored for any anomalous activity.

Post-Launch Maintenance:

Log Monitoring: The engineering team will actively monitor logs (via a service like Datadog or ELK Stack) for errors and anomalies.

Hotfixes: A dedicated hotfix branch will be used to address any critical bugs. Hotfixes will be deployed via an expedited CI/CD process after code review.

Scheduled Maintenance: A regular maintenance window will be established for database backups, dependency updates, and minor system upgrades.