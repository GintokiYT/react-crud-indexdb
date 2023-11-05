import { useEffect, useState } from 'react'
import { openIndexDB, addUser, getUsers, updateUser, deleteUser } from './helper'

const App = () => {

  const [ users, setUsers ] = useState([])
  const [ name, setName ] = useState('')
  const [ editUser, setEditUser ] = useState({})

  const handleSubmit = (event) => {
    event.preventDefault()

    if(name.trim().length === 0) return

    if(Object.keys(editUser).length === 0) {
      console.log('Registrar')
      const newUser = {
        id: crypto.randomUUID(),
        name: name,
        createAt: Date.now()
      }
      setUsers((state) => [...state, newUser])
      addUser(newUser)
    } else {
      console.log('Actualizar')
      const userUpdate = {
        id: editUser.id,
        name: name,
        createAt: editUser.createAt
      }
      setUsers((state) => state.map(user => user.id === editUser.id ? userUpdate : user));
      updateUser(userUpdate)
      setEditUser({})
    }
    setName('')
  }

  const handleEdit = (user) => {
    setEditUser(user)
    setName(user.name)
  }

  const handleDelete = (user) => {
    deleteUser(user);
    setUsers((state) => state.filter( userState => userState.id !== user.id ))
  }

  useEffect(() => {
    openIndexDB().finally(() => {
      getUsers().then(data => {
        const sortData = data.sort((a, b) => a.createAt - b.createAt)
        setUsers(sortData)
      })
    })
  }, [])

  return (
    <div className='container w-100 vh-100 text-white'>
      <div className='row'>
        <div className='col-12 col-md-6'>
          <h1 className='mt-5'>React Crud IndexDB</h1>
          <form className='mt-3' onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fs-4" htmlFor="nombre">Nombre</label>
              <input 
                className='form-control'
                type="text" 
                id='name'
                placeholder='Ingresa tu nombre' 
                value={name} 
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <button className="btn btn-primary" type="submit">
              { Object.keys(editUser).length === 0 ? 'Guardar' : 'Actualizar' }
            </button>
          </form>
        </div>
        <div className='col-12 col-md-6 mt-5 mb-5'>
          <div className='d-flex flex-column gap-3'>
            { users.map( user => (
              <div className='card p-4' key={user.id}>
                <p className='text-left'>
                  <span className='fw-bold'>Nombre: </span>
                  { user.name }
                </p>
                <div className='d-flex gap-2'>
                  <button 
                    className='flex-fill btn btn-warning fw-bold text-white' 
                    onClick={() => handleEdit(user)}
                  >Editar</button>
                  <button 
                    className='flex-fill btn btn-danger fw-bold text-white' 
                    onClick={() => handleDelete(user)}
                  >Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App