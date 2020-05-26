// @ts-ignore
import fse from 'fs-extra';
// @ts-ignore
import path from 'path';
// @ts-ignore
import glob from 'glob';

const srcDir = path.join('./src');
const distDir = path.join('./dist/js');
const files = glob.sync('**/*.d.ts', {
  cwd: srcDir,
});

const scss = glob.sync('**/*.scss', {
  cwd: srcDir,
});

const svg = glob.sync('**/*.svg', {
  cwd: srcDir,
});
[...files, ...scss, ...svg].forEach((file: any) => {
  const from = path.join(srcDir, file);
  const to = path.join(distDir, file);
  const esm = path.join('./dist/esm', file);
  const umd = path.join('./dist/umd', file);
  fse.copySync(from, esm);
  fse.copySync(from, to);
  fse.copySync(from, umd);
});
