const chrome = require("chrome-aws-lambda");

async function getBrowserInstance() {
  const executablePath = await chrome.executablePath;

  if (!executablePath) {
    // running locally
    const puppeteer = require("puppeteer");
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

  let browser = null;

  try {
    browser = await getBrowserInstance();
    let page = await browser.newPage();
    await page.goto(url);

    //Chack if the user exists
    try {
      await page.waitForSelector(".info-content", { timeout: 2000 });
    } catch (err) {
      res.status(400).json({
        status: "error",
        error: "User not found",
      });
    }
    const imgs = await page.$(".info-content > .avatar > .img-face");

    const src = await imgs.getProperty("src");
    const image = await src.jsonValue();

    //remove default resolution
    const imageUrl = image.replace("/w/64", "");
    const imageUrl2 = imageUrl.replace("/h/64", "");

    res.json({
      status: "success",
      image: imageUrl2,
    });
    // upload this buffer on AWS S3
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
