/**
 * @Author: Ali
 * @Date:   2019-10-28T09:23:53+01:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-28T09:42:20+01:00
 */
import React,{useState} from 'react'

const ContactForm = () => {
  const [contact,setContact] = useState({
    name:'',
    email:'',
    phone:'',
    type:'personal'
  })
  const {name,email,phone,type} = contact

  const onChange = e => setContact({...contact,[e.target.name]:e.target.value})

  return (
    <form action="">
      <h2 className="text-primary"> Add Contact </h2>
      <input type="text" placeholder="Name" name='name' value={name} onChange={onChange} />
      <input type="email" placeholder="Email" name='email' value={email} onChange={onChange} />
      <input type="text" placeholder="Phone" name='phone' value={phone} onChange={onChange} />
      <h5> Contact Type </h5>
      <input
        type="radio"
        name="type"
        value='personal'
        checked={type === 'personal'} /> Personal{' '}
      <input
        type="radio"
        name="type"
        value='proffessional'
        checked={type === 'proffessional'} /> Proffessional
      <div className="">
        <input type="submit" value="Add Contact" className="btn btn-primary btn-block"/>
      </div>
    </form>
  )
}
export default ContactForm
