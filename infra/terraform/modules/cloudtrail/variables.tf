variable "region" {
}
variable "env" {}
variable "name" {}
variable "s3_bucket_name" {}
variable "s3_key_prefix" {
  type=string
  default = "cloudtrail"
}
variable "include_global_service_events" {
  type=string
  default = "true"
}
variable "is_multi_region_trail" {
  type=string
  default = "true"
}
variable "enable_log_file_validation" {
  type=string
  default = "true"
}
variable "cloud_watch_logs_group_arn" {
  type=string
  default = ""
}
variable "cloud_watch_logs_role_arn" {
  type=string
  default = ""
}
variable "kms_key_id" {
  type=string
  default = ""
}

