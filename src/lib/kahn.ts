function kahnsAlgorithm(nodeIds: Array<string>, edges: Array<[string, string]>): Array<string> {

  const indegree = new Map<string, number>();
  nodeIds.forEach((nodeId) => {
    indegree.set(nodeId, 0);
  });
  edges.forEach((edge) => {
    const [src, dst] = edge;
    indegree.set(dst, indegree.get(dst)! + 1);
  });

  const adj = new Map<string, string[]>();
  nodeIds.forEach((nodeId) => {
    adj.set(nodeId, []);
  });
  edges.forEach((edge) => {
    const [src, dst] = edge;
    adj.get(src)!.push(dst);
  })

  const queue: Array<string> = [];
  indegree.forEach((count, nodeId) => {
    if (count === 0) {
      queue.push(nodeId);
    }
  });

  const order: Array<string> = []
  while (queue.length > 0) {
      const node = queue.shift();
      order.push(node!);
      adj.get(node!)!.forEach((neighbor) => {
          indegree.set(neighbor, indegree.get(neighbor)! - 1);
          if (indegree.get(neighbor) === 0) {
              queue.push(neighbor);
          }
      });
  }
  return order;
}

export default kahnsAlgorithm;