export const AWS_SERVICES = [
    {
        "id": 0,
        "name": "S3",
        "description": "Amazon S3 (Simple Storage Service) provides scalable object storage (similar to Google Drive).",
        "cost": {
            "flat": 0,
            "per-user": 0.0046
        },
        "settings": {
            "versioning": {
                "type": "boolean",
                "options": [],
                "value": true,
                "description": "Enable versioning for your S3 bucket"
            } 
        },
        "questions": [
            {
                "id": 0,
                "question": "Nickname",
                "note": "Name of your component",
                "type": "input",
                "value": "bucket1"
            },
            {
                "id": 1,
                "question": "Location of build files in your repository",
                "note": "Example: /build",
                "type": "input",
                "value": "./build"
            }
        ],
        "disabled": false
    },
    {
        "id": 1,
        "name": "CloudFront",
        "description": "Amazon CloudFront is a web service for content delivery. It integrates with other Amazon Web Services to give developers and businesses an easy way to distribute content to end users with low latency, high data transfer speeds, and no commitments.",
        "cost": {
            "flat": 0,
            "per-user": 0.017
        },
        "settings": {
            "option1": "on"
        },
        "questions": [],
        "disabled": false
    },
    {
        "id": 2,
        "name": "Route 53",
        "description": "Amazon S3 (Simple Storage Service) provides scalable object storage (similar to Google Drive).",
        "cost": {
            "flat": 0.50,
            "per-user": 0.0000
        },
        "settings": {
            "domain": {
                "type": "string",
                "options": [],
                "value": "stratus.com",
                "description": "Domain name for your Route 53 hosted zone (No http:// or www)"
            } 
        },
        "questions": [],
        "disabled": false
    }
]
