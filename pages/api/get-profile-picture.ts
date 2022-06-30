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
        "--autoplay-policy=user-gesture-required",
        "--disable-background-networking",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-breakpad",
        "--disable-client-side-phishing-detection",
        "--disable-component-update",
        "--disable-default-apps",
        "--disable-dev-shm-usage",
        "--disable-domain-reliability",
        "--disable-extensions",
        "--disable-features=AudioServiceOutOfProcess",
        "--disable-hang-monitor",
        "--disable-ipc-flooding-protection",
        "--disable-notifications",
        "--disable-offer-store-unmasked-wallet-cards",
        "--disable-popup-blocking",
        "--disable-print-preview",
        "--disable-prompt-on-repost",
        "--disable-renderer-backgrounding",
        "--disable-setuid-sandbox",
        "--disable-speech-api",
        "--disable-sync",
        "--hide-scrollbars",
        "--ignore-gpu-blacklist",
        "--metrics-recording-only",
        "--mute-audio",
        "--no-default-browser-check",
        "--no-first-run",
        "--no-pings",
        "--no-zygote",
        "--password-store=basic",
        "--use-gl=swiftshader",
        "--use-mock-keychain",
      ],
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
      ignoreHTTPSErrors: true,
      slowMo: 0,
      userDataDir: "./my/path",
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

    await page.goto(url, { waitUntil: "networkidle2" });

    const profilePicture = await page.evaluate(() => {
      const profilePicture = document.querySelector(
        ".space-face > .img-face"
      ) as HTMLImageElement | null;
      if (profilePicture) {
        return profilePicture.src;
      }
      res.status(400).json({
        status: "error",
        error: "No profile picture found",
      });
    });
    console.log(profilePicture);

    //remove default resolution
    const imageUrl = profilePicture.replace("/w/64/h/64", "");

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
