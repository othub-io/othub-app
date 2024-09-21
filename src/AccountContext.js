import React, { createContext, useState } from 'react'

export const AccountContext = createContext({
  data: '',
  app_index: '',
  isRequestOpen: '',
  isCreateAppOpen: '',
  isAppSettingsOpen: '',
  isResultOpen: '',
  resultValue: '',
  isLoading:'',
  balance:'',
  isConnected:'',
  isActionOpen:'',
  open_node_page: '',
  open_edit_node: '',
  open_asset_page: '',
  open_view_asset: '',
  connected_blockchain: '',
  network: '',
  token: '',
  account: '',
  edit_profile: '',
  saved: '',
  open_publisher_page: '',
  selectedFile: '',
  displayContent: '',
  paranet: '',
  format: '',
  type: '',
  personFormData: '',
  eventFormData: '',
  organizationFormData: '',
  productFormData: '',
  open_delegator_stats : '',
  open_node_stats : '',
  open_delegator_settings : '',
  freeMint: '',
  mint: '',
  setData: () => { },
  setAppIndex: () => { },
  setIsResultOpen: () => { },
  setIsRequestOpen: () => { },
  setCreateAppPopup: () => { },
  setIsAppSettingsOpen: () => { },
  setResultValue: () => { },
  setIsLoading: () => { },
  setBalance: () => { },
  setIsConnected: () => { },
  setIsActionOpen: () => { },
  setOpenNodePage: () => { },
  setOpenEditNode: () => { },
  setOpenAssetPage: () => { },
  setOpenDelegatorSettings: () => { },
  setOpenDelegatorStats: () => { },
  setOpenNodeStats: () => { },
  setOpenViewAsset: () => { },
  setConnectedBlockchain: () => { },
  setNetwork: () => { },
  setToken: () => { },
  setAccount: () => { },
  setEditProfile: () => { },
  setSaved: () => { },
  setOpenPublisherPage: () => { },
  setSelectedFile: () => { },
  setDisplayContent: () => { },
  setParanet: () => { },
  setFormat: () => { },
  setType: () => { },
  setPersonFormData: () => { },
  setEventFormData: () => { },
  setOrganizationFormData: () => { },
  setProductFormData: () => { },
  setFreeMint: () => { },
  setMint: () => { }
})

