

#create an alb with a target group using the alb module
module "alb" {
  source            = "../../modules/alb"
  name              = "api-core"
  env               = var.env
  hostname          = "${var.app_name}.${var.domain}"
  sg_name           = "${var.env}-Frontend-sg"
  domain            = var.domain
  vpc_id            = data.aws_vpc.main_vpc.id
  port              = 8080
  health_check_path = "/api/data/ht"
}
