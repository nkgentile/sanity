import {startProfiling, stopProfiling} from 'v8-profiler-next'
import {createWriteStream} from 'fs'

/**
 * Runs a function with a tracing profiler and writes the result into a file.
 *
 * This file depends on `v8-profiler-next` being installed. It's recommeded to _NOT_
 * use this function directly, but rather use `withEnvTrace` from ../debug.ts.
 *
 * @param name A name for the current trace. The same name should not be used recursively.
 * @param filenamePrefix The filename where the report will be written. The full name
 * will be `{filenamePrefix}-{random}.cputfile`.
 */
export async function withTrace<T>(
  name: string,
  filenamePrefix: string,
  fn: () => Promise<T>,
): Promise<T> {
  startProfiling(name, true)
  try {
    return await fn()
  } finally {
    const fullname = `${filenamePrefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}.cpuprofile`
    const profile = stopProfiling(name)
    const stream = createWriteStream(fullname)
    const exportStream = profile.export(stream)
    await new Promise((resolve) => exportStream.on('close', resolve))
  }
}
