import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AdminProvider } from './context/AdminContext'
import AdminLayout from './pages/AdminLayout'
import UserApp from './pages/UserApp'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <AdminProvider>
              <AdminLayout />
            </AdminProvider>
          }
        />
        <Route path="/*" element={<UserApp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App