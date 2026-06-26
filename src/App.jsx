import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import TransactionDetail from './pages/TransactionDetail'
import AddTransaction from './pages/AddTransaction'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transaction" element={<TransactionDetail />} />
        <Route path="/add" element={<AddTransaction />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
