import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane as Plant, Sprout, CloudSun, Database, TrendingUp, LineChart } from 'lucide-react';

const features = [
  {
    icon: <Plant className="w-6 h-6" />,
    title: 'Soil Testing',
    description: 'Schedule and analyze soil tests for optimal farming decisions',
  },
  {
    icon: <Sprout className="w-6 h-6" />,
    title: 'Crop Recommendations',
    description: 'Get AI-powered crop suggestions based on soil conditions',
  },
  {
    icon: <CloudSun className="w-6 h-6" />,
    title: 'Disease Detection',
    description: 'Early detection of crop diseases using advanced AI',
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: 'Treatment Plans',
    description: 'Customized fertilizer and soil treatment recommendations',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Yield Prediction',
    description: 'Accurate yield predictions using historical data',
  },
  {
    icon: <LineChart className="w-6 h-6" />,
    title: 'Market Insights',
    description: 'Real-time market prices and selling recommendations',
  },
];

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-green-600">SmartFarm AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/signin')}
                className="px-4 py-2 text-green-600 hover:text-green-700 font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Transform your farming with</span>
                  <span className="block text-green-600">AI-powered insights</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Optimize your agricultural practices with data-driven recommendations,
                  real-time monitoring, and predictive analytics.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button
                      onClick={() => navigate('/signup')}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      onClick={() => navigate('/signin')}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 md:py-4 md:text-lg md:px-10"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to succeed
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                      <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;