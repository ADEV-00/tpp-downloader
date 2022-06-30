const chrome = require("chrome-aws-lambda");
const puppeteer = require("puppeteer");

async function getBrowserInstance() {
  const executablePath = await chrome.executablePath;

  if (!executablePath) {
    // running locally
    return puppeteer.launch({
      args: chrome.args,
      headless: true,
      defaultViewport: {
        width: 1280,
        height: 720,
      },
      ignoreHTTPSErrors: true,
      ignoreDefaultArgs: ["--disable-extensions"],
    });
  }

  return chrome.puppeteer.launch({
    args: [
      ...chrome.args,
      "--hide-scrollbars",
      "--disable-web-security",
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
    defaultViewport: {
      width: 1280,
      height: 720,
    },
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
    ignoreHTTPSErrors: true,
    ignoreDefaultArgs: ["--disable-extensions"],
  });
}

const getOptions = async () => {
  let options;
  if (process.env.NODE_ENV === "production") {
    options = {
      args: [
        ...chrome.args,
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-setuid-sandbox",
        "--no-first-run",
        "--no-sandbox",
        "--no-zygote",
      ],
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
      ignoreHTTPSErrors: true,
      slowMo: 0,
    };
  } else {
    options = {
      args: [],
      headless: true,
    };
  }
  return options;
};

const getProfilePicture = async (req: any, res: any) => {
  const url = req.body.url;

  // Perform URL validation
  if (
    !url ||
    !url.trim() ||
    !url.startsWith("https://") ||
    !url.includes("trovo.live/s/")
  ) {
    res.status(400).json({
      status: "error",
      error: "Enter a valid URL",
    });

    return;
  }

  let browser: any = null;

  try {
    const options = await getOptions();
    const browser = await puppeteer.launch(options);
    let page = await browser.newPage();

    // Block images, videos, fonts from downloading
    await page.setRequestInterception(true);
    page.on("request", (request: any) => {
      const blockResources = ["font", "media"] as any;
      const reqType = request.resourceType();
      if (reqType === "font") {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.goto(url, {
      waitUntil: "networkidle0",
    });

    //Chack if the user exists
    /* try {
      await page.waitForSelector(".info-content", { timeout: 2000 });
    } catch (err) {
      res.status(400).json({
        status: "error",
        error: "User not found",
      });
    } */
    const imgs = await page.$(".space-face > .img-face");

    const src = await imgs.getProperty("src");
    const image = await src.jsonValue();

    //remove default resolution
    const imageUrl = image.replace("/w/64/h/64", "");

    res.json({
      status: "success",
      image: imageUrl,
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      status: "error",
      data: error.message || "Something went wrong",
    });
    // return callback(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};

export default getProfilePicture;

export const config = {
  api: {
    externalResolver: true,
    responseLimit: false,
  },
};
