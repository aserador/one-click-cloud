export type PayloadArgs = {};

export interface INodeId extends PayloadArgs {
  nodeId: string;
}

export interface IAddGraphNode extends PayloadArgs {
  nodeId: string;
  category: string;
  service: string;
}
