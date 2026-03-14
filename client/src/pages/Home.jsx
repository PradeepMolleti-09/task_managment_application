import React from 'react'
import NavBar from '../components/NavBar.jsx'
import Header from '../components/Header.jsx'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[#000414] relative overflow-hidden'>
        {/* Ambient Lighting */}
        <div className='absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none'></div>
        <div className='absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none'></div>
        
        <NavBar />
        <Header />
    </div>
  )
}

export default Home