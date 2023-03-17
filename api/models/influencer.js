const sql = require("../database/index.js")
const moment = require("moment")
// constructor
const Influencer = function (params) {
  this.id_influencer = params.id_influencer
  this.influencer_data = params.influencer_data
  this.tag = params.tag
}

Influencer.getInfluencers = (data, result) => {
  sql.query(
    "SELECT DISTINCT \
        influencer.*, scrape_ig_last.data_scrape as last_scrape_ig, scrape_ig_last.esito as esito_ig, scrape_ig_last.utente_trovato as utente_trovato_ig, \
        scrape_ig_valid.follower_ig, scrape_ig_valid.engagement_ig, scrape_ig_valid.data_scrape as valid_scrape_ig, \
        scrape_tt_last.data_scrape as last_scrape_tt, scrape_tt_last.esito as esito_tt, scrape_tt_last.utente_trovato as utente_trovato_tt, \
        scrape_tt_valid.follower_tt, scrape_tt_valid.likes_tt, scrape_tt_valid.data_scrape as valid_scrape_tt, \
        scrape_yt_last.data_scrape as last_scrape_yt, scrape_yt_last.esito as esito_yt, scrape_yt_last.utente_trovato as utente_trovato_yt, \
        scrape_yt_valid.iscritti_yt, scrape_yt_valid.data_scrape as valid_scrape_yt \
    FROM influencer \
        LEFT JOIN scrape_ig as scrape_ig_last ON influencer.id_influencer = scrape_ig_last.id_influencer \
            AND scrape_ig_last.data_scrape = (SELECT MAX(data_scrape) from scrape_ig as scrape_ig2 WHERE scrape_ig2.id_influencer=influencer.id_influencer) \
        LEFT JOIN scrape_ig as scrape_ig_valid ON influencer.id_influencer = scrape_ig_valid.id_influencer \
            AND scrape_ig_valid.data_scrape = (SELECT MAX(data_scrape) from scrape_ig as scrape_ig2 WHERE scrape_ig2.esito = 1 AND scrape_ig2.utente_trovato = 1 AND scrape_ig2.id_influencer=influencer.id_influencer) \
        LEFT JOIN scrape_tt as scrape_tt_last ON influencer.id_influencer = scrape_tt_last.id_influencer \
            AND scrape_tt_last.data_scrape = (SELECT MAX(data_scrape) from scrape_tt as scrape_tt2 WHERE scrape_tt2.id_influencer=influencer.id_influencer) \
        LEFT JOIN scrape_tt as scrape_tt_valid ON influencer.id_influencer = scrape_tt_valid.id_influencer \
            AND scrape_tt_valid.data_scrape = (SELECT MAX(data_scrape) from scrape_tt as scrape_tt2 WHERE scrape_tt2.esito = 1 AND scrape_tt2.utente_trovato = 1 AND scrape_tt2.id_influencer=influencer.id_influencer) \
        LEFT JOIN scrape_yt as scrape_yt_last on influencer.id_influencer = scrape_yt_last.id_influencer \
            AND scrape_yt_last.data_scrape = (SELECT MAX(data_scrape) from scrape_yt as scrape_yt2 WHERE scrape_yt2.id_influencer=influencer.id_influencer) \
        LEFT JOIN scrape_yt as scrape_yt_valid ON influencer.id_influencer = scrape_yt_valid.id_influencer \
            AND scrape_yt_valid.data_scrape = (SELECT MAX(data_scrape) from scrape_yt as scrape_yt2 WHERE scrape_yt2.esito = 1 AND scrape_yt2.utente_trovato = 1 AND scrape_yt2.id_influencer=influencer.id_influencer) \
    WHERE influencer.data_eliminazione IS NULL \
    ORDER BY influencer.data_inserimento",
    (err, res) => {
      if (err) {
        console.log(err)
        result(err, "err")
      } else {
        //console.log(res)
        if (res.length) {
          let result_format = formatInfluencersData(res)
          result(null, result_format)
        } else {
          result(null, null)
        }
      }
    }
  )
}

