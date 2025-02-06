import { MailTesting, MailTestingClient } from '@ebizbase/testing-utils';
import { APIRequestContext, expect as baseExpect } from '@playwright/test';
import { test as baseTest, createBdd } from 'playwright-bdd';

type PersonalInformation = { email: string; firstName: string; lastName: string };
type Fixtures = {
  information: PersonalInformation;
  maildev: MailTestingClient;
  requestContext: APIRequestContext;
};

const test = baseTest.extend<Fixtures>({
  // eslint-disable-next-line no-empty-pattern
  information: async ({}, use) => {
    const info: PersonalInformation = {
      firstName: 'John',
      lastName: 'Doe',
      email: `${Date.now()}@email.test`,
    };
    await use(info as Fixtures['information']);
  },
  // eslint-disable-next-line no-empty-pattern
  maildev: async ({}, use) => {
    await use((await MailTesting.getClient()) as Fixtures['maildev']);
  },
});

const expect = baseExpect.extend({
  // see more about custom matcher https://playwright.dev/docs/test-assertions#add-custom-matchers-using-expectextend
  async toBeStartWiths(received: string, expected: string) {
    const pass = received.startsWith(expected);
    if (pass) {
      return {
        message: () => `expected "${received}" not to start with "${expected}"`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected "${received}" to start with "${expected}"`,
        pass: false,
      };
    }
  },
  async toBeEndWiths(received: string, expected: string) {
    const pass = received.endsWith(expected);
    if (pass) {
      return {
        message: () => `expected "${received}" not to start with "${expected}"`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected "${received}" to start with "${expected}"`,
        pass: false,
      };
    }
  },
});

const baseURL = process.env['BASE_URL'] || 'http://fbi.com';
const protocal = baseURL.split('://')[0];
const rootDomain = baseURL.split('://')[1];

const getComponentUrl = (name: string) => {
  return name === 'home' ? `${protocal}://${rootDomain}` : `${protocal}://${name}.${rootDomain}`;
};
export const { Given, When, Then, After, AfterAll, AfterScenario, AfterWorker } = createBdd(test);
export { expect, getComponentUrl, test };
