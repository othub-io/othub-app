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
  setIsActionOpen: () => { }
})

export const AccountProvider = ({ children }) => {
  const [balance, setBalance] = useState('')
  const [syncData, setSyncData] = useState('')
  const [syncStatus, setSyncStatus] = useState('')
  const [network, setNetwork] = useState('')
  const [blockchain, setBlockchain] = useState('')

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
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}
