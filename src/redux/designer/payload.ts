import { IService } from "./models";

export type PayloadArgs = {};

export interface INodeId extends PayloadArgs {
  nodeId: string;
}

export interface IAddGraphNode extends PayloadArgs {
  nodeId: string;
  category: string;
  service: string;
}

export interface IUpdateGraphNode extends PayloadArgs {
  nodeId: string;
  updatedSchema: IService
}
