import { useEffect, useState } from 'react'
import './App.css'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Reservation from './pages/Rezerv.jsx'
import Hookah from './pages/Hookah.jsx'
import Admin from './pages/Admin.jsx'
import { LanguageProvider } from './i18n.jsx'
import { NavigationProvider } from './navigation.jsx'
import { useNavigation } from './useNavigation.js'
import SiteLoader from './components/SiteLoader.jsx'

function AppContent() {
  const { location } = useNavigation()
  const [isLoading, setIsLoading] = useState(true)
  const path = location.pathname

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1300)
    return () => window.clearTimeout(timer)
  }, [])

  let page = <Home />
  if (path === '/admin') {
    page = <Admin />
  } else if (path === '/about') {
    page = <About />
  } else if (path === '/rezerv') {
    page = <Reservation />
  } else if (path === '/hookah') {
    page = <Hookah />
  }

  return (
    <>
      {page}
      {isLoading && <SiteLoader />}
    </>
  )
}

function App() {
  return (
    <NavigationProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </NavigationProvider>
  )
}

export default App
