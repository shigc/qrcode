/**
 * 构建脚本：复制全部静态文件到 dist/，并对核心业务 JS 进行混淆加密
 *
 * 使用方式：
 *   node build.mjs
 *
 * 产物：
 *   dist/                完整可部署的静态站点
 *   dist/assets/js/*.js  已混淆的核心业务代码
 */
import JavaScriptObfuscator from 'javascript-obfuscator';
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  rmSync,
  readdirSync,
  statSync,
  existsSync,
  copyFileSync,
} from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const DIST = join(ROOT, 'dist');

/* ---- 配置区 ---- */

// 需要混淆的核心业务 JS（相对根目录路径）
// assets/lib/ 下的第三方库不混淆，原样复制
const OBFUSCATE_FILES = [
  'assets/js/i18n.js',
  'assets/js/theme.js',
  'assets/js/qr-generator.js',
  'assets/js/qr-decoder.js',
  'assets/js/main.js',
];

// 不复制到 dist 的条目（构建/依赖/源码管理）
const EXCLUDE = new Set([
  'dist',
  'node_modules',
  '.git',
  '.trae',
  '.wrangler',
  'build.mjs',
  'package.json',
  'package-lock.json',
  'AGENTS.md',
  'README.md',
  'LICENSE',
  'THIRD_PARTY_LICENSES.md',
  'CONTRIBUTING.md',
  '.github',
  '.gitignore',
  'review-results.json',
]);

// 混淆参数：在保护强度与运行性能之间取得平衡
const OBFUSCATOR_OPTIONS = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.5,
  deadCodeInjection: false,
  debugProtection: false,
  debugProtectionInterval: 0,
  disableConsoleOutput: false,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.75,
  transformObjectKeys: true,
  unicodeEscapeSequence: false,
};

/* ---- 工具函数 ---- */

function copyDir(src, dest) {
  if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    const stat = statSync(srcPath);
    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

function cleanDist() {
  if (existsSync(DIST)) {
    rmSync(DIST, { recursive: true, force: true });
  }
}

/* ---- 主流程 ---- */

console.log('🧹 Cleaning dist/ ...');
cleanDist();

console.log('📋 Copying all files to dist/ ...');
mkdirSync(DIST, { recursive: true });
for (const entry of readdirSync(ROOT)) {
  // 跳过构建/版本控制相关的隐藏文件与目录（如 .git、.github、.gitignore）
  if (EXCLUDE.has(entry) || entry.startsWith('README.') || entry.startsWith('.')) continue;
  const srcPath = join(ROOT, entry);
  const destPath = join(DIST, entry);
  const stat = statSync(srcPath);
  if (stat.isDirectory()) {
    copyDir(srcPath, destPath);
  } else {
    copyFileSync(srcPath, destPath);
  }
}

console.log('🔒 Obfuscating core JS files ...');
let successCount = 0;
for (const relPath of OBFUSCATE_FILES) {
  const absPath = join(DIST, relPath);
  if (!existsSync(absPath)) {
    console.warn(`  ⚠️  Not found, skipped: ${relPath}`);
    continue;
  }
  const code = readFileSync(absPath, 'utf-8');
  try {
    const result = JavaScriptObfuscator.obfuscate(code, OBFUSCATOR_OPTIONS);
    const out = result.getObfuscatedCode();
    writeFileSync(absPath, out, 'utf-8');
    console.log(
      `  ✅ ${relPath}  ${code.length} -> ${out.length} bytes`
    );
    successCount++;
  } catch (err) {
    console.error(`  ❌ ${relPath}: ${err.message}`);
  }
}

console.log(
  `\n✅ Build complete: ${successCount}/${OBFUSCATE_FILES.length} files obfuscated.`
);
console.log(`   Output dir: ${DIST}`);
console.log('   Deploy: npx wrangler pages deploy dist --project-name qr-code-generator --branch main');
