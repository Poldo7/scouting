import { DefaultRoute } from '../router/routes'
import Axios from "axios"
import themeConfig from "@configs/themeConfig"

//hash crypt package
var bcrypt = require("bcryptjs")
var randomString = require("randomstring")

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = obj => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = html => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = date => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value) return value
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

/**
 * verify the token validity
 * @param {*} user from localstorage
 * @returns promise of axios post verify token
 */
export async function verifyToken(user) {
  let promise = await Axios.post(themeConfig.app.serverUrl + "verifyToken", {
    id_account: user.id_account,
    token: user.token,
  }).then((response) => {
    // check if token is valid
    if (response.data) {
      return true
    } else {
      return false
    }
  })
  return promise
}
/**
 * send a new access token to server and store it on the browser
 * @param {*} user from localstorage
 * @returns promise of axios post store token
 */
export async function storeNewToken(user) {
  const newToken = randomString.generate(50)
  let promise = await Axios.post(themeConfig.app.serverUrl + "storeToken", {
    id_account: user.id_account,
    token: newToken,
  }).then((response) => {
    // check if the token was stored correctly
    if (response.data === "ok") {
      //set localStorage
      user.token = bcrypt.hashSync(newToken, 6)
      localStorage.setItem("user", JSON.stringify(user))
      //set sessionStorage
      sessionStorage.setItem("isTokenValid", true)
      console.log("successo")
      return true // ** login correctly
    }
    return false // ** error trying to update the token
  })
  return promise
}
/**
 * check if data saved in the localstoraga are valid for get the access
 * @returns true or false, based on the login status
 */
export async function isUserLoggedIn() {
  try {
    //verify localStorage
    var user = JSON.parse(localStorage.getItem("user"))
    if (
      user === null ||
      user.id_account === null
    )
      return false
    //console.log(user)
    var result = false
    //verify token validity
    await verifyToken(user).then(function (isTokenValid) {
      if (isTokenValid !== false) {
        //verify session validity
        var isSessionValid = sessionStorage.getItem("isTokenValid")
        console.log("isSessionValid: " + isSessionValid)
        if (isSessionValid === null || !isSessionValid) {
          //update token and session
          storeNewToken(user).then(function (isStored) {
            if (isStored) {
              console.log("token updated")
            } else {
              console.log("error trying to update the token")
            }
          })
        }
        result = isTokenValid
      }
    })
    return result
  } catch {
    return false
  }
}
export const getUserData = () => localStorage.getItem("user")

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = userRole => {
  if (userRole === 'admin') return DefaultRoute
  if (userRole === 'client') return '/access-control'
  return '/login'
}

// ** React Select Theme Colors
export const selectThemeColors = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})
