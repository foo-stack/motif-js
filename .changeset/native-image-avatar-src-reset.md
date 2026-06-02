---
'@usemotif/react-native': patch
---

Port the v1.1.2 web image-state fix to native. Native `Image` now resets its load status to `'loading'` whenever `src` changes, so swapping the source on a mounted image no longer keeps a stale loaded frame (or a failed image's fallback) for the new src. Native `Avatar` tracks which `src` failed instead of a one-way `errored` boolean, so a previously-failed avatar re-attempts the image when given a new, valid `src` instead of staying stuck on the initials fallback.
