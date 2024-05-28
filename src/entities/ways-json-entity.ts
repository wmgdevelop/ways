export type WaysJsonEntity = Way[];

export interface Way {
  templates: string[];
  options: WayOptions[];
}

export type WayOptions = {
  [key: string]: string;
}
