#create aws code deploy application
resource "aws_codedeploy_app" "my_app" {
  name = "${var.env}-${var.name}-app"
  compute_platform = "Server"
  tags = {
    Name = "${var.env}-${var.name}-app"
    Environment = var.env
  }
}

#create application group
resource "aws_codedeploy_deployment_group" "my_app_group" {
  app_name = aws_codedeploy_app.my_app.name
  deployment_group_name = "${var.env}-${var.name}-app-group"
  service_role_arn = aws_iam_role.my_codedeploy_role.arn
  deployment_config_name = "CodeDeployDefault.OneAtATime"
  auto_rollback_configuration {
    enabled = true
    events = ["DEPLOYMENT_FAILURE"]
  }
  deployment_style {
    deployment_option = "WITH_TRAFFIC_CONTROL"
    deployment_type = "IN_PLACE"
  }
  load_balancer_info {
    target_group_info {
      name = var.asg_group_name
    }
  }
  auto_scaling_groups = [var.asg_group_name]
  # trigger_configuration {
  #   trigger_events = ["DeploymentFailure"]
  #   trigger_name = "DeploymentFailure"
  #   trigger_target_arn = aws_cloudwatch_metric_alarm.my_alarm.arn
  # }
  tags = {
    Name = "${var.env}-${var.name}-app-group"
    Environment = var.env
  }
}