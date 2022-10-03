const chrome = require("chrome-aws-lambda");
const puppeteer = require("puppeteer");

require("dotenv").config();

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
      userDataDir: "./my/path",
    };
  } else {
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
      headless: true,
    };
  }
  return options;
};

/* const getProfilePicture = async (req: any, res: any) => {
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
      const image = document.querySelector(
        ".space-face > .img-face"
      ) as HTMLImageElement | null;
      if (image) {
        return image.src;
      }
      res.status(400).json({
        status: "error",
        error: "No profile picture found",
      });
    });

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
}; */

const getProfilePicture = async (req: any, res: any) => {
  let browser: any = null;
  const { username } = req.body;
  try {
    var raw = JSON.stringify({ username });

    var requestOptions: any = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-ID": process.env.CLIENT_ID,
        Origin: "https://www.tppdownloader.com",
      },
      redirect: "follow",
      body: raw,
    };

    await fetch(
      "https://open-api.trovo.live/openplatform/channels/id",
      requestOptions
    )
      .then((response) => response.json())
      .then((result: any) => {
        console.log(result);
        if (result.status === 1002) {
          return res.status(400).json({
            status: "Error",
            error: "Cannot find the user",
          });
        }
        return res.json({
          status: "success",
          image: result.profile_pic,
        });
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
