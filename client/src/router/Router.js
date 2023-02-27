// ** Router imports
import { useRoutes } from 'react-router-dom'
// ** Utils
import { isUserLoggedIn } from "@utils"


const Router = ({ allRoutes }) => {

  //check with an async call if the user is logged
  async function asyncIsUserLoggedIn() {
    const isLogged = await isUserLoggedIn()
    console.log("Redirect: area " + isLogged)
    return isLogged
  }
  const result = asyncIsUserLoggedIn()
  result.then(function (isLogged) {
    if (
      !isLogged &&
      window.location.pathname.slice(0, 6) !== "/login"
    ) {
      window.location.href = "/login"
    }
  })

  const routes = useRoutes([...allRoutes])

  return routes
}

export default Router
