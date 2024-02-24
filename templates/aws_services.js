export const AWS_SERVICES = [
  {
      "id": 0,
      "name": "S3",
      "description": "Amazon S3 provides a simple web services interface that can be used to store and retrieve any amount of data, at any time, from anywhere on the web.",
      "cost": 0,
      "options": {
          "bucketHandling": false
      }
  },
  {
      "id": 1,
      "name": "CloudFront",
      "description": "Amazon CloudFront is a web service for content delivery. It integrates with other Amazon Web Services to give developers and businesses an easy way to distribute content to end users with low latency, high data transfer speeds, and no commitments.",
      "cost": 0,
      "options": {
          "option1": true
      }
  }
]

export const AWS_SERVICES_CONNECTIONS =  [{ id: "e1-2", source: "0", target: "1" }];