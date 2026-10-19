# Validation notes

## Prepared repository

- Node scripts parse the inline JavaScript, check local runtime references and confirm the required notice/license files.
- The build regenerates a self-contained offline HTML file and a static `dist/` site without fetching packages.
- The game uses relative asset paths so it can run under a GitHub Pages project subdirectory.
- The local server serves a fixed list of game/documentation files and does not expose `.git`, environment files or arbitrary paths.
- The repository package excludes development scratch files, authentication state, course lesson files, other participants' repositories and old gameplay videos.

## Gameplay checks from the visual-development pass

- Full HD desktop rendering and window coverage.
- Portrait 390 × 844 and landscape 844 × 390 viewport coverage without horizontal overflow.
- Keyboard movement, dash, lash and ascension; touch ability buttons; pause/settings.
- Complete boss entrance and willow rebirth preview returning to the menu.
- No JavaScript errors reported in the final gameplay checks of that pass.

Phone layouts were checked in a desktop browser with touch controls enabled. Every physical Android/iOS device, all late-game combinations and any particular frame rate have not been certified. The repository distribution switches optional online font requests to device fonts and otherwise preserves the final game code and assets.

The built-site HTTP smoke check passed for the page, JavaScript, CSS, JPEG texture and offline game; requests for `.git/config` returned 404. `npm run build` and `npm run check` passed for this repository package.

## Publication

On October 20, 2026, the public repository was uploaded and GitHub Pages was enabled from `main` / root. The public HTTPS play link loaded the title screen, started the game and ran movement/lash/combat checks with no JavaScript errors reported. The play link is also present in the README and repository About panel.

- Repository: https://github.com/ajeetpratapsingh12/spirit-sanctuary
- Play: https://ajeetpratapsingh12.github.io/spirit-sanctuary/

Later changes to `main` trigger another Pages deployment; allow it time to finish before checking new changes.
