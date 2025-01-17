import {type PatchExample} from './types'

const examples: PatchExample[] = [
  {
    name: 'Inc and dec',
    before: {
      a: [0, 1, 2, 3, 4],
      b: 4,
      c: 5,
    },
    patch: {
      id: 'a',
      inc: {
        'a[2]': 1,
        'b': 2,
      },
      dec: {
        c: 1,
      },
    },
    after: {
      a: [0, 1, 3, 3, 4],
      b: 6,
      c: 4,
    },
  },
]

export default examples
