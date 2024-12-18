import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import fs from 'fs-extra';
import JSON5 from 'json5';
import UglifyJS from 'uglify-js';

const RegExtraFile = /#FROM_FILE#/;
const UglifyJSOptions = {
  module: false,
  compress: {
    expression: true,
  },
};

// Define paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const __rootdir = resolve(__dirname, '../');
const __sourcedir = resolve(__rootdir, './source');
const __distdir = resolve(__rootdir, './dist');

// Create/empty dist dir
if (!fs.existsSync(__distdir)) fs.mkdirSync(__distdir);
fs.emptyDirSync(__distdir);

// Read basic meta
const basicMeta = JSON5.parse(fs.readFileSync(resolve(__sourcedir, './meta.json5'), { encoding: 'utf-8' }));
basicMeta['bookSourceComment'] = fs.readFileSync(resolve(__rootdir, './README.md'), { encoding: 'utf-8' });
basicMeta['lastUpdateTime'] = Date.now();

// Add search scripts
const searchScript = fs.readFileSync(resolve(__sourcedir, './searchUrl.js'), { encoding: 'utf-8' });
const searchScriptMinify = UglifyJS.minify(searchScript, UglifyJSOptions);
if (!searchScriptMinify.error) basicMeta['searchUrl'] = `@js:${searchScriptMinify.code}`;
else basicMeta['searchUrl'] = `@js:${searchScript}`;

// Read rule paths
const ruleNames = (() => {
  const rulesPath = resolve(__sourcedir, './rules');
  const result = [];
  const ls = fs.readdirSync(rulesPath);
  for (const file of ls) {
    if (!fs.statSync(join(rulesPath, file)).isFile()) result.push(file);
  }
  return result;
})();

// Read rules
for (const ruleName of ruleNames) {
  const rulePath = join(__sourcedir, 'rules', ruleName);
  const rulePathMeta = resolve(rulePath, './meta.json5');
  if (!fs.existsSync(rulePathMeta)) continue;

  const ruleMeta = JSON5.parse(fs.readFileSync(rulePathMeta, { encoding: 'utf-8' }));

  // Test if had any extra files
  for (const name in ruleMeta) {
    if (RegExtraFile.test(ruleMeta[name])) {
      const extraFilePath = join(rulePath, `${name}.js`);
      const extraFile = fs.readFileSync(extraFilePath, { encoding: 'utf-8' });
      const extraFileMinify = UglifyJS.minify(extraFile, UglifyJSOptions);

      if (!extraFileMinify.error) ruleMeta[name] = ruleMeta[name].replace(RegExtraFile, extraFileMinify.code);
      else ruleMeta[name] = ruleMeta[name].replace(RegExtraFile, extraFile);
    }
  }
  basicMeta[`rule${ruleName}`] = ruleMeta;
}

fs.writeFileSync(resolve(__distdir, './rule.json'), JSON.stringify([basicMeta]));
