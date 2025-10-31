[
    {
        "essential": true,
        "memory": 2048,
        "name": "${container_name}",
        "cpu": 1024,
        "image": "${account_id}.dkr.ecr.${region}.amazonaws.com/${image_name}:latest",
        "portMappings": [
            {
                "hostPort": 8080,
                "containerPort": 8080,
                "protocol": "tcp"
            }
        ],
        "environmentFiles": [
            {
                "value": "arn:aws:s3:::${deployment_bucket}/${container_name}/app.env",
                "type": "s3"
            }
        ],
        "command": [
            "sh",
            "-c",
            "sh scripts/init.sh && npm run-script start-prod"
        ],
        "logConfiguration": {
            "logDriver": "awslogs",
            "options": {
                "awslogs-create-group": "true",
                "awslogs-group": "${container_name}",
                "awslogs-region": "${region}",
                "awslogs-stream-prefix": "ecs"
            }
        }
    }
]