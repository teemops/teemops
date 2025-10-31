[
    {
        "essential": true,
        "memory": 3072,
        "name": "${container_name}",
        "cpu": 1024,
        "image": "${account_id}.dkr.ecr.${region}.amazonaws.com/${image_name}:latest",
        "environmentFiles": [
            {
                "value": "arn:aws:s3:::${deployment_bucket}/${container_name}/app.env",
                "type": "s3"
            }
        ],
        "command": [
            "sh",
            "-c",
            "sh scripts/init.sh && npm run-script status-prod"
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