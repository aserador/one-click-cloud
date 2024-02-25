export const ARCHITECTURES = [
    {
        "name": "S3",
        "description": "Amazon S3 (Simple Storage Service) is an object storage service that offers industry-leading scalability, data availability, security, and performance. It is designed to store and retrieve any amount of data from anywhere on the web, making it a great choice for applications that require secure, scalable object storage.",
        "pros": [
            "Highly scalable",
            "Secure",
            "Durable",
            "Cost-effective"
        ],
        "cons": [
            "Not suitable for transactional data",
            "Limited support for complex queries"
        ],
        "services": [0],
        "edges": []
    }, 
    {
        "name": "S3 + CloudFront",
        "description": "This bundle combines Amazon S3 and Amazon CloudFront. S3 provides secure, scalable object storage, while CloudFront is a fast content delivery network (CDN) service that securely delivers data, videos, applications, and APIs to users globally with low latency and high transfer speeds. This combination is ideal for applications that require both object storage and fast content delivery to users around the world.",
        "pros": [
            "Highly scalable",
            "Secure",
            "Durable",
            "Cost-effective",
            "Fast content delivery"
        ],
        "cons": [
            "Not suitable for transactional data",
            "Limited support for complex queries"
        ],
        "services": [0, 1],
        "edges": [
            {
                "from": 0,
                "to": 1
            }
        ]
    },
        {
        "name": "S3 + CloudFront",
        "description": "This bundle combines Amazon S3 and Amazon CloudFront. S3 provides secure, scalable object storage, while CloudFront is a fast content delivery network (CDN) service that securely delivers data, videos, applications, and APIs to users globally with low latency and high transfer speeds. This combination is ideal for applications that require both object storage and fast content delivery to users around the world.",
        "pros": [
            "Highly scalable",
            "Secure",
            "Durable",
            "Cost-effective",
            "Fast content delivery"
        ],
        "cons": [
            "Not suitable for transactional data",
            "Limited support for complex queries"
        ],
        "services": [0, 1],
        "edges": [
            {
                "from": 0,
                "to": 1
            }
        ]
    },
    {
        "name": "Google Cloud Storage",
        "description": "Google Cloud Storage is a RESTful online file storage web service for storing and accessing data on Google Cloud Platform infrastructure. The service combines the performance and scalability of Google's cloud with advanced security and sharing capabilities.",
        "pros": [
            "Highly scalable",
            "Secure",
            "Durable",
            "Cost-effective"
        ],
        "cons": [
            "Not suitable for transactional data",
            "Limited support for complex queries"
        ],
        "services": [2],
        "edges": []
    }, 
    {
        "name": "Azure Blob Storage",
        "description": "Azure Blob storage is Microsoft's object storage solution for the cloud. Blob storage is optimized for storing massive amounts of unstructured data, such as text or binary data.",
        "pros": [
            "Highly scalable",
            "Secure",
            "Durable",
            "Cost-effective"
        ],
        "cons": [
            "Not suitable for transactional data",
            "Limited support for complex queries"
        ],
        "services": [3],
        "edges": []
    }
];