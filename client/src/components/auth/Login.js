/**
 * @Author: Ali
 * @Date:   2019-10-30T04:43:59+01:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-30T05:00:35+01:00
 */
 import React,{ useState } from 'react'

 const Login = () => {
   const [user,setUser] = useState({
     email:'',
     password:''
   })
   const {email,password} = user

   const onChange = e => setUser({...user, [e.target.name]: e.target.value})
   const onSubmit = e => {
     e.preventDefault()
     //call method to register here
     console.log('sss');
   }
   return (
     <div className="form-container">
       <h1> Account <span className="text-primary">
         Login
       </span> </h1>
       <form onSubmit={onSubmit}>
         <div className="form-group">
           <label htmlFor="email">Email Address</label>
           <input type="email" name='email' value={email} onChange={onChange} />
         </div>
         <div className="form-group">
           <label htmlFor="password">Password</label>
           <input type="password" name='password' value={password} onChange={onChange} />
         </div>
         <input type="submit" value='Login'
         className='btn btn-primary btn-block' />
       </form>
     </div>
   )
 }
 export default Login