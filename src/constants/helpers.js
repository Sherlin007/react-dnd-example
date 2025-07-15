import shortid from "shortid";
import { ROW, COLUMN, COMPONENT, SECTION } from "./formConstants";

// a little function to help us with reordering the result
export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed); // inserting task in new index

  return result;
};

export const remove = (arr, index) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // part of the array after the specified index
  ...arr.slice(index + 1),
];

export const insert = (arr, index, newItem) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...arr.slice(index),
];

export const reorderChildren = (children, splitDropZonePath, splitItemPath) => {
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
    ),
  };

  return updatedChildren;
};

export const removeChildFromChildren = (children, splitItemPath) => {
  if (splitItemPath?.length === 1) {
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
    ),
  };

  return updatedChildren;
};

export const addChildToChildren = (children, splitDropZonePath, item) => {
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
    ),
  };

  return updatedChildren;
};

export const handleMoveWithinParent = (
  layout,
  splitDropZonePath,
  splitItemPath
) => {
  return reorderChildren(layout, splitDropZonePath, splitItemPath);
};

export const handleAddColumDataToRow = (layout) => {
  const layoutCopy = [...layout];
  const COLUMN_STRUCTURE = {
    type: COLUMN,
    id: shortid.generate(),
    children: [],
  };

  return layoutCopy.map((row) => {
    if (!row.children.length) {
      row.children = [COLUMN_STRUCTURE];
    }
    return row;
  });
};

export const handleMoveToDifferentParent = (
  layout,
  splitDropZonePath,
  splitItemPath,
  item
) => {
  let newLayoutStructure;
  const COLUMN_STRUCTURE = {
    type: COLUMN,
    id: shortid.generate(),
    children: [item],
  };

  const ROW_STRUCTURE = {
    type: ROW,
    id: shortid.generate(),
  };

  const SECTION_STRUCTURE = {
    type: SECTION,
    id: shortid.generate(),
    title: 'New Section',
  };

  switch (splitDropZonePath.length) {
    case 1: {
      // Top level - moving to root
      if (item.type === SECTION) {
        newLayoutStructure = item;
      } else if (item.type === ROW) {
        // Wrap row in a new section
        newLayoutStructure = {
          ...SECTION_STRUCTURE,
          children: [item],
        };
      } else if (item.type === COLUMN) {
        // Wrap column in row and section
        newLayoutStructure = {
          ...SECTION_STRUCTURE,
          children: [{
            ...ROW_STRUCTURE,
            children: [item],
          }],
        };
      } else {
        // Wrap component in column, row, and section
        newLayoutStructure = {
          ...SECTION_STRUCTURE,
          children: [{
            ...ROW_STRUCTURE,
            children: [COLUMN_STRUCTURE],
          }],
        };
      }
      break;
    }
    case 2: {
      // Section level - moving into a section
      if (item.type === ROW) {
        newLayoutStructure = item;
      } else if (item.type === COLUMN) {
        // Wrap column in a row
        newLayoutStructure = {
          ...ROW_STRUCTURE,
          children: [item],
        };
      } else if (item.type === COMPONENT) {
        // Wrap component in column and row
        newLayoutStructure = {
          ...ROW_STRUCTURE,
          children: [COLUMN_STRUCTURE],
        };
      } else {
        newLayoutStructure = item;
      }
      break;
    }
    case 3: {
      // Row level - moving into a row
      if (item.type === COLUMN) {
        newLayoutStructure = item;
      } else if (item.type === COMPONENT) {
        newLayoutStructure = COLUMN_STRUCTURE;
      } else {
        newLayoutStructure = item;
      }
      break;
    }
    default: {
      newLayoutStructure = item;
    }
  }

  let updatedLayout = layout;
  // Only try to remove the child if splitItemPath exists
  if (splitItemPath) {
    updatedLayout = removeChildFromChildren(updatedLayout, splitItemPath);
  }
  updatedLayout = handleAddColumDataToRow(updatedLayout);
  updatedLayout = addChildToChildren(
    updatedLayout,
    splitDropZonePath,
    newLayoutStructure
  );

  return updatedLayout;
};

export const handleMoveSidebarComponentIntoParent = (
  layout,
  splitDropZonePath,
  item
) => {
  let newLayoutStructure;
  switch (splitDropZonePath.length) {
    case 1: {
      // Top level - create a new section with row and column
      newLayoutStructure = {
        type: SECTION,
        id: shortid.generate(),
        title: 'New Section',
        children: [
          {
            type: ROW,
            id: shortid.generate(),
            children: [
              {
                type: COLUMN,
                id: shortid.generate(),
                children: [item],
              },
            ],
          },
        ],
      };
      break;
    }
    case 2: {
      // Section level - create a new row with column
      newLayoutStructure = {
        type: ROW,
        id: shortid.generate(),
        children: [
          {
            type: COLUMN,
            id: shortid.generate(),
            children: [item],
          },
        ],
      };
      break;
    }
    case 3: {
      // Row level - create a new column
      newLayoutStructure = {
        type: COLUMN,
        id: shortid.generate(),
        children: [item],
      };
      break;
    }
    default: {
      // Direct component placement
      newLayoutStructure = item;
    }
  }

  return addChildToChildren(layout, splitDropZonePath, newLayoutStructure);
};

export const handleRemoveItemFromLayout = (layout, splitItemPath) => {
  return removeChildFromChildren(layout, splitItemPath);
};
