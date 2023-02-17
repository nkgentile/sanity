import {uuid} from '@sanity/uuid'
import {PerformanceTestContext, PerformanceTestProps} from '../types'
import {KNOWN_TEST_IDS} from '../utils/testIds'

export default {
  id: KNOWN_TEST_IDS['simple-typing-speed-test'],
  name: 'Simple typing speed test',
  description: `
  This test measures the typing speed of a simple text field. It's collecting results as a regression in percentage between the base branch and the current branch. A negative value means that the current branch is faster than the base branch.
  `,
  metrics: {
    lag: {title: 'Lag', description: 'The lag measured while running the tests'},
    timePerKeyStroke: {
      title: 'Time per keystroke',
      description: 'The measured time per keystroke',
    },
  },
  version: 1,
  async run({page, client, url}: PerformanceTestContext) {
    const documentId = uuid()
    await page.goto(`${url}/desk/simple;${documentId}`, {
      // This is needed on CI servers with restricted resources because it takes a long time to compile the studio js
      timeout: 1000 * 60 * 5,
    })

    const input = page.locator('[data-testid="field-simple"] [data-testid="string-input"]')

    const samples = await input.evaluate((el: HTMLInputElement) =>
      window.perf.typingTest(el, {iterations: 1})
    )

    await Promise.all([client.delete(`drafts.${documentId}`), client.delete(documentId)])

    return {
      lag: samples.reduce((lag, sample) => lag + sample.lag, 0),
      timePerKeyStroke: samples.reduce((lag, sample) => lag + sample.timePerKeyStroke, 0),
    }
  },
} satisfies PerformanceTestProps<{lag: number; timePerKeyStroke: number}>
