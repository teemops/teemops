#create a new S3 public bucket for sharing templates, scripts and other resources
resource "aws_s3_bucket" "templates_bucket" {
  bucket = "${var.app_name}.${var.domain}"

}
resource "aws_s3_bucket_ownership_controls" "templates_bucket_oc" {
  bucket = aws_s3_bucket.templates_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}
resource "aws_s3_bucket_public_access_block" "templates_bucket_public_access_block" {
  bucket                  = aws_s3_bucket.templates_bucket.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}
#enable acl
resource "aws_s3_bucket_acl" "templates_bucket_acl" {
  depends_on = [aws_s3_bucket_ownership_controls.templates_bucket_oc, aws_s3_bucket_public_access_block.templates_bucket_public_access_block]
  bucket     = aws_s3_bucket.templates_bucket.id
  acl        = "public-read"
}
