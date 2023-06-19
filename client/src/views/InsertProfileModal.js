import React, { useEffect, useState } from "react"
import { Plus } from "react-feather"
import { Button, Modal, ModalHeader, ModalBody, TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap"
import Swal from "sweetalert2"
import ProfileForm from "./form/ProfileForm"

const InsertProfileModal = (props) => {
  const { isOpen, setIsOpen, profilesArray, setProfilesArray, emptyProfileObject, regions, cities, tag, fetchProfiles } = props

  const [active, setActive] = useState(2)
  const [scrapeStatus, setScrapeStatus] = useState("to-do") // ('to-do', 'running', 'success', 'error')

  // ** check profiles scrape status
  useEffect(() => {
    console.log("profilesArray useEffect")
    let profileToScrape = 0,
      scrapeSuccess = 0,
      scrapeError = 0

    profilesArray.forEach((profile) => {
      //check instagram
      if (profile.username_ig) {
        if (profile.username_ig_verified != profile.username_ig) profileToScrape++
        else if (profile.esito_ig == 1) scrapeSuccess++
        else if (profile.esito_ig == 0) scrapeError++
      }
      //check youtube
      if (profile.username_yt) {
        if (profile.username_yt_verified != profile.username_yt) profileToScrape++
        else if (profile.esito_yt == 1) scrapeSuccess++
        else if (profile.esito_yt == 0) scrapeError++
      }
    })

    //set scrape status
    if (profileToScrape > 0) setScrapeStatus("to-do")
    else if (scrapeError > 0) setScrapeStatus("error")
    else if (scrapeSuccess > 0) setScrapeStatus("success")
  }, [profilesArray])

  // ** verify social
  const verifySocial = () => {
    if (profilesArray.scrapeRetries + profilesArray.scrapeErrors > 6) {
      Swal.fire({
        title: "Limiti tentativi raggiunto: non è possibile verificare i social",
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
    }

    console.log("verifing profile(s): ", profilesArray)

    //get profile to scrape
    let profileToScrapeIG = profilesArray.filter((p) => p.username_ig && (p.username_ig != p.username_ig_verified || p.esito_ig == 0))
    let profileToScrapeYT = profilesArray.filter((p) => p.username_yt && (p.username_yt != p.username_yt_verified || p.esito_yt == 0))

    let deep_copy = JSON.parse(JSON.stringify(profilesArray))
    let isWaitScrapeIG = false,
      isWaitScrapeYT = false

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

    //check profile and start ig scrape
    if (profileToScrapeIG.length > 0) {
      isWaitScrapeIG = true
      setScrapeStatus("running")
      console.log("start scrape ig")

      //simulate scrape
      window.setTimeout(() => {
        console.log("scrape ig done")
        if (false) deep_copy.scrapeErrors // to-do: if error increase counter
        isWaitScrapeIG = false
        for (let i = 0; i < deep_copy.length; i++) {
          if (deep_copy[i].username_ig) {
            deep_copy[i].username_ig_verified = deep_copy[i].username_ig
            deep_copy[i].esito_ig = 1
            deep_copy[i].follower_ig = 45000
            deep_copy[i].engagement_ig = 3
            deep_copy[i].is_new_scrape_ig = true
            //to-do: update other properties
          }
        }
        if (!isWaitScrapeIG && !isWaitScrapeYT) {
          handleMessage("success", "Verifica social completata!", "Controlla che i dati raccolti siano corretti")

          setProfilesArray(deep_copy)
          setIsOpen(true)
        }
      }, 3000)
    }

    //check profile and start yt scrape
    if (profileToScrapeYT.length > 0) {
      isWaitScrapeYT = true
      setScrapeStatus("running")
      console.log("start scrape yt")

      //simulate scrape
      window.setTimeout(() => {
        console.log("scrape yt done")
        if (false) deep_copy.scrapeErrors // to-do: if error increase counter
        isWaitScrapeYT = false
        for (let i = 0; i < deep_copy.length; i++) {
          if (deep_copy[i].username_yt) {
            deep_copy[i].username_yt_verified = deep_copy[i].username_yt
            deep_copy[i].esito_yt = 1
            deep_copy[i].iscritti_yt = 23000
            deep_copy[i].is_new_scrape_yt = true
            //to-do: update other properties
          }
        }
        if (!isWaitScrapeIG && !isWaitScrapeYT) {
          handleMessage("success", "Verifica social completata!", "Controlla che i dati raccolti siano corretti")
          setProfilesArray(deep_copy)
          setIsOpen(true)
        }
      }, 5000)
    }
  }

  // ** insert new profile
  const insertProfile = () => {
    console.log("inserting profile(s): ", profilesArray)
    setIsOpen(false)
    let empty = [emptyProfileObject]
    empty.scrapeRetries = 0
    empty.scrapeErrors = 0
    setProfilesArray(empty)
    fetchProfiles()
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
                  setProfilesArray([...profilesArray, emptyProfileObject])
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
                    profile={profile}
                    setProfile={(edited) => {
                      let deep_copy = JSON.parse(JSON.stringify(profilesArray))
                      deep_copy[index] = edited
                      console.log(deep_copy)
                      setProfilesArray(deep_copy)
                    }}
                    regions={regions}
                    cities={cities}
                    tag={tag}
                    tabId={2 + index}
                    activeTab={active}
                    isWaitingScrape={scrapeStatus == "running" ? true : false}
                  />
                </TabPane>
              )
            })}
          </TabContent>
          <Button
            onClick={() => insertProfile()}
            color="primary"
            className="float-right"
            disabled={scrapeStatus == "to-do" || scrapeStatus == "running" ? true : false}
          >
            Inserisci
          </Button>
          <Button
            onClick={() => verifySocial()}
            color="primary"
            className="float-right me-1"
            disabled={scrapeStatus == "running" || scrapeStatus == "success" ? true : false}
          >
            Verifica social
          </Button>
        </ModalBody>
      </Modal>
    </>
  )
}

export default InsertProfileModal
