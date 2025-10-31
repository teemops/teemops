module "s3_bucket" {
  source = "../../modules/s3_bucket"
  env    = var.env
  region = var.region
  name   = "${var.env}-${var.label}-${var.app_name}"
}
