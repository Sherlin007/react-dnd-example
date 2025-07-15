import { COMPONENT, ROW, COLUMN, SECTION } from './formConstants';
import shortid from 'shortid';

const initialFormData = {
  layout: [
    {
      type: SECTION,
      id: shortid.generate(),
      title: 'Section 1',
      children: [
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
    },
  ],
  components: {},
};

export default initialFormData;
