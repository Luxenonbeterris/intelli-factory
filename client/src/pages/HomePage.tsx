export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero with background */}
      <div className="relative w-full">
        <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center py-20 px-4 w-full text-white">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4">
            Seamlessly source production worldwide
          </h2>
          <p className="max-w-xl text-lg mb-8">
            From placing requests to secure delivery — we take care of everything so you can focus
            on your business.
          </p>
          <a
            href="/login"
            className="bg-blue-600 text-white px-10 py-4 rounded-full shadow hover:bg-blue-700 transition"
          >
            Get Started
          </a>

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-5xl w-full">
            <div className="p-6 bg-white/80 backdrop-blur rounded shadow hover:scale-105 hover:shadow-xl transition flex flex-col items-center text-gray-900 border hover:border-blue-600">
              <img src="/global.svg" alt="Global reach" className="w-24 h-24 mb-4" />
              <h3 className="text-xl font-bold mb-2">Global reach</h3>
              <p className="text-center">
                Find manufacturers and clients across continents without barriers.
              </p>
            </div>
            <div className="p-6 bg-white/80 backdrop-blur rounded shadow hover:scale-105 hover:shadow-xl transition flex flex-col items-center text-gray-900 border hover:border-blue-600">
              <img src="/delivery.svg" alt="Integrated logistics" className="w-24 h-24 mb-4" />
              <h3 className="text-xl font-bold mb-2">Integrated logistics</h3>
              <p className="text-center">
                We handle delivery with trusted logistic partners worldwide.
              </p>
            </div>
            <div className="p-6 bg-white/80 backdrop-blur rounded shadow hover:scale-105 hover:shadow-xl transition flex flex-col items-center text-gray-900 border hover:border-blue-600">
              <img src="/secure.svg" alt="Secure contracts" className="w-24 h-24 mb-4" />
              <h3 className="text-xl font-bold mb-2">Secure contracts</h3>
              <p className="text-center">
                All transactions are protected under smart contracts and escrow.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Us */}
      <section id="about" className="py-20 bg-white text-gray-900 flex flex-col items-center px-4">
        <img src="/team.jpg" alt="Our team" className="rounded-lg shadow mb-6 w-full max-w-md" />
        <h2 className="text-3xl font-bold mb-6">About Us</h2>
        <p className="max-w-2xl text-center text-lg mb-6">
          We are a team of engineers and logistics experts dedicated to transforming global supply
          chains. Our platform connects businesses with top manufacturers and ensures hassle-free
          deliveries.
        </p>
        <img src="/factory.svg" alt="Factory illustration" className="w-48 opacity-80" />
      </section>

      {/* How it works */}
      <section
        id="how"
        className="py-20 bg-[#ffffff] bg-[url('/backgrnd.svg')] bg-repeat bg-center bg-cover text-gray-900 flex flex-col items-center px-4"
      >
        <h2 className="text-3xl text-white font-bold mb-6">How it works</h2>
        <img src="/workflow.svg" alt="Workflow diagram" className="w-64 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl">
          <div className="p-6 bg-white rounded shadow flex flex-col items-center hover:scale-105 transition">
            <img src="/contract.svg" alt="Post request" className="w-16 mb-4" />
            <h3 className="text-xl font-bold mb-2">1. Post your request</h3>
            <p className="text-center">
              Describe your manufacturing needs. We'll do the matchmaking.
            </p>
          </div>
          <div className="p-6 bg-white rounded shadow flex flex-col items-center hover:scale-105 transition">
            <img
              src="/containers.svg"
              alt="Offers"
              className="w-full h-32 object-cover rounded mb-4"
            />
            <h3 className="text-xl font-bold mb-2">2. Get best offers</h3>
            <p className="text-center">Receive proposals from vetted suppliers globally.</p>
          </div>
          <div className="p-6 bg-white rounded shadow flex flex-col items-center hover:scale-105 transition">
            <img src="/secure.svg" alt="Secure delivery" className="w-16 mb-4" />
            <h3 className="text-xl font-bold mb-2">3. Secure delivery</h3>
            <p className="text-center">
              We coordinate logistics and guarantee secure transactions.
            </p>
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section
        id="contacts"
        className="py-20 bg-white text-gray-900 flex flex-col items-center px-4"
      >
        <h2 className="text-3xl font-bold mb-6">Contacts</h2>
        <img
          src="/world-map.svg"
          alt="Global presence"
          className="w-full max-w-4xl mb-6 opacity-70"
        />
        <p className="max-w-xl text-center mb-4">
          Reach out to us at{' '}
          <a href="mailto:intellifactory@gmail.com" className="text-blue-600 underline">
            intellifactory@gmail.com
          </a>
        </p>
        <a
          href="/login"
          className="bg-blue-600 text-white px-8 py-3 rounded-full shadow hover:bg-blue-700 transition"
        >
          Contact Us
        </a>
      </section>
    </div>
  )
}
