import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { isAuthenticated, setToken } from '../../utils/auth';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // If token exists and is valid, redirect to management page
    if (isAuthenticated()) {
      navigate('/management');
    }
  }, []);
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    // Add your login logic here
    try{
        const res = await login({username: email, password: password});

        // save token
        if(res.token)
        {
            setToken(res.token);
        }
        // redirect to management page
        navigate('/management');
    }
    catch(err: any){
        setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-linear-to-br from-blue-400 to-purple-600 fixed top-0 left-0 m-0 p-0">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Chào mừng trở lại</h2>
        {error && (
          <div className="text-red-600 bg-red-50 p-3 rounded-lg mb-5 text-center border border-red-200">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Tên đăng nhập</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your User Name"
              className="px-4 py-3 border border-gray-300 rounded-lg text-sm transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu của bạn"
              className="px-4 py-3 border border-gray-300 rounded-lg text-sm transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <button type="submit" className="bg-linear-to-r from-blue-500 to-purple-600 text-white py-3.5 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 mt-2">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
