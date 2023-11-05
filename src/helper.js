// Metodos de indexdb

let db = null;

export const openIndexDB = () => {
  return new Promise((resolve, reject) => {
    db = indexedDB.open('db_react', 1)

    db.addEventListener('error', (event) => {
      console.log('error', event.code)
      reject()
    })

    db.addEventListener('success', (event) => {
      db = event.target.result
      resolve()
    })

    db.addEventListener('upgradeneeded', (event) => {
      const database = event.target.result
      database.createObjectStore('user', { keyPath: 'id' })
    })
  })
}

export const addUser = (newUser) => {
  const transaction = db.transaction(['user'], 'readwrite')
  const user = transaction.objectStore('user')
  user.add(newUser)
}

export const getUsers = () => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['user'], "readonly");
    const user = transaction.objectStore('user');
    const getAllUsers = user.getAll();
    
    getAllUsers.onsuccess = (event) => {
      resolve(event.target.result)
    }
    
    getAllUsers.onerror = () => {
      console.error("Error al obtener los datos de la tabla");
      reject()
    }
  })
}

export const updateUser = (data) => {
  const transaction = db.transaction(['user'], "readwrite");
  const user = transaction.objectStore('user');
  const getUser = user.get(data.id);
  
  getUser.onsuccess = (event) => {
    const userResult = event.target.result;

    if(userResult) {
      console.log(data)
      const updateUser = user.put(data);

      updateUser.onsuccess = () => {
        console.log('Usuario actualizado')
      }

      updateUser.onerror = () => {
        console.log('Error al actualizar el usuario')
      }

    } else {
      console.log('Usuario no encontrado')
    }
  }
  
  getUser.onerror = () => {
    console.error("Error al obtener los datos de la tabla");
  }
}

export const deleteUser = (data) => {
  const transaction = db.transaction(['user'], "readwrite");
  const user = transaction.objectStore('user');
  const getUser = user.get(data.id);
  
  getUser.onsuccess = (event) => {
    const userResult = event.target.result;

    if(userResult) {
      console.log(data)
      const updateUser = user.delete(data.id);

      updateUser.onsuccess = () => {
        console.log('Usuario Eliminado')
      }

      updateUser.onerror = () => {
        console.log('Error al eliminar el usuario')
      }

    } else {
      console.log('Usuario no encontrado')
    }
  }
  
  getUser.onerror = () => {
    console.error("Error al obtener los datos de la tabla");
  }
}