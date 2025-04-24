import shortid from "shortid";
import { COLUMN, COMPONENT, ROW } from "./constants";
import { IInitialData } from "./types";

const initialData: IInitialData = {
  layout: [
    {
      type: ROW,
      id: shortid.generate(),
      children: [
        {
          type: COLUMN,
          id: shortid.generate(),
          children: [
            {
              type: COMPONENT,
              id: shortid.generate()
            }
          ]
        },
        {
          type: COLUMN,
          id: shortid.generate(),
          children: [
            {
              type: COMPONENT,
              id: shortid.generate()
            }
          ]
        }
      ]
    }
  ],
  components: {
    [shortid.generate()]: {
      id: shortid.generate(),
      type: "input",
      content: "Some input"
    },
    [shortid.generate()]: {
      id: shortid.generate(),
      type: "name",
      content: "Some name"
    },
    [shortid.generate()]: {
      id: shortid.generate(),
      type: "email",
      content: "Some email"
    },
    [shortid.generate()]: {
      id: shortid.generate(),
      type: "phone",
      content: "Some phone"
    },
    [shortid.generate()]: {
      id: shortid.generate(),
      type: "image",
      content: "Some image"
    }
  }
};

export default initialData;