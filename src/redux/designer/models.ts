import { XYPosition } from "reactflow";

export interface ISchemaTemplates {
  [key: string]: ICategory;
}

export interface ICategory {
  [key: string]: IService;
}

export interface IService {
  id: string;
  deploy: {};
  cost: {};
  enabled: boolean;
  config: {};
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
  id: string;
  source: string;
  target: string;
}
