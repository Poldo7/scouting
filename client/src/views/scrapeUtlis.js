//import { PlaywrightCrawler, ProxyConfiguration } from "crawlee"
//import { setTimeout } from "timers/promises"

/*const router_ig = createPlaywrightRouter()
const router_tt = createPlaywrightRouter()
const router_yt = createPlaywrightRouter()

router_ig.addDefaultHandler(async ({ request, page, log }) => {
  //LOG IN
  await page.getByRole("button", { name: "Only allow essential cookies" }).click()
  await page.getByLabel("Phone number, username, or email").fill("il_nencia_2")
  await page.getByLabel("Password").fill("Pandoro12")
  await page.getByRole("button", { name: "Log in", exact: true }).click()
  //CLOSE POP-UP
  await page.getByRole("button", { name: "Not now" }).click()
  await page.getByRole("button", { name: "Not now" }).click()

  //CYCLE FOR EACH INFLUENCER IN LIST (STATIC)
  let influencerList = ["smartisfitness", "lamuccadaipuntiniblu", "ludovicaincucina"]
  for (let j = 0; j < influencerList.length; j++) {
    console.log("INFLUENCER: " + influencerList[j])

    //SEARCH AND OPEN INFLUENCER PROFILE (TO ITERATE)
    await page.getByRole("link", { name: "Search Search" }).click()
    await page.getByPlaceholder("Search").fill(influencerList[j])
    await page.getByText(influencerList[j]).first().click()
    //await page.locator("._abo1 >> nth=0").click()
    if ((await page.getByPlaceholder("Search").count()) > 0) await page.getByRole("link", { name: "Search" }).click()

    //GET LIKE AND COMMENT OF FIRST POST (TO ITERATE FOR FIRST 18 POSTS)
    var postToRead = 18
    const postsData = new Array()
    for (let i = 0; i < postToRead; i++) {
      //MOVE MOUSE HOVER POST FOR READING LIKE AND COMMENT
      await page.locator("._aabd._aa8k._aanf >> nth=" + i).hover()
      let like, comment
      let childCount = await page.locator("._aacl._aacp._adda._aad3._aad6._aade").count()

      //case 1: private post. skipping this cycle
      if (childCount == 0) {
        console.log("unable to read " + (i + 1) + "° post, because it is private")
        postToRead++
        continue
      }
      //case 2: first post trying to read.
      if (childCount == 2) {
        like = await page.locator("._aacl._aacp._adda._aad3._aad6._aade >> nth=0").textContent()
        comment = await page.locator("._aacl._aacp._adda._aad3._aad6._aade >> nth=1").textContent()
      }
      //case 3: not first post trying to read. in this case we read 3° and 4° child
      if (childCount == 4) {
        like = await page.locator("._aacl._aacp._adda._aad3._aad6._aade >> nth=2").textContent()
        comment = await page.locator("._aacl._aacp._adda._aad3._aad6._aade >> nth=3").textContent()
      }

      //OPEN POST FOR READING DATETIME
      await page.locator("._aabd._aa8k._aanf >> nth=" + i).click()
      let date = await page.locator("time._aaqe").getAttribute("datetime")
      if ((await page.getByRole("button", { name: "Close" }).count()) > 0) await page.getByRole("button", { name: "Close" }).first().click()

      //save data
      postsData.push({
        like,
        comment,
        date,
      })
    }

    //order post data by datetime
    postsData.sort(function (a, b) {
      return new Date(a.date) < new Date(b.date) ? 1 : -1
    })
    let postsInteractions = 0
    //sum post interacion of first 12 posts
    for (let i = 0; i < 12; i++) {
      postsInteractions += postsData[i].like ? parseInt(postsData[i].like.replace(",", "")) : 0
      postsInteractions += postsData[i].comment ? parseInt(postsData[i].comment.replace(",", "")) : 0
    }

    //GET INFLUENCER FOLLOWER
    let followString = (await page.getByText(" follower").locator("._ac2a").getAttribute("title")) || ""
    let follower = parseInt(followString.replace(",", ""))

    let engagement = postsInteractions / 12 / follower // calculate engagement

    //display results
    console.log("Follower: " + follower)
    console.log("postsInteractions: " + postsInteractions)
    console.log("engagement (beta): " + engagement * 100)
    console.log("engagement (90%): " + engagement * 90)
  }
})

router_tt.addDefaultHandler(async ({ request, page, log }) => {
  //LOGIN
  await page
    .getByRole("link", { name: "Use phone / email / username" })
    .getByRole("link", { name: "Use phone / email / username", exact: true })
    .filter({ hasText: "Use phone / email / username" })
    .click()
  await page.getByRole("link", { name: "Log in with email or username" }).click()
  await page.getByPlaceholder("Email or username").fill("nencionisamuele@live.it")
  await page.getByPlaceholder("Password").fill("Pandoro12!")
  await page.getByRole("button", { name: "Log in" }).click()

  //PAUSE FOR RESOLVE CAPTCHA
  //await setTimeout(10000);

  let influencerList = ["smartisfitness", "lamuccadaipuntiniblu", "ludovicaincucina"]
  for (let j = 0; j < influencerList.length; j++) {
    //OPEN INFLUENCER PROFILE
    await page.getByPlaceholder("Search accounts and videos").fill(influencerList[j])
    await page.getByPlaceholder("Search accounts and videos").press("Enter")
    await page.locator(".e10wilco3").first().click()

    //here on some profile (usually the first one) it may request captcha. no problem cause the next line is blocking

    //EXTRACT DATA
    let follower = await page.locator('[data-e2e="followers-count"]').textContent()
    let likes = await page.locator('[data-e2e="likes-count"]').textContent()

    //DISPLAY RESULT
    console.log(influencerList[j] + ": follower: " + follower + " - likes: " + likes)
  }
})

router_yt.addDefaultHandler(async ({ request, page, log }) => {
  await page.getByRole("button", { name: "Reject all" }).click()
  //EXTRACT DATA
  var subscriberString = await page.locator("#subscriber-count").textContent()
  console.log("raw text: " + subscriberString)

  //DISPLAY RESULT
  // Rimuove "iscritti" o "subscribers" dall'inizio della stringa, se presenti
  subscriberString = subscriberString.replace(/^(iscritti|subscribers)/i, "").trim()
  let subscribersNumber

  if (subscriberString.includes("K")) {
    subscribersNumber = parseFloat(subscriberString.replace("K", "")) * 1000
  } else if (subscriberString.includes("M")) {
    subscribersNumber = parseFloat(subscriberString.replace("M", "")) * 1000000
  } else {
    subscribersNumber = parseFloat(subscriberString.replace(".", ""))
  }
  console.log("channel subscriber: " + subscribersNumber)

  //await setTimeout(1000000);
})
*/
const scrapeProfiles = (profiles) => {
  /*var crawlerOptions = {
    //proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    browserPoolOptions: {
      useFingerprints: true, // this is the default
      fingerprintOptions: {
        fingerprintGeneratorOptions: {
          browsers: [
            {
              name: "edge",
              minVersion: 96,
            },
          ],
          devices: ["desktop"],
          operatingSystems: ["windows"],
        },
      },
    },
    headless: false,
  }

  crawlerOptions.requestHandler = router_ig

  const crawler_ig = new PlaywrightCrawler(crawlerOptions)

  crawlerOptions.requestHandler = router_tt

  const crawler_tt = new PlaywrightCrawler(crawlerOptions)

  crawlerOptions.requestHandler = router_yt

  const crawler_yt = new PlaywrightCrawler(crawlerOptions)*/
}

export { scrapeProfiles }
