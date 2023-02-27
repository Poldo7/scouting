import React from "react"
import { Instagram, Music, Youtube } from "react-feather"
import { Card, CardBody, CardTitle, Col, Row } from "reactstrap"

const ScrapingStatus = (props) => {
  const { influencerNotFound, influencerNotScraped } = props

  return (
    <Row>
      {influencerNotFound.length > 0 && (
        <Col sm="12" md="6">
          <Card color="danger" inverse>
            <CardBody>
              <CardTitle className="text-white" tag="h4" style={{ marginBottom: "10px" }}>
                <u>Elenco social non trovati</u>
              </CardTitle>
              <span style={{ fontSize: "15px" }}>
                I seguenti profili non sono stati trovati sui rispettivi social: è probabile che abbiano cambiato username e debbano essere aggiornati
                <br />
                <ul className="list-style-icons" style={{ marginTop: "15px" }}>
                  {influencerNotFound.map((influencer, index) => {
                    return (
                      <li key={index} style={{ marginBottom: "5px" }}>
                        {influencer.piattaforma === "Instagram" && <Instagram size={16} className="rotate-rtl me-50" />}
                        {influencer.piattaforma === "TikTok" && <Music size={16} className="rotate-rtl me-50" />}
                        {influencer.piattaforma === "Youtube" && <Youtube size={16} className="rotate-rtl me-50" />}
                        {influencer.username} ({influencer.piattaforma})
                      </li>
                    )
                  })}
                </ul>
              </span>
            </CardBody>
          </Card>
        </Col>
      )}
      {influencerNotScraped.length > 0 && (
        <Col sm="12" md="6">
          <Card color="warning" inverse>
            <CardBody>
              <CardTitle className="text-white" tag="h4" style={{ marginBottom: "10px" }}>
                <u>Elenco social non aggiornati</u>
              </CardTitle>
              <span style={{ fontSize: "15px" }}>
                A causa di un errore sconosciuto l'ultimo tentativo di aggiornamento dei seguenti profili è fallito
                <br />
                <ul className="list-style-icons" style={{ marginTop: "15px" }}>
                  {influencerNotScraped.map((influencer, index) => {
                    return (
                      <li key={index} style={{ marginBottom: "5px" }}>
                        {influencer.piattaforma === "Instagram" && <Instagram size={16} className="rotate-rtl me-50" />}
                        {influencer.piattaforma === "TikTok" && <Music size={16} className="rotate-rtl me-50" />}
                        {influencer.piattaforma === "Youtube" && <Youtube size={16} className="rotate-rtl me-50" />}
                        {influencer.username} ({influencer.piattaforma})
                      </li>
                    )
                  })}
                </ul>
              </span>
            </CardBody>
          </Card>
        </Col>
      )}
    </Row>
  )
}

export default ScrapingStatus
