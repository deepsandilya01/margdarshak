const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
const keys = new Set();

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = [...content.matchAll(/t\(['"]([\w\.]+)['"]\)/g)];
  matches.forEach(m => keys.add(m[1]));
});

const enCommon = JSON.parse(fs.readFileSync('./src/locales/en/common.json', 'utf8'));

function setNested(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) current[parts[i]] = {};
    current = current[parts[i]];
  }
  if (!current[parts[parts.length - 1]]) {
    current[parts[parts.length - 1]] = value;
  }
}

let added = 0;
keys.forEach(k => {
  const parts = k.split('.');
  let exists = true;
  let curr = enCommon;
  for (let p of parts) {
    if (curr[p] === undefined) { exists = false; break; }
    curr = curr[p];
  }
  if (!exists) {
    const last = parts[parts.length - 1];
    let readable = last.replace(/_/g, ' ');
    readable = readable.charAt(0).toUpperCase() + readable.slice(1);
    
    // Fix specific known keys to be perfect English for the UI
    if (k === 'auth.login') readable = 'Login';
    if (k === 'auth.email') readable = 'Email address';
    if (k === 'auth.password') readable = 'Password';
    if (k === 'auth.forgot_password') readable = 'Forgot password?';
    if (k === 'auth.no_account') readable = "Don't have an account?";
    if (k === 'auth.signup') readable = 'Sign up';
    if (k === 'workspace.title') readable = 'Workspace';
    if (k === 'ai_sathi.header') readable = 'AI Sathi';
    
    setNested(enCommon, k, readable);
    added++;
  }
});

fs.writeFileSync('./src/locales/en/common.json', JSON.stringify(enCommon, null, 2));
console.log('Added ' + added + ' missing keys to en/common.json');
