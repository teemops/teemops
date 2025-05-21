#!/bin/bash
set -e

mysql -uroot -p"$MYSQL_ROOT_PASSWORD" <<-EOSQL
  ALTER DATABASE \`$MYSQL_DATABASE\`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
EOSQL
