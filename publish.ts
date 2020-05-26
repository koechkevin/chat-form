import * as fs from 'fs';

fs.readFile('package.json', 'utf-8', (err, data: string) => {
  const dataObj = JSON.parse(data);
  const version = dataObj.version.split('.');
  version[2] = parseInt(version[2], 10) === 99 ? 0 : parseInt(version[2], 10) + 1;
  version[1] = parseInt(version[2], 10) === 0 ? parseInt(version[1], 10) + 1 : version[1];
  const newVersion = version.join('.');
  const packageData = JSON.stringify({...dataObj, version: newVersion}, null, 2);
  fs.writeFile('package.json', packageData, (err) => {
    if (err) {
      console.error(err)
    } else {
      console.log(`version updated to ======> ${newVersion}`);
    }
  })
});
