#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

COLORS_RED='\033[0;31m'
COLORS_YELLOW='\033[1;33m'
COLORS_GREEN='\033[0;32m'
COLORS_BLUE='\033[0;34m'
COLORS_CYAN='\033[0;36m'
COLORS_NC='\033[0m' # No Color
echo -e "${COLORS_GREEN}"
# This script is used to install TeemOps and its dependencies.
cat << EOF

 ███████████                                                             
░█░░░███░░░█                                                             
░   ░███  ░   ██████   ██████  █████████████    ██████  ████████   █████ 
    ░███     ███░░███ ███░░███░░███░░███░░███  ███░░███░░███░░███ ███░░  
    ░███    ░███████ ░███████  ░███ ░███ ░███ ░███ ░███ ░███ ░███░░█████ 
    ░███    ░███░░░  ░███░░░   ░███ ░███ ░███ ░███ ░███ ░███ ░███ ░░░░███
    █████   ░░██████ ░░██████  █████░███ █████░░██████  ░███████  ██████ 
   ░░░░░     ░░░░░░   ░░░░░░  ░░░░░ ░░░ ░░░░░  ░░░░░░   ░███░░░  ░░░░░░  
                                                        ░███             
                                                        █████            
                                                       ░░░░░             

#######################################################################################################                                                                                                    
#######################################################################################################
#
#    Copyright (C) 2023 TeemOps. All rights reserved.
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
#    GNU General Public License for more details.
#
#    Teemops is not affiliated with or endorsed by Amazon Web Services, Inc. or any of its affiliates.
#    For more information, please visit our website at https://teemops.com
#    For more information about the GNU General Public License, see <https://www.gnu.org/licenses/>.
#
#######################################################################################################
#######################################################################################################

EOF

echo -e "${COLORS_YELLOW}Welcome to TeemOps Beta Installer${COLORS_NC}"

echo -e "${COLORS_YELLOW}Before Install Please Check The Following:${COLORS_NC}"
cat << EOF

 - Git installed
 - OpenSSL installed (optional)
 - Node.js installed
 - AWS CLI installed and configured
 - Docker and Docker Compose installed
 
EOF

#I want to create a fancy looking table in linux termina

echo -e "${COLORS_YELLOW}Local AWS Setup:${COLORS_NC}"

