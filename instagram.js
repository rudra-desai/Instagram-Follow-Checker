const puppeteer = require('puppeteer');
const colors = require('colors');
const spinner = require('./spinner');

const BASE_URL = 'https://www.instagram.com/';
let user_name = '';
const AllFollowers = {};

const instagram = {
  browser: null,
  page: null,

  initialize: async () => {
    try {
      console.log('');
      spinner.outputMessages('Initializing The Browser!', 'yellow');

      instagram.browser = await puppeteer.launch({
        headless: false,

      });
      instagram.page = await instagram.browser.newPage();
      await instagram.page.setViewport({ width: 1366, height: 768 });

      spinner.everythingWorked('1. Initialized!');
    } catch (e) {
      spinner.somethingWrong('1. Failed to intialize!');
    }
  },

  login: async (username, password) => {
    try {
      spinner.outputMessages('2. Loggin In!', 'yellow');

      await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle2' });
      user_name = username;

      // Typing in the username and password into the text fields and then click on Log in
      await instagram.page.type('input[name="username"]', username, { delay: 50 });
      await instagram.page.type('input[name="password"]', password, { delay: 50 });

      await instagram.page.click('button[type="submit"]');

      // Wait for the Home Page to Load
      await instagram.page.waitFor(10000);
      await instagram.page.waitFor(`img[alt="${username}\'s profile picture"]`);

      spinner.everythingWorked('2. Successfully Logged In!');
    } catch (e) {
      spinner.somethingWrong('2. Failed to Log In!');
    }
  },

  fetchFollowing_and_compare: async () => {
    try {
      spinner.outputMessages('4. Fetching The People You Follow And Comparing!', 'yellow');
      // Go to user's profile
      await instagram.page.goto(BASE_URL + user_name, { waitUntil: 'networkidle2' });

      // Click on Following
      await instagram.page.waitFor(5000);
      await instagram.page.click(`a[href='/${user_name}/following/']`);

      // wait until the followers show up
      await instagram.page.waitFor("div[role='dialog'] > div:nth-child(3) > ul > div > li");

      // Total number of people the user following
      let following = await instagram.page.$eval(`a[href='/${user_name}/following/'] > span`, (el) => el.innerText);
      following = parseInt(following);

      const lis = await instagram.page.$eval("div[role='dialog'] > div:nth-child(3) > ul > div", (el) => el.getElementsByTagName('li').length);
      following = parseInt(following);

      // console.log("Total Following: " + following);

      let hoverOverThis;
      let followingUser;

      for (var i = 1; i <= following / 12; i++) {
        hoverOverThis = `div[role='dialog'] > div:nth-child(3) > ul > div > li:nth-child(${i * 12})`;
        await instagram.page.waitFor(hoverOverThis);
        await instagram.page.waitFor(500);
        await instagram.page.hover(hoverOverThis);
      }
      spinner.stopSpinner();
      console.log("\nPeople Who Don't Follow You Back: ".bold);
      for (var i = 1; i <= following; i++) {
        await instagram.page.waitFor(`div[role='dialog'] > div:nth-child(3) > ul > div > li:nth-child(${i}) > div > div > div > div > a`);
        followingUser = await instagram.page.$eval(`div[role='dialog'] > div:nth-child(3) > ul > div > li:nth-child(${i}) > div > div > div > div > a`, (el) => el.innerText);
        if (!(followingUser in AllFollowers)) {
          console.log(followingUser);
        }
      }
      await instagram.browser.close();
    } catch (e) {
      spinner.somethingWrong('4. Failed To Fetch Following and Comparing!');
    }
  },

  fetchFollowers: async () => {
    try {
      spinner.outputMessages('3. Fetching Followers!', 'yellow');
      // Go to user's profile
      await instagram.page.goto(BASE_URL + user_name, { waitUntil: 'networkidle2' });

      // Click on Followers
      await instagram.page.waitFor(5000);
      await instagram.page.click(`a[href='/${user_name}/followers/']`);

      // wait until the followers show up
      await instagram.page.waitFor("div[role='dialog'] > div:nth-child(2) > ul > div > li");

      // Total number of followers
      let followers = await instagram.page.$eval(`a[href='/${user_name}/followers/'] > span`, (el) => el.innerText);
      followers = parseInt(followers);

      let hoverOverThis;
      let followerUser;

      for (var i = 1; i <= followers / 12; i++) {
        hoverOverThis = `div[role='dialog'] > div:nth-child(2) > ul > div > li:nth-child(${i * 12})`;
        await instagram.page.waitFor(hoverOverThis);
        await instagram.page.waitFor(500);
        await instagram.page.hover(hoverOverThis);
      }

      for (var i = 1; i <= followers; i++) {
        await instagram.page.waitFor(`div[role='dialog'] > div:nth-child(2) > ul > div > li:nth-child(${i}) > div > div > div > div > a`);
        followerUser = await instagram.page.$eval(`div[role='dialog'] > div:nth-child(2) > ul > div > li:nth-child(${i}) > div > div > div > div > a`, (el) => el.innerText);
        AllFollowers[followerUser] = 1;
      }
      spinner.everythingWorked('3. Successfully Fetched Followers!');
    } catch (e) {
      spinner.somethingWrong('3. Failed to fetch followers!');
    }
  },
};

module.exports = instagram;
