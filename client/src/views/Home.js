import themeConfig from "@configs/themeConfig"
import Axios from "axios"
import React, { useEffect, useState } from "react"
import { ChevronDown, Filter, MinusCircle, Plus } from "react-feather"
import { Button, Card, CardHeader, CardTitle } from "reactstrap"
// ** Table columns & Expandable Data
import ExpandableTable, { columns } from "./data"

// ** Third Party Components
import DataTable from "react-data-table-component"
import "react-input-range/lib/css/index.css"
import ReactPaginate from "react-paginate"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

// ** Custom Components
import Filters from "./Filters"
import ScrapingStatus from "./ScrapingStatus"

const MySwal = withReactContent(Swal)

const Home = () => {
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
  const [followerMaxTT, setFollowerMaxTT] = useState(1)
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
  const [filterFollowerMinTT, setFilterFollowerMinTT] = useState(0)
  const [filterFollowerMaxTT, setFilterFollowerMaxTT] = useState(1)
  const [filterSubscriberMinYT, setFilterSubscriberMinYT] = useState(0)
  const [filterSubscriberMaxYT, setFilterSubscriberMaxYT] = useState(1)

  // ** main use effect
  useEffect(() => {
    // ** GET DATA
    Axios.post(themeConfig.app.serverUrl + "getInfluencers").then((res) => {
      if (res) {
        let result = res.data
        console.log(result)

        // ** FILTER
        // set state options for filters
        setTagOptions(result.tagOptions)
        setRegionOptions(result.regionOptions)
        // set state var for max values
        setFollowerMaxIG(result.followerMaxIG)
        setEngagementMaxIG(result.engagementMaxIG)
        setFollowerMaxTT(result.followerMaxTT)
        setSubscriberMaxYT(result.subscriberMaxYT)
        // set state var for filters (default values)
        setFilterFollowerMaxIG(result.followerMaxIG)
        setFilterEngagementMaxIG(result.engagementMaxIG)
        setFilterFollowerMaxTT(result.followerMaxTT)
        setFilterSubscriberMaxYT(result.subscriberMaxYT)

        // ** SCRAPING
        // set state var for profiles not scraped or not found
        setInfluencerNotScraped(result.influencerNotScraped)
        setInfluencerNotFound(result.influencerNotFound)

        // ** SET ata
        setData(result.profileList)
        setFilteredData(result.profileList)
      } else {
        console.log("Error")
      }
    })
  }, [])

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
    setFilterFollowerMinTT(0)
    setFilterFollowerMaxTT(followerMaxTT)
    setFilterSubscriberMinYT(0)
    setFilterSubscriberMaxYT(subscriberMaxYT)
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
            Elenco Profili{" "}
            <small className="text-muted" style={{ marginLeft: "5px", fontSize: "16px" }}>
              {filteredData.length} risultat{filteredData.length === 1 ? "o" : "i"}
            </small>
          </CardTitle>
          <div>
            {filterCounter > 0 && (
              <Button color="danger" outline style={{ marginRight: "10px" }} id="remove-filter" onClick={() => resetFilters()}>
                <MinusCircle size={18} className="me-50 vertical-align-text-bottom" /> Resetta filtri
              </Button>
            )}
            <Button color="primary" onClick={() => setIsFilterOpen(!isFilterOpen)} style={{ marginRight: "10px" }} id="control-filter">
              <Filter size={18} className="me-50 vertical-align-text-bottom" /> Filtri {filterCounter > 0 ? `(${filterCounter})` : ""}
            </Button>
            <Button color="primary" outline className="float-right" id="add-profile">
              <Plus size={18} className="me-50 vertical-align-text-bottom" /> Aggiungi profilo
            </Button>
          </div>
        </CardHeader>
        <Filters
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
          filterFollowerMinTT={filterFollowerMinTT}
          setFilterFollowerMinTT={setFilterFollowerMinTT}
          filterFollowerMaxTT={filterFollowerMaxTT}
          setFilterFollowerMaxTT={setFilterFollowerMaxTT}
          filterSubscriberMinYT={filterSubscriberMinYT}
          setFilterSubscriberMinYT={setFilterSubscriberMinYT}
          filterSubscriberMaxYT={filterSubscriberMaxYT}
          setFilterSubscriberMaxYT={setFilterSubscriberMaxYT}
          followerMaxIG={followerMaxIG}
          engagementMaxIG={engagementMaxIG}
          followerMaxTT={followerMaxTT}
          subscriberMaxYT={subscriberMaxYT}
        />
        <div className="react-dataTable">
          <DataTable
            noHeader
            pagination
            data={filteredData}
            expandableRows
            columns={columns}
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
                <h2 style={{ marginBottom: "15px" }}>Nessun profilo trovato</h2>
                <h5>
                  Prova ad utilizzare altri filtri o{" "}
                  <span style={{ color: "#ea5455", cursor: "pointer" }} onClick={() => resetFilters()}>
                    <u>Rimuovili</u>
                  </span>
                </h5>
              </center>
            }
          />
        </div>
      </Card>
      <ScrapingStatus influencerNotFound={influencerNotFound} influencerNotScraped={influencerNotScraped} />
    </>
  )
}

export default Home
