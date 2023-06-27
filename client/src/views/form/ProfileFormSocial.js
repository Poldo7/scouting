// ** React Imports
import { Fragment, useEffect } from "react"

// ** Icons Imports
import { ArrowLeft, ArrowRight, Briefcase, Check, Heart, Star, Users, X } from "react-feather"

// ** Reactstrap Imports
import { Label, Row, Col, InputGroup, Input, InputGroupText, Form, Button, Badge, Spinner } from "reactstrap"

// ** Third Party Components
import { abbreviaNumero } from "./../utils"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

// ** logo images
const logo_instagram = require("@src/assets/images/logo/instagram.png").default
const logo_tiktok = require("@src/assets/images/logo/tiktok.png").default
const logo_youtube = require("@src/assets/images/logo/youtube.png").default

const ProfileFormSocial = (props) => {
  const { profile, setProfile, tabId, isWaitScrapeIG, isWaitScrapeYT } = props

  return (
    <Fragment>
      <div className="content-header" style={{ marginBottom: "30px" }}>
        <h5 className="mb-0">Piattaforme social</h5>
        <small className="text-muted">Connetti almeno un profilo per continuare</small>
      </div>
      <div className="d-flex mt-2">
        <div className="flex-shrink-0">
          <img className="me-1" src={logo_instagram} alt="instagram" height="38" width="38" />
        </div>
        <div className="d-flex align-item-center justify-content-between flex-grow-1">
          <div className="me-1" style={{ width: "100%", padding: "0 10px" }}>
            {profile.username_ig == null ? (
              <>
                <p className="fw-bolder mb-0">Instagram</p>
                <span>Non connesso</span>
              </>
            ) : (
              <>
                <InputGroup>
                  <InputGroupText>@</InputGroupText>
                  <Input
                    placeholder="Username"
                    value={profile.username_ig}
                    disabled={isWaitScrapeIG}
                    onChange={(e) => {
                      setProfile({ ...profile, username_ig: e.target.value })
                    }}
                  />
                </InputGroup>
                <div className="social-container justify-content-around pt-75">
                  <div className="d-flex align-items-start me-2">
                    <Badge color="light-primary" className="rounded p-75">
                      <Users className="font-medium-2" />
                    </Badge>
                    {isWaitScrapeIG == true ? (
                      <div className="ms-75">
                        <h4 className="mb-0">
                          <Spinner style={{ width: "1.4rem", height: "1.4rem" }} />
                        </h4>
                        <small className="text-info">Verifica in corso...</small>
                      </div>
                    ) : profile.follower_ig != null ? (
                      <div className="ms-75">
                        <h4 className="mb-0">{abbreviaNumero(profile.follower_ig)}</h4>
                        <small className="text-success">Verificato</small>
                      </div>
                    ) : (
                      <div className="ms-75">
                        <h4 className="mb-0">?</h4>
                        <small className="text-danger">Non verificato</small>
                      </div>
                    )}
                  </div>
                  <div className="d-flex align-items-start">
                    <Badge color="light-primary" className="rounded p-75">
                      <Star className="font-medium-2" />
                    </Badge>
                    {isWaitScrapeIG == true ? (
                      <div className="ms-75">
                        <h4 className="mb-0">
                          <Spinner style={{ width: "1.4rem", height: "1.4rem" }} />
                        </h4>
                        <small className="text-info">Verifica in corso...</small>
                      </div>
                    ) : profile.engagement_ig != null ? (
                      <div className="ms-75">
                        <h4 className="mb-0">{profile.engagement_ig}%</h4>
                        <small className="text-success">Verificato</small>
                      </div>
                    ) : (
                      <div className="ms-75">
                        <h4 className="mb-0">?</h4>
                        <small className="text-danger">Non verificato</small>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="mt-50">
            <div className="form-switch">
              <Input
                type="switch"
                checked={profile.username_ig != null}
                id={"instagram_" + tabId}
                onChange={async (e) => {
                  if (e.target.checked) {
                    setProfile({ ...profile, username_ig: "" })
                  } else {
                    if (profile.username_ig == "") {
                      setProfile({ ...profile, username_ig: null, follower_ig: null, engagement_ig: null })
                      return
                    }
                    const result = await MySwal.fire({
                      title: "Scollegare Instagram?",
                      text: 'Procedendo rimuoverai "@' + profile.username_ig + '" ed i suoi dati',
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Si, Rimuovilo!",
                      cancelButtonText: "No, Annulla!",
                      customClass: {
                        confirmButton: "btn btn-danger",
                        cancelButton: "btn btn-primary ms-1",
                      },
                      buttonsStyling: false,
                    })
                    if (result.value) {
                      setProfile({ ...profile, username_ig: null, follower_ig: null, engagement_ig: null })
                    }
                  }
                }}
              />
              <Label className="form-check-label" for={"instagram_" + tabId}>
                <span className="switch-icon-left">
                  <Check size={14} />
                </span>
                <span className="switch-icon-right">
                  <X size={14} />
                </span>
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex mt-2">
        <div className="flex-shrink-0">
          <img className="me-1" src={logo_tiktok} alt="tiktok" height="38" width="38" />
        </div>
        <div className="d-flex align-item-center justify-content-between flex-grow-1">
          <div className="me-1" style={{ width: "100%", padding: "0 10px" }}>
            {profile.username_tt == null ? (
              <>
                <p className="fw-bolder mb-0">TikTok</p>
                <span>Non collegato</span>
              </>
            ) : (
              <>
                <InputGroup>
                  <InputGroupText>@</InputGroupText>
                  <Input
                    placeholder="Username"
                    value={profile.username_tt}
                    onChange={(e) => {
                      setProfile({ ...profile, username_tt: e.target.value })
                    }}
                  />
                </InputGroup>
              </>
            )}
          </div>
          <div className="mt-50">
            <div className="form-switch">
              <Input
                type="switch"
                checked={profile.username_tt != null}
                id={"tiktok_" + tabId}
                onChange={async (e) => {
                  if (e.target.checked) {
                    setProfile({ ...profile, username_tt: "" })
                  } else {
                    if (profile.username_tt == "") {
                      setProfile({ ...profile, username_tt: null })
                      return
                    }
                    const result = await MySwal.fire({
                      title: "Scollegare TikTok?",
                      text: 'Procedendo rimuoverai "@' + profile.username_tt + '" dal profilo',
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Si, Rimuovilo!",
                      cancelButtonText: "No, Annulla!",
                      customClass: {
                        confirmButton: "btn btn-danger",
                        cancelButton: "btn btn-primary ms-1",
                      },
                      buttonsStyling: false,
                    })
                    if (result.value) {
                      setProfile({ ...profile, username_tt: null })
                    }
                  }
                }}
              />
              <Label className="form-check-label" for={"tiktok_" + tabId}>
                <span className="switch-icon-left">
                  <Check size={14} />
                </span>
                <span className="switch-icon-right">
                  <X size={14} />
                </span>
              </Label>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex mt-2">
        <div className="flex-shrink-0">
          <img className="me-1" src={logo_youtube} alt="youtube" height="38" width="38" />
        </div>
        <div className="d-flex align-item-center justify-content-between flex-grow-1">
          <div className="me-1" style={{ width: "100%", padding: "0 10px" }}>
            {profile.username_yt == null ? (
              <>
                <p className="fw-bolder mb-0">Youtube</p>
                <span>Non connesso</span>
              </>
            ) : (
              <>
                <InputGroup>
                  <InputGroupText>@</InputGroupText>
                  <Input
                    placeholder="Username"
                    value={profile.username_yt}
                    disabled={isWaitScrapeYT}
                    onChange={(e) => {
                      setProfile({ ...profile, username_yt: e.target.value })
                    }}
                  />
                </InputGroup>
                <div className="social-container justify-content-around pt-75">
                  <div className="d-flex align-items-start me-2">
                    <Badge color="light-primary" className="rounded p-75">
                      <Users className="font-medium-2" />
                    </Badge>
                    {isWaitScrapeYT == true ? (
                      <div className="ms-75">
                        <h4 className="mb-0">
                          <Spinner style={{ width: "1.4rem", height: "1.4rem" }} />
                        </h4>
                        <small className="text-info">Verifica in corso...</small>
                      </div>
                    ) : profile.iscritti_yt != null ? (
                      <div className="ms-75">
                        <h4 className="mb-0">{abbreviaNumero(profile.iscritti_yt)}</h4>
                        <small className="text-success">Verificato</small>
                      </div>
                    ) : (
                      <div className="ms-75">
                        <h4 className="mb-0">?</h4>
                        <small className="text-danger">Non verificato</small>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="mt-50">
            <div className="form-switch">
              <Input
                type="switch"
                checked={profile.username_yt != null}
                id={"youtube_" + tabId}
                onChange={async (e) => {
                  if (e.target.checked) {
                    setProfile({ ...profile, username_yt: "" })
                  } else {
                    if (profile.username_yt == "") {
                      setProfile({ ...profile, username_yt: null, iscritti_yt: null })
                      return
                    }
                    const result = await MySwal.fire({
                      title: "Scollegare Youtube?",
                      text: 'Procedendo rimuoverai "@' + profile.username_yt + '" ed i suoi dati',
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Si, Rimuovilo!",
                      cancelButtonText: "No, Annulla!",
                      customClass: {
                        confirmButton: "btn btn-danger",
                        cancelButton: "btn btn-primary ms-1",
                      },
                      buttonsStyling: false,
                    })
                    if (result.value) {
                      setProfile({ ...profile, username_yt: null, iscritti_yt: null })
                    }
                  }
                }}
              />
              <Label className="form-check-label" for={"youtube_" + tabId}>
                <span className="switch-icon-left">
                  <Check size={14} />
                </span>
                <span className="switch-icon-right">
                  <X size={14} />
                </span>
              </Label>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default ProfileFormSocial
