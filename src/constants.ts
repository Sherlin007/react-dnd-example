import shortid from "shortid";
import { ISidebarItem } from "./types";

export const SIDEBAR_ITEM = "sidebarItem";
export const ROW = "row";
export const COLUMN = "column";
export const COMPONENT = "component";

export const SIDEBAR_ITEMS: ISidebarItem[] = [
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "input",
      content: "Some input"
    }
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "name",
      content: "Some name"
    }
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "email",
      content: "Some email"
    }
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "phone",
      content: "Some phone"
    }
  },
  {
    id: shortid.generate(),
    type: SIDEBAR_ITEM,
    component: {
      type: "image",
      content: "Some image"
    }
  }
];