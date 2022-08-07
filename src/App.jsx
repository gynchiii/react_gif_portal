import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = 'gynchiii';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_GIFS = ['https://cdn.discordapp.com/attachments/1005314444722712576/1005348578069315665/YKVW8UJWAzgNhmNjGYRPwedkVFWcDVaTQYmzPHkrLcU.gif',
  'https://cdn.discordapp.com/attachments/1005314444722712576/1005349001501102141/82_1.gif',
  'https://cdn.discordapp.com/attachments/1005314444722712576/1005332059390230588/unknown.png'
]

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [gifLists, setGifLists] = useState([])
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found')

          const response = await solana.connect({ onlyIfTrusted: true })
          console.log('connected with publickey: ', response.publicKey.toString())
          setWalletAdress(response.publicKey.toString())
        } else {
          alert('Solana object not found, get a Phantom wallet')
        }
      }
    } catch {
      console.error(error)
    }
  }
  const connectWallet = async () => {
    const { solana } = window;
    if (solana) {
      const response = await solana.connect();
      console.log('connecteed with Public Key: ', response.publicKey.toString())
      setWalletAddress(response.publicKey.toString())
    }
  }
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect Wallet
    </button>
  )
  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('gif link:', inputValue)
      setGifLists([...gifLists, inputValue])
      setInputValue('')
    } else {
      console.log('input empty, try again')
    }
  }
  const onInputChange = event => {
    const { value } = event.target;
    setInputValue(value)
  }
  const renderConnectedContainer = () => (
    <div className='connected-container'>
      <form onSubmit={event => {
        event.preventDefault()
        sendGif()
      }} >
        <input type="text" onChange={onInputChange} value={inputValue} placeholder="enter gif link" />
        <button type="submit" className="cta-button submit-gif-button"> Submit </button>
      </form>
      <div className='gif-grid'>
        {gifLists.map(gif => (
          <div className='gif-item' key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div >
  )
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected()
    }
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])
  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching gif list...')

      setGifLists(TEST_GIFS)
    }
  }, [walletAddress])
  return (
    <div className="App" >
      <div className={walletAddress ? 'authed-container' : "container"}>
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >
            {`Adapted from @gynchiii`}</a>
        </div>
      </div>
    </div >
  );
};

export default App;
