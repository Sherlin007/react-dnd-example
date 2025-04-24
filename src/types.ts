// Define component types
export type ComponentType = 'input' | 'name' | 'email' | 'phone' | 'image' | string;

// Define item types
export type ItemType = 'sidebarItem' | 'row' | 'column' | 'component';

// Define component interface
export interface IComponent {
  id: string;
  type: ComponentType;
  content: string;
}

// Define component map
export interface IComponentMap {
  [key: string]: IComponent;
}

// Add this type alias to fix the import error
export type Components = IComponentMap;

// Define child component
export interface IComponentChild {
  id: string;
  type: 'component';
}

// Define column
export interface IColumn {
  id: string;
  type: 'column';
  children: IComponentChild[];
}

// Define row
export interface IRow {
  id: string;
  type: 'row';
  children: IColumn[];
}

// Define layout
export type Layout = IRow[];

// Define sidebar item
export interface ISidebarItem {
  id: string;
  type: 'sidebarItem';
  component: {
    type: ComponentType;
    content: string;
  };
}

// Define drop zone data
export interface IDropZoneData {
  path: string;
  childrenCount: number;
}

// Define trash drop zone data
export interface ITrashDropZoneData {
  layout: Layout;
}

// Define drag item
// Update your IDragItem interface to include the component property
// A more specific component interface
export interface IComponent {
  type: string;
  [key: string]: any;
}

export interface IDragItem {
  id: string;
  type: string;
  path?: string;
  children?: any[];
  component?: IComponent; // Use the more specific type
}

// Define component props
export interface IComponentProps {
  data: IComponentChild;
  components: IComponentMap;
  path: string;
}

// Define column props
export interface IColumnProps {
  data: IColumn;
  components: IComponentMap;
  handleDrop: (dropZone: IDropZoneData, item: IDragItem) => void;
  path: string;
}

// Define row props
export interface IRowProps {
  data: IRow;
  components: IComponentMap;
  handleDrop: (dropZone: IDropZoneData, item: IDragItem) => void;
  path: string;
}

// Define drop zone props
// Update your IDropZoneProps interface to include the path property
export interface IDropZoneProps {
  data: IDropZoneData;
  onDrop: (dropZone: IDropZoneData, item: IDragItem) => void;
  isLast?: boolean;
  className?: string;
  path?: string; // Add this property
}

// Define trash drop zone props
export interface ITrashDropZoneProps {
  data: ITrashDropZoneData;
  onDrop: (dropZone: ITrashDropZoneData, item: IDragItem) => void;
}

// Define sidebar item props
// Add this interface to your types.ts file if it doesn't exist
export interface ISideBarItemProps {
  data: {
    id: string;
    type: string;
    component: {
      type: string;
      [key: string]: any;
    };
  };
}

// Define initial data
export interface IInitialData {
  layout: Layout;
  components: IComponentMap;
}

export interface IDragItem {
  type: string;
  id: string;
  children: IColumn[];
  path: string;
}