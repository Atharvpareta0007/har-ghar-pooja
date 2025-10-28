import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Users, Video, Phone, Mail } from 'lucide-react'
import Navbar from '../components/Navbar'
import PujaCard from '../components/PujaCard'
import axios from 'axios'

const pujas = [
  { name: 'पितृ शांति', price: 5100 },
  { name: 'नारायण बली', price: 21000 },
  { name: 'काल सर्प दोष', price: 4100 },
  { name: 'रुद्राभिषेक', price: '1100-11000' },
  { name: 'मंगल शांति', price: 3100 },
  { name: 'भात पूजन', price: 2100 },
  { name: 'ग्रहण दोष शांति', price: 2100 },
  { name: 'नवग्रह शांति', price: 2500 },
  { name: 'चांडाल दोष शांति', price: 2500 },
  { name: 'कुंभ विवाह', price: 3500 },
  { name: 'अर्क विवाह', price: 3100 },
  { name: 'वास्तु पूजन', price: 11000 },
  { name: 'ग्रह शांति', price: 1100 },
  { name: 'जप', price: '1000-51000' },
  { name: 'वैवाहिक एवं मांगलिक पूजन', price: 11000 },
]

const Home = () => {
  const [pujasData, setPujasData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/pujas').then(res => {
      setPujasData(res.data)
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">Har Ghar Pooja</span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 mb-4">AsthaSetu for Every Devotee</p>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Connecting devotion with digital convenience
            </p>
            <a href="#services" className="bg-primary-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary-600 transition inline-block shadow-md">
              Book a Pooja Now
            </a>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="mt-12">
            <div className="text-9xl">🪔</div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">About Us</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            AsthaSetu brings the divine experience home — book traditional rituals, consult trusted Pandits, and participate in live virtual pujas with ease. Our goal is to merge tradition with technology, making spiritual services accessible to everyone, everywhere.
          </p>
          <div className="mt-8 text-8xl">🛕</div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-8 rounded-xl shadow-lg border-2 border-primary-100">
              <div className="text-5xl mb-4">🕉️</div>
              <h3 className="text-2xl font-bold mb-3 text-primary-600">Puja Booking</h3>
              <p className="text-gray-600 mb-4">Book rituals for peace, prosperity, and health</p>
              <button className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 w-full shadow-md transition-colors">
                Book Now
              </button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-8 rounded-xl shadow-lg border-2 border-primary-100">
              <div className="text-5xl mb-4">🙏</div>
              <h3 className="text-2xl font-bold mb-3 text-primary-600">Pandit Consultation</h3>
              <p className="text-gray-600 mb-4">Consult verified Pandits for personalized guidance</p>
              <button className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 w-full shadow-md transition-colors">
                Book Now
              </button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-8 rounded-xl shadow-lg border-2 border-primary-100">
              <div className="text-5xl mb-4">🌐</div>
              <h3 className="text-2xl font-bold mb-3 text-primary-600">Virtual Pooja</h3>
              <p className="text-gray-600 mb-4">Participate in live-streamed pujas from home</p>
              <button className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 w-full shadow-md transition-colors">
                Book Now
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Sacred Pujas</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🕉️</div>
              <p className="text-xl text-gray-600">Loading pujas...</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {pujasData.map((puja) => (
                <PujaCard key={puja.id} puja={puja} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Testimonials</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Rajesh Kumar', text: 'Beautiful experience, very authentic service' },
              { name: 'Priya Sharma', text: 'The pandits are knowledgeable and respectful' },
              { name: 'Amit Patel', text: 'Easy booking process, great platform' },
            ].map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md">
                <p className="text-gray-600 mb-4 italic">"{t.text}"</p>
                <p className="font-bold text-primary-600">- {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Contact Us</h2>
          <form className="space-y-4">
            <input type="text" placeholder="Name" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            <input type="email" placeholder="Email" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            <input type="tel" placeholder="Phone" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            <textarea placeholder="Message" rows="4" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"></textarea>
            <button type="submit" className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 font-semibold shadow-md transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-4">&copy; 2025 Har Ghar Pooja. All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="hover:text-primary-400 transition-colors">Instagram</a>
            <a href="#" className="hover:text-primary-400 transition-colors">YouTube</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Facebook</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
