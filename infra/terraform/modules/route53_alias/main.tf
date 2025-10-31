
#get route53 hosted zone id from name
data "aws_route53_zone" "my_zone" {
  name = var.domain
}

#create route53 record
resource "aws_route53_record" "my_record" {
  zone_id = data.aws_route53_zone.my_zone.zone_id
  name = var.record_name
  type = "A"

  alias {
    name=var.record_value
    zone_id = var.alias_zoneid
    evaluate_target_health = false
  }

}