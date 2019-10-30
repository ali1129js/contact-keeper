/**
 * @Author: Ali
 * @Date:   2019-10-30T05:21:00+01:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-30T05:27:06+01:00
 */
import React,{useContext} from 'react'
import AlertContext from '../../context/alert/alertContext'
const Alert = () => {
  const alertContext = useContext(AlertContext)

  return (
    alertContext.alerts.length > 0 && alertContext.alerts.map(alert =>
      <div key={alert.id} className={`alert alert-${alert.type}`}>
        <i className='fas fa-info-circle' /> {alert.msg}
      </div>
    )
  )
}
export default Alert
