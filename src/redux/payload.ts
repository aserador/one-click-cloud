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