import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import SignUpIllustration from '../../assets/signup-illustration.svg';
import ExorixLogo from '../../assets/exorix-logo.svg';
import { signUp } from '../../firebase';

const SignUp = () => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const result = await signUp(email, password, firstName, lastName);
      if (result.success) {
        navigate('/profile');
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Left Side - Illustration & Welcome Text */}
      <div className="md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
        <div className="max-w-md text-center md:text-left">
          <Link to="/" className="inline-block mb-8">
            <img
              src={ExorixLogo}
              alt="Exorix"
              className="h-12 w-auto dark:text-white text-gray-900"
            />
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Join the Exorix Community
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Create your Exorix account and embark on a journey of endless possibilities.
          </p>
          <div className="relative w-full max-w-md mx-auto">
            <img
              src={SignUpIllustration}
              alt="Welcome illustration"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Your Exorix Account</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                  Sign in
                </Link>
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSignUp}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    required
                    className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    className="pl-10 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  I agree to the{' '}
                  <a href="#" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <img className="h-5 w-5" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" />
                </button>
                <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <img className="h-5 w-5" src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook logo" />
                </button>
                <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <img className="h-5 w-5" src="https://www.svgrepo.com/show/475689/twitter-color.svg" alt="Twitter logo" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 