import axios from 'axios'
const url = 'http://localhost:3001/api/persons'
console.log('ENV', process.env)

const getAll = () => {
  const request = axios.get(url)
  return request.then((response) => response.data)
}

const create = (newObject) => {
  const request = axios.post(url, newObject)
  return request.then((response) => response.data)
}

const remove = (id) => {
  const removeUrl = `${url}/${id}`
  const request = axios.delete(removeUrl)
  return request.then((response) => response.data)
}

const update = (id, personObject) => {
  const request = axios.put(`${url}/${id}`, personObject)
  return request.then((response) => response.data)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, remove, update }
