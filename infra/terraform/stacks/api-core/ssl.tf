#generate TF  for adding another listener to ALB
#get ssl cert for api.teemops.com
data "aws_acm_certificate" "my_cert" {
  domain   = "${var.app_name}.${var.domain}"
  statuses = ["ISSUED"]
}

#add rule based on host header api.teemops.com to listener port 443 from alb module output
resource "aws_lb_listener_rule" "my_alb_listener_rule_api" {
  listener_arn = module.alb.alb_listener_https_arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = module.alb.target_group_arn
  }

  condition {
    host_header {
      values = ["${var.app_name}.${var.domain}"]
    }
  }
}

#add another certificate to https listener
resource "aws_lb_listener_certificate" "my_alb_listener_certificate_api" {
  listener_arn    = module.alb.alb_listener_https_arn
  certificate_arn = data.aws_acm_certificate.my_cert.arn
}
