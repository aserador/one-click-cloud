import { IGraphEdge } from "./models";

export type PayloadArgs = {};

export interface IPersistentDrawerIsOpen extends PayloadArgs {
  isOpen: boolean;
}

export interface IPersistentDrawerFocusedNode extends PayloadArgs {
  focusedNode: any;
}

export interface IPersistentDrawerSetAwsServices extends PayloadArgs {
  AWSServices: Array<any>;
}

export interface IPersistentDrawerSetAwsServiceProperty extends PayloadArgs {
  focusedNode: any;
}

export interface IPersistentDrawerSetDrawerMode extends PayloadArgs {
  drawerMode: "Service Details" | "Add Service";
}

export interface IPersistentDrawerSetGraphServices extends PayloadArgs {
  graphServices: any[];
}

export interface IPersistentDrawerSetGraphEdges extends PayloadArgs {
  graphEdges: IGraphEdge[];
}