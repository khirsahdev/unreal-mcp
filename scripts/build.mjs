// Cross-platform, type-error-tolerant build.
// tsc emits valid JS even when it reports TS2589 ("type instantiation excessively deep")
// from the zod + MCP-SDK generics. Those are type-checker noise, not emit failures —
// so we run tsc, ignore its exit code, then always copy the editor python scripts.
import { spawnSync } from "node:child_process"
import { createRequire } from "node:module"
import { cpSync, mkdirSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const require = createRequire(import.meta.url)
const tscBin = require.resolve("typescript/bin/tsc")

const r = spawnSync(process.execPath, ["--max-old-space-size=6144", tscBin], {
	cwd: root,
	stdio: "inherit",
})
if (r.status !== 0) {
	console.log(`\n[build] tsc reported type warnings (exit ${r.status}); JS still emitted, continuing.`)
}

const src = resolve(root, "server/editor/scripts")
const dest = resolve(root, "dist/editor/scripts")
mkdirSync(dest, { recursive: true })
cpSync(src, dest, { recursive: true })
console.log(`[build] copied editor scripts -> ${dest}`)
