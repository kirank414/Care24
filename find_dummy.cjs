const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('c:/Users/Dell/Documents/Dell/OneDrive/Desktop/Care24/Care24/src');
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if (line.match(/<(Button|button|Link|a)(\s|>)/) && !line.match(/onClick|onSubmit|href|to=|type="submit"|type='submit'/)) {
      console.log(file.split('\\').pop().split('/').pop() + ':' + (i + 1) + ' ' + line.trim());
    } else if (line.match(/to="#"|href="#"|to=""|href=""/)) {
      console.log(file.split('\\').pop().split('/').pop() + ':' + (i + 1) + ' ' + line.trim());
    }
  });
});
