import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Music catalog commits also use [skip-version] to avoid a package bump, but
// they still need a deployment. Only skip the version bot's own follow-up.
export function shouldSkipBuild(message) {
  return /^chore\(release\): bump package\.json to [^\r\n]+ \[skip-version\](?:\r?\n|$)/.test(
    String(message || '').trim()
  )
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const skip = shouldSkipBuild(process.env.VERCEL_GIT_COMMIT_MESSAGE)
  console.log(
    skip
      ? 'Skip package-version-only follow-up.'
      : 'Build site content and music updates.'
  )
  // Vercel's ignored-build command uses zero for skip and one for build.
  process.exitCode = skip ? 0 : 1
}
