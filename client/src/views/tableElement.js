import { AlertCircle, Calendar, FileText, Heart, Instagram, Mail, Map, MapPin, Music, User, Users, Youtube } from "react-feather"
import { Badge, Card, CardBody, CardText, CardTitle, Col, Row, UncontrolledTooltip } from "reactstrap"

// ** Third Party Components
import Avatar from "@components/avatar"
import moment from "moment"
import { abbreviaNumero } from "./utils"

const isSocialActive = false

/**
 *
 * Export element for main table
 *  - colums (without actions)
 *  - ExpandableTable (for expanding rows and see profile details)
 *  - editProfileModal (modal for edit profile data)
 *
 */

// ** Table Common Column
export const columns = [
  {
    name: "Nome",
    minWidth: "250px",
    sortable: true,
    selector: (row) => (row.username_ig ? row.username_ig : row.username_tt ? row.username_tt : row.username_yt),
    cell: (row) => (
      <div className="d-flex align-items-center cursor-initial">
        <div className="user-info text-truncate ms-1">
          <span className="d-block fw-bold text-truncate">
            {isSocialActive == true &&
              (row.ig_not_found || row.yt_not_found ? (
                <>
                  <AlertCircle size={16} className="me-50 text-danger vertical-align-text-bottom" id={"rowAlert_" + row.id_influencer} />
                  <UncontrolledTooltip placement="top" target={"rowAlert_" + row.id_influencer}>
                    <div className="uncontrolled-container">
                      <span style={{ marginBottom: "10px" }}>Gli username per i seguenti social non sono più validi:</span>
                      {row.ig_not_found && (
                        <span>
                          <Instagram size={16} /> {row.username_ig}
                        </span>
                      )}
                      {row.yt_not_found && (
                        <span>
                          <Youtube size={16} /> {row.username_yt}
                        </span>
                      )}
                    </div>
                  </UncontrolledTooltip>
                </>
              ) : (
                (row.ig_not_scraped || row.yt_not_scraped) && (
                  <>
                    <AlertCircle size={16} className="me-50 text-warning vertical-align-text-bottom" id={"rowWarning_" + row.id_influencer} />
                    <UncontrolledTooltip placement="top" target={"rowWarning_" + row.id_influencer}>
                      <div className="uncontrolled-container">
                        <span style={{ marginBottom: "10px" }}>A causa di un errore i seguenti social non sono stati aggiornati:</span>
                        {row.ig_not_scraped && (
                          <span>
                            <Instagram size={16} /> {row.username_ig}
                          </span>
                        )}
                        {row.yt_not_scraped && (
                          <span>
                            <Youtube size={16} /> {row.username_yt}
                          </span>
                        )}
                      </div>
                    </UncontrolledTooltip>
                  </>
                )
              ))}
            {row.username_ig ? row.username_ig : row.username_tt ? row.username_tt : row.username_yt}
          </span>
          <small>{row.post}</small>
        </div>
      </div>
    ),
  },
  {
    name: "Interessi",
    sortable: false,
    minWidth: "400px",
    selector: (row) => row.interessi,
    cell: (row) => {
      const interests = row.interessi.split(",")
      return (
        <div className="d-flex align-items-center cursor-initial">
          {interests.map((interest) => (
            <Badge color="light-secondary" className="me-50" key={row.id_influencer + "_" + interest}>
              {interest}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    name: (
      <center>
        <Instagram size={16} className="me-50 vertical-align-text-bottom" />
        Follower
      </center>
    ),
    sortable: true,
    selector: (row) => row.follower_ig,
    cell: (row) => (
      <div className="d-flex align-items-center cursor-initial">
        <div className="user-info text-truncate ms-1">
          <Badge className="background-purple font-12px">{row.follower_ig ? abbreviaNumero(row.follower_ig) : <span>-</span>}</Badge>
        </div>
      </div>
    ),
  },
  {
    name: (
      <center>
        <Instagram size={16} className="me-50 vertical-align-text-bottom" />
        <span style={{ whiteSpace: "nowrap" }}>E.R. (%)</span>
      </center>
    ),
    sortable: true,
    selector: (row) => row.engagement_ig,
    cell: (row) => (
      <div className="d-flex align-items-center cursor-initial">
        <div className="user-info text-truncate ms-1">
          <Badge className="background-purple font-12px">{row.engagement_ig ? row.engagement_ig + "%" : <span>-</span>}</Badge>
        </div>
      </div>
    ),
  },
  {
    name: "Grado",
    sortable: true,
    selector: (row) => row.grado,
    cell: (row) => (
      <div className="d-flex align-items-center cursor-initial">
        <div className="user-info text-truncate">
          {row.grado == null ? (
            <Badge color="light-secondary">-</Badge>
          ) : row.grado == "A" ? (
            <Badge color="light-success">A</Badge>
          ) : row.grado == "B" ? (
            <Badge color="light-success">B</Badge>
          ) : row.grado == "C" ? (
            <Badge color="light-warning">C</Badge>
          ) : (
            <Badge color="light-danger">D</Badge>
          )}
        </div>
      </div>
    ),
  },
  {
    name: "Stato",
    sortable: true,
    selector: (row) => row.stato,
    cell: (row) => (
      <div className="d-flex align-items-center cursor-initial">
        <div className="user-info text-truncate">
          {row.stato == 0 ? (
            <Badge color="light-warning">Senza agenzia</Badge>
          ) : row.stato == 1 ? (
            <Badge color="light-danger">Con agenzia</Badge>
          ) : (
            <Badge color="light-success">In domini</Badge>
          )}
        </div>
      </div>
    ),
  },
]

// ** Expandable table component
export const ExpandableTable = ({ data }) => {
  return (
    <div className="expandable-content p-2">
      <Row>
        <Col lg="3" md="6" sm="12">
          <div className="d-flex mb-1">
            <Avatar color="light-primary" className="rounded me-1" icon={<User size={18} />} />
            <div>
              <h6 className="mb-0">Nome</h6>
              <small>{data.nome || <span className="text-secondary">?</span>}</small>
            </div>
          </div>
          <div className="d-flex mb-1">
            <Avatar color="light-primary" className="rounded me-1" icon={<Map size={18} />} />
            <div>
              <h6 className="mb-0">Regione</h6>
              <small>{data.regione || <span className="text-secondary">?</span>}</small>
            </div>
          </div>
          <div className="d-flex">
            <Avatar color="light-primary" className="rounded me-1" icon={<MapPin size={18} />} />
            <div>
              <h6 className="mb-0">Città</h6>
              <small>{data.citta || <span className="text-secondary">?</span>}</small>
            </div>
          </div>
        </Col>
        <Col lg="3" md="6" sm="12">
          <div className="d-flex mb-1">
            <Avatar color="light-primary" className="rounded me-1" icon={<Calendar size={18} />} />
            <div>
              <h6 className="mb-0">Età</h6>
              <small>
                {data.eta ? data.eta + " anni" : <span className="text-secondary">?</span>}{" "}
                {data.data_nascita_format && "(" + data.data_nascita_format + ")"}
              </small>
            </div>
          </div>
          <div className="d-flex mb-1">
            <Avatar color="light-primary" className="rounded me-1" icon={<Mail size={18} />} />
            <div>
              <h6 className="mb-0">Contatti</h6>
              <small>{data.contatti || <span className="text-secondary">?</span>}</small>
            </div>
          </div>
          {data.stato == 2 && data.scadenza_contratto != null && (
            <div className="d-flex">
              <Avatar color="light-primary" className="rounded me-1" icon={<FileText size={18} />} />
              <div>
                <h6 className="mb-0">Scadenza contratto</h6>
                <small>{moment(data.scadenza_contratto).format("DD/MM/YY")}</small>
              </div>
            </div>
          )}
        </Col>
        <Col lg="3" md="6" sm="12">
          <Card color="dark" inverse className="social-card">
            <CardBody>
              <CardTitle className="text-white" tag="h4">
                <Music size={20} /> TikTok
              </CardTitle>
              <CardText>
                {data.username_tt ? (
                  <>
                    <span onClick={() => window.open("https://www.tiktok.com/@" + data.username_tt, "_blank")} className="social-link">
                      @{data.username_tt}
                    </span>
                    <span className="text-secondary">Collegato</span>
                  </>
                ) : (
                  <span className="text-secondary">Non collegato</span>
                )}
              </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col lg="3" md="6" sm="12">
          <Card color="danger" inverse className="social-card">
            <CardBody>
              <CardTitle className="text-white" tag="h4">
                <Youtube size={20} /> Youtube
                {isSocialActive == true &&
                  (data.yt_not_found ||
                    (data.yt_not_scraped && (
                      <>
                        <AlertCircle
                          size={18}
                          className="text-warning vertical-align-text-bottom"
                          id={"ytBoxAlert_" + data.id_influencer}
                          style={{ marginLeft: "7px" }}
                        />
                        <UncontrolledTooltip placement="top" target={"ytBoxAlert_" + data.id_influencer}>
                          <span className="uncontrolled-container">
                            Ultimo aggiornamento: {moment(data.valid_scrape_yt).format("DD/MM/YYYY - hh:mm")}
                          </span>
                        </UncontrolledTooltip>
                      </>
                    )))}
              </CardTitle>
              <CardText>
                {data.username_yt ? (
                  <>
                    <span onClick={() => window.open("https://www.youtube.com/@" + data.username_yt, "_blank")} className="social-link">
                      @{data.username_yt}
                    </span>
                    {data.iscritti_yt ? (
                      <>
                        <Users size={18} /> <b>{abbreviaNumero(data.iscritti_yt)}</b>
                      </>
                    ) : null}
                  </>
                ) : (
                  <span style={{ color: "#f3aeae" }}>Non collegato</span>
                )}
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

// ** Modal for edit a profile
export const editProfileModal = ({ data }) => {
  return (
    <div className="expandable-content p-2">
      <Row>
        <Col lg="3" md="6" sm="12">
          <div className="d-flex mb-1">
            <Avatar color="light-primary" className="rounded me-1" icon={<User size={18} />} />
            <div>
              <h6 className="mb-0">Nome</h6>
              <small>{data.nome || <span className="text-secondary">?</span>}</small>
            </div>
          </div>
          <div className="d-flex mb-1">
            <Avatar color="light-primary" className="rounded me-1" icon={<Map size={18} />} />
            <div>
              <h6 className="mb-0">Regione</h6>
              <small>{data.regione || <span className="text-secondary">?</span>}</small>
            </div>
          </div>
          <div className="d-flex">
            <Avatar color="light-primary" className="rounded me-1" icon={<MapPin size={18} />} />
            <div>
              <h6 className="mb-0">Città</h6>
              <small>{data.citta || <span className="text-secondary">?</span>}</small>
            </div>
          </div>
        </Col>
        <Col lg="3" md="6" sm="12">
          <div className="d-flex mb-1">
            <Avatar color="light-primary" className="rounded me-1" icon={<Calendar size={18} />} />
            <div>
              <h6 className="mb-0">Età</h6>
              <small>{data.eta ? data.eta + " anni" : <span className="text-secondary">?</span>}</small>
            </div>
          </div>
          <div className="d-flex mb-1">
            <Avatar color="light-primary" className="rounded me-1" icon={<Mail size={18} />} />
            <div>
              <h6 className="mb-0">Contatti</h6>
              <small>{data.contatti || <span className="text-secondary">?</span>}</small>
            </div>
          </div>
          <div className="d-flex">
            <Avatar color="light-primary" className="rounded me-1" icon={<Database size={18} />} />
            <div>
              <h6 className="mb-0">Data inserimento</h6>
              <small>{moment(data.data_inserimento).format("DD/MM/YY")}</small>
            </div>
          </div>
        </Col>
        <Col lg="3" md="6" sm="12">
          <Card color="dark" inverse className="social-card">
            <CardBody>
              <CardTitle className="text-white" tag="h4">
                <Music size={20} /> TikTok
              </CardTitle>
              <CardText>
                {data.username_tt ? (
                  <>
                    <span onClick={() => window.open("https://www.tiktok.com/@" + data.username_tt, "_blank")} className="social-link">
                      @{data.username_tt}
                    </span>
                    <span className="text-secondary">Collegato</span>
                  </>
                ) : (
                  <span className="text-secondary">Non collegato</span>
                )}
              </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col lg="3" md="6" sm="12">
          <Card color="danger" inverse className="social-card">
            <CardBody>
              <CardTitle className="text-white" tag="h4">
                <Youtube size={20} /> Youtube
                {data.yt_not_found ||
                  (data.yt_not_scraped && (
                    <>
                      <AlertCircle
                        size={18}
                        className="text-warning vertical-align-text-bottom"
                        id={"ytBoxAlert_" + data.id_influencer}
                        style={{ marginLeft: "7px" }}
                      />
                      <UncontrolledTooltip placement="top" target={"ytBoxAlert_" + data.id_influencer}>
                        <span className="uncontrolled-container">
                          Ultimo aggiornamento: {moment(data.valid_scrape_yt).format("DD/MM/YYYY - hh:mm")}
                        </span>
                      </UncontrolledTooltip>
                    </>
                  ))}
              </CardTitle>
              <CardText>
                {data.username_yt ? (
                  <>
                    <span onClick={() => window.open("https://www.youtube.com/@" + data.username_yt, "_blank")} className="social-link">
                      @{data.username_yt}
                    </span>
                    {data.iscritti_yt ? (
                      <>
                        <Users size={18} /> <b>{abbreviaNumero(data.iscritti_yt)}</b>
                      </>
                    ) : null}
                  </>
                ) : (
                  <span style={{ color: "#f3aeae" }}>Non collegato</span>
                )}
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
