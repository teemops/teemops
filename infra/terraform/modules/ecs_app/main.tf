#get an ecs cluster
data "aws_ecs_cluster" "ecs_cluster" {
  cluster_name = "${var.cluster_name}-cluster"
}

#filter subnets by tag
data "aws_subnets" "my_subnets" {
  filter {
    name   = "tag:Private"
    values = ["true"]
  }
}

#filter public subnets by tag
data "aws_subnets" "my_subnets_public" {
  filter {
    name   = "tag:Private"
    values = ["false"]
  }
}

locals {
  public_subnets  = data.aws_subnets.my_subnets_public.ids
  private_subnets = data.aws_subnets.my_subnets.ids
}

#get the security group id for the ecs service
data "aws_security_group" "my_ecs_sg" {
  filter {
    name   = "tag:Name"
    values = [var.sg_name]
  }
}

#get SSL Certificate ARN
data "aws_acm_certificate" "my_cert" {
  domain   = var.hostname
  statuses = ["ISSUED"]
}

#create ecs task definition
resource "aws_ecs_task_definition" "ecs_task_definition" {
  family                   = "${var.env}-${var.name}-ecs-task-definition"
  container_definitions    = var.task_definition
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "1024"
  memory                   = "3072"
  execution_role_arn       = var.execution_iam_role
  task_role_arn            = var.task_iam_role
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64"
  }
}

#create ecs service
resource "aws_ecs_service" "ecs_service" {
  name                   = "${var.env}-${var.name}-ecs-service"
  cluster                = data.aws_ecs_cluster.ecs_cluster.id
  task_definition        = aws_ecs_task_definition.ecs_task_definition.arn
  desired_count          = 1
  launch_type            = "FARGATE"
  enable_execute_command = true
  network_configuration {
    subnets          = local.private_subnets
    security_groups  = [data.aws_security_group.my_ecs_sg.id]
    assign_public_ip = true
  }
  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = var.container_name
    container_port   = var.port
  }
  #Enable execute command

  # load_balancer {
  #   target_group_arn = aws_lb_target_group.my_php_alb_target_group.arn
  #   container_name   = "${var.env}-${var.name}"
  #   container_port   = 9000
  # }
}
