import type { DateTime } from "luxon";
import type { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import type { ToadScheduler } from "toad-scheduler";
import { SimpleIntervalJob } from "toad-scheduler";
import { Task } from "toad-scheduler";

import GoogleTasksError from "../errors/GoogleTasksError";

const WAIT_MIN = 250;
const WAIT_MAX = 400;

export default class GoogleTasksClient {
  public constructor(
    private readonly chromePath: string,
    private readonly chromeDataPath: string,
  ) {
    // eslint-disable-next-line new-cap
    puppeteer.use(StealthPlugin());
  }

  private getDateAndTimeString(object: DateTime): [string, string] {
    const date = `${object.day} ${object.toFormat("MMM")} ${object.year}`;
    const time = object.toFormat("H:mm");

    return [date, time];
  }

  public scheduleSessionKeepalive(scheduler: ToadScheduler) {
    const task = new Task("google-tasks-client-session-keepalive", () => {
      void this.touchSession();
    });

    scheduler.addSimpleIntervalJob(
      new SimpleIntervalJob({ days: 1, runImmediately: true }, task),
    );
  }

  private async getBrowser(): Promise<Browser> {
    return await puppeteer.launch({
      executablePath: this.chromePath,
      userDataDir: this.chromeDataPath,
      args: ["--no-sandbox"],
    });
  }

  private async randomWait() {
    // eslint-disable-next-line promise/avoid-new
    return await new Promise((resolve) => {
      setTimeout(
        () => {
          resolve(true);
        },
        Math.floor(WAIT_MIN + Math.random() * (WAIT_MAX - WAIT_MIN + 1)),
      );
    });
  }

  // eslint-disable-next-line max-statements
  private async inputAndSave(
    page: Page,
    payload: {
      date: string;
      time: string;
      title: string;
    },
  ) {
    await page.click('xpath/.//span[text()="Create"]');

    const task = await page.waitForSelector('li[data-key="task"]');

    await this.randomWait();

    if (!task) {
      throw new GoogleTasksError("Create button not found.");
    }

    await task.click();

    const titleSelector = 'input[aria-label="Add title"]';

    await this.randomWait();

    await page.type(titleSelector, payload.title);
    await page.click('xpath/.//li[text()="Doesn\'t repeat"]');
    await this.randomWait();

    await page.type('input[aria-label="Start date"]', payload.date);

    await this.randomWait();

    await page.type('input[aria-label="Start time"]', payload.time);

    await this.randomWait();

    await page.click('xpath/.//span[text()="Save"]/..');
    await this.randomWait();
  }

  private async getCalendarPage(browser: Browser) {
    const page = await browser.newPage();

    await page.goto("https://calendar.google.com", { waitUntil: "load" });

    const signInButton = await page.$("gws-button");

    if (signInButton) {
      throw new GoogleTasksError("Session expired.");
    }

    return page;
  }

  public async createTask(title: string, datetime: DateTime) {
    const browser = await this.getBrowser();

    try {
      const page = await this.getCalendarPage(browser);

      await this.randomWait();

      const [date, time] = this.getDateAndTimeString(datetime);

      await this.inputAndSave(page, {
        title,
        date,
        time,
      });
    } finally {
      await browser.close();
    }
  }

  public async touchSession() {
    const browser = await this.getBrowser();

    try {
      await this.getCalendarPage(browser);
      await this.randomWait();

      // eslint-disable-next-line no-console
      console.log("Google Tasks Client: touched session");
    } catch (error) {
      console.error(error);
    } finally {
      await browser.close();
    }
  }
}
