#create aws resource cloudformation template

resource "aws_cloudformation_stack" "my_stack" {
  name = "${var.env}-${var.name}-stack"
  template_body = var.template
  capabilities = ["CAPABILITY_IAM", "CAPABILITY_NAMED_IAM"]
  parameters = var.parameters
}
