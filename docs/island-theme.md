# Island · 云间小岛

A separate, complete NotionNext theme. Orange remains the default; preview Island with `/?theme=island`.

The original Three.js village includes a timber reading house, glass workshop, domed observatory, hillside cottage, orchard satellite, rope bridge, pond, waterfall, trees, cats, sheep and birds. All geometry is generated locally; no external model or texture service is required. A portrait-inspired explorer walks along a shared path graph, including rerouting during interrupted trips. Four destinations connect to existing `/archive`, `/tools`, `/profile` and `/about` content. Article pages retain password protection, Notion rendering, reading progress, a contents panel, sharing, comments and adjacent notes.

Visitors can rotate, zoom, pause, tour, visit buildings, greet animals, and change day/night. A single arrival cover lasts until the first successful frame. Explicit skip, initialization failure or a visible 12-second startup deadline opens an interactive SVG map with the same destinations. A discarded live context rebuilds automatically with a smaller rendering budget and retained destination, up to two consecutive retries; twenty healthy seconds renew the recovery allowance. Unmounting explicitly releases the GPU context. No compatibility room flashes during startup. Background/offscreen animation stops; reduced motion freezes decorative motion. Static geometry is batched by material and destination, flowers are instanced, shadow maps are cached, and drawing-buffer pixels/frame rate are bounded. Animated actors and doors stay outside static batches. Changing scene state reuses the renderer.

Orange and Island are both marked recommended in `conf/themeSwitch.manifest.js`. Their header gallery button loads the shared theme selector only on demand, without restoring a floating toolbar. Theme choice uses the existing query override and does not mutate the site's Notion default.

## Configuration

See `config.js` for `ISLAND_TITLE`, `ISLAND_SCENE_ENABLE`, `ISLAND_AMBIENCE_ENABLE`, and the four palette fields. These are editable in the theme console/Notion configuration. Do not change `THEME` to try the preview.

## Validation

`node --test scripts/tests/island-world.test.mjs` checks geometry/batching/color/instancing, collision-free routes and interrupted walks, animated animals and reduced motion. Jest checks startup/skip/timeout/disposal, scene reuse, destinations, password protection, query search, article URLs, recommendations and the retained default. Browser QA covers desktop and phone layouts, dragging, camera flights, pause/zoom/reset, navigation and content pages.
