// import { useState } from 'react'
// import { useDatabase } from '../contexts/DatabaseContext'
// import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ClimberCard from '../components/ClimberCard'

const Climbers = () => {
    // const { users, items, shops, categories } = useDatabase()
    // const { currentUser } = useAuth()
    // const [search, setSearch] = useState('')

    const climbers = [
        { id: 1, name: 'אדן', },
        { id: 2, name: 'אדן רוזן', lead: true},
        { id: 3, name: 'אדן', },
        { id: 4, name: 'אדן', },
        { id: 5, name: 'אדן', },
        { id: 6, name: 'אדן', },
        { id: 7, name: 'אדן', },
        { id: 8, name: 'אדן', },
        { id: 9, name: 'אדן', },
        { id: 10, name: 'אדן', },
        { id: 11, name: 'אדן', },
    ]

    const crew = [
        { id: 1, name: 'גבי', crew: true, boss: true},
        { id: 2, name: 'עמית', crew: true},
        { id: 3, name: 'ערן', crew: true},
    ]


    return (
        <div className='page climbers-page'>
            <Navbar/>
            <div className='page-content'>
                <h1>מטפסים</h1>
                <main>
                <div className='list-section'>
                    <h2>צוות</h2>
                    <div className='climbers-list'>
                        { crew.map(e => (
                            <div key={`crew${e.id}`}>
                                { ClimberCard({climber: e}) }
                            </div>
                        ))}
                    </div>    
                </div>
                <div className='list-section'>
                    <h2>מטפסים</h2>
                    <div className='climbers-list'>
                        { climbers.map(e => (
                            <div key={e.id}>
                                { ClimberCard({climber: e}) }
                            </div>
                        ))}
                    </div>    
                </div>
                </main>
            </div>
            <Footer/>
        </div>
    )
}

export default Climbers