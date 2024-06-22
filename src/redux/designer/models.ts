import { XYPosition } from "reactflow";

export interface ISchemaTemplates {
  [key: string]: ICategory;
}

export interface ICategory {
  [key: string]: IService;
}

export interface IService {
  id: string;
  category: string;
  description: string;
  deploy: {
    [key: string]: any;
  };
  cost: {
    [key: string]: any;
  };
  enabled: boolean;
  config: {
    [key: string]: any;
  };
  neighbors: Array<string>;
  onConnect?: (mySchema: IService, targetSchema: IService) => IServicePair;
  onDisconnect?: (mySchema: IService, targetSchema: IService) => IServicePair;
  onChange?: (mySchema: IService, connectedSchema: IService) => IServicePair;
}

export interface IServicePair {
  source?: IService;
  target?: IService;
}

export enum NodeType {
  ICON = 'iconNode',
  TEXT = 'textNode',
}

export interface IGraphNode {
  id: string;
  type: NodeType;
  position: XYPosition;
  data: IGraphNodeData;
}

export interface IGraphNodeData {
  label: string;
  category: string;
  service: string;
}

export interface IGraphDragData {
  type: NodeType;
  category: string;
  service: string;
}

export interface IGraphEdge {
  source: string;
  target: string;
}
