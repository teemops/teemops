
#create aws ssl certificate
resource "aws_acm_certificate" "my_cert" {
  domain_name = var.domain
  subject_alternative_names = var.alt_names
  validation_method = "DNS"
  tags = {
    Name = var.name
    Environment = var.env
  }
}

#get route53 hosted zone id from name
data "aws_route53_zone" "my_zone" {
  name = var.domain
}

#create route53 record for validation
resource "aws_route53_record" "my_validation_record" {
  for_each = {
    for dvo in aws_acm_certificate.my_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name = each.value.name
  records = [each.value.record]
  ttl = 60
  type=each.value.type
  zone_id = data.aws_route53_zone.my_zone.zone_id
}

#validate aws ssl certificate
resource "aws_acm_certificate_validation" "my_cert_validation" {
  certificate_arn = aws_acm_certificate.my_cert.arn
  validation_record_fqdns = [
    for record in aws_route53_record.my_validation_record : record.fqdn
  ]
}
