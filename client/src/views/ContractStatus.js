import React from "react"
import { Instagram, Music, Youtube } from "react-feather"
import { Card, CardBody, CardTitle, Col, Row } from "reactstrap"

const ContractStatus = (props) => {
  const { expiringContractList, expiredContractList } = props

  return (
    <Row>
      {expiringContractList.length > 0 && (
        <Col sm="12" md="6">
          <Card color="warning" inverse>
            <CardBody>
              <CardTitle className="text-white" tag="h4" style={{ marginBottom: "10px" }}>
                <u>Contratti in scadenza nei prossimi 90 giorni</u>
              </CardTitle>
              <span style={{ fontSize: "15px" }}>
                <ul className="list-style-icons" style={{ marginTop: "15px" }}>
                  {expiringContractList.map((influencer, index) => {
                    return (
                      <li key={index} style={{ marginBottom: "5px" }}>
                        <b>{influencer.day_left} giorni rimasti</b>: {influencer.nome} ({influencer.username}) - {influencer.data_scadenza}
                      </li>
                    )
                  })}
                </ul>
              </span>
            </CardBody>
          </Card>
        </Col>
      )}
      {expiredContractList.length > 0 && (
        <Col sm="12" md="6">
          <Card color="danger" inverse>
            <CardBody>
              <CardTitle className="text-white" tag="h4" style={{ marginBottom: "10px" }}>
                <u>Contratti scaduti</u>
              </CardTitle>
              <span style={{ fontSize: "15px" }}>
                Aggiungi una nuova data scadenza del contratto, o contrassegnali come non più in Domini
                <br />
                <ul className="list-style-icons" style={{ marginTop: "15px" }}>
                  {expiredContractList.map((influencer, index) => {
                    return (
                      <li key={index} style={{ marginBottom: "5px" }}>
                        {influencer.nome} ({influencer.username}) - {influencer.data_scadenza}
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

export default ContractStatus