cat << EOF

 - Ensure you have the necessary permissions to create resources in your AWS account
 - The Setup will run and create the following resources:
   - CloudFormation Stack
   - 2 SQS Queues
   - SNS Topic(s)
   - IAM Role and Policy (View IAM Role and Policy on Github https://github.com/teemops/teemops/blob/master/cloudformation/iam.ec2.root.role.cfn.yaml)
   - KMS Key
   - S3 Bucket
   
EOF

#DEFAULTS
ENV_NAME=${1:-dev}
ROOT_DIR=$(pwd)
export TEEMOPS_ROOT=$ROOT_DIR
DOCKER_DIR="$ROOT_DIR/docker"
REPO_THIS=https://github.com/teemops/teemops.git
OS_VERSION="UNSUPPORTED"
AWS_ACCOUNT_ID=0

if [[ "$OSTYPE" == "linux-gnu" ]]; then
    if [ -f /etc/redhat-release ] ; then
        #Redhat or CENTOS
        OS_VERSION="redhat"
    elif [[ -f /etc/debian_version ]]; then
        #Ubuntu or Debian
        OS_VERSION="debian"
    else
        OS_VERSION="UNSUPPORTED"
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS_VERSION="osx"
else
    OS_VERSION="UNSUPPORTED"
fi

check_pre(){
    
    #check pre-requisites
    if [[ "$OS_VERSION" == "UNSUPPORTED" ]]; then
        echo "Your OS is unsupported"
        echo "Please try on one of the following OS or manually add .env file and run docker compose up -d:"
        echo "Redhat, Centos, Ubuntu, Debian, Mac OSX"
        echo "Exiting..."
        exit 1
    fi
    PACKAGES_TO_INSTALL=""

    #check if node is installed
    if which node > /dev/null
    then
        echo -e "${COLORS_GREEN}Node is installed, skipping...${COLORS_NC}"
    else
        PACKAGES_TO_INSTALL="node"
        echo -e "${COLORS_YELLOW}Node Not Installed. Install node first before installing${COLORS_NC}"
        echo -e "NVM Installer is recommended: ${COLORS_BLUE}https://github.com/nvm-sh/nvm${COLORS_NC}"
        exit
    fi

# Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        echo "Docker is not running. Please start Docker and try again."
        exit 1
    fi

# Check if git is installed otherwise exit
    if which git > /dev/null
    then
        echo -e "${COLORS_GREEN}git is installed, skipping...${COLORS_NC}"
    else
        # add deb.nodesource repo commands 
        # install node
        echo -e "${COLORS_YELLOW}git needs to be installed first before installing\n"
        if [[ "$OS_VERSION" == "redhat" ]]; then
            echo "yum install git"
        elif [[ "$OS_VERSION" == "debian" ]]; then
            echo "apt-get install git"
        elif [[ "$OS_VERSION" == "osx" ]]; then
            echo "Install via Xcode or Homebrew"
        fi

        exit
    fi

    #check if aws cli is installed
    if which aws > /dev/null
    then
        echo -e "${COLORS_GREEN}AWS CLI is installed, skipping...${COLORS_NC}"
    else
        # add deb.nodesource repo commands 
        # install node
        echo -e "${COLORS_YELLOW}AWS CLI needs to be installed first before installing${COLORS_NC}"
        echo -e "Please install AWS CLI v2 from ${COLORS_BLUE}https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html${COLORS_NC}"

        exit
    fi

    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    if [ $? -ne 0 ]; then
        echo -e "${COLORS_RED}Failed to get AWS account ID. Please check your AWS CLI configuration.${COLORS_NC}"
        exit 1
    fi
    
}

generate_secrets(){

    #Generates the API mysecrets secret for password and confirmation secrets
    if which openssl > /dev/null
    then
        NEW_CONFIRM_SECRET=$(openssl rand -base64 24)
        NEW_SECRET=$(openssl rand -base64 24)
        NEW_DB_PASS=$(openssl rand -base64 12 | md5sum $1 | grep -o '[a-z0-9]*' | head -c 16 ; echo )
    else
        NEW_CONFIRM_SECRET=$(LC_ALL=C tr -dc 'A-Za-z0-9!"#$%&'\''()*+,-./:;<=>?@[\]^_`{|}~' </dev/urandom | head -c 16 ; echo )
        NEW_SECRET=$(LC_ALL=C tr -dc 'A-Za-z0-9!"#$%&'\''()*+,-./:;<=>?@[\]^_`{|}~' </dev/urandom | head -c 16 ; echo )
        NEW_DB_PASS=$(LC_ALL=C tr -dc 'A-Za-z0-9!"#$%&'\''()*+,-./:;<=>?@[\]^_`{|}~' </dev/urandom | head -c 16 ; echo )
    fi
}

check_state() {
    # Check if .env file exists
    if [ -f ".env" ]; then
        echo "ERROR: install has already run here. Run Remove option before running install."
        echo "Exiting..."
        exit
    fi

    #check if the api/state folder exists
    if [ -d ".teemops/state" ]; then
        echo "ERROR: .teemops/state folder already exists. Run Remove option before running install."
        echo "Exiting..."
        exit
    fi
}

install_app() {
    
    generate_secrets

    #Check if this is a locally run copy of the script or a Remote run (curl)
    if [ ! -d "$DOCKER_DIR" ] ; then
        echo "Pulling down the rest of the repo as well"
        #now pull down all other assets
        git clone $REPO_THIS
        # Navigate to the newly cloned folder
        cd teemops
    fi
    
    cd docker
    check_state
    # Create the state directory
    mkdir -p .teemops/state

    # Create an .env file from the example
    cp .env.example .env
   
    #get the value of the DB_PASS= from the .env file and replace it with the value of the DB_PASS variable
    sed -i "s|^CONFIRM_SECRET=.*|CONFIRM_SECRET=$NEW_CONFIRM_SECRET|" .env
    sed -i "s|^SECRET=.*|SECRET=$NEW_SECRET|" .env
    sed -i "s|DB_PASS=.*|DB_PASS=$NEW_DB_PASS|" .env
    sed -i "s|^DATABASE_URL=.*|DATABASE_URL=mysql://teem:$NEW_DB_PASS@mysql:3306/teem|" .env
    #update AWS_ACCOUNT_ID in the .env file
    sed -i "s|^AWS_ACCOUNT_ID=.*|AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID|" .env

    chmod +x setup.sh
    # Run the setup script and when it is done, run the docker compose up command
    # This will create the database and run the migrations

    ./setup.sh 
    
    echo "Install completed. You can now run the application at http://localhost:3000 if running locally."

}

update_app() {
    # Check if the script is running in the correct directory
    if [ ! -d "$DOCKER_DIR" ]; then
        echo "This script must be run from the teemops directory."
        exit 1
    fi

    # Pull the latest changes from the repository
    git pull origin master

    cd docker

    # Rebuild and restart the Docker containers
    docker-compose down
    docker-compose up -d

}


delete_app() {

    echo -e "${COLORS_RED}Are you sure you want to delete TeemOps? This will remove all data and configurations.${COLORS_NC}"
    read -p "Type 'yes' to confirm: " confirm
    if [ "$confirm" != "yes" ]; then
        echo "Aborting deletion."
        exit 1
    fi

    cd docker

    # Stop and remove the Docker containers
    docker compose down

    # Remove the .env file and state directory
    sudo rm -rf .env .teemops/state

    # remove the api data directory if it exists
    if [ -d "api" ]; then
        sleep 5
        echo "Stopping docker containers..."
        echo "Removing api + mysql directory..."
        sudo rm -rf api
    fi

    echo "TeemOps has been deleted."
}

fix_mysql_native_password() {
    cd $DOCKER_DIR

    # Check if the MySQL container is running
    if ! docker ps | grep -q mysql; then
        echo "MySQL container is not running. Please start it first."
        exit 1
    fi

    #get value of DB_PASS from the .env file
    DB_USER=$(grep -oP '(?<=^DB_USER=).*' .env)
    DB_PASS=$(grep -oP '(?<=^DB_PASS=).*' .env)

    # Run the MySQL command to set the password plugin to 'mysql_native_password'
    #docker compose exec mysql mysql -u root -p -e "ALTER USER '$DB_USER'@'%' IDENTIFIED WITH mysql_native_password BY '$DB_PASS';"
}

list_options (){
    echo -e "${COLORS_RED}WARNING: The initial install time can take 2-4 minutes, please grab a cuppa.${COLORS_NC}"
    echo "Arguments: $1"
    #if the first argument is present e.g. ./install.sh action=install
    if [ "$1" = "action=install" ]; then
        echo -e "${COLORS_YELLOW}Running Install...${COLORS_NC}"
        install_app
        fix_mysql_native_password
        exit
    fi
    #if the first argument is present e.g. ./install.sh action=update
    if [ "$1" = "action=update" ]; then
        echo -e "${COLORS_YELLOW}Running Update...${COLORS_NC}"
        update_app
        exit
    fi
    #if the first argument is present e.g. ./install.sh action=remove
    if [ "$1" = "action=remove" ]; then
        echo -e "${COLORS_YELLOW}Running Remove...${COLORS_NC}"
        delete_app
        exit
    fi
    #if the first argument is present e.g. ./install.sh action=cloudformation
    if [ "$1" = "action=cloudformation" ]; then
        echo -e "${COLORS_YELLOW}Running CloudFormation...${COLORS_NC}"
        run_aws_install
        exit
    fi

    #Get arguments from user input
    OPTIONS="Install Update Remove Quit"
    select opt in $OPTIONS; do
        if [ "$opt" = "Quit" ]; then
            echo "User quit"
            exit
        elif [ "$opt" = "Install" ]; then
            install_app
            fix_mysql_native_password
            exit
        elif [ "$opt" = "Update" ]; then
            update_app
            exit
        elif [ "$opt" = "Remove" ];then
            delete_app
            exit
        elif [ "$opt" = "CloudFormation" ]; then
            run_aws_install
            exit
        else
            clear
            echo bad option
            exit
        fi
    done
}

check_pre
list_options
