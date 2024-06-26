// You can customize the template with the help of this file

//Template config options
const themeConfig = {
  app: {
    appName: "Domini",
    appLogoImage: require("@src/assets/images/logo/logo.png").default,
    baseUrl: "",
    clientUrl: "",
    serverUrl: "",
  },
  layout: {
    isRTL: false,
    skin: "light", // light, dark, bordered, semi-dark
    routerTransition: "fadeIn", // fadeIn, fadeInLeft, zoomIn, none or check this for more transition https://animate.style/
    type: "vertical", // vertical, horizontal
    contentWidth: "boxed", // full, boxed
    menu: {
      isHidden: true,
      isCollapsed: false,
    },
    navbar: {
      // ? For horizontal menu, navbar type will work for navMenu type
      type: "hidden", // static , sticky , floating, hidden
      backgroundColor: "white", // BS color options [primary, success, etc]
    },
    footer: {
      type: "static", // static, sticky, hidden
    },
    customizer: false,
    scrollTop: true, // Enable scroll to top button
    toastPosition: "top-right",
  },
}

if (process.env.NODE_ENV == "production") {
  themeConfig.app.baseUrl = "https://scouting.dominiagency.com/"
  themeConfig.app.clientUrl = "https://scouting.dominiagency.com/"
  themeConfig.app.serverUrl = "https://scouting.api.dominiagency.com/"
} else {
  themeConfig.app.baseUrl = "http://localhost/scouting/client/"
  themeConfig.app.clientUrl = "https://localhost:3000/"
  themeConfig.app.serverUrl = "http://localhost:3001/"
}

export default themeConfig
