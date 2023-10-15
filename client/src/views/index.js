import themeConfig from "@configs/themeConfig"
import Axios from "axios"
import React, { useEffect, useState } from "react"
import { ChevronDown, Edit, Filter, MinusCircle, Plus, RotateCw, Trash, User } from "react-feather"
import { Button, Card, CardHeader, CardTitle } from "reactstrap"
// ** Table columns & Expandable Data
import { columns, ExpandableTable } from "./tableElement"

// ** Third Party Components
import DataTable from "react-data-table-component"
import ReactPaginate from "react-paginate"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

// ** Custom Components
import Filters from "./Filters"
import ScrapingStatus from "./ScrapingStatus"
import InsertProfileModal from "./InsertProfileModal"
import UpdateProfileModal from "./UpdateProfileModal"

const MySwal = withReactContent(Swal)

const Home = () => {
  const isSocialActive = false // to enable/disable scraping bot functionalities

  // ** State
  const [currentPage, setCurrentPage] = useState(0)
  const [currentRows, setCurrentRows] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [influencerNotScraped, setInfluencerNotScraped] = useState([])
  const [influencerNotFound, setInfluencerNotFound] = useState([])
  // ** Options For Filters
  const [tagOptions, setTagOptions] = useState([])
  const [regionOptions, setRegionOptions] = useState([])
  const [followerMaxIG, setFollowerMaxIG] = useState(1)
  const [engagementMaxIG, setEngagementMaxIG] = useState(1)
  const [subscriberMaxYT, setSubscriberMaxYT] = useState(1)
  // ** Filters Values
  const [filterCounter, setFilterCounter] = useState(0)
  const [filterName, setFilterName] = useState("")
  const [filterTag, setFilterTag] = useState([])
  const [filterEta, setFilterEta] = useState([])
  const [filterState, setFilterState] = useState([])
  const [filterRegion, setFilterRegion] = useState([])
  const [isInstragramChecked, setIsInstragramChecked] = useState(false)
  const [isTiktokChecked, setIsTiktokChecked] = useState(false)
  const [isYoutubeChecked, setIsYoutubeChecked] = useState(false)
  const [filterFollowerMinIG, setFilterFollowerMinIG] = useState(0)
  const [filterFollowerMaxIG, setFilterFollowerMaxIG] = useState(1)
  const [filterEngagementMinIG, setFilterEngagementMinIG] = useState(0)
  const [filterEngagementMaxIG, setFilterEngagementMaxIG] = useState(1)
  const [filterSubscriberMinYT, setFilterSubscriberMinYT] = useState(0)
  const [filterSubscriberMaxYT, setFilterSubscriberMaxYT] = useState(1)
  // ** Form Params
  const [formTagList, setFormTagList] = useState([])
  const [formRegionsList, setFormRegionsList] = useState([])
  const [formCitiesList, setFormCitiesList] = useState([])
  const emptyProfileObject = {
    contatti: "",
    interessiArray: [],
    nome: "",
    eta: "",
    stato: null,
    regioniArray: [],
    cittaArray: [],
    username_ig: null,
    username_ig_verified: null,
    username_tt: null,
    username_yt: null,
    username_yt_verified: null,
    follower_ig: null,
    engagement_ig: null,
    iscritti_yt: null,
    esito_ig: null,
    esito_yt: null,
  }
  // ** Modal State
  const [insertModalOpen, setInsertModalOpen] = useState(false)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [insertModalData, setInsertModalData] = useState([])
  const [updateModalData, setUpdateModalData] = useState({})
  const [updateModalDataCopy, setUpdateModalDataCopy] = useState({}) //copy for recognize updates
  // ** Column Actions
  const columnActions = [
    {
      name: "Azioni",
      allowOverflow: true,
      cell: (row) => {
        return (
          <div className="d-flex action-icons">
            <Button.Ripple
              color="flat-primary"
              onClick={() => {
                //format interessi, regioni, città in un array di options
                let profile = row
                if (profile.interessi) {
                  profile.interessiArray = profile.interessi.split(", ")
                  profile.interessiArray = profile.interessiArray.map((el) => ({ value: el, label: el }))
                } else profile.interessiArray = []
                if (profile.regione) {
                  profile.regioniArray = profile.regione.split(", ")
                  profile.regioniArray = profile.regioniArray.map((el) => ({ value: el, label: el }))
                } else profile.regioniArray = []
                if (profile.citta) {
                  profile.cittaArray = profile.citta.split(", ")
                  profile.cittaArray = profile.cittaArray.map((el) => ({ value: el, label: el }))
                } else profile.cittaArray = []
                profile.statoOption = {
                  value: profile.stato,
                  label: profile.stato == 2 ? "In domini" : profile.stato == 1 ? "Con agenzia" : "Senza agenzia",
                }
                // add properties for monitor scraping retries and errors
                profile.scrapeRetries = 0
                profile.scrapeErrors = 0

                setUpdateModalOpen(true)
                setUpdateModalData(profile)
                setUpdateModalDataCopy(profile)
              }}
            >
              <Edit size={15} className="text-primary" />
            </Button.Ripple>
            <Button.Ripple
              color="flat-danger"
              onClick={() =>
                deleteProfile(row.id_influencer, row.username_ig ? row.username_ig : row.username_tt ? row.username_tt : row.username_yt)
              }
            >
              <Trash size={15} className="text-danger" />
            </Button.Ripple>
          </div>
        )
      },
    },
  ]

  // ** main use effect
  useEffect(() => {
    console.log("IS_SOCIAL_ACTIVE: ", process.env)
    fetchProfiles()
    getLuoghi()
    getTag()
    let empty = [emptyProfileObject]
    empty.scrapeRetries = 0
    empty.scrapeErrors = 0
    setInsertModalData(empty)
  }, [])

  // ** Function for fetch table data
  const fetchProfiles = () => {
    // ** GET DATA
    Axios.post(themeConfig.app.serverUrl + "getInfluencers")
      .then((res) => {
        if (res) {
          let result = res.data
          console.log(result)

          if (!res.data) return

          // ** FILTER
          // set state options for filters
          setTagOptions(result.tagOptions)
          setRegionOptions(result.regionOptions)
          // set state var for max values
          setFollowerMaxIG(result.followerMaxIG)
          setEngagementMaxIG(result.engagementMaxIG)
          setSubscriberMaxYT(result.subscriberMaxYT)
          // set state var for filters (default values)
          setFilterFollowerMaxIG(result.followerMaxIG)
          setFilterEngagementMaxIG(result.engagementMaxIG)
          setFilterSubscriberMaxYT(result.subscriberMaxYT)

          // ** SCRAPING
          // set state var for profiles not scraped or not found
          setInfluencerNotScraped(result.influencerNotScraped)
          setInfluencerNotFound(result.influencerNotFound)

          // ** SET ata
          setData(result.profileList)
          setFilteredData(result.profileList)
        } else {
          handleMessage("error", "Errore!", "Qualcosa è andato storto :(")
        }
      })
      .catch((err) => {
        handleMessage("error", "Errore!", "Qualcosa è andato storto :(")
      })
  }

  // ** Function for fecth region and cities
  const getLuoghi = () => {
    Axios.post(themeConfig.app.serverUrl + "getLuoghi")
      .then((res) => {
        if (res) {
          let result = res.data
          setFormRegionsList(result.regioni)
          setFormCitiesList(result.citta)
        } else {
          handleMessage("error", "Errore!", "Qualcosa è andato storto :(")
        }
      })
      .catch((err) => {
        handleMessage("error", "Errore!", "Qualcosa è andato storto :(")
      })
  }

  // ** Function for fecth tags
  const getTag = () => {
    Axios.post(themeConfig.app.serverUrl + "getTag")
      .then((res) => {
        if (res) {
          let result = res.data
          setFormTagList(result)
        } else {
          handleMessage("error", "Errore!", "Qualcosa è andato storto :(")
        }
      })
      .catch((err) => {
        handleMessage("error", "Errore!", "Qualcosa è andato storto :(")
      })
  }

  // ** delete profile
  const deleteProfile = async (id, name) => {
    const result = await MySwal.fire({
      title: "Eliminare @" + name + "?",
      text: "Cancellerai il profilo dalla lista degli influencer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, Eliminalo!",
      cancelButtonText: "No, Annulla!",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-primary ms-1",
      },
      buttonsStyling: false,
    })
    if (result.value) {
      Axios.post(themeConfig.app.serverUrl + "deleteInfluencer", { id_influencer: id })
        .then((res) => {
          if (res) {
            fetchProfiles()
            resetFilters()
            setIsFilterOpen(false)
            handleMessage("success", "Eliminato!", 'Ci siamo "occupati" di @' + name + " ;)")
          } else {
            handleMessage("error", "Errore!", "Qualcosa è andato storto :(")
          }
        })
        .catch((err) => {
          handleMessage("error", "Errore!", "Qualcosa è andato storto :(")
        })
    } else if (result.dismiss === MySwal.DismissReason.cancel) {
      MySwal.fire({
        title: "Operazione annullata",
        text: "L'influencer è salvo, per ora :)",
        icon: "info",
        customClass: {
          confirmButton: "btn btn-info",
        },
      })
    }
  }

  // ** scrape profile
  const updateProfileScrape = (id) => {
    console.log("scraping profile with id: " + id)
  }

  // ** reset filters
  const resetFilters = () => {
    setFilterName("")
    setFilterTag([])
    setFilterEta([])
    setFilterState([])
    setFilterRegion([])
    setIsInstragramChecked(false)
    setIsTiktokChecked(false)
    setIsYoutubeChecked(false)
    setFilterFollowerMinIG(0)
    setFilterFollowerMaxIG(followerMaxIG)
    setFilterEngagementMinIG(0)
    setFilterEngagementMaxIG(engagementMaxIG)
    setFilterSubscriberMinYT(0)
    setFilterSubscriberMaxYT(subscriberMaxYT)
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

  // ** Function to handle filter
  const handlePagination = (page) => {
    setCurrentPage(page.selected)
  }

  // ** Function to handle row expand
  const handleRowExpand = (row) => {
    if (currentRows.includes(row)) {
      const rows = currentRows.filter((item) => item !== row)
      setCurrentRows(rows)
    } else {
      setCurrentRows([...currentRows, row])
    }
  }

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={""}
      nextLabel={""}
      forcePage={currentPage}
      onPageChange={(page) => handlePagination(page)}
      pageCount={filteredData.length / 10 || 1}
      breakLabel={"..."}
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName="active"
      pageClassName="page-item"
      breakClassName="page-item"
      nextLinkClassName="page-link"
      pageLinkClassName="page-link"
      breakLinkClassName="page-link"
      previousLinkClassName="page-link"
      nextClassName="page-item next-item"
      previousClassName="page-item prev-item"
      containerClassName={"pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1"}
    />
  )

  return (
    <>
      <Card className="table-header">
        <CardHeader>
          <CardTitle tag="h1" style={{ fontSize: "20px" }}>
            Elenco Profili
            <small className="text-muted" style={{ marginLeft: "10px", fontSize: "16px" }}>
              {filteredData.length} risultat{filteredData.length === 1 ? "o" : "i"}
            </small>
          </CardTitle>
          <div id="table-action-container">
            {filterCounter > 0 && (
              <Button color="danger" outline style={{ marginRight: "10px" }} id="remove-filter" onClick={() => resetFilters()}>
                <MinusCircle size={18} className="me-50 vertical-align-text-bottom" /> Resetta filtri
              </Button>
            )}
            <Button color="primary" onClick={() => setIsFilterOpen(!isFilterOpen)} style={{ marginRight: "10px" }} id="control-filter">
              <Filter size={18} className="me-50 vertical-align-text-bottom" /> Filtri {filterCounter > 0 ? `(${filterCounter})` : ""}
            </Button>
            <Button color="primary" outline className="float-right" id="add-profile" onClick={() => setInsertModalOpen(true)}>
              <Plus size={18} className="me-50 vertical-align-text-bottom" /> Aggiungi profili
            </Button>
          </div>
        </CardHeader>
        <Filters
          isSocialActive={isSocialActive}
          // ** default profile data
          data={data}
          // ** update filtered profile data
          setFilteredData={setFilteredData}
          // ** select options
          tagOptions={tagOptions}
          regionOptions={regionOptions}
          // ** filters data and update functions
          isFilterOpen={isFilterOpen}
          setFilterCounter={setFilterCounter}
          filterName={filterName}
          setFilterName={setFilterName}
          filterTag={filterTag}
          setFilterTag={setFilterTag}
          filterEta={filterEta}
          setFilterEta={setFilterEta}
          filterState={filterState}
          setFilterState={setFilterState}
          filterRegion={filterRegion}
          setFilterRegion={setFilterRegion}
          isInstragramChecked={isInstragramChecked}
          setIsInstragramChecked={setIsInstragramChecked}
          isTiktokChecked={isTiktokChecked}
          setIsTiktokChecked={setIsTiktokChecked}
          isYoutubeChecked={isYoutubeChecked}
          setIsYoutubeChecked={setIsYoutubeChecked}
          filterFollowerMinIG={filterFollowerMinIG}
          setFilterFollowerMinIG={setFilterFollowerMinIG}
          filterFollowerMaxIG={filterFollowerMaxIG}
          setFilterFollowerMaxIG={setFilterFollowerMaxIG}
          filterEngagementMinIG={filterEngagementMinIG}
          setFilterEngagementMinIG={setFilterEngagementMinIG}
          filterEngagementMaxIG={filterEngagementMaxIG}
          setFilterEngagementMaxIG={setFilterEngagementMaxIG}
          filterSubscriberMinYT={filterSubscriberMinYT}
          setFilterSubscriberMinYT={setFilterSubscriberMinYT}
          filterSubscriberMaxYT={filterSubscriberMaxYT}
          setFilterSubscriberMaxYT={setFilterSubscriberMaxYT}
          // ** max values for filters range
          followerMaxIG={followerMaxIG}
          engagementMaxIG={engagementMaxIG}
          subscriberMaxYT={subscriberMaxYT}
        />
        <div className="react-dataTable">
          <DataTable
            noHeader
            pagination
            data={filteredData}
            expandableRows
            columns={[...columns, ...columnActions]}
            expandableRowExpanded={(row) => currentRows.includes(row)}
            expandOnRowClicked
            onRowClicked={(row) => handleRowExpand(row)}
            onRowExpandToggled={(bool, row) => handleRowExpand(row)}
            className="react-dataTable"
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            paginationDefaultPage={currentPage + 1}
            expandableRowsComponent={ExpandableTable}
            paginationRowsPerPageOptions={[10, 25, 50, 100]}
            noDataComponent={
              <center style={{ padding: "30px" }}>
                {data.length == 0 ? ( // se la tabella è vuota perchè deve ancora fare il fetch dei dati
                  <>
                    <h4>Caricamento...</h4>
                  </>
                ) : (
                  // se la tabella è vuota a causa dei filtri utilizzati
                  <>
                    <h2 style={{ marginBottom: "15px" }}>Nessun profilo trovato</h2>
                    <h5>
                      Prova ad utilizzare altri filtri o{" "}
                      <span style={{ color: "#ea5455", cursor: "pointer" }} onClick={() => resetFilters()}>
                        <u>Rimuovili</u>
                      </span>
                    </h5>
                  </>
                )}
              </center>
            }
          />
        </div>
      </Card>
      {/** SCRAPING STATUS */}
      {isSocialActive == true && <ScrapingStatus influencerNotFound={influencerNotFound} influencerNotScraped={influencerNotScraped} />}
      {/** MODALI */}
      <InsertProfileModal
        isSocialActive={isSocialActive}
        isOpen={insertModalOpen}
        setIsOpen={setInsertModalOpen}
        profilesArray={insertModalData}
        setProfilesArray={setInsertModalData}
        emptyProfileObject={emptyProfileObject}
        regions={formRegionsList}
        cities={formCitiesList}
        tag={formTagList}
        fetchProfiles={fetchProfiles}
      />
      <UpdateProfileModal
        isSocialActive={isSocialActive}
        isOpen={updateModalOpen}
        setIsOpen={setUpdateModalOpen}
        profile={updateModalData}
        profileCopy={updateModalDataCopy}
        setProfile={setUpdateModalData}
        setProfileCopy={setUpdateModalDataCopy}
        regions={formRegionsList}
        cities={formCitiesList}
        tag={formTagList}
        fetchProfiles={fetchProfiles}
      />
    </>
  )
}

export default Home
