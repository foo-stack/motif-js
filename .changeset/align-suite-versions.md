---
'@usemotif/core': patch
---

Align every published package on a single suite version

The package group was configured as `linked`, which keeps changed packages on a
shared version number but leaves untouched packages behind. Releases that
happened to modify `@usemotif/core` cascaded a bump to nearly everything and so
looked uniform; 1.2.2 touched only the React packages, and twelve packages
stayed at 1.2.1.

The group is now `fixed`, so every package moves together on every release and
one version identifies the whole suite. This release carries no functional
change to the packages it lifts — it exists to put them back on one number.
