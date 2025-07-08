import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Aquí puedes agregar más rutas, por ejemplo:
        <Route path="/character/:id" element={<CharacterDetails />} /> 
        */}
      </Routes>
    </Router>
  )
}

export default App