// src/components/Footer.jsx
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

    return (
        <footer className="bg-black text-gray-300 py-10 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Horizontal Flex Layout */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                    {/* Brand Section */}
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-white mb-1">StoreRater</h3>
                        <p className="text-sm text-gray-400 max-w-xs">
                            Honest reviews. Real feedback. Better shopping.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
                        <button onClick={() => navigate('/')} className="hover:text-white transition duration-200">
                            Home
                        </button>
            
                        <button onClick={() => navigate('/login')} className="hover:text-white transition duration-200">
                            Login
                        </button>
            
                        <button onClick={() => navigate('/register')} className="hover:text-white transition duration-200">
                            Register
                        </button>
            
                        <button onClick={() => navigate('/stores')} className="hover:text-white transition duration-200">
                            All Stores
                        </button>
            
                        <button onClick={() => navigate('/privacy')} className="hover:text-white transition duration-200">
                            Privacy Policy
                        </button>
                    </div>

                    {/* Contact & Social */}
                    <div className="text-center md:text-right space-y-2">
                        <p className="text-sm">
                            <span className="text-gray-400">Contact:</span>{' '}
                            <a href="mailto:support@storerater.com" className="text-blue-400 hover:underline">
                                support@storerater.com
                            </a>
                        </p>

                        {/* Social Icons */}
                        <div className="flex justify-center md:justify-end space-x-5">
                            {/* Facebook */}
                            <a
                                href="#"
                                aria-label="Facebook"
                                className="text-gray-400 hover:text-blue-500 transition-transform hover:scale-110 duration-200"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 12.018v-8.388H7.078v-3.63h3.047V9.33c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.983h-1.51c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.63h-2.796v8.388C19.612 23.029 24 18.065 24 12.073z"/>
                                </svg>
                            </a>

                            {/* Twitter (X) */}
                            <a
                                href="#"
                                aria-label="Twitter"
                                className="text-gray-400 hover:text-cyan-400 transition-transform hover:scale-110 duration-200"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.061a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                            </a>

                            {/* LinkedIn - Correct Icon & Color */}
                            <a
                                href="#"
                                aria-label="LinkedIn"
                                className="text-gray-400 hover:text-blue-600 transition-transform hover:scale-110 duration-200"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-5 text-center text-xs text-gray-500">
                    &copy; {new Date().getFullYear()} <span className="text-white">StoreRater</span>. All rights reserved. 
                    Built with ❤️ for better customer experiences.
                </div>
            </div>
        </footer>
    );
}