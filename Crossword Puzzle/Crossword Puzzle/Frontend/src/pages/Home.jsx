import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Puzzle, 
  Users, 
  Trophy, 
  Share2, 
  BookOpen, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Custom Dictionaries',
      description: 'Create and manage your own word collections with custom clues for personalized crossword experiences.'
    },
    {
      icon: <Puzzle className="w-8 h-8" />,
      title: 'Smart Generation',
      description: 'Generate crossword puzzles of various sizes with intelligent word placement algorithms.'
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: 'Easy Sharing',
      description: 'Share puzzles instantly with shareable links and QR codes. No login required for solvers.'
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Leaderboards',
      description: 'Compete with others and track your progress on global leaderboards for each puzzle.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community',
      description: 'Join a community of puzzle enthusiasts and challenge friends with your creations.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Play',
      description: 'Start solving immediately with our responsive interface and real-time validation.'
    }
  ];

  const benefits = [
    'Create unlimited custom dictionaries',
    'Generate puzzles in multiple sizes (5x5 to 20x20)',
    'Real-time answer validation and scoring',
    'Share puzzles with anyone, anywhere',
    'Track progress on global leaderboards',
    'Mobile-friendly responsive design',
    'Dark/light mode support',
    'No ads or premium restrictions'
  ];

  return (
    <div className="space-y-24 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative text-center space-y-8 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-300 dark:bg-blue-800 rounded-full opacity-10 blur-3xl" />
        </div>
        <div className="relative z-10 space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Create & Share
            <span className="block text-blue-600 dark:text-blue-300">
              Amazing Crosswords
            </span>
          </h1>
          <p className="text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-medium">
            Build custom crossword puzzles with your own words and clues.<br />
            Share them instantly with friends, family, or the world.<br />
            No limits, no hassle, just pure puzzle fun.
          </p>
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          {isAuthenticated ? (
            <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:scale-105 transition-transform">
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:scale-105 transition-transform">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/login" className="bg-white dark:bg-gray-800 border border-blue-600 text-blue-700 dark:text-blue-300 text-lg px-8 py-3 rounded-lg flex items-center gap-2 shadow hover:scale-105 transition-transform">
                Sign In
              </Link>
            </>
          )}
        </div>
        
      </section>

      {/* Features Grid */}
      <section className="space-y-16 px-4">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Powerful features designed to make crossword creation and sharing effortless
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-8 flex flex-col items-center text-center border border-gray-100 dark:border-gray-700 hover:-translate-y-2 transform transition-transform"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-blue-50 dark:bg-blue-900/30 rounded-3xl p-10 md:p-16 max-w-6xl mx-auto shadow-xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Why Choose CrosswordGen?
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              We've built the most comprehensive and user-friendly crossword creation platform.<br />
              Here's what makes us different:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-800 dark:text-gray-200 text-base">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-5 gap-1 mb-4">
                {Array.from({ length: 25 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 border-2 border-gray-300 dark:border-gray-700 rounded-md ${
                      Math.random() > 0.3 ? 'bg-white dark:bg-gray-900' : 'bg-blue-200 dark:bg-blue-700'
                    }`}
                  />
                ))}
              </div>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Sample 5x5 Crossword Grid
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-8 py-20 px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Ready to Create Your First Crossword?
        </h2>
        <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Join thousands of puzzle creators and start building amazing crosswords today.<br />
          It's completely free to get started!
        </p>
        {!isAuthenticated && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform">
              Create Free Account
            </Link>
            <Link to="/login" className="bg-white dark:bg-gray-800 border border-blue-600 text-blue-700 dark:text-blue-300 text-lg px-8 py-3 rounded-lg shadow hover:scale-105 transition-transform">
              I Already Have an Account
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;