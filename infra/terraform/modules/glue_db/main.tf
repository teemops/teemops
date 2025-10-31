# Configure the AWS Provider
provider "aws" {
  region = var.region
}

resource "aws_glue_catalog_database" "glue_db"{
  name=var.dbname
  create_table_default_permission {
    permissions = ["SELECT"]

    principal {
      data_lake_principal_identifier = "IAM_ALLOWED_PRINCIPALS"
    }
  }
}

