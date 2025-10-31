variable "region" {
}
variable "env" {}
variable "name" {}
variable "domain" {}
variable "versioning" {
    default=false
}
variable "mfa_delete" {
    default=false
}
variable "allowed_methods"{
    default=["GET","HEAD","OPTIONS"]
}
variable "log_bucket_name" {
  
}
variable "log_bucket_folder" {
  
}
variable "default_root_object" {
    default="index.html"
}


