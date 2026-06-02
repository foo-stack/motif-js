---
'@usemotif/react-native': patch
---

Three native fixes. The FLIP layout hook now keeps its running `Animated.parallel` in a ref, stops it before starting the next one, and stops it on unmount — previously a rapid second layout left the old parallel driving the same Animated.Values alongside the new one, and unmount left an animation running (the web counterpart got this in v1.1.2). The JS-thread spring integrator (and its Reanimated fallback) now applies the configured initial velocity only on the genuine first activation via a `seeded` flag, instead of re-seeding it on every settled→moving transition. Native `IconButton` ports the web `hasGrayScale` guard plus literal gray fallbacks, so neutral/ghost variants render correctly on a theme that defines no `gray` scale (the v1.1.2 changelog claimed this but it had not landed).
