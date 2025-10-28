import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { Calendar, Users, DollarSign, Check, X, Clock, MapPin, Video } from 'lucide-react'

const PanditDashboard = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [stats, setStats] = useState({ pending: 0, confirmed: 0, completed: 0, total_earnings: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'pandit') {
      navigate('/login')
      return
    }
    fetchData()
  }, [user, token, navigate])

  const fetchData = async () => {
    try {
      // Get pandit profile
      const profileRes = await axios.get('/api/pandits', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const panditProfile = profileRes.data.find(p => p.user.id === user.id)
      
      if (!panditProfile) {
        console.error('Pandit profile not found')
        setLoading(false)
        return
      }

      // Fetch pandit's bookings
      const bookingsRes = await axios.get(`/api/pandits/${panditProfile.id}/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBookings(bookingsRes.data)

      // Calculate stats
      const pending = bookingsRes.data.filter(b => b.status === 'pending').length
      const confirmed = bookingsRes.data.filter(b => b.status === 'confirmed').length
      const completed = bookingsRes.data.filter(b => b.status === 'completed').length
      const total_earnings = bookingsRes.data
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.price, 0)

      setStats({ pending, confirmed, completed, total_earnings })
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await axios.patch(`/api/bookings/${bookingId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      )
      fetchData() // Refresh data
    } catch (err) {
      console.error(err)
      alert('Failed to update booking status')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Pandit Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome, {user?.name} 🙏</p>
          </div>
          <button onClick={logout} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600">
            Logout
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🕉️</div>
            <p className="text-xl text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-500 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Pending</p>
                    <p className="text-3xl font-bold">{stats.pending}</p>
                  </div>
                  <Clock className="w-12 h-12 opacity-50" />
                </div>
              </div>

              <div className="bg-green-500 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Confirmed</p>
                    <p className="text-3xl font-bold">{stats.confirmed}</p>
                  </div>
                  <Check className="w-12 h-12 opacity-50" />
                </div>
              </div>

              <div className="bg-purple-500 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Completed</p>
                    <p className="text-3xl font-bold">{stats.completed}</p>
                  </div>
                  <Users className="w-12 h-12 opacity-50" />
                </div>
              </div>

              <div className="bg-saffron-500 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Earnings</p>
                    <p className="text-3xl font-bold">₹{stats.total_earnings.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-12 h-12 opacity-50" />
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-saffron-500 text-white px-6 py-4">
                <h2 className="text-2xl font-bold">My Bookings</h2>
              </div>
              <div className="p-6">
                {bookings.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-xl">No bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map(booking => (
                      <div key={booking.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-saffron-300 transition">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800">{booking.puja_type.name_local}</h3>
                            <p className="text-gray-600">{booking.puja_type.name_en}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-5 h-5 mr-2" />
                            <span>{new Date(booking.scheduled_at).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            {booking.is_virtual ? (
                              <><Video className="w-5 h-5 mr-2" /> Virtual Puja</>
                            ) : (
                              <><MapPin className="w-5 h-5 mr-2" /> In-Person</>
                            )}
                          </div>
                          <div className="flex items-center text-gray-600 font-semibold">
                            <DollarSign className="w-5 h-5 mr-1" />
                            ₹{booking.price}
                          </div>
                        </div>

                        {booking.address && (
                          <div className="mb-4 text-gray-600">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            {booking.address}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition flex items-center justify-center"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Accept
                              </button>
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition flex items-center justify-center"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Decline
                              </button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'completed')}
                              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Mark Complete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PanditDashboard
