import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { imageBufferToUrl } from '../utils/imageHandle'
import UserDefault from '../images/user_default.png'

const ClimberCard = ({ climber }) => {
    console.log(climber);
    
    const imageURL = imageBufferToUrl(climber.profile)

    return (
        <div className='climber-card-container'>
            <Link to={`/climber/${climber.id}`}>
                <div className='climber-card'>
                    <div className='image-preview'>
                        { imageURL ?
                            <img src={imageURL} alt={climber.id} />
                            : <img src={UserDefault} alt={climber.id} />
                        }
                    </div>
                    <div className='name'>
                        <span>{climber.name}</span>
                    </div>
                    { !climber.crew && <>
                        { climber.lead ?
                            <div className='lead-section lead'>מוביל</div>
                            : <div className='lead-section no-lead'>לא מוביל</div>
                        }
                    </>}
                </div>
            </Link>
        </div>
    )
}

ClimberCard.propTypes = {
    climber: PropTypes.object.isRequired,
}

export default ClimberCard