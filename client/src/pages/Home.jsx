// import { useState } from 'react'
// import { useDatabase } from '../contexts/DatabaseContext'
// import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Banner from '../images/banner2.jpg'

const Home = () => {
    // const { users, items, shops, categories } = useDatabase()
    // const { currentUser } = useAuth()
    // const [search, setSearch] = useState('')


    return (
        <div className='page home-page'>
            <Navbar/>
            <div className='page-content'>
                <img className='banner' src={Banner} alt={'banner'} />
            </div>
            <Footer/>
        </div>
    )
}

export default Home