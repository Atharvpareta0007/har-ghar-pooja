import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Calendar, MapPin, CheckCircle, XCircle } from 'lucide-react'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [pujas, setPujas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchData()
  }, [user, navigate])

  const fetchData = async () => {
    try {
      const [bookingsRes, pujasRes] = await Promise.all([
        axios.get('/api/bookings/my-bookings'),
        axios.get('/api/pujas')
      ])
      setBookings(bookingsRes.data)
      setPujas(pujasRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    try {
      await axios.patch(`/api/bookings/${bookingId}/cancel`)
      fetchData()
    } catch (error) {
      alert('Failed to cancel booking')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-saffron-600">🕉️ Har Ghar Pooja</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.name}</span>
            <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">My Bookings</h2>

        {bookings.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600 mb-4">You haven't booked any pujas yet</p>
            <a href="/#services" className="bg-saffron-500 text-white px-6 py-3 rounded-lg hover:bg-saffron-600 inline-block">
              Book a Puja
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-saffron-500">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {booking.puja_type?.name_local || 'Puja'}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>{new Date(booking.scheduled_at).toLocaleString()}</span>
                  </div>
                  {booking.address && (
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{booking.address}</span>
                    </div>
                  )}
                  <div className="text-2xl font-bold text-saffron-600 mt-3">
                    ₹{booking.price}
                  </div>
                </div>

                {booking.status === 'pending' && (
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Available Pujas</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pujas.slice(0, 6).map((puja) => (
              <div key={puja.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{puja.name_local}</h3>
                <p className="text-gray-600 mb-3">{puja.name_en}</p>
                <p className="text-2xl font-bold text-saffron-600 mb-4">₹{puja.default_price}</p>
                <button className="w-full bg-saffron-500 text-white py-2 rounded-lg hover:bg-saffron-600">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
