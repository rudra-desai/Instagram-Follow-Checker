const ig = require('./instagram');
const prompt = require('prompt-sync')();

console.log('');
const username = prompt('Enter your Instagram username: ');
const password = prompt('Enter your Instagram password: ');

(async () => {
  await ig.initialize();
  await ig.login(username, password);
  await ig.fetchFollowers();
  await ig.fetchFollowing_and_compare();
})();
