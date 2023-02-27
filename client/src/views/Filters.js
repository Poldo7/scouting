import { selectThemeColors } from "@utils"
import React, { useEffect } from "react"
import { Instagram, Music, X, Youtube } from "react-feather"
import { CardBody, Col, Collapse, Input, InputGroup, InputGroupText, Label, Row } from "reactstrap"
// ** Table columns & Expandable Data
import { abbreviaNumero } from "./data"

// ** Third Party Components
import InputRange from "react-input-range"
import "react-input-range/lib/css/index.css"
import Select from "react-select"
import makeAnimated from "react-select/animated"

const animatedComponents = makeAnimated()

const Filters = (props) => {
  const {
    // ** default profile data
    data,
    // ** update filtered profile data
    setFilteredData,
    // ** select options
    tagOptions,
    regionOptions,
    // ** filters data
    isFilterOpen,
    filterName,
    filterTag,
    filterEta,
    filterState,
    filterRegion,
    isInstragramChecked,
    isTiktokChecked,
    isYoutubeChecked,
    filterFollowerMinIG,
    filterFollowerMaxIG,
    filterEngagementMinIG,
    filterEngagementMaxIG,
    filterFollowerMinTT,
    filterFollowerMaxTT,
    filterSubscriberMinYT,
    filterSubscriberMaxYT,
    setFilterCounter,
    followerMaxIG,
    engagementMaxIG,
    followerMaxTT,
    subscriberMaxYT,
    // ** update filters data
    setFilterName,
    setFilterTag,
    setFilterEta,
    setFilterState,
    setFilterRegion,
    setIsInstragramChecked,
    setIsTiktokChecked,
    setIsYoutubeChecked,
    setFilterFollowerMinIG,
    setFilterFollowerMaxIG,
    setFilterEngagementMinIG,
    setFilterEngagementMaxIG,
    setFilterFollowerMinTT,
    setFilterFollowerMaxTT,
    setFilterSubscriberMinYT,
    setFilterSubscriberMaxYT,
  } = props

  // ** useffect for listening filter changes
  useEffect(() => {
    if (data.length == 0) return

    // update filter counter
    let filterCounter = 0
    if (filterName !== "") filterCounter++
    if (filterTag.length > 0) filterCounter++
    if (filterEta.length > 0) filterCounter++
    if (filterState.length > 0) filterCounter++
    if (filterRegion.length > 0) filterCounter++
    if (isInstragramChecked || isTiktokChecked || isYoutubeChecked) filterCounter++
    if (filterFollowerMinIG > 0 || filterFollowerMaxIG < followerMaxIG) filterCounter++
    if (filterEngagementMinIG > 0 || filterEngagementMaxIG < engagementMaxIG) filterCounter++
    if (filterFollowerMinTT > 0 || filterFollowerMaxTT < followerMaxTT) filterCounter++
    if (filterSubscriberMinYT > 0 || filterSubscriberMaxYT < subscriberMaxYT) filterCounter++
    setFilterCounter(filterCounter)

    // apply filters
    if (filterCounter == 0) setFilteredData(data)
    else applyFilters()
  }, [
    filterName,
    filterTag,
    filterEta,
    filterState,
    filterRegion,
    isInstragramChecked,
    isTiktokChecked,
    isYoutubeChecked,
    filterFollowerMinIG,
    filterFollowerMaxIG,
    filterEngagementMinIG,
    filterEngagementMaxIG,
    filterFollowerMinTT,
    filterFollowerMaxTT,
    filterSubscriberMinYT,
    filterSubscriberMaxYT,
  ])

  const applyFilters = () => {
    //** FILTER DATA */
    const filteredData = data.filter((profile) => {
      let name = false,
        tag = false,
        eta = false,
        state = false,
        region = false,
        instagram = false,
        tiktok = false,
        youtube = false,
        followerIG = false,
        engagementIG = false,
        followerTT = false,
        subscriberYT = false

      // ** NAME
      if (filterName !== "") {
        if (
          (profile.nome && profile.nome.toLowerCase().includes(filterName.toLowerCase())) ||
          (profile.username_ig && profile.username_ig.toLowerCase().includes(filterName.toLowerCase())) ||
          (profile.username_tt && profile.username_tt.toLowerCase().includes(filterName.toLowerCase())) ||
          (profile.username_yt && profile.username_yt.toLowerCase().includes(filterName.toLowerCase()))
        )
          name = true
      } else name = true

      // ** TAG
      if (filterTag.length > 0) {
        for (let i = 0; i < filterTag.length; i++) {
          if (profile.interessi && profile.interessi.toLowerCase().includes(filterTag[i].value.toLowerCase())) tag = true
        }
      } else tag = true

      // ** ETA
      if (filterEta.length > 0) {
        for (let i = 0; i < filterEta.length; i++) {
          if (profile.eta_min && profile.eta_max) {
            // if eta is a range
            if (
              (filterEta[i].min <= profile.eta_min && filterEta[i].max >= profile.eta_min) ||
              (filterEta[i].min <= profile.eta_max && filterEta[i].max >= profile.eta_max)
            )
              eta = true
          } else {
            // if eta is a single value
            if (profile.eta && filterEta[i].min <= profile.eta && filterEta[i].max >= profile.eta) eta = true
          }
        }
      } else eta = true

      // ** STATE
      if (filterState.length > 0) {
        for (let i = 0; i < filterState.length; i++) {
          if (profile.stato == filterState[i].value) state = true
        }
      } else state = true

      // ** REGION
      if (filterRegion.length > 0) {
        for (let i = 0; i < filterRegion.length; i++) {
          if (profile.regione && profile.regione.toLowerCase().includes(filterRegion[i].value.toLowerCase())) region = true
        }
      } else region = true

      // ** SOCIAL
      if (isInstragramChecked && !profile.username_ig) instagram = false
      else instagram = true
      if (isTiktokChecked && !profile.username_tt) tiktok = false
      else tiktok = true
      if (isYoutubeChecked && !profile.username_yt) youtube = false
      else youtube = true

      // ** FOLLOWER IG
      if (filterFollowerMinIG > 0 || filterFollowerMaxIG < followerMaxIG) {
        if (profile.username_ig) if (profile.follower_ig >= filterFollowerMinIG && profile.follower_ig <= filterFollowerMaxIG) followerIG = true
      } else followerIG = true

      // ** ENGAGEMENT IG
      if (filterEngagementMinIG > 0 || filterEngagementMaxIG < engagementMaxIG) {
        if (profile.username_ig)
          if (profile.engagement_ig >= filterEngagementMinIG && profile.engagement_ig <= filterEngagementMaxIG) engagementIG = true
      } else engagementIG = true

      // ** FOLLOWER TT
      if (filterFollowerMinTT > 0 || filterFollowerMaxTT < followerMaxTT) {
        if (profile.username_tt) if (profile.follower_tt >= filterFollowerMinTT && profile.follower_tt <= filterFollowerMaxTT) followerTT = true
      } else followerTT = true

      // ** SUBSCRIBER YT
      if (filterSubscriberMinYT > 0 || filterSubscriberMaxYT < subscriberMaxYT) {
        if (profile.username_yt) if (profile.iscritti_yt >= filterSubscriberMinYT && profile.iscritti_yt <= filterSubscriberMaxYT) subscriberYT = true
      } else subscriberYT = true
      //console.log(name, tag, eta, state, region, instagram, tiktok, youtube, followerIG, engagementIG, followerTT, subscriberYT)
      return name && tag && eta && state && region && instagram && tiktok && youtube && followerIG && engagementIG && followerTT && subscriberYT
    })

    setFilteredData(filteredData)
  }

  return (
    <CardBody className="pb-0">
      <Collapse isOpen={isFilterOpen}>
        <div className="p-1 border radius-5px" style={{ backgroundColor: "rgb(246 242 255)" }}>
          <Row>
            <Col className="mb-2" xl="3" md="5" sm="12">
              <Label className="form-label" for="nome">
                Nome
              </Label>
              <InputGroup className="input-group-merge">
                <Input
                  type="text"
                  id="nome"
                  placeholder="Username, nome o cognome"
                  value={filterName}
                  onChange={(el) => setFilterName(el.target.value)}
                />
                {filterName != "" && (
                  <InputGroupText>
                    <X size={14} style={{ cursor: "pointer" }} onClick={() => setFilterName("")} />
                  </InputGroupText>
                )}
              </InputGroup>
            </Col>
            <Col className="mb-2" xl="5" md="7" sm="12">
              <Label className="form-label" for="interessi">
                Interessi
              </Label>
              <Select
                isClearable={true}
                theme={selectThemeColors}
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                value={filterTag}
                onChange={(value) => setFilterTag(value)}
                options={tagOptions}
                className="react-select"
                classNamePrefix="select"
                placeholder="Digita per cercare..."
                id="interessi"
              />
            </Col>
            <Col className="mb-2" xl="4" md="6" sm="12">
              <Label className="form-label" for="interessi">
                Social{" "}
                <i>
                  (<u>deve possedere tutti quelli selezionati</u>)
                </i>
              </Label>
              <div className="demo-inline-spacing">
                <div className="form-check form-check-pink">
                  <Input
                    type="checkbox"
                    id="social-ig"
                    checked={isInstragramChecked}
                    onChange={(e) => {
                      setIsInstragramChecked(e.target.checked)
                      if (e.target.checked == false) {
                        setFilterFollowerMinIG(0)
                        setFilterFollowerMaxIG(followerMaxIG)
                        setFilterEngagementMinIG(0)
                        setFilterEngagementMaxIG(engagementMaxIG)
                      }
                    }}
                  />
                  <Label className="form-check-label" for="social-ig">
                    Instagram
                  </Label>
                </div>
                <div className="form-check form-check-dark">
                  <Input
                    type="checkbox"
                    id="social-tt"
                    checked={isTiktokChecked}
                    onChange={(e) => {
                      setIsTiktokChecked(e.target.checked)
                      if (e.target.checked == false) {
                        setFilterFollowerMinTT(0)
                        setFilterFollowerMaxTT(followerMaxTT)
                      }
                    }}
                  />
                  <Label className="form-check-label" for="social-tt">
                    TikTok
                  </Label>
                </div>
                <div className="form-check form-check-danger">
                  <Input
                    type="checkbox"
                    id="social-yt"
                    checked={isYoutubeChecked}
                    onChange={(e) => {
                      setIsYoutubeChecked(e.target.checked)
                      if (e.target.checked == false) {
                        setFilterSubscriberMinYT(0)
                        setFilterSubscriberMaxYT(subscriberMaxYT)
                      }
                    }}
                  />
                  <Label className="form-check-label" for="social-yt">
                    Youtube
                  </Label>
                </div>
              </div>
            </Col>
            <Col className="mb-2" xl="3" md="6" sm="12">
              <Label className="form-label" for="follower_ig" style={{ marginBottom: "25px" }}>
                <Instagram size={16} className="vertical-align-text-bottom" style={{ marginRight: "5px" }} /> Follower Instagram
              </Label>
              <div style={{ padding: "0 20px 0 10px" }} className="instagram-range">
                <InputRange
                  maxValue={followerMaxIG}
                  minValue={0}
                  step={1000}
                  value={{ min: filterFollowerMinIG, max: filterFollowerMaxIG }}
                  formatLabel={(value) => abbreviaNumero(value)}
                  onChange={(value) => {
                    if (value.max - value.min < followerMaxIG / 10) return
                    setFilterFollowerMinIG(value.min > 0 ? value.min : 0)
                    setFilterFollowerMaxIG(value.max < followerMaxIG ? value.max : followerMaxIG)
                    if (!isInstragramChecked && (value.min > 0 || value.max < followerMaxIG)) {
                      setIsInstragramChecked(true)
                    }
                  }}
                />
              </div>
            </Col>
            <Col className="mb-2" xl="3" md="6" sm="12">
              <Label className="form-label" for="engagement_ig" style={{ marginBottom: "25px" }}>
                <Instagram size={16} className="vertical-align-text-bottom" style={{ marginRight: "5px" }} /> E.R Instagram
              </Label>
              <div style={{ padding: "0 20px 0 10px" }} className="instagram-range">
                <InputRange
                  maxValue={engagementMaxIG}
                  minValue={0}
                  step={1}
                  value={{ min: filterEngagementMinIG, max: filterEngagementMaxIG }}
                  formatLabel={(value) => `${value}%`}
                  onChange={(value) => {
                    if (value.max - value.min < 1) return
                    setFilterEngagementMinIG(value.min > 0 ? value.min : 0)
                    setFilterEngagementMaxIG(value.max < engagementMaxIG ? value.max : engagementMaxIG)
                    if (!isInstragramChecked && (value.min > 0 || value.max < engagementMaxIG)) {
                      setIsInstragramChecked(true)
                    }
                  }}
                />
              </div>
            </Col>
            <Col className="mb-2" xl="3" md="6" sm="12">
              <Label className="form-label" for="follower_tt" style={{ marginBottom: "25px" }}>
                <Music size={16} className="vertical-align-text-bottom" style={{ marginRight: "5px" }} /> Follower TikTok
              </Label>
              <div style={{ padding: "0 20px 0 10px" }} className="tiktok-range">
                <InputRange
                  maxValue={followerMaxTT}
                  minValue={0}
                  step={1000}
                  value={{ min: filterFollowerMinTT, max: filterFollowerMaxTT }}
                  formatLabel={(value) => abbreviaNumero(value)}
                  onChange={(value) => {
                    if (value.max - value.min < followerMaxTT / 10) return
                    setFilterFollowerMinTT(value.min > 0 ? value.min : 0)
                    setFilterFollowerMaxTT(value.max < followerMaxTT ? value.max : followerMaxTT)
                    if (!isTiktokChecked && (value.min > 0 || value.max < followerMaxTT)) {
                      setIsTiktokChecked(true)
                    }
                  }}
                />
              </div>
            </Col>
            <Col className="mb-2" xl="3" md="6" sm="12">
              <Label className="form-label" for="subscriber_yt" style={{ marginBottom: "25px" }}>
                <Youtube size={16} className="vertical-align-text-bottom" style={{ marginRight: "5px" }} /> Iscritti Youtube
              </Label>
              <div style={{ padding: "0 20px 0 10px" }} className="youtube-range">
                <InputRange
                  maxValue={subscriberMaxYT}
                  minValue={0}
                  step={1000}
                  value={{ min: filterSubscriberMinYT, max: filterSubscriberMaxYT }}
                  formatLabel={(value) => abbreviaNumero(value)}
                  onChange={(value) => {
                    if (value.max - value.min < subscriberMaxYT / 10) return
                    setFilterSubscriberMinYT(value.min > 0 ? value.min : 0)
                    setFilterSubscriberMaxYT(value.max < subscriberMaxYT ? value.max : subscriberMaxYT)
                    if (!isYoutubeChecked && (value.min > 0 || value.max < subscriberMaxYT)) {
                      setIsYoutubeChecked(true)
                    }
                  }}
                />
              </div>
            </Col>
            <Col className="mb-2" xl="4" md="6" sm="12">
              <Label className="form-label" for="regione">
                Regione
              </Label>
              <Select
                isClearable={true}
                theme={selectThemeColors}
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                value={filterRegion}
                onChange={(value) => setFilterRegion(value)}
                options={regionOptions}
                className="react-select"
                classNamePrefix="select"
                placeholder="Digita per cercare..."
                id="regione"
              />
            </Col>
            <Col className="mb-2" xl="4" md="6" sm="12">
              <Label className="form-label" for="eta">
                Età
              </Label>
              <Select
                isClearable={true}
                theme={selectThemeColors}
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                value={filterEta}
                onChange={(value) => setFilterEta(value)}
                options={[
                  { value: "14-20", label: "14-20", min: 14, max: 20 },
                  { value: "20-25", label: "20-25", min: 20, max: 25 },
                  { value: "25-30", label: "25-30", min: 25, max: 30 },
                  { value: "30-35", label: "30-35", min: 30, max: 35 },
                  { value: "35-40", label: "35-40", min: 35, max: 40 },
                  { value: "40+", label: "40+", min: 40, max: 100 },
                ]}
                className="react-select"
                classNamePrefix="select"
                placeholder="Seleziona"
                id="interessi"
              />
            </Col>
            <Col className="mb-2" xl="4" md="6" sm="12">
              <Label className="form-label" for="stato">
                Stato
              </Label>
              <Select
                isClearable={true}
                theme={selectThemeColors}
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                value={filterState}
                onChange={(value) => setFilterState(value)}
                options={[
                  { value: 2, label: "In domini" },
                  { value: 1, label: "Con agenzia" },
                  { value: 0, label: "Senza agenzia" },
                ]}
                className="react-select"
                classNamePrefix="select"
                placeholder="Seleziona"
                id="stato"
              />
            </Col>
          </Row>
        </div>
      </Collapse>
    </CardBody>
  )
}

export default Filters
