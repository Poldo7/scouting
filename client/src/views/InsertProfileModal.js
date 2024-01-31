import React, { useEffect, useState } from "react"
import { Plus } from "react-feather"
import { Button, Modal, ModalHeader, ModalBody, TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap"
import Swal from "sweetalert2"
import Axios from "axios"
import themeConfig from "@configs/themeConfig"
import ProfileForm from "./form/ProfileForm"

const InsertProfileModal = (props) => {
  const { isSocialActive, isOpen, setIsOpen, profilesArray, setProfilesArray, emptyProfileObject, regions, cities, tag, fetchProfiles, getTag } =
    props

  const [active, setActive] = useState(2)
  const [scrapeStatus, setScrapeStatus] = useState("to-do") // ('to-do', 'running', 'success', 'error')
  const [isWaitScrapeIG, setIsWaitScrapeIG] = useState(false)
  const [isWaitScrapeYT, setIsWaitScrapeYT] = useState(false)

  // ** check profiles scrape status
  useEffect(() => {
    let profileToScrape = 0,
      scrapeSuccess = 0

    profilesArray.forEach((profile) => {
      //check instagram
      if (profile.username_ig) {
        if (profile.username_ig_verified != profile.username_ig) profileToScrape++
        else if (profile.esito_ig == 1) scrapeSuccess++
      }
      //check youtube
      if (profile.username_yt) {
        if (profile.username_yt_verified != profile.username_yt) profileToScrape++
        else if (profile.esito_yt == 1) scrapeSuccess++
      }
    })

    //set scrape status
    let counter = parseInt(profilesArray.scrapeRetries) + parseInt(profilesArray.scrapeErrors)
    if (isWaitScrapeIG || isWaitScrapeYT) setScrapeStatus("running")
    else if (counter > 6) setScrapeStatus("error")
    else if (profileToScrape > 0) setScrapeStatus("to-do")
    else if (scrapeSuccess > 0) setScrapeStatus("success")
  }, [profilesArray])

  // ** verify social
  const verifySocial = async () => {
    if (scrapeStatus == "error") {
      Swal.fire({
        title: "Errore: limiti tentativi raggiunto",
        text: "Se i dati inseriti sono corretti puoi saltare la verifica e procedere inserendo i profili. Faremo in automatico nuovi tentativi per verificare i suoi social",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Devo ricontrollare",
        confirmButtonText: "Sono sicuro dei dati, inserisci i profili",
      }).then((result) => {
        if (result.isConfirmed) {
          insertProfile()
        }
      })
      return
    }

    console.log("verifing profile(s): ", profilesArray)

    //get profile to scrape
    let profileToScrapeIG = profilesArray
      .filter((p) => p.username_ig && (p.username_ig != p.username_ig_verified || p.esito_ig == 0))
      .map((p) => p.username_ig)
    let profileToScrapeYT = profilesArray
      .filter((p) => p.username_yt && (p.username_yt != p.username_yt_verified || p.esito_yt == 0))
      .map((p) => p.username_yt)

    let deep_copy = JSON.parse(JSON.stringify(profilesArray))
    deep_copy.scrapeRetries = profilesArray.scrapeRetries
    deep_copy.scrapeErrors = profilesArray.scrapeErrors

    if (profileToScrapeIG.length > 0 || profileToScrapeYT.length > 0) {
      Swal.fire({
        position: "top-end",
        icon: "info",
        title: "Verifica in corso...",
        text: "Puoi anche chiudere la finestra, ti avviseremo una volta finito",
        showConfirmButton: false,
        timer: 5000,
      })

      deep_copy.scrapeRetries++
    }

    //nested fuction: start yt scrape (to call after ig scraped was completed)
    var verifySocial_YT = async function () {
      setIsWaitScrapeYT(true)
      setScrapeStatus("running")
      console.log("start scrape yt")

      await Axios.post(themeConfig.app.serverUrl + "scrapeYT", { profileList: profileToScrapeYT })
        .then((res) => {
          console.log("scrape yt done")
          console.log(res.data)
          setIsWaitScrapeYT(false)
          let scrapeResult = res.data?.scrapeResult
          let status = res.data?.status
          //if instagram scrape has finished
          if (!isWaitScrapeIG) {
            setIsOpen(true)
            if (status === "success") handleMessage("success", "Verifica social completata!", "Controlla che i dati raccolti siano corretti")
          }
          // if youtube scrape failed
          if (status === "warning" || status === "error") {
            console.log("verifica yt fallita")
            handleMessage("error", "Errore nella verifica di alcuni canali Youtube!", "Controlla che gli username siano corretti")
            deep_copy.scrapeErrors++
          }

          //update profile with scrape data
          let index = 0
          for (let i = 0; i < deep_copy.length; i++) {
            if (deep_copy[i].username_yt && (deep_copy[i].username_yt != deep_copy[i].username_yt_verified || deep_copy[i].esito_yt == 0)) {
              deep_copy[i].esito_yt = scrapeResult[index]?.esito || 0
              deep_copy[i].utente_trovato_yt = scrapeResult[index]?.utente_trovato || 0
              deep_copy[i].iscritti_yt = scrapeResult[index]?.subscriber || 0
              if (deep_copy[i].esito_yt == 1 && deep_copy[i].utente_trovato_yt == 1) deep_copy[i].username_yt_verified = deep_copy[i].username_yt

              index++
            }
          }

          setProfilesArray(deep_copy)
        })
        .catch((err) => {
          console.log("CATCH: verifica yt fallita", err)
          handleMessage("error", "Errore nella verifica Youtube!!", "Qualcosa è andato storto :/")
          setIsWaitScrapeYT(false)
          deep_copy.scrapeErrors++
          setProfilesArray(deep_copy)
        })
    }

    //check profile and start ig scrape
    if (profileToScrapeIG.length > 0) {
      setIsWaitScrapeIG(true)
      setScrapeStatus("running")
      console.log("start scrape ig")

      await Axios.post(themeConfig.app.serverUrl + "scrapeIG", { profileList: profileToScrapeIG })
        .then((res) => {
          console.log("scrape ig done")
          console.log(res.data)
          setIsWaitScrapeIG(false)
          let scrapeResult = res.data?.scrapeResult
          let status = res.data?.status
          //if there are youtube profile to scrape continue
          if (profileToScrapeYT.length > 0) verifySocial_YT()
          else {
            setIsOpen(true)
            if (status === "success") handleMessage("success", "Verifica social completata!", "Controlla che i dati raccolti siano corretti")
          }
          // if instagram scrape failed
          if (status === "warning" || status === "error") {
            console.log("verifica ig fallita")
            handleMessage("error", "Errore nella verifica di alcuni profili Instagram!", "Controlla che gli username siano corretti")
            deep_copy.scrapeErrors++
          }

          //update profile with scrape data
          let index = 0
          for (let i = 0; i < deep_copy.length; i++) {
            if (deep_copy[i].username_ig && (deep_copy[i].username_ig != deep_copy[i].username_ig_verified || deep_copy[i].esito_ig == 0)) {
              deep_copy[i].esito_ig = scrapeResult[index]?.esito || 0
              deep_copy[i].utente_trovato_ig = scrapeResult[index]?.utente_trovato || 0
              deep_copy[i].post_privati_ig = scrapeResult[index]?.post_privati || 0
              deep_copy[i].follower_ig = scrapeResult[index]?.follower || 0
              deep_copy[i].engagement_ig = scrapeResult[index]?.engagement || 0
              if (deep_copy[i].esito_ig == 1 && deep_copy[i].utente_trovato_ig == 1) deep_copy[i].username_ig_verified = deep_copy[i].username_ig

              index++
            }
          }

          setProfilesArray(deep_copy)
        })
        .catch((err) => {
          console.log("CATCH: verifica ig fallita", err)
          handleMessage("error", "Errore nella verifica Instagram!!", "Qualcosa è andato storto :/")
          setIsWaitScrapeIG(false)
          deep_copy.scrapeErrors++
          setProfilesArray(deep_copy)

          //if there are youtube profile to scrape continue
          if (profileToScrapeYT.length > 0) verifySocial_YT()
        })
    } else if (profileToScrapeYT.length > 0) verifySocial_YT()
  }

  // ** insert new profile
  const insertProfile = () => {
    console.log("inserting profile(s): ", profilesArray)
    // ** CHECK IF REQUIRED FIELDS ARE FILLED

    for (let i = 0; i < profilesArray.length; i++) {
      const profile = profilesArray[i]

      // stato
      if (profile.stato == null) {
        handleMessage("info", "Stato mancante!", "Devi indicare se il profilo appartiene ad un agenzia")
        return
      }
      // scadenza contratto
      if (profile.statoOption?.label == "In domini" && profile.scadenza_contratto == null) {
        handleMessage("info", "Data termine contratto mancante!", "Devi indicare se la data in cui il contratto con domini scadrà")
        return
      }
      // fee
      if (profile.fee == null || profile.fee == "") {
        handleMessage("info", "Fee mancante!", "Devi indicare la fee (%) del profilo")
        return
      }
      // contatti
      if (profile.contatti == null || profile.contatti == "") {
        handleMessage("info", "Contatto mancante!", "Completa il campo contatti nel " + (i + 1) + " profilo prima di continuare")
        return
      }
      // interessi
      if (profile.interessi == null || profile.interessi == "") {
        handleMessage("info", "Interessi mancanti!", "Completa il campo interessi nel " + (i + 1) + " profilo prima di continuare")
        return
      }
      // at least one social username
      if (
        (profile.username_ig == null || profile.username_ig == "") &&
        (profile.username_tt == null || profile.username_tt == "") &&
        (profile.username_yt == null || profile.username_yt == "")
      ) {
        handleMessage("info", "Social mancante!", "Inserisci almeno un username di un social nel " + (i + 1) + " profilo prima di continuare")
        return
      }
    }
    console.log("profilesArray", profilesArray)
    //INSERT PROFILES
    Axios.post(themeConfig.app.serverUrl + "insertInfluencers", { profilesArray })
      .then((res) => {
        console.log(res.data)
        if (res.data && res.data.status == "success") {
          setIsOpen(false)
          let empty = [emptyProfileObject]
          empty.scrapeRetries = 0
          empty.scrapeErrors = 0
          setProfilesArray(empty)
          fetchProfiles()
          getTag()
          handleMessage("success", "Aggiornato", "Profili inseriti con successo!")
        } else {
          handleMessage("error", "Errore!", "Qualcosa è andato storto :/")
        }
      })
      .catch((err) => {
        console.log(err)
        handleMessage("error", "Errore!", "Qualcosa è andato storto :/")
      })
  }

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const handleMessage = (icon, title, text = null, html = null) => {
    return Swal.fire({
      icon,
      title,
      text,
      html,
      showConfirmButton: false,
      showClass: {
        popup: "animate__animated animate__fadeIn",
      },
      timer: 4000,
    })
  }

  return (
    <>
      <Modal isOpen={isOpen} backdrop={true} toggle={null} className="modal-dialog-centered modal-lg">
        <ModalHeader toggle={() => setIsOpen(false)}>Inserisci Profili</ModalHeader>
        <ModalBody>
          <Nav tabs>
            {profilesArray.map((profile, index) => {
              return (
                <NavItem key={index}>
                  <NavLink
                    active={active == 2 + index}
                    onClick={() => {
                      toggle(2 + index)
                    }}
                  >
                    {profile.nome.up || "Profilo " + (index + 1)}
                  </NavLink>
                </NavItem>
              )
            })}
            <NavItem>
              <NavLink
                active={active == "1"}
                onClick={() => {
                  let deep_copy = JSON.parse(JSON.stringify(profilesArray))
                  deep_copy.push(emptyProfileObject)
                  deep_copy.scrapeRetries = profilesArray.scrapeRetries
                  deep_copy.scrapeErrors = profilesArray.scrapeErrors
                  setProfilesArray(deep_copy)
                }}
              >
                <Plus size={18} />
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent className="py-50" activeTab={active}>
            {profilesArray.map((profile, index) => {
              return (
                <TabPane tabId={2 + index} key={index}>
                  <ProfileForm
                    isSocialActive={isSocialActive}
                    profile={profile}
                    setProfile={(edited) => {
                      let deep_copy = JSON.parse(JSON.stringify(profilesArray))
                      deep_copy[index] = edited
                      deep_copy.scrapeRetries = profilesArray.scrapeRetries
                      deep_copy.scrapeErrors = profilesArray.scrapeErrors
                      setProfilesArray(deep_copy)
                    }}
                    regions={regions}
                    cities={cities}
                    tag={tag}
                    tabId={2 + index}
                    activeTab={active}
                    isWaitScrapeIG={isWaitScrapeIG}
                    isWaitScrapeYT={isWaitScrapeYT}
                  />
                </TabPane>
              )
            })}
          </TabContent>
          <Button
            onClick={() => insertProfile()}
            color="primary"
            className="float-right"
            disabled={isSocialActive && (scrapeStatus == "to-do" || scrapeStatus == "running") ? true : false}
          >
            Inserisci
          </Button>
          {isSocialActive && (
            <Button
              onClick={() => verifySocial()}
              color="primary"
              className="float-right me-1"
              disabled={scrapeStatus == "running" || scrapeStatus == "success" ? true : false}
            >
              Verifica social
            </Button>
          )}
        </ModalBody>
      </Modal>
    </>
  )
}

export default InsertProfileModal
