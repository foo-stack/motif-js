// React-Native-on-desktop + Yarn workspaces Metro config. Mirrors
// apps/playground-bare-rn/metro.config.js — the same three monorepo-aware
// tweaks so Metro resolves the workspace motif packages and the locally
// provisioned react-native(-macos):
//
// 1. `watchFolders` reaches the monorepo root so workspace-package edits
//    (`@usemotif/react-native`, the shared demo) reload Metro.
// 2. `nodeModulesPaths` lists this app's node_modules first (where the CI
//    lane installs react-native-macos) then the root's (the hoisted motif
//    packages).
// 3. `disableHierarchicalLookup` turns off the walk-up resolver — the
//    explicit paths are enough.

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
