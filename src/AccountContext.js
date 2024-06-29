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
  open_asset_page: '',
  open_view_asset: '',
  connected_blockchain: '',
  token: '',
  account: '',
  edit_profile: '',
  saved: '',
  open_publisher_page: '',
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
  setOpenAssetPage: () => { },
  setOpenDelegateSettings: () => { },
  setOpenViewAsset: () => { },
  setConnectedBlockchain: () => { },
  setToken: () => { },
  setAccount: () => { },
  setEditProfile: () => { },
  setSaved: () => { },
  setOpenPublisherPage: () => { }
})

export const AccountProvider = ({ children }) => {
  const [balance, setBalance] = useState('')
  const [syncData, setSyncData] = useState('')
  const [syncStatus, setSyncStatus] = useState('')
  const [network, setNetwork] = useState('')
  const [blockchain, setBlockchain] = useState('')
  const [open_node_page, setOpenNodePage] = useState('')
  const [open_asset_page, setOpenAssetPage] = useState(null)
  const [open_delegator_settings, setOpenDelegateSettings] = useState(false)
  const [open_edit_node, setOpenEditNode] = useState(false)
  const [open_view_asset, setOpenViewAsset] = useState(false)
  const [connected_blockchain, setConnectedBlockchain] = useState(null)
  const [token, setToken] = useState(null)
  const [account, setAccount] = useState(null)
  const [edit_profile, setEditProfile] = useState(null)
  const [saved, setSaved] = useState(null)
  const [open_publisher_page, setOpenPublisherPage] = useState(null)

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

  const handleSetOpenDelegateSettings = open_delegator_setings => {
    setOpenDelegateSettings(open_delegator_setings)
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
        setOpenDelegateSettings: handleSetOpenDelegateSettings,
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
        setOpenPublisherPage: handleSetOpenPublisherPage
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}
