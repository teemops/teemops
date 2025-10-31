output "target_group_arn" {
  value = aws_lb_target_group.my_alb_target_group.arn
}
output "alb_arn" {
  value = aws_lb.my_alb.arn
}
output "alb_listener_https_arn" {
  value = aws_lb_listener.my_alb_listener_https.arn
}