export const AccountProvider = ({ children }) => {
  const [balance, setBalance] = useState('')
  const [syncData, setSyncData] = useState('')
  const [syncStatus, setSyncStatus] = useState('')
  const [network, setNetwork] = useState('')
  const [blockchain, setBlockchain] = useState('')
  const [open_node_page, setOpenNodePage] = useState('')
  const [open_asset_page, setOpenAssetPage] = useState(null)
  const [open_delegator_settings, setOpenDelegatorSettings] = useState(false)
  const [open_delegator_stats, setOpenDelegatorStats] = useState(false)
  const [open_node_stats, setOpenNodeStats] = useState(false)
  const [open_edit_node, setOpenEditNode] = useState(false)
  const [open_view_asset, setOpenViewAsset] = useState(false)
  const [connected_blockchain, setConnectedBlockchain] = useState(null)
  const [token, setToken] = useState(null)
  const [account, setAccount] = useState(null)
  const [edit_profile, setEditProfile] = useState(null)
  const [saved, setSaved] = useState(null)
  const [open_publisher_page, setOpenPublisherPage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [displayContent, setDisplayContent] = useState(null)
  const [paranet, setParanet] = useState({name: "No Paranet Selected"})
  const [format, setFormat] = useState(null)
  const [type, setType] = useState(null)
  const [freeMint, setFreeMint] = useState(null)
  const [mint, setMint] = useState(null)
  const [personFormData, setPersonFormData] = useState({
    "@context": "https://schema.org",
    "@type": "Person",
    name: "",
    image: "",
    description: "",
    location: {
      "@type": "Place",
      name: "",
      address: {
        "@type": "PostalAddress",
        streetAddress: "",
        addressLocality: "",
        postalCode: "",
        addressCountry: "",
      },
    },
    jobTitle: "",
    worksFor: {
      "@type": "Organization",
      name: "",
    },
    relatedTo: {
      "@type": "Person",
      name: [],
    },
    isPartOf: [],
  })

  const [eventFormData, setEventFormData] = useState({
    "@context": "https://schema.org",
    "@type": "Event",
    name: "",
    image: "",
    description: "",
    startDate: "",
    endDate: "",
    location: {
      "@type": "Place",
      name: "",
      address: {
        "@type": "PostalAddress",
        streetAddress: "",
        addressLocality: "",
        postalCode: "",
        addressCountry: "",
      },
    },
    organizer: {
      "@type": "Person",
      name: "",
    },
    sameAs: [],
    isPartOf: [],
  })

  const [organizationFormData, setOrganizationFormData] = useState({
    "@context": "https://schema.org",
    "@type": "",
    name: "",
    alternativeName: "",
    url: "",
    logo: "",
    description: "",
    contactPoint: [],
    sameAs: [],
    isPartOf: [],
  })

  const [productFormData, setProductFormData] = useState({
    "@context": "https://schema.org",
    "@type": "Product",
    name: "",
    brand: {
      "@type": "Brand",
      name: "",
    },
    url: "",
    image: "",
    description: "",
    offers: {
      "@type": "",
      url: "",
      priceCurrency: "",
      price: "",
      priceValidUntil: null,
      availability: "",
      itemCondition: "",
      lowPrice: "",
      highPrice: "",
      offerCount: "",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "",
      bestRating: "",
      worstRating: "",
      ratingCount: "",
    },
    review: [],
    isPartOf: [],
  })

  const handleSetBalance = balance => {
    setBalance(balance)
  }

  const handleSetSyncData = syncdata => {
    setSyncData(syncdata)
  }

  const handleSetSyncStatus = syncstatus => {
    setSyncStatus(syncstatus)
  }
  
  const handleSetNetwork = network => {
    setNetwork(network)
  }

  const handleSetBlockchain = blockchain => {
    setBlockchain(blockchain)
  }

  const handleSetOpenNodePage = open_node_page => {
    setOpenNodePage(open_node_page)
  }

  const handleSetOpenAssetPage = open_asset_page => {
    setOpenAssetPage(open_asset_page)
  }

  const handleSetOpenDelegatorSettings = open_delegator_settings => {
    setOpenDelegatorSettings(open_delegator_settings)
  }

  const handleSetOpenDelegatorStats = open_delegator_stats => {
    setOpenDelegatorStats(open_delegator_stats)
  }

  const handleSetOpenNodeStats = open_node_stats => {
    setOpenNodeStats(open_node_stats)
  }

  const handleSetOpenEditNode = open_edit_node => {
    setOpenEditNode(open_edit_node)
  }

  const handleSetOpenViewAsset = open_view_asset => {
    setOpenViewAsset (open_view_asset)
  }

  const handleSetConnectedBlockchain = connected_blockchain => {
    setConnectedBlockchain (connected_blockchain)
  }

  const handleSetToken = token => {
    setToken (token)
  }

  const handleSetAccount = account => {
    setAccount (account)
  }

  const handleSetEditProfile = edit_profile => {
    setEditProfile (edit_profile)
  }

  const handleSetSaved = saved => {
    setSaved (saved)
  }

  const handleSetOpenPublisherPage = open_publisher_page => {
    setOpenPublisherPage (open_publisher_page)
  }

  const handleSetSelectedFile = selectedFile => {
    setSelectedFile (selectedFile)
  }

  const handleSetDisplayContent = displayContent => {
    setDisplayContent (displayContent)
  }

  const handleSetParanet = paranet => {
    setParanet (paranet)
  }

  const handleSetFormat = format => {
    setFormat (format)
  }

  const handleSetType = type => {
    setType (type)
  }

  const handleSetPersonFormData = personFormData => {
    setPersonFormData (personFormData)
  }

  const handleSetEventFormData = eventFormData => {
    setEventFormData (eventFormData)
  }

  const handleSetOrganizationFormData = organizationFormData => {
    setOrganizationFormData (organizationFormData)
  }

  const handleSetProductFormData = productFormData => {
    setProductFormData (productFormData)
  }

  const handleSetFreeMint = freeMint => {
    setFreeMint (freeMint)
  }

  const handleSetMint = mint => {
    setMint (mint)
  }

  return (
    <AccountContext.Provider
      value={{
        balance,
        setBalance: handleSetBalance,
        syncData,
        setSyncData: handleSetSyncData,
        syncStatus,
        setSyncStatus: handleSetSyncStatus,
        network,
        setNetwork: handleSetNetwork,
        blockchain,
        setBlockchain: handleSetBlockchain,
        open_node_page,
        setOpenNodePage: handleSetOpenNodePage,
        open_asset_page,
        setOpenAssetPage: handleSetOpenAssetPage,
        open_delegator_settings,
        setOpenDelegatorSettings: handleSetOpenDelegatorSettings,
        open_delegator_stats,
        setOpenDelegatorStats: handleSetOpenDelegatorStats,
        open_node_stats,
        setOpenNodeStats: handleSetOpenNodeStats,
        open_edit_node,
        setOpenEditNode: handleSetOpenEditNode,
        open_view_asset,
        setOpenViewAsset: handleSetOpenViewAsset,
        connected_blockchain,
        setConnectedBlockchain: handleSetConnectedBlockchain,
        token,
        setToken: handleSetToken,
        account,
        setAccount: handleSetAccount,
        edit_profile,
        setEditProfile: handleSetEditProfile,
        saved,
        setSaved: handleSetSaved,
        open_publisher_page,
        setOpenPublisherPage: handleSetOpenPublisherPage,
        selectedFile,
        setSelectedFile: handleSetSelectedFile,
        displayContent,
        setDisplayContent: handleSetDisplayContent,
        paranet,
        setParanet: handleSetParanet,
        format,
        setFormat: handleSetFormat,
        type,
        setType: handleSetType,
        personFormData,
        setPersonFormData: handleSetPersonFormData,
        eventFormData,
        setEventFormData: handleSetEventFormData,
        organizationFormData,
        setOrganizationFormData: handleSetOrganizationFormData,
        productFormData,
        setProductFormData: handleSetProductFormData,
        freeMint,
        setFreeMint: handleSetFreeMint,
        mint,
        setMint: handleSetMint,
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}
