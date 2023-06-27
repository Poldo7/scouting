import React, { useEffect, useState } from "react"
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap"

// ** Third Party Components
import Axios from "axios"
import themeConfig from "@configs/themeConfig"
import Swal from "sweetalert2"
import ProfileForm from "./form/ProfileForm"
import _ from "lodash"

const UpdateProfileModal = (props) => {
  const { profile, profileCopy, setProfile, setProfileCopy, isOpen, setIsOpen, regions, cities, tag, fetchProfiles } = props

  const [isInstagramChanged, setIsInstagramChanged] = useState(false)
  const [isYoutubeChanged, setIsYoutubeChanged] = useState(false)
  const [isWaitScrapeIG, setIsWaitScrapeIG] = useState(false)
  const [isWaitScrapeYT, setIsWaitScrapeYT] = useState(false)
  const [originalUsernameIG, setOriginalUsernameIG] = useState(null)
  const [originalUsernameYT, setOriginalUsernameYT] = useState(null)

  // ** when modal is closed, reset social username
  useEffect(() => {
    if (isOpen == false) {
      setIsInstagramChanged(false)
      setIsYoutubeChanged(false)
      setOriginalUsernameIG(null)
      setOriginalUsernameYT(null)
    } else {
      console.log("editing profile ", profile)
      setOriginalUsernameIG(profile.username_ig)
      setOriginalUsernameYT(profile.username_yt)
    }
  }, [isOpen])

  // ** check if social username has changed
  useEffect(() => {
    //check instagram username
    if (profile.username_ig && originalUsernameIG != profile.username_ig) setIsInstagramChanged(true)
    else setIsInstagramChanged(false)
    //check youtube username
    if (profile.username_yt && originalUsernameYT != profile.username_yt) setIsYoutubeChanged(true)
    else setIsYoutubeChanged(false)
  }, [profile.username_ig, profile.username_yt, originalUsernameIG, originalUsernameYT])

  // ** update profile
  const updateProfileData = () => {
    console.log("updating profile: ", profile)

    // ** CHECK IF REQUIRED FIELDS ARE FILLED

    // contatti
    if (profile.contatti == null || profile.contatti == "") {
      handleMessage("info", "Contatto mancante!", "Completa il campo contatti prima di aggiornare il profilo")
      return
    }
    // interessi
    if (profile.interessi == null || profile.interessi == "") {
      handleMessage("info", "Interessi mancanti!", "Completa il campo interessi prima di aggiornare il profilo")
      return
    }
    // at least one social username
    if (
      (profile.username_ig == null || profile.username_ig == "") &&
      (profile.username_tt == null || profile.username_tt == "") &&
      (profile.username_yt == null || profile.username_yt == "")
    ) {
      handleMessage("info", "Social mancante!", "Inserisci almeno un username di un social prima di aggiornare il profilo")
      return
    }

    //UPDATE PROFILE
    Axios.post(themeConfig.app.serverUrl + "updateInfluencer", { profile })
      .then((res) => {
        if (res.data && res.data.status == "success") {
          setProfileCopy(profile)
          fetchProfiles()
          handleMessage("success", "Aggiornato", "Profilo aggiornato con successo!")
        } else {
          handleMessage("error", "Errore!", "Qualcosa è andato storto :(")
        }
      })
      .catch((err) => {
        handleMessage("error", "Errore!", "Qualcosa è andato storto :(")
      })
  }

  // ** verify social
  const verifySocial = async () => {
    if (profile.scrapeRetries + profile.scrapeErrors > 5) {
      Swal.fire({
        title: "Errore: imiti tentativi raggiunto",
        text: "Se i dati inseriti sono corretti puoi saltare la verifica e procedere salvando i dati. Faremo in automatico nuovi tentativi per verificare i suoi social",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Devo ricontrollare",
        confirmButtonText: "Sono sicuro dei social, salva i dati",
      }).then((result) => {
        if (result.isConfirmed) {
          updateProfileData()
        }
      })
      return
    }

    Swal.fire({
      position: "top-end",
      icon: "info",
      title: "Verifica in corso...",
      text: "Non chiudere la finestra",
      showConfirmButton: false,
      timer: 4000,
    })

    let deep_copy = JSON.parse(JSON.stringify(profile))
    deep_copy.scrapeRetries = profile.scrapeRetries
    deep_copy.scrapeErrors = profile.scrapeErrors
    deep_copy.scrapeRetries++

    if (isInstagramChanged) {
      setIsWaitScrapeIG(true)
      deep_copy.follower_ig = null
      deep_copy.engagement_ig = null
      deep_copy.is_new_scrape_ig = true
      console.log("start instagram verify...")
      await Axios.post(themeConfig.app.serverUrl + "scrapeIG", { profileList: [profile.username_ig] })
        .then((res) => {
          setIsWaitScrapeIG(false)
          let scrapeResult = res.data?.scrapeResult
          let status = res.data?.status
          console.log(res.data)
          if (status === "success") {
            if (!isWaitScrapeYT) handleMessage("success", "Verifica social completata!", "Controlla che i dati raccolti siano corretti")
            console.log("ig verificato con successo")
            setIsInstagramChanged(false)
            setOriginalUsernameIG(profile.username_ig)
            //aggiorna dati scrape del profilo
            deep_copy.follower_ig = scrapeResult[0].follower
            deep_copy.engagement_ig = scrapeResult[0].engagement
            deep_copy.esito_ig = scrapeResult[0].esito
            deep_copy.utente_trovato_ig = scrapeResult[0].esito
          } else {
            // if instagram scrape failed
            console.log("verifica ig fallita")
            handleMessage("error", "Errore nella verifica Instagram!", "Controlla l'username sia corretto")
            deep_copy.scrapeErrors++
            //aggiorna dati scrape del profilo
            deep_copy.esito_ig = scrapeResult[0]?.esito || 0
            deep_copy.utente_trovato_ig = scrapeResult[0]?.utente_trovato || 0
          }

          setProfile(deep_copy)
        })
        .catch((err) => {
          handleMessage("error", "Errore nella verifica Instagram!!", "Qualcosa è andato storto :(")
          console.log("CATCH: verifica ig fallita con errore", err)
          setIsWaitScrapeIG(false)
          deep_copy.scrapeErrors++
          //aggiorna dati scrape del profilo
          deep_copy.esito_ig = 0
          deep_copy.utente_trovato_ig = 0

          setProfile(deep_copy)
        })
    }

    if (isYoutubeChanged) {
      setIsWaitScrapeYT(true)
      deep_copy.iscritti_yt = null
      deep_copy.is_new_scrape_yt = true
      console.log("start youtube verify...")
      await Axios.post(themeConfig.app.serverUrl + "scrapeYT", { profileList: [profile.username_yt] })
        .then((res) => {
          setIsWaitScrapeYT(false)
          let scrapeResult = res.data?.scrapeResult
          let status = res.data?.status
          console.log(res.data)
          // if youtube scrape success
          if (status === "success") {
            if (!isWaitScrapeIG) handleMessage("success", "Verifica social completata!", "Controlla che i dati raccolti siano corretti")
            setIsYoutubeChanged(false)
            setOriginalUsernameYT(profile.username_yt)
            //aggiorna dati scrape del profilo
            deep_copy.iscritti_yt = scrapeResult[0].subscriber
            deep_copy.esito_yt = scrapeResult[0].esito
            deep_copy.utente_trovato_yt = scrapeResult[0].utente_trovato
          } else {
            // if youtube scrape failed
            handleMessage("error", "Errore nella verifica Youtube!", "Controlla l'username sia corretto")
            deep_copy.scrapeErrors++
            //aggiorna dati scrape del profilo
            deep_copy.esito_yt = scrapeResult[0]?.esito || 0
            deep_copy.utente_trovato_yt = scrapeResult[0]?.utente_trovato || 0
          }

          setProfile(deep_copy)
        })
        .catch((err) => {
          handleMessage("error", "Errore nella verifica Youtube!!", "Qualcosa è andato storto :(")
          console.log("CATCH: verifica yt fallita con errore", err)
          setIsWaitScrapeYT(false)
          deep_copy.scrapeErrors++
          //aggiorna dati scrape del profilo
          deep_copy.esito_yt = 0
          deep_copy.utente_trovato_yt = 0

          setProfile(deep_copy)
        })
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
      <Modal
        isOpen={isOpen}
        backdrop={true}
        onClosed={() => {
          //check if there are any unsaved changes
          if (_.isEqual(profile, profileCopy) == false) {
            Swal.fire({
              title: "Modifiche non salvate",
              text: "Confermi di voler uscire?",
              icon: "info",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              cancelButtonText: "Si, chiudi",
              confirmButtonText: "Salva le modifiche",
            }).then((result) => {
              if (result.isConfirmed) {
                setIsOpen(true)
              }
            })
          }
        }}
        toggle={null}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader toggle={() => setIsOpen(false)}>Modifica profilo</ModalHeader>
        <ModalBody>
          <ProfileForm
            profile={profile}
            setProfile={setProfile}
            regions={regions}
            cities={cities}
            tag={tag}
            isWaitScrapeIG={isWaitScrapeIG}
            isWaitScrapeYT={isWaitScrapeYT}
          />
          <Button onClick={() => updateProfileData()} color="primary" className="float-right" disabled={isInstagramChanged || isYoutubeChanged}>
            Aggiorna
          </Button>
          {(isInstagramChanged || isYoutubeChanged) && (
            <Button onClick={() => verifySocial()} color="primary" className="float-right me-1" disabled={isWaitScrapeIG || isWaitScrapeYT}>
              Verifica social
            </Button>
          )}
        </ModalBody>
      </Modal>
    </>
  )
}

export default UpdateProfileModal
