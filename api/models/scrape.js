const sql = require("../database/index.js")
const { PlaywrightCrawler, ProxyConfiguration, createPlaywrightRouter } = require("crawlee")

// constructor
const Scrape = function (params) {
  this.profileList = params.profileList
}

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

const router = createPlaywrightRouter()

Scrape.scrapeIG = async (data, result) => {
  console.log(data)

  var response = new Array()

  const crawler = new PlaywrightCrawler({
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

    async requestHandler({ request, page, enqueueLinks, log }) {
      //LOG IN
      await page.getByRole("button", { name: "Only allow essential cookies" }).click()
      await page.getByLabel("Phone number, username, or email").fill("il_nencia_2")
      await page.getByLabel("Password").fill("Pandoro12")
      await page.getByRole("button", { name: "Log in", exact: true }).click()
      //CLOSE POP-UP
      console.log("closing 1 pop-up...")
      await page.getByRole("button", { name: "Not now" }).click()
      await delay(3000)
      if (await page.getByRole("button", { name: "Not now" } > 0).count()) {
        console.log("closing 2 pop-up...")
        await page.getByRole("button", { name: "Not now" }).click()
      }

      //CYCLE FOR EACH INFLUENCER IN LIST (STATIC)
      let influencerList = ["smartisfitness", "lamuccadaipuntiniblu" /*, "ludovicaincucina"*/]
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
          await page.locator("._aabd._aa8k >> nth=" + i).hover()
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
          await page.locator("._aabd._aa8k >> nth=" + i).click()
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
        response.push({
          influencer: influencerList[j],
          follower,
          postsInteractions,
          engagement_1: engagement * 100,
          engagement_2: engagement * 90,
        })
      }
    },
  })

  crawler.addRequests(["https://www.instagram.com/"])

  await crawler.run()

  result(null, response)
}

module.exports = Scrape
