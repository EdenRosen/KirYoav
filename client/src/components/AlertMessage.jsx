import { GoAlertFill } from "react-icons/go"

const AlertMessage = ({ text }) => {
    return (
        <div className="alert-message">
            <GoAlertFill/>
            <p>{ text }</p>
        </div>
    )
}

export default AlertMessage