// Bare-RN + Yarn workspaces Metro config.
//
// Mirrors apps/playground-native/metro.config.js but uses
// `@react-native/metro-config` directly instead of going through
// `expo/metro-config`. The three monorepo-aware tweaks are the same:
//
// 1. `watchFolders` extended to the monorepo root so changes in
//    workspace packages (`@usemotif/react-native`, `@usemotif/tokens`,
//    etc.) trigger Metro reloads.
// 2. `nodeModulesPaths` lists both the app's node_modules and the
//    root's, since Yarn 4 with `nodeLinker: node-modules` hoists
//    packages to the root.
// 3. `disableHierarchicalLookup` shuts off Metro's walk-up resolver -
//    the explicit `nodeModulesPaths` is enough and the walk-up triggers
//    spurious lookups in unrelated parents.

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('node:path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '..', '..');

const config = {
  watchFolders: [monorepoRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    disableHierarchicalLookup: true,
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
