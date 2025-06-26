import React from 'react';
import { ShoppingCart, Truck, Wrench } from 'lucide-react';
import { useApp } from '../context/AppContext';

const HomePage = () => {
  const { navigateTo } = useApp();
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Forklift hire from €80 per week
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              We are specialists in the supply and hire of new and refurbished forklifts for industry and small independent trader
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigateTo('shop')} className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
                View Products
              </button>
              <a href="tel:+35351293208" className="bg-blue-700 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-800 transition-colors">
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Sales</h3>
              <p className="text-gray-600 mb-4">
                Do you need a Quote for repair of your existing machinery and supply of your future requirement
              </p>
              <button onClick={() => navigateTo('shop')} className="text-blue-600 hover:underline">
                Browse Products →
              </button>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Plant Hire</h3>
              <p className="text-gray-600 mb-4">
                In the event of a breakdown of one of your forklifts we always have a replacement forklift in stock
              </p>
              <button onClick={() => navigateTo('contact')} className="text-blue-600 hover:underline">
                Hire Enquiry →
              </button>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Service</h3>
              <p className="text-gray-600 mb-4">
                Professional maintenance and repair services with a low loader to deliver / collect same
              </p>
              <button onClick={() => navigateTo('contact')} className="text-blue-600 hover:underline">
                Service Enquiry →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Call Today!</h2>
          <p className="text-5xl font-bold mb-8">+353 (0) 51 293 208</p>
          <a href="tel:+35351293208" className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors inline-block">
            Call Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default HomePage;