import React, { useEffect, useState } from "react"
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap"

// ** Third Party Components
import Axios from "axios"
import themeConfig from "@configs/themeConfig"
import Swal from "sweetalert2"
import ProfileForm from "./form/ProfileForm"

const UpdateProfileModal = (props) => {
  const { profile, setProfile, isOpen, setIsOpen, regions, cities, tag, fetchProfiles } = props

  const [isSocialChanged, setIsSocialChanged] = useState(false)
  const [originalUsernameIG, setOriginalUsernameIG] = useState(null)
  const [originalUsernameTT, setOriginalUsernameTT] = useState(null)
  const [originalUsernameYT, setOriginalUsernameYT] = useState(null)

  // ** when modal is closed, reset social username
  useEffect(() => {
    if (isOpen == false) {
      console.log("isOpen useEffect")
      setIsSocialChanged(false)
      setOriginalUsernameIG(null)
      setOriginalUsernameTT(null)
      setOriginalUsernameYT(null)
    } else {
      setOriginalUsernameIG(profile.username_ig)
      setOriginalUsernameTT(profile.username_tt)
      setOriginalUsernameYT(profile.username_yt)
    }
  }, [isOpen])

  // ** check if social username has changed
  useEffect(() => {
    console.log("update useEffect", profile, originalUsernameIG, originalUsernameTT, originalUsernameYT)
    if (originalUsernameIG || originalUsernameTT || originalUsernameYT) {
      // check if original username is different from current username
      if (originalUsernameIG != profile.username_ig || originalUsernameTT != profile.username_tt || originalUsernameYT != profile.username_yt) {
        setIsSocialChanged(true)
      } else {
        setIsSocialChanged(false)
      }
    }
  }, [profile.username_ig, profile.username_tt, profile.username_yt])

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
        if (res.data) {
          fetchProfiles()
          handleMessage("success", "Aggiornato", "Profilo aggiornato con successo!")
        }
      })
      .catch((err) => {
        handleMessage("error", "Errore!", "Qualcosa è andato storto :(")
      })
  }

  // ** verify social
  const verifySocial = async () => {
    if (originalUsernameYT != profile.username_yt) {
      await Axios.post(themeConfig.app.serverUrl + "scrapeYT", { profileList: [profile.username_yt] })
        .then((res) => {
          console.log(res)
          if (res.data && res.data.status === "success") {
            handleMessage("success", "Verifica Youtube completata", "Controlla che i dati raccolti siano corretti")

            setIsSocialChanged(false)
            setOriginalUsernameYT(profile.username_yt)
            let deep_copy = JSON.parse(JSON.stringify(profile))
            deep_copy.iscritti_yt = res.data[0].subscriber
            deep_copy.is_new_scrape_yt = true
            //to-do: update other properties
            setProfile(deep_copy)
          } else handleMessage("error", "Errore nella verifica Youtube!", "Qualcosa è andato storto :(")
        })
        .catch((err) => {
          handleMessage("error", "Errore nella verifica Youtube!!", "Qualcosa è andato storto :(")
        })
    }

    if (originalUsernameIG != profile.username_ig) {
      await Axios.post(themeConfig.app.serverUrl + "scrapeIG", { profileList: [profile.username_ig] })
        .then((res) => {
          console.log(res)
          if (res.data && res.data.status === "success") {
            handleMessage("success", "Verifica Instagram completata", "Controlla che i dati raccolti siano corretti")

            setIsSocialChanged(false)
            setOriginalUsernameIG(profile.username_ig)
            let deep_copy = JSON.parse(JSON.stringify(profile))
            deep_copy.follower_ig = res.data[0].follower
            deep_copy.engagement_ig = res.data[0].engagement
            deep_copy.is_new_scrape_ig = true
            //to-do: update other properties
            setProfile(deep_copy)
          } else handleMessage("error", "Errore nella verifica Instagram!", "Qualcosa è andato storto :(")
        })
        .catch((err) => {
          handleMessage("error", "Errore nella verifica Instagram!!", "Qualcosa è andato storto :(")
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
      <Modal isOpen={isOpen} backdrop={true} toggle={null} className="modal-dialog-centered modal-lg">
        <ModalHeader toggle={() => setIsOpen(false)}>Modifica profilo</ModalHeader>
        <ModalBody>
          <ProfileForm profile={profile} setProfile={setProfile} regions={regions} cities={cities} tag={tag} />
          <Button onClick={() => updateProfileData()} color="primary" className="float-right" disabled={isSocialChanged}>
            Aggiorna
          </Button>
          {isSocialChanged && (
            <Button onClick={() => verifySocial()} color="primary" className="float-right me-1">
              Verifica social
            </Button>
          )}
        </ModalBody>
      </Modal>
    </>
  )
}

export default UpdateProfileModal
