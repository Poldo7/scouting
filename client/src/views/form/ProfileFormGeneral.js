// ** React Imports
import { Fragment, useEffect, useState } from "react"

// ** Icons Imports
import { ArrowRight, Plus } from "react-feather"

// ** Reactstrap Imports
import { Button, Col, Input, Label, Row, Modal, ModalHeader, ModalBody } from "reactstrap"

// ** Third Party Components
import Axios from "axios"
import themeConfig from "@configs/themeConfig"
import Cleave from "cleave.js/react"
import Select from "react-select"
import makeAnimated from "react-select/animated"
import { selectThemeColors } from "@utils"
import Swal from "sweetalert2"
import Flatpickr from "react-flatpickr"
const Italian = require("flatpickr/dist/l10n/it.js").default.it
// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss"

const animatedComponents = makeAnimated()

const ProfileFormGeneral = (props) => {
  const { stepper, profile, setProfile, regions, cities, tag, tabId, activeTab } = props

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [newTagsArray, setNewTagsArray] = useState([])
  const [interessiValue, setInteressiValue] = useState(null)
  const [regioniValue, setRegioniValue] = useState(null)
  const [cittaValue, setCittaValue] = useState(null)
  const [scadenzaContratto, setScadenzaContratto] = useState(null)

  // ** in case of multiple forms (insert mode)
  //      =>  we must set multi-selects values only when we select this specific tab (there can be more than one), otherwise multi-selects crash
  useEffect(() => {
    if (tabId == activeTab) {
      setInteressiValue(profile.interessiArray)
      setRegioniValue(profile.regioniArray)
      setCittaValue(profile.cittaArray)
      setScadenzaContratto(profile.scadenza_contratto)
    }
  }, [activeTab])

  const createTag = () => {
    Axios.post(themeConfig.app.serverUrl + "createTag", { tag: newTag })
      .then((res) => {
        if (res.data) {
          let tag_option = { value: res.data, label: res.data }
          let deep_copy = JSON.parse(JSON.stringify(profile))
          deep_copy.interessiArray.push(tag_option)
          setProfile(deep_copy)
          setNewTagsArray([...newTagsArray, tag_option])
          setIsModalOpen(false)
          setNewTag("")
          handleMessage("success", "Aggiunto", "Interesse creato con successo")
        }
      })
      .catch((err) => {
        handleMessage("error", "Errore!", "Qualcosa è andato storto :/")
      })
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
    <Fragment>
      <div className="content-header mb-2">
        <h5 className="mb-0">Informazioni generali</h5>
        <small className="text-muted">Inserisci i campi obbligatori (*) per continuare</small>
      </div>
      <Row>
        <Col md="12" className="mb-2">
          <Label className="form-label gray-label" for="interessi">
            Contatti *
          </Label>
          <Input
            type="textarea"
            id="floatingInput"
            placeholder="Contatti *"
            value={profile.contatti}
            onChange={(e) => {
              let deep_copy = JSON.parse(JSON.stringify(profile))
              deep_copy.contatti = e.target.value
              setProfile(deep_copy)
            }}
            aria-rowcount={1}
          />
        </Col>
        <Col md="6" className="mb-2">
          <Label className="form-label gray-label" for="interessi">
            Stato *
          </Label>
          <Select
            theme={selectThemeColors}
            closeMenuOnSelect={false}
            components={animatedComponents}
            value={profile.statoOption}
            onChange={(el) => {
              let deep_copy = JSON.parse(JSON.stringify(profile))
              deep_copy.stato = el.value
              deep_copy.statoOption = el
              setProfile(deep_copy)
            }}
            options={[
              { value: 2, label: "In domini" },
              { value: 1, label: "Con agenzia" },
              { value: 0, label: "Senza agenzia" },
            ]}
            className="react-select"
            classNamePrefix="select"
            placeholder="Stato *"
            id="stato"
          />
        </Col>
        <Col md="6" className="mb-2">
          <div className="form-floating" style={{ marginTop: "22px" }}>
            <Cleave
              className="form-control"
              placeholder="Fee (%) *"
              options={{ blocks: [2] }}
              id="fee"
              value={profile.fee}
              onChange={(e) => {
                let deep_copy = JSON.parse(JSON.stringify(profile))
                deep_copy.fee = e.target.value
                setProfile(deep_copy)
              }}
            />
            <label htmlFor="floatingInput">Fee (%) *</label>
          </div>
        </Col>
        <Col md="12">
          {profile.statoOption?.label == "In domini" && (
            <div className="mb-2">
              <Label className="form-label gray-label" for="interessi">
                Scadenza contratto *
              </Label>
              <Flatpickr
                className="form-control"
                value={scadenzaContratto}
                onChange={(value) => {
                  console.log(value)
                  let deep_copy = JSON.parse(JSON.stringify(profile))
                  deep_copy.scadenza_contratto = value
                  setScadenzaContratto(value)
                  setProfile(deep_copy)
                }}
                options={{
                  altInput: true,
                  altFormat: "j F, Y",
                  dateFormat: "d-m-Y",
                  locale: {
                    ...Italian,
                  },
                }}
                id={"scadenza_" + tabId}
              />
            </div>
          )}
          {profile.statoOption?.label == "Con agenzia" && (
            <div className="form-floating mb-2">
              <Input
                type="text"
                id="floatingInput"
                placeholder="Nome agenzia"
                value={profile.nome_agenzia}
                onChange={(e) => {
                  let deep_copy = JSON.parse(JSON.stringify(profile))
                  deep_copy.nome_agenzia = e.target.value
                  setProfile(deep_copy)
                }}
              />
              <label htmlFor="floatingInput">Nome agenzia</label>
            </div>
          )}
        </Col>
        <Col md="12" className="mb-3">
          <Label className="form-label gray-label" for="interessi">
            Interessi *
          </Label>
          <Select
            isClearable={false}
            theme={selectThemeColors}
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            value={interessiValue}
            onChange={(value) => {
              console.log(value)
              let deep_copy = JSON.parse(JSON.stringify(profile))
              deep_copy.interessiArray = value
              deep_copy.interessi = value.map((item) => item.label).join(", ")
              setInteressiValue(value)
              setProfile(deep_copy)
            }}
            onInputChange={(typedValue) => {
              if (typedValue) setNewTag(typedValue)
            }}
            options={[...tag, ...newTagsArray]}
            className="react-select"
            classNamePrefix="select"
            id={"interessi_" + tabId}
            placeholder="Interessi *"
            noOptionsMessage={() => (
              <div style={{ padding: "10px" }}>
                <h4 style={{ color: "gray", marginBottom: "15px" }}>Nessun risultato</h4>
                <Button color="primary" className="btn-next" size="sm" onClick={() => setIsModalOpen(true)}>
                  <Plus size={16} className="me-50 vertical-align-text-bottom" />
                  <span className="d-sm-inline-block d-none" style={{ fontSize: "14px" }}>
                    Aggiungi interesse
                  </span>
                </Button>
              </div>
            )}
          />
          <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)} className="modal-dialog-centered">
            <ModalHeader className="bg-transparent" toggle={() => setIsModalOpen(false)}></ModalHeader>
            <ModalBody className="px-sm-5 mx-50 pb-3">
              <h3 className="text-center mb-75">Aggiungi interesse</h3>
              <p className="text-center">Procedi solo se sei sicuro che non esista già una variante di questo nome</p>
              <Row tag="form" className="gy-1 gx-2 mt-75">
                <div className="form-floating mt-2">
                  <Input type="text" id="floatingInput" placeholder="Nome interesse" value={newTag} onChange={(e) => setNewTag(e.target.value)} />
                  <label htmlFor="floatingInput">Nome interesse</label>
                </div>
                <Col className="text-center mt-3" xs={12}>
                  <Button className="me-1" color="primary" onClick={() => createTag()}>
                    Aggiungi
                  </Button>
                  <Button color="secondary" outline onClick={() => setIsModalOpen(false)}>
                    Anulla
                  </Button>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
        </Col>
        <Col md="6" className="mb-2">
          <div className="form-floating">
            <Input
              type="text"
              id="floatingInput"
              placeholder="Nome"
              value={profile.nome}
              onChange={(e) => {
                let deep_copy = JSON.parse(JSON.stringify(profile))
                deep_copy.nome = e.target.value
                setProfile(deep_copy)
              }}
            />
            <label htmlFor="floatingInput">Nome</label>
          </div>
        </Col>
        <Col md="6" className="mb-2">
          <div className="form-floating">
            <Cleave
              className="form-control"
              placeholder="Età"
              options={{ delimiter: "~", blocks: [2, 2] }}
              id="eta"
              value={profile.eta}
              onChange={(e) => {
                let deep_copy = JSON.parse(JSON.stringify(profile))
                deep_copy.eta = e.target.value
                setProfile(deep_copy)
              }}
            />
            <label htmlFor="floatingInput">Età</label>
          </div>
        </Col>
        <Col md="6" className="mb-2">
          <div className="form-floating">
            <Select
              isClearable={false}
              theme={selectThemeColors}
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              value={regioniValue}
              onChange={(value) => {
                let deep_copy = JSON.parse(JSON.stringify(profile))
                deep_copy.regioniArray = value
                deep_copy.regione = value.map((item) => item.label).join(", ")
                setRegioniValue(value)
                setProfile(deep_copy)
              }}
              options={regions}
              className="react-select"
              classNamePrefix="select"
              placeholder="Regione"
              noOptionsMessage={() => "Nessun risultato"}
              id="regione"
            />
          </div>
        </Col>
        <Col md="6" className="mb-2">
          <div className="form-floating">
            <Select
              isClearable={false}
              theme={selectThemeColors}
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              value={cittaValue}
              onChange={(value) => {
                let deep_copy = JSON.parse(JSON.stringify(profile))
                deep_copy.cittaArray = value
                deep_copy.citta = value.map((item) => item.label).join(", ")
                setCittaValue(value)
                setProfile(deep_copy)
              }}
              options={cities}
              className="react-select"
              classNamePrefix="select"
              placeholder="Città"
              noOptionsMessage={() => "Nessun risultato"}
              id="citta"
            />
          </div>
        </Col>
        <Col md="12" className="mb-2">
          <Label className="form-label gray-label" for="interessi">
            Note aggiuntive
          </Label>
          <Input
            type="textarea"
            id="floatingInput"
            placeholder="Note aggiuntive"
            value={profile.note}
            onChange={(e) => {
              let deep_copy = JSON.parse(JSON.stringify(profile))
              deep_copy.note = e.target.value
              setProfile(deep_copy)
            }}
            aria-rowcount={1}
          />
        </Col>
      </Row>
      <Button color="primary" outline className="btn-next float-right" onClick={() => stepper.next()}>
        <span className="align-middle d-sm-inline-block d-none">Social</span>
        <ArrowRight size={14} className="align-middle ms-sm-25 ms-0"></ArrowRight>
      </Button>
    </Fragment>
  )
}

export default ProfileFormGeneral
