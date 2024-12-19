import debugIt from 'debug'

export const debug = debugIt('sanity:core')

/**
 * Runs a function such that it will be profiled when the environment variable
 * `SANITY_PROFILE_${key}=${filename}` is set. The generated file can be inspected by
 * using the Speedscpe NPM package:`speedscope ${filename}` opens a UI in the browser.
 * For profiling to be supported the `v8-profiler-next` package has to be installed.
 *
 * @param key The "key" of the tracing. The environment variable `SANITY_PROFILE_${key}`.
 * @param fn The function that will be invoked.
 * @returns
 */
export async function withEnvTrace<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const envName = `SANITY_PROFILE_${key}`
  const filename = process.env[envName]
  if (!filename) return await fn()

  let profiling
  try {
    profiling = await import('./util/profiling')
  } catch (err) {
    throw new Error(`${envName} is set, but unable to load profiling tools: ${err}`)
  }

  return await profiling.withTrace(key, filename, fn)
}
