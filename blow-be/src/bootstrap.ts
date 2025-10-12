import { Module } from 'module';
import { existsSync, lstatSync, symlinkSync } from 'fs';
import { delimiter, join } from 'path';

const distDir = __dirname;
const aliasTarget = join(distDir, 'src');

try {
  if (!existsSync(aliasTarget)) {
    symlinkSync('.', aliasTarget, process.platform === 'win32' ? 'junction' : 'dir');
  } else if (!lstatSync(aliasTarget).isSymbolicLink()) {
    // If the path exists but is not a symlink, leave it untouched to avoid overriding user files.
  }
} catch (error) {
  console.warn('Failed to create dist alias for "src" imports:', error);
}

const existingNodePath = process.env.NODE_PATH ? process.env.NODE_PATH.split(delimiter) : [];
if (!existingNodePath.includes(distDir)) {
  existingNodePath.unshift(distDir);
  process.env.NODE_PATH = existingNodePath.join(delimiter);
  (Module as unknown as { _initPaths: () => void })._initPaths();
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('./main');
