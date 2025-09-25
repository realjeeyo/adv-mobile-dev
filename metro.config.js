const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for additional asset types
config.resolver.assetExts.push(
  'glb',
  'gltf',
  'mtl',
  'obj',
  'dae',
  'bin'
);

// Configure for Reanimated 4.x
config.resolver.alias = {
  ...config.resolver.alias,
};

module.exports = config;