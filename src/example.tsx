import React, { useState, useCallback } from "react";

import DropZone from "./DropZone";
import TrashDropZone from "./TrashDropZone";
import SideBarItem from "./SideBarItem";
import Row from "./Row";
import initialData from "./initial-data";
import {
  handleMoveWithinParent,
  handleMoveToDifferentParent,
  handleMoveSidebarComponentIntoParent,
  handleRemoveItemFromLayout,
} from "./helpers";

import { SIDEBAR_ITEMS, SIDEBAR_ITEM, COMPONENT, COLUMN } from "./constants";
import shortid from "shortid";
import { Body, SideBar, Page, PageContainer } from "./StyledComponents";
import {
  IDragItem,
  IDropZoneData,
  IRow,
  ITrashDropZoneData,
  Layout,
  Components,
  IComponent, // Add this import
} from "./types";

const Container: React.FC = () => {
  const initialLayout = initialData.layout;
  const initialComponents = initialData.components;
  const [layout, setLayout] = useState<Layout>(initialLayout);
  const [components, setComponents] = useState<Components>(initialComponents);

  const handleDropToTrashBin = useCallback(
    (dropZone: ITrashDropZoneData, item: IDragItem) => {
      const splitItemPath = item.path ? item.path.split("-") : [];
      setLayout(handleRemoveItemFromLayout(layout, splitItemPath));
    },
    [layout]
  );

  const handleDrop = useCallback(
    (dropZone: IDropZoneData, item: IDragItem) => {
      console.log("dropZone", dropZone);
      console.log("item", item);

      const splitDropZonePath = dropZone.path.split("-");
      const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");

      const newItem: any = { id: item.id, type: item.type };
      if (item.type === COLUMN) {
        newItem.children = item.children;
      }

      // sidebar into
      if (item.type === SIDEBAR_ITEM) {
        // 1. Move sidebar item into page
        const newComponent: IComponent = {
          id: shortid.generate(),
          type: (item.component && item.component.type) || "default", // Replace ?. with && operator
          content: (item.component && item.component.content) || "", // Replace ?. with && operator
          ...(item.component || {})
        };
        const newItem = {
          id: newComponent.id,
          type: COMPONENT as "component", // Cast the COMPONENT constant to the literal type "component"
        };
        setComponents({
          ...components,
          [newComponent.id]: newComponent,
        });
        setLayout(
          handleMoveSidebarComponentIntoParent(
            layout,
            splitDropZonePath,
            newItem
          )
        );
        return;
      }

      // move down here since sidebar items dont have path
      const splitItemPath = item.path ? item.path.split("-") : [];
      const pathToItem = splitItemPath.slice(0, -1).join("-");

      // 2. Pure move (no create)
      if (splitItemPath.length === splitDropZonePath.length) {
        // 2.a. move within parent
        if (pathToItem === pathToDropZone) {
          setLayout(
            handleMoveWithinParent(layout, splitDropZonePath, splitItemPath)
          );
          return;
        }

        // 2.b. OR move different parent
        // TODO FIX columns. item includes children
        setLayout(
          handleMoveToDifferentParent(
            layout,
            splitDropZonePath,
            splitItemPath,
            newItem
          )
        );
        return;
      }

      // 3. Move + Create
      setLayout(
        handleMoveToDifferentParent(
          layout,
          splitDropZonePath,
          splitItemPath,
          newItem
        )
      );
    },
    [layout, components]
  );

  const renderRow = (row: IRow, currentPath: string) => {
    return (
      <Row
        key={row.id}
        data={row}
        handleDrop={handleDrop}
        components={components}
        path={currentPath}
      />
    );
  };

  // dont use index for key when mapping over items
  // causes this issue - https://github.com/react-dnd/react-dnd/issues/342
  return (
    <Body>
      <SideBar>
        {Object.values(SIDEBAR_ITEMS).map((sideBarItem) => (
          <SideBarItem key={sideBarItem.id} data={sideBarItem} />
        ))}
      </SideBar>
      <PageContainer>
        <Page>
          {layout.map((row, index) => {
            const currentPath = `${index}`;

            return (
              <React.Fragment key={row.id}>
                <DropZone
                  data={{
                    path: currentPath,
                    childrenCount: layout.length,
                  }}
                  onDrop={handleDrop}
                  // Remove the path prop if it's not needed
                  // path={currentPath}
                />
                {renderRow(row, currentPath)}
              </React.Fragment>
            );
          })}
          <DropZone
            data={{
              path: `${layout.length}`,
              childrenCount: layout.length,
            }}
            onDrop={handleDrop}
            isLast
          />
        </Page>

        <TrashDropZone
          data={{
            layout,
          }}
          onDrop={handleDropToTrashBin}
        />
      </PageContainer>
    </Body>
  );
};
export default Container;
