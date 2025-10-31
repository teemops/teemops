# Configure the AWS Provider
provider "aws" {
  region = var.region
}

locals {
  
}

resource "aws_glue_catalog_table" "glue_table"{
  name=var.table_name
  database_name = var.dbname

  table_type = "EXTERNAL_TABLE"

  parameters = {
    EXTERNAL              = "TRUE"
    "skip.header.line.count" = "2"
    "delimiter"="\t"
  }

  storage_descriptor {
    location = "s3://${var.source_bucket}"
    input_format = org.apache.hadoop.mapred.TextInputFormat
    output_format = org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat
    ser_de_info {
      name="stream-${var.table_name}"
      serialization_library = "org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe"
      parameters = {
        "field.delim" = "\t"
      }
    }

    columns {
      name = "my_string"
      type = "string"
    }

  }
}

