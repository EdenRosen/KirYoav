// import { useState } from 'react'
// import { useDatabase } from '../contexts/DatabaseContext'
// import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Home = () => {
    // const { users, items, shops, categories } = useDatabase()
    // const { currentUser } = useAuth()
    // const [search, setSearch] = useState('')


    return (
        <div className='page home-page'>
            <Navbar/>
            <div className='shop-list expand-content'>
                hiii
            </div>
            <Footer/>
        </div>
    )
}

export default Home