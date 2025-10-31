#launch cloudformation given URL
resource "aws_cloudformation_stack" "tops_root_iam" {
  name         = "${var.env}-${var.label}-${var.app_name}-tops-iam"
  template_url = "${var.cfn_url}${var.cfn_file}"
  #   parameters = {
  #     Environment = var.env
  #     Label       = var.label
  #     AppName     = var.app_name
  #   }
  capabilities = ["CAPABILITY_IAM", "CAPABILITY_NAMED_IAM"]
}
#
