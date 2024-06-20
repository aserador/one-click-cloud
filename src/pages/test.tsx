import React, { use } from 'react';
import { useRouter } from 'next/router';
import { v4 } from 'uuid';
import { useAppDispatch } from '@/redux/hooks';
import { addGraphEdge, addGraphNode, reset } from '@/redux/designer/slice/graphSlice';


const S3_ID = v4();
const CLOUDFRONT_ID = v4();
const ROUTE53_ID = v4();

function Test() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const test_S3 = () => {
    dispatch(reset());
    dispatch(
      addGraphNode({ nodeId: S3_ID, category: 'Storage', service: 'Simple-Storage-Service' })
    );
    router.push("/designer");
  };

  const test_S3_CloudFront = () => {
    dispatch(reset());
    dispatch(
      addGraphNode({ nodeId: S3_ID, category: 'Storage', service: 'Simple-Storage-Service' })
    );
    dispatch(
      addGraphNode({ nodeId: CLOUDFRONT_ID, category: 'Networking-Content-Delivery', service: 'CloudFront' })
    );
    dispatch(
      addGraphEdge({ source: S3_ID, target: CLOUDFRONT_ID })
    );
    router.push("/designer");
  };

  const test_S3_CloudFront_Route53 = () => {
    dispatch(reset());
    dispatch(
      addGraphNode({ nodeId: ROUTE53_ID, category: 'Networking-Content-Delivery', service: 'Route-53' })
    );
    dispatch(
      addGraphNode({ nodeId: CLOUDFRONT_ID, category: 'Networking-Content-Delivery', service: 'CloudFront' })
    );
    dispatch(
      addGraphNode({ nodeId: S3_ID, category: 'Storage', service: 'Simple-Storage-Service' })
    );
    dispatch(
      addGraphEdge({ source: ROUTE53_ID, target: CLOUDFRONT_ID })
    );
    dispatch(
      addGraphEdge({ source: CLOUDFRONT_ID, target: S3_ID })
    );
    router.push("/designer");
  };

  return (
    <div className='w-screen h-screen flex flex-col'>
      <button className="btn btn-info m-8" onClick={test_S3}> S3 </button>
      <button className="btn btn-warning m-8" onClick={test_S3_CloudFront}> S3 + CloudFront </button>
      <button className="btn btn-error m-8" onClick={test_S3_CloudFront_Route53}> S3 + CloudFront + Route53 </button>
    </div>
  );
}

export default Test;