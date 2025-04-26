import { COMPONENT, ROW, COLUMN } from './formConstants';
import shortid from 'shortid';

const initialFormData = {
  layout: [
    {
      type: ROW,
      id: shortid.generate(),
      children: [
        {
          type: COLUMN,
          id: shortid.generate(),
          children: [],
        },
      ],
    },
  ],
  components: {},
};

export default initialFormData;
