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
        "name": "Google Cloud Storage",
        "description": "Google Cloud Storage is a RESTful online file storage web service for storing and accessing data on Google Cloud Platform infrastructure. ",
        "cost": {
            "flat": 0,
            "per-user": 0.004
        },
        "settings": {},
        "questions": [],
        "disabled": true
    },
    {
        "id": 3,
        "name": "Azure Blob Storage",
        "description": "Azure Blob storage is Microsoft's object storage solution for the cloud. Blob storage is optimized for storing massive amounts of unstructured data, such as text or binary data.",
        "cost": {
            "flat": 0,
            "per-user": 0.0046
        },
        "settings": {},
        "questions": [],
        "disabled": true
    }
]

export const AWS_SERVICES_CONNECTIONS =  [{ id: "e1-2", source: "0", target: "1",}];