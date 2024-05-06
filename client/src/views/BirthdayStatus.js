import React from "react"
import { Card, CardBody, CardTitle, Col } from "reactstrap"

const ContractStatus = (props) => {
  const { birthdaysList } = props

  return (
    <>
      {birthdaysList.length > 0 && (
        <Col sm="12" md="6">
          <Card color="info" inverse>
            <CardBody>
              <CardTitle className="text-white" tag="h4" style={{ marginBottom: "10px" }}>
                <u>Prossimi compleanni 🎉</u>
              </CardTitle>
              <span style={{ fontSize: "15px" }}>
                <ul className="list-style-icons" style={{ marginTop: "15px" }}>
                  {birthdaysList.map((influencer, index) => {
                    return (
                      <li key={index} style={{ marginBottom: "5px" }}>
                        {influencer.data_compleanno}: <b>{influencer.nome}</b> ({influencer.username}) - {influencer.anni} anni
                      </li>
                    )
                  })}
                </ul>
              </span>
            </CardBody>
          </Card>
        </Col>
      )}
    </>
  )
}

export default ContractStatus
