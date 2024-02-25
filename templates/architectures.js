export const ARCHITECTURES = [
    {
        "name": "AWS S3",
        "description": "Store your static files on S3 and make them publicly accessible.",
        "pros": [
            "Simple",
            "Highly scalable",
            "Cost-effective"
        ],
        "cons": [
            "No https/ssl support",
            "Slow for users far from the bucket's region"
        ],
        "services": [0],
        "edges": []
    }, 
    {
        "name": "AWS S3 + CloudFront",
        "description": "Store your static files on S3 and use CloudFront as a CDN to deliver your content.",
        "pros": [
            "Highly scalable",
            "Fast content delivery",
            "Supports https/ssl",
        ],
        "cons": [
            "Complex setup",
            "Not cost-effective for small projects",
        ],
        "services": [0, 1],
        "edges": [
            {
                "from": 0,
                "to": 1
            }
        ]
    }
];