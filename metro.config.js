const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure TypeScript files are resolved properly
config.resolver.sourceExts.push('tsx', 'ts');

// Ensure proper module resolution order
config.resolver.platforms = ['native', 'android', 'ios', 'web'];

module.exports = config; 