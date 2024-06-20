import { v4 } from 'uuid';
import { IAddGraphNode } from '@/redux/designer/payload';
import { IGraphEdge } from '@/redux/designer/models';

export interface IGraphBuilder {
  graphNodes: Array<IAddGraphNode>;
  graphEdges: Array<IGraphEdge>;
}

export const AWS_TEMPLATES = {
  S3: {
    name: 'S3',
    description:
      'Store your static files on S3 and make them publicly accessible.',
    pros: ['Simple', 'Highly scalable', 'Cost-effective'],
    cons: [
      'No https/ssl support',
      "Slow for users far from the bucket's region",
    ],
    graphBuilder: function () {
      const graphNodes: Array<IAddGraphNode> = [
        {
          nodeId: v4(),
          category: 'Storage',
          service: 'Simple-Storage-Service',
        },
      ];
      const graphEdges: Array<IGraphEdge> = [];
      return { graphNodes, graphEdges } as IGraphBuilder;
    },
  },
  'S3+CloudFront': {
    name: 'S3 + CloudFront',
    description:
      'Store your static files on S3 and use CloudFront as a CDN to deliver your content.',
    pros: ['Highly scalable', 'Fast content delivery', 'Supports https/ssl'],
    cons: ['Complex setup', 'Not cost-effective for small projects'],
    graphBuilder: function () {
      const S3_ID = v4();
      const CLOUDFRONT_ID = v4();
      const graphNodes: Array<IAddGraphNode> = [
        {
          nodeId: CLOUDFRONT_ID,
          category: 'Networking-Content-Delivery',
          service: 'CloudFront',
        },
        {
          nodeId: S3_ID,
          category: 'Storage',
          service: 'Simple-Storage-Service',
        },
      ];
      const graphEdges: Array<IGraphEdge> = [
        { source: CLOUDFRONT_ID, target: S3_ID },
      ];
      return { graphNodes, graphEdges } as IGraphBuilder;
    },
  },
  'S3+CloudFront+Route53': {
    name: 'S3 + CloudFront + Route 53',
    description:
      'Store your static files on S3, use CloudFront as a CDN and Route 53 for DNS management.',
    pros: [
      'Highly scalable',
      'Fast content delivery',
      'Supports https/ssl',
      'Custom domain name support',
    ],
    cons: ['Complex setup', 'Not cost-effective for small projects'],
    graphBuilder: function () {
      const S3_ID = v4();
      const CLOUDFRONT_ID = v4();
      const ROUTE53_ID = v4();
      const graphNodes: Array<IAddGraphNode> = [
        {
          nodeId: ROUTE53_ID,
          category: 'Networking-Content-Delivery',
          service: 'Route-53',
        },
        {
          nodeId: CLOUDFRONT_ID,
          category: 'Networking-Content-Delivery',
          service: 'CloudFront',
        },
        {
          nodeId: S3_ID,
          category: 'Storage',
          service: 'Simple-Storage-Service',
        },
      ];
      const graphEdges: Array<IGraphEdge> = [
        { source: ROUTE53_ID, target: CLOUDFRONT_ID },
        { source: CLOUDFRONT_ID, target: S3_ID },
      ];
      return { graphNodes, graphEdges } as IGraphBuilder;
    },
  },
};
