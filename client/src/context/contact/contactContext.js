/**
 * @Author: Ali
 * @Date:   2019-10-27T10:23:08+01:00
 * @Last modified by:   Ali
 * @Last modified time: 2019-10-27T11:11:31+01:00
 */

 // first step is creating the context object from react
import { createContext } from 'react'

const contactContext = createContext()

export default contactContext
//Every Context object comes with a Provider React component that allows consuming components to subscribe to context changes.
// means it has .Provider by default
//The defaultValue argument is only used when a component does not have a matching Provider above it in the tree.
