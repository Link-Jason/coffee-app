# Coffee App Status

## Current State
Stable "scroll-based" version (one page layout).

## Branch
main

## Verified Commit
ad50577

## Deployment
Live and working on Vercel.

## Notes
Navigation experiments (Expo Router, page switching, etc.) caused layout issues.
Reverted back to stable version to preserve working UI.

## Future Changes Rule
- Small tweaks (text, styling): safe to do on `main`
- Bigger changes (navigation, layout, new features): create a new branch first

Example:
git checkout -b navigation-experiment