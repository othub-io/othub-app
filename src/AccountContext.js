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
  setOpenNodePage: () => { }
})

export const AccountProvider = ({ children }) => {
  const [balance, setBalance] = useState('')
  const [syncData, setSyncData] = useState('')
  const [syncStatus, setSyncStatus] = useState('')
  const [network, setNetwork] = useState('')
  const [blockchain, setBlockchain] = useState('')
  const [open_node_page, setOpenNodePage] = useState('')

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
        setOpenNodePage: handleSetOpenNodePage
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}
