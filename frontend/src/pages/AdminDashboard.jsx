import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Users, BookOpen, DollarSign, UserCheck } from 'lucide-react'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [pandits, setPandits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }
    fetchData()
  }, [user, navigate])

  const fetchData = async () => {
    try {
      const [statsRes, panditsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/pandits')
      ])
      setStats(statsRes.data)
      setPandits(panditsRes.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprovePandit = async (panditId, approved) => {
    try {
      await axios.patch(`/api/admin/pandits/${panditId}/approve`, { approved })
      fetchData()
    } catch (error) {
      alert('Failed to update pandit status')
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-2xl">Loading...</div></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-saffron-600">🕉️ Admin Dashboard</h1>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Overview</h2>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Users className="w-10 h-10 text-saffron-600 mb-2" />
            <h3 className="text-gray-600">Total Users</h3>
            <p className="text-3xl font-bold">{stats?.total_users || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <UserCheck className="w-10 h-10 text-green-600 mb-2" />
            <h3 className="text-gray-600">Total Pandits</h3>
            <p className="text-3xl font-bold">{stats?.total_pandits || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <BookOpen className="w-10 h-10 text-blue-600 mb-2" />
            <h3 className="text-gray-600">Total Bookings</h3>
            <p className="text-3xl font-bold">{stats?.total_bookings || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <DollarSign className="w-10 h-10 text-purple-600 mb-2" />
            <h3 className="text-gray-600">Total Revenue</h3>
            <p className="text-3xl font-bold">₹{stats?.total_revenue?.toLocaleString() || 0}</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-8 text-gray-800">Pandit Approvals</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pandits.map((pandit) => (
                <tr key={pandit.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{pandit.user?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{pandit.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm ${pandit.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {pandit.approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    {!pandit.approved && (
                      <button
                        onClick={() => handleApprovePandit(pandit.id, true)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                    )}
                    {pandit.approved && (
                      <button
                        onClick={() => handleApprovePandit(pandit.id, false)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
