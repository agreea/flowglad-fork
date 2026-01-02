#!/usr/bin/env node
/**
 * Cross-platform biome wrapper that properly detects musl vs glibc on Linux
 */
const { platform, arch, env, version, release } = require('process');
const { spawnSync, execSync } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

function isMusl() {
  if (platform !== 'linux') return false;

  // Try ldd first (standard approach)
  try {
    const result = execSync('ldd --version 2>&1', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    if (result.toLowerCase().includes('musl')) return true;
  } catch (err) {
    // ldd failed or doesn't exist
  }

  // Check for musl libc directly
  if (existsSync('/lib/ld-musl-x86_64.so.1') || existsSync('/lib/ld-musl-aarch64.so.1')) {
    return true;
  }

  // Check if glibc dynamic linker exists - if not, likely musl
  if (!existsSync('/lib64/ld-linux-x86-64.so.2') && !existsSync('/lib/ld-linux-aarch64.so.1')) {
    // No glibc linker found, try musl binary
    const muslPath = arch === 'x64'
      ? '@biomejs/cli-linux-x64-musl/biome'
      : '@biomejs/cli-linux-arm64-musl/biome';
    try {
      const resolvedPath = require.resolve(muslPath);
      if (existsSync(resolvedPath)) return true;
    } catch {
      // musl package not installed
    }
  }

  return false;
}

const PLATFORMS = {
  win32: {
    x64: '@biomejs/cli-win32-x64/biome.exe',
    arm64: '@biomejs/cli-win32-arm64/biome.exe',
  },
  darwin: {
    x64: '@biomejs/cli-darwin-x64/biome',
    arm64: '@biomejs/cli-darwin-arm64/biome',
  },
  linux: {
    x64: '@biomejs/cli-linux-x64/biome',
    arm64: '@biomejs/cli-linux-arm64/biome',
  },
  'linux-musl': {
    x64: '@biomejs/cli-linux-x64-musl/biome',
    arm64: '@biomejs/cli-linux-arm64-musl/biome',
  },
};

const platformKey = platform === 'linux' && isMusl() ? 'linux-musl' : platform;
const binPath = env.BIOME_BINARY || PLATFORMS?.[platformKey]?.[arch];

if (!binPath) {
  console.error(
    "The Biome CLI package doesn't ship with prebuilt binaries for your platform yet. " +
    `Platform: ${platform}, Arch: ${arch}`
  );
  process.exit(1);
}

let resolvedPath;
try {
  resolvedPath = require.resolve(binPath);
} catch (err) {
  console.error(`Could not resolve biome binary: ${binPath}`);
  console.error(err.message);
  process.exit(1);
}

const result = spawnSync(resolvedPath, process.argv.slice(2), {
  shell: false,
  stdio: 'inherit',
  env: {
    ...env,
    JS_RUNTIME_VERSION: version,
    JS_RUNTIME_NAME: release.name,
  },
});

if (result.error) {
  throw result.error;
}

process.exitCode = result.status;
