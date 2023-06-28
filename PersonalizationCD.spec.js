const { test, chromium, expect } = require('@playwright/test');
const fs = require('fs');
const CDPersonalizationPage = require('../../Pages/CDPersonalizationPage').default;
const Environment = require('../../Data/Environment.json');
const CDLoginPage = require('../../Pages/CDLogin.page');
const PersonalizationData = require('../../Data/PersonalizationData.json');

let cdPage;
let cdContext;
let browser;
const cDState = JSON.parse(fs.readFileSync('CDstate.json'));
const cdState2 = JSON.parse(fs.readFileSync('CDstate2.json'));
const envURL = Environment.CDURL;

test.describe.parallel('Personalization Tests', () => {
  const usersToTest = [
    { UserEmail: Environment.CDUsername, UserState: cDState, UserTag: Environment.CDUserTag },
    { UserEmail: Environment.CDUsername1, UserState: cdState2, UserTag: Environment.CDUserTag1 },
  ];

  PersonalizationData.forEach((personalizeData) => {
    usersToTest.forEach((user) => {
      test(`Check ${personalizeData.Item} Personalization For User ${user.UserEmail}`, async () => {
        browser = await chromium.launch();
        cdContext = await browser.newContext({ storageState: user.UserState });
        cdPage = await cdContext.newPage();
        await cdPage.goto(`${envURL}${personalizeData.Page}`, { waitUntil: 'networkidle' });

        const tile = cdPage.locator(personalizeData.Locator, { hasText: personalizeData.Item });
        if (personalizeData.TagsIncluded.includes(user.UserTag)) {
          await expect(tile).toBeVisible();
        } else {
          await expect(tile).toHaveCount(0);
        }
      });
    });
  });

  test.afterEach(async () => {
    await browser.close();
  });
});
