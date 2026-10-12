import './App.css'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Reservation from './pages/Rezerv.jsx'
import { LanguageProvider } from './i18n.jsx'

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'

  let page = <Home />
  if (path === '/about') {
    page = <About />
  } else if (path === '/rezerv') {
    page = <Reservation />
  }

  return <LanguageProvider>{page}</LanguageProvider>
}

export default App
