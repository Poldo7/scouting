import { useSkin } from '@hooks/useSkin'
import React, { useContext, useState } from "react"
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Mail, GitHub } from 'react-feather'
import InputPasswordToggle from '@components/input-password-toggle'
import { Row, Col, CardTitle, CardText, Form, Label, Input, Button, Spinner } from 'reactstrap'
import Axios from "axios"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import themeConfig from "@configs/themeConfig"
import '@styles/react/pages/page-authentication.scss'

const MySwal = withReactContent(Swal)

const Login = () => {
  const { skin } = useSkin()
  const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default

  const [nomeUtente, setNomeUtente] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  var bcrypt = require("bcryptjs")
  var randomString = require("randomstring")

  const checkCredential = () => {
    Axios.post(themeConfig.app.serverUrl + "login", { nome_utente: nomeUtente })
      .then((response) => {
        console.log(response)
        if (response.data !== "") {
          if (bcrypt.compareSync(password, response.data.password) === true) {
            //is passw correct?
            // ** logged correctly

            //generate access token and send it to server
            const token = randomString.generate(50)
            Axios.post(themeConfig.app.serverUrl + "storeToken", {
              id_account: response.data.id_account,
              token,
            }).then((response2) => {
              if (response2.data === "ok") {
                //save access data
                const user = {
                  id_account: response.data.id_account,
                  token: bcrypt.hashSync(token, 6)
                }
                localStorage.setItem("user", JSON.stringify(user))
                sessionStorage.setItem("isTokenValid", true)
                //redirect
                window.location.href = "/home"
                
              } else {
                setLoading(false)
                console.log("token error occurred")
                handleError(
                  "Ops,<br>Si è verificato un errore nel server!",
                  "<br> Contatta l'assistenza o riprova più tardi"
                )
              }
            })
          } else {
            // ** wrong password
            setLoading(false)
            handleError(
              "Password errata!",
              "Sicurə di averla digitata correttamente?"
            )
          }
        } else {
          // ** wrong username
          setLoading(false)
          handleError(
            "Nome utente errato!",
            "Sicurə di averlo digitato correttamente?"
          )
        }
      })
      .catch((error) => {
        setLoading(false)
        handleError(
          "Ops,<br>Si è verificato un errore nel server!",
          "<br> Contatta l'assistenza o riprova più tardi"
        )
      })
  }

  const handleError = (message, html) => {
    return MySwal.fire({
      position: "top-end",
      icon: "error",
      title: message,
      html,
      showConfirmButton: false,
      showClass: {
        popup: "animate__animated animate__fadeIn",
      },
      timer: 4000,
    })
  }

  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt='Login Cover' />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='fw-bold mb-1'>
              🔎 Database Scouting
            </CardTitle>
            <CardText className='mb-2'>Accedi con il tuo account per continuare</CardText>
            <Form className='auth-login-form mt-2' onSubmit={e => e.preventDefault()}>
              <div className='mb-1'>
                <Label className='form-label' for='login-username'>
                  Nome utente
                </Label>
                <Input type='text' id='login-username' placeholder='admin' autoFocus 
                  onChange={(e) => {
                    setNomeUtente(e.target.value)
                  }}/>
              </div>
              <div className='mb-1'>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='login-password'>
                    Password
                  </Label>
                </div>
                <InputPasswordToggle className='input-group-merge' id='login-password'
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      checkCredential()
                      setLoading(true)
                    }
                  }}/>
              </div>
              {!loading ? (
                <Button.Ripple
                  onClick={() => {
                    checkCredential()
                    setLoading(true)
                  }}
                  color="primary"
                  block
                >
                  Accedi
                </Button.Ripple>
              ) : (
                <Button.Ripple color="primary" block>
                  <Spinner color="white" size="sm" />
                  <span className="ml-50">Accesso in corso...</span>
                </Button.Ripple>
              )}
            </Form>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Login
