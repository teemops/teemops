#output ssl certificate arn
output "my_ssl_cert" {
  value = aws_acm_certificate.my_cert.arn
}