import React, { useEffect, useState } from "react"
import { Plus } from "react-feather"
import { Button, Modal, ModalHeader, ModalBody, TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap"
import ProfileForm from "./form/ProfileForm"

const InsertProfileModal = (props) => {
  const { isOpen, setIsOpen, regions, cities, tag, fetchProfiles } = props

  const profileData = {
    contatti: "",
    interessiArray: [],
    nome: "",
    eta: "",
    regioniArray: [],
    cittaArray: [],
    username_ig: null,
    username_tt: null,
    username_yt: null,
    follower_ig: null,
    engagement_ig: null,
    follower_tt: null,
    likes_tt: null,
    iscritti_yt: null,
  }

  const [profilesArray, setProfilesArray] = useState([profileData])
  const [active, setActive] = useState(2)

  // ** insert new profile
  const insertProfile = () => {
    console.log("inserting profile(s): ", profilesArray)
    setInsertModalOpen(false)
    fetchProfiles()
  }

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
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
                    Profilo {index + 1}
                  </NavLink>
                </NavItem>
              )
            })}
            <NavItem>
              <NavLink
                active={active == "1"}
                onClick={() => {
                  setProfilesArray([...profilesArray, profileData])
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
                  />
                </TabPane>
              )
            })}
          </TabContent>
          <Button onClick={() => insertProfile()} color="primary" className="float-right">
            Inserisci
          </Button>
        </ModalBody>
      </Modal>
    </>
  )
}

export default InsertProfileModal
