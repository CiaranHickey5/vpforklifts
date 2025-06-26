import React from "react";
import { Phone, Mail, MapPin, Smartphone } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Contact Us</h1>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Get in Touch</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold">Telephone</p>
                    <a
                      href="tel:+35351293208"
                      className="text-blue-600 hover:underline"
                    >
                      +353 (0) 51 293 208
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold">Mobile</p>
                    <a
                      href="tel:+353872501934"
                      className="text-blue-600 hover:underline"
                    >
                      +353 (0) 87 250 1934
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <a
                      href="mailto:sales@virgilpowerforklifts.com"
                      className="text-blue-600 hover:underline"
                    >
                      sales@virgilpowerforklifts.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-gray-700">Waterford, Ireland</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Send Message</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <textarea
                rows="5"
                placeholder="Message"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              ></textarea>
              <button
                onClick={() =>
                  alert(
                    "Please call +353 (0) 51 293 208 or email sales@virgilpowerforklifts.com"
                  )
                }
                className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
