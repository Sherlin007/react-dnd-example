import { COLUMN, COMPONENT, ROW } from "./constants";
import { IComponentChild, IColumn, IDragItem, IDropZoneData, IRow, Layout } from "./types";

// a little function to help us with reordering the result
export const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const remove = (arr: any[], index: number): any[] => [
  ...arr.slice(0, index),
  ...arr.slice(index + 1)
];

export const insert = (arr: any[], index: number, newItem: any): any[] => [
  ...arr.slice(0, index),
  newItem,
  ...arr.slice(index)
];

export const reorderChildren = (
  children: any[],
  splitDropZonePath: string[],
  splitItemPath: string[]
): any[] => {
  if (splitDropZonePath.length === 1) {
    const dropZoneIndex = Number(splitDropZonePath[0]);
    const itemIndex = Number(splitItemPath[0]);
    return reorder(children, itemIndex, dropZoneIndex);
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitDropZonePath.slice(0, 1));

  // Update the specific node's children
  const splitDropZoneChildrenPath = splitDropZonePath.slice(1);
  const splitItemChildrenPath = splitItemPath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: reorderChildren(
      nodeChildren.children,
      splitDropZoneChildrenPath,
      splitItemChildrenPath
    )
  };

  return updatedChildren;
};

export const removeChildFromChildren = (
  children: any[],
  splitItemPath: string[]
): any[] => {
  if (splitItemPath.length === 1) {
    const itemIndex = Number(splitItemPath[0]);
    return remove(children, itemIndex);
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitItemPath.slice(0, 1));

  // Update the specific node's children
  const splitItemChildrenPath = splitItemPath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: removeChildFromChildren(
      nodeChildren.children,
      splitItemChildrenPath
    )
  };

  return updatedChildren;
};

export const addChildToChildren = (
  children: any[],
  splitDropZonePath: string[],
  item: any
): any[] => {
  if (splitDropZonePath.length === 1) {
    const dropZoneIndex = Number(splitDropZonePath[0]);
    return insert(children, dropZoneIndex, item);
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitDropZonePath.slice(0, 1));

  // Update the specific node's children
  const splitItemChildrenPath = splitDropZonePath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: addChildToChildren(
      nodeChildren.children,
      splitItemChildrenPath,
      item
    )
  };

  return updatedChildren;
};

export const handleMoveWithinParent = (
  layout: Layout,
  splitDropZonePath: string[],
  splitItemPath: string[]
): Layout => {
  return layout.map((row: IRow) => {
    if (splitDropZonePath.length === 0) {
      return row;
    }

    const rowIndex = Number(splitDropZonePath[0]);
    const itemIndex = Number(splitItemPath[0]);

    if (splitDropZonePath.length === 1) {
      if (rowIndex === itemIndex) {
        return row;
      }
    }

    if (Number(splitItemPath[0]) !== Number(splitDropZonePath[0])) {
      return row;
    }

    return {
      ...row,
      children: reorderChildren(
        row.children,
        splitDropZonePath.slice(1),
        splitItemPath.slice(1)
      )
    };
  });
};

export const handleAddColumDataToRow = (layout: Layout): Layout => {
  return layout.map((row: IRow) => {
    if (!row.children.length) {
      row.children = [
        {
          id: "1",
          type: COLUMN,
          children: []
        }
      ];
    }

    return row;
  });
};

export const handleMoveToDifferentParent = (
  layout: Layout,
  splitDropZonePath: string[],
  splitItemPath: string[],
  item: IDragItem
): Layout => {
  let newLayoutStructure: Layout = [...layout];
  const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");
  const columnChildrenCount =
    newLayoutStructure[Number(splitDropZonePath[0])].children[
      Number(splitDropZonePath[1])
    ].children.length;

  // Move item to different parent
  // Remove item from source
  if (item.type === COLUMN) {
    const newItem = {
      id: item.id,
      type: item.type,
      children: item.children
    };
    newLayoutStructure = handleRemoveItemFromLayout(
      newLayoutStructure,
      splitItemPath
    );

    if (pathToDropZone.length === 1) {
      // moving column outside into new row made on the fly
      if (splitItemPath.length === 2) {
        // create new row
        const newRow: IRow = {
          type: ROW,
          id: "1",
          children: []
        };

        // add new item as children
        newRow.children = addChildToChildren(
          newRow.children,
          [splitDropZonePath[splitDropZonePath.length - 1]],
          newItem
        );

        newLayoutStructure = addChildToChildren(
          newLayoutStructure,
          [splitDropZonePath[0]],
          newRow
        );

        return newLayoutStructure;
      }
    }
  }

  // Add item to new parent
  newLayoutStructure = addChildToChildren(
    newLayoutStructure,
    splitDropZonePath,
    item
  );

  return newLayoutStructure;
};

export const handleMoveSidebarComponentIntoParent = (
  layout: Layout,
  splitDropZonePath: string[],
  item: IComponentChild
): Layout => {
  let newLayoutStructure: Layout = [...layout];

  newLayoutStructure = addChildToChildren(
    newLayoutStructure,
    splitDropZonePath,
    item
  );

  return newLayoutStructure;
};

export const handleRemoveItemFromLayout = (
  layout: Layout,
  splitItemPath: string[]
): Layout => {
  return layout.map((row: IRow, index: number) => {
    if (index === Number(splitItemPath[0]) && splitItemPath.length === 1) {
      return null;
    }

    if (index !== Number(splitItemPath[0])) {
      return row;
    }

    // If no children left, remove the row
    if (
      row.children.length === 1 &&
      Number(splitItemPath[1]) === 0 &&
      splitItemPath.length === 2
    ) {
      return null;
    }

    // Remove the item from the row
    if (splitItemPath.length === 2) {
      const updatedChildren = removeChildFromChildren(
        row.children,
        splitItemPath.slice(1)
      );

      return {
        ...row,
        children: updatedChildren
      };
    }

    // Remove the item from the column
    if (splitItemPath.length === 3) {
      const updatedChildren = row.children.map((column: IColumn, idx: number) => {
        if (idx === Number(splitItemPath[1])) {
          const updatedColumnChildren = removeChildFromChildren(
            column.children,
            splitItemPath.slice(2)
          );

          return {
            ...column,
            children: updatedColumnChildren
          };
        }

        return column;
      });

      return {
        ...row,
        children: updatedChildren
      };
    }

    return row;
  }).filter(Boolean) as Layout;
};