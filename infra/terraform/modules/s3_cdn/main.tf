# Configure the AWS Provider
provider "aws" {
  region = var.region
}

locals {
  log_bucket_prefix="cloudfront/apps/${var.log_bucket_folder}"
  #remove subdomain from domain
  #get the number of items in the domain array split
  domain_array_length=length(split(".", var.domain))
  #get the substring of the domain from the first item in the array to the last item in the array
  tld_domain=substr(var.domain, length(split(".", var.domain)[0])+1, length(var.domain))
  sub_domain=split(".", var.domain)[0]
}

#get SSL Certificate ARN
data "aws_acm_certificate" "my_cert" {
  domain   = local.tld_domain
  statuses = ["ISSUED"]
}

resource "aws_s3_bucket" "bucket" {
  bucket = var.name

  tags = {
    Name        = var.name
    Environment = var.env
  }
}

resource "aws_s3_bucket_versioning" "bucket_versioning" {
  bucket = aws_s3_bucket.bucket.id

  versioning_configuration {
    status = var.versioning ? "Enabled" : "Disabled"
  }
}

resource "aws_s3_bucket_acl" "bucket_acl" {
  bucket = aws_s3_bucket.bucket.id
  acl    = "private"
}

resource "aws_s3_bucket_public_access_block" "app" {
  bucket = aws_s3_bucket.bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

#add cloudfront S3 origin access identity
resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "S3 origin access identity for ${var.name}"
}


#create cloudfront distribution points to S3 bucket
resource "aws_cloudfront_distribution" "my_cdn" {
  origin {
    domain_name = aws_s3_bucket.bucket.bucket_regional_domain_name
    origin_id   = aws_s3_bucket.bucket.id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    }
  }
  #domain names
  aliases = [var.domain]

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CDN for ${var.name}"
  default_root_object = var.default_root_object

  default_cache_behavior {
    allowed_methods  = var.allowed_methods
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = aws_s3_bucket.bucket.id

    forwarded_values {
      query_string = true

      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = false
    #use own cert
    acm_certificate_arn = data.aws_acm_certificate.my_cert.arn
    ssl_support_method = "sni-only"
    minimum_protocol_version = "TLSv1.2_2019"
  }

  logging_config {
    include_cookies = true
    bucket          = "${var.log_bucket_name}.s3.${var.region}.amazonaws.com"
    prefix          = local.log_bucket_prefix
  }

  tags = {
    Name        = var.name
    Environment = var.env
  }
}

data "aws_iam_policy_document" "s3_origin_policy" {
  statement {
    sid = "CloudFrontPublicReadGetObject"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.bucket.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn]
    }
  }
}

#udpate aws iam policy for S3 bucket to allow cloudfront origin access identity
resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.bucket.id

  policy = data.aws_iam_policy_document.s3_origin_policy.json


}

#add route53 record with module
module "route53_alias" {
  source = "../route53_alias"
  domain = local.tld_domain
  record_name = var.domain
  record_value = aws_cloudfront_distribution.my_cdn.domain_name
  alias_zoneid = aws_cloudfront_distribution.my_cdn.hosted_zone_id
}