const formatInfluencersData = (data) => {
  let today = new Date()
  let tagList = [],
    regionList = [],
    followerMaxIG = 20000,
    engagementMaxIG = 5,
    followerMaxTT = 10000,
    subscriberMaxYT = 10000
  let influencerNotScraped = [],
    influencerNotFound = []
  for (let i = 0; i < data.length; i++) {
    let influencer = data[i]

    // ** FORMAT ETA'
    if (influencer.eta) {
      let eta = influencer.eta.split("~")
      if (eta.length > 1) {
        data[i].eta_min = eta[0]
        data[i].eta_max = eta[1]
      }
    }

    // ** FILTRI

    //compone l'array degli interessi e delle regioni (da utilizzare nei filtri)
    if (influencer.interessi) tagList = tagList.concat(influencer.interessi.split(", "))
    if (influencer.regione) regionList = regionList.concat(influencer.regione.split(", "))
    //cerca il profilo con più follower instagram
    if (influencer.follower_ig > followerMaxIG) followerMaxIG = influencer.follower_ig
    //cerca il profilo con più engagement rate di instagram
    if (influencer.engagement_ig > engagementMaxIG) engagementMaxIG = influencer.engagement_ig
    //cerca il profilo con più follower tiktok
    if (influencer.follower_tt > followerMaxTT) followerMaxTT = influencer.follower_tt
    //cerca il profilo con più iscritti youtube
    if (influencer.iscritti_yt > subscriberMaxYT) subscriberMaxYT = influencer.iscritti_yt

    // ** SCRAPING

    //cerca profili instagram per cui l'ultimo scraping o è fallito o è più vecchio di 7 giorni
    if (influencer.esito_ig === 0 || moment(today).diff(influencer.last_scrape_ig, "days") > 7) {
      data[i].ig_not_scraped = true
      influencerNotScraped.push({
        username: influencer.username_ig,
        piattaforma: "Instagram",
      })
    }
    //cerca profili instagram per cui l'ultimo scraping non ha trovato l'utente
    if (influencer.esito_ig === 1 && influencer.utente_trovato_ig === 0) {
      data[i].ig_not_found = true
      influencerNotFound.push({
        username: influencer.username_ig,
        piattaforma: "Instagram",
      })
    }
    //cerca profili tiktok per cui l'ultimo scraping o è fallito o è più vecchio di 7 giorni
    if (influencer.esito_tt === 0 || moment(today).diff(influencer.last_scrape_tt, "days") > 7) {
      data[i].tt_not_scraped = true
      influencerNotScraped.push({
        username: influencer.username_tt,
        piattaforma: "TikTok",
      })
    }
    //cerca profili tiktok per cui l'ultimo scraping non ha trovato l'utente
    if (influencer.esito_tt === 1 && influencer.utente_trovato_tt === 0) {
      data[i].tt_not_found = true
      influencerNotFound.push({
        username: influencer.username_tt,
        piattaforma: "TikTok",
      })
    }
    //cerca profili youtube per cui l'ultimo scraping o è fallito o è più vecchio di 7 giorni
    if (influencer.esito_yt === 0 || moment(today).diff(influencer.last_scrape_yt, "days") > 7) {
      data[i].yt_not_scraped = true
      influencerNotScraped.push({
        username: influencer.username_yt,
        piattaforma: "Youtube",
      })
    }
    //cerca profili youtube per cui l'ultimo scraping non ha trovato l'utente
    if (influencer.esito_yt === 1 && influencer.utente_trovato_yt === 0) {
      data[i].yt_not_found = true
      influencerNotFound.push({
        username: influencer.username_yt,
        piattaforma: "Youtube",
      })
    }
  }

  // ** FILTRI
  //remove tag and region duplicates
  tagList = [...new Set(tagList)]
  regionList = [...new Set(regionList)]
  //order tag and region arrays
  regionList.sort((a, b) => a.localeCompare(b))
  tagList.sort((a, b) => a.localeCompare(b))
  // map tag and region arrays into select options
  let tagOptions = tagList.map((el) => ({ value: el, label: el }))
  let regionOptions = regionList.map((el) => ({ value: el, label: el }))
  //increase max range values
  followerMaxIG = increaseRangeMax(followerMaxIG)
  engagementMaxIG = Math.ceil(engagementMaxIG + 1)
  followerMaxTT = increaseRangeMax(followerMaxTT)
  subscriberMaxYT = increaseRangeMax(subscriberMaxYT)

  return {
    profileList: data,
    tagOptions: tagOptions,
    regionOptions: regionOptions,
    followerMaxIG: followerMaxIG,
    engagementMaxIG: engagementMaxIG,
    followerMaxTT: followerMaxTT,
    subscriberMaxYT: subscriberMaxYT,
    influencerNotScraped: influencerNotScraped,
    influencerNotFound: influencerNotFound,
  }
}

Influencer.deleteInfluencer = (data, result) => {
  sql.query("UPDATE influencer SET data_eliminazione = NOW() WHERE id_influencer = ?", [data.id_influencer], (err, res) => {
    if (err) {
      console.log("error: ", err)
      result(null, err)
    } else {
      result(null, res)
    }
  })
}

Influencer.updateInfluencer = (data, result) => {
  let profile = data.influencer_data
  sql.query(
    "UPDATE influencer SET username_ig = ?, username_tt = ?, username_yt = ?, nome = ?, interessi=?, regione = ?, citta = ?, eta = ?, contatti = ?, stato = ? \
    WHERE id_influencer = ?",
    [
      profile.username_ig,
      profile.username_tt,
      profile.username_yt,
      profile.nome,
      profile.interessi,
      profile.regione,
      profile.citta,
      profile.eta,
      profile.contatti,
      profile.stato,
      profile.id_influencer,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err)
        result(null, err)
      } else {
        //TO-DO: if there's new scrape (is_new_scrape_ig, is_new_scrape_tt, is_new_scrape_yt), insert the new scrape data respective tables
        result(null, res)
      }
    }
  )
}

Influencer.getLuoghi = (data, result) => {
  sql.query("SELECT * FROM luoghi_italiani", [], (err, res) => {
    if (err) {
      console.log("error: ", err)
      result(null, err)
    } else {
      // map region and cities arrays into select options
      let regioni = res.map((el) => ({ value: el.regione, label: el.regione }))
      regioni = [...new Map(regioni.map((r) => [r.value, r])).values()]
      regioni.sort((a, b) => a.value.localeCompare(b.value))
      let citta = res.map((el) => ({ value: el.provincia, label: el.provincia, regione: el.regione }))
      result(null, {
        regioni: regioni,
        citta: citta,
      })
    }
  })
}

Influencer.getTag = (data, result) => {
  sql.query("SELECT * FROM tag", [], (err, res) => {
    if (err) {
      console.log("error: ", err)
      result(null, err)
    } else {
      // map tag array into select options
      let tag = res.map((el) => ({ value: el.nome, label: el.nome }))
      result(null, tag)
    }
  })
}

Influencer.createTag = (data, result) => {
  sql.query("INSERT INTO tag (nome) VALUES (?)", [data.tag], (err, res) => {
    if (err) {
      console.log("error: ", err)
      result(null, err)
    } else {
      result(null, data.tag)
    }
  })
}

const increaseRangeMax = (max) => {
  let newMax = max * 1.05
  newMax /= 10000
  newMax = Math.ceil(newMax)
  newMax *= 10000
  return newMax
}

module.exports = Influencer
