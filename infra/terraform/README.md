# Infrastructure as Code

Terraform configuration for deploying LMRA on AWS.

## Architecture

- **VPC** with public and private subnets
- **ECS Fargate** for containerized services
- **RDS PostgreSQL** for database
- **Application Load Balancer** for routing
- **ECR** for container images

## Prerequisites

- Terraform >= 1.5
- AWS CLI configured
- AWS account with appropriate permissions

## Usage

1. Initialize Terraform:
```bash
terraform init
```

2. Create a `terraform.tfvars` file:
```hcl
aws_region   = "us-east-1"
db_username  = "lmra_user"
db_password  = "your_secure_password"
```

3. Plan the deployment:
```bash
terraform plan
```

4. Apply the configuration:
```bash
terraform apply
```

5. Destroy infrastructure:
```bash
terraform destroy
```

## Outputs

- VPC ID
- Database endpoint
- ECS Cluster name
- ECR repository URLs

## Cost Estimation

Approximate monthly costs (us-east-1):
- RDS db.t3.micro: ~$15/month
- ECS Fargate: ~$30-50/month (depending on usage)
- ALB: ~$18/month
- Data transfer: Variable

Total: ~$75-100/month for basic setup

## Notes

- This is a basic setup for demonstration
- Production deployments should include:
  - WAF for security
  - CloudFront CDN
  - Multi-AZ RDS
  - Securities best practices (IAM roles, encryption)

