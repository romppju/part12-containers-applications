import { useState, useEffect } from 'react'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notification, setNotification] = useState({
    message: '',
    success: true,
  })

  useEffect(() => {
    personService.getAll().then((returnedPersons) => {
      setPersons(returnedPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const names = persons.map((p) => p.name)

    if (names.includes(newName)) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, ` +
            `replace the old number with a new one?`
        )
      ) {
        const person = persons.find((p) => p.name === newName)
        const id = person.id
        const changedPerson = { ...person, number: newNumber }

        personService
          .update(id, changedPerson)
          .then((returnedPerson) => {
            setPersons(persons.map((p) => (p.id !== id ? p : returnedPerson)))
            setNotification({ message: `Updated ${newName}`, success: true })
            setTimeout(() => {
              setNotification({ message: '', success: true })
            }, 5000)
          })
          .catch((error) => {
            setNotification({
              message:
                `Information of ${newName} ` +
                `has already been removed from server`,
              success: false,
            })
            setTimeout(() => {
              setNotification({ message: '', success: true })
            }, 5000)
          })
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      }
      personService
        .create(personObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson))

          setNotification({ message: `Added ${newName}`, success: true })
          setTimeout(() => {
            setNotification({ message: '', success: true })
          }, 5000)
        })
        .catch((error) => {
          console.log(error.response.data)
          setNotification({
            message: error.response.data.error,
            success: false,
          })
          setTimeout(() => {
            setNotification({ message: '', success: true })
          }, 5000)
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handleDeleteOf = (id) => {
    const personToBeDeleted = persons.find((p) => p.id === id)

    if (window.confirm(`Delete ${personToBeDeleted.name}`)) {
      personService.remove(id).then((returnedPersons) => {
        setPersons(persons.filter((p) => p.id !== id))
        setNotification({
          message: `Deleted ${personToBeDeleted.name}`,
          success: true,
        })
        setTimeout(() => {
          setNotification({ message: '', success: true })
        }, 5000)
      })
    }
  }

  const personsToShow =
    newFilter === ''
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(newFilter.toLowerCase())
        )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notification.message}
        success={notification.success}
      />
      <Filter handleChange={handleFilterChange} />
      <h2>add a new number</h2>
      <PersonForm
        add={addPerson}
        name={newName}
        nameChange={handleNameChange}
        number={newNumber}
        numberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Numbers persons={personsToShow} handleDelete={handleDeleteOf} />
    </div>
  )
}

const Person = (props) => {
  return (
    <p>
      {props.name} {props.number}
      <button onClick={props.handleDelete}>delete</button>
    </p>
  )
}

const Filter = ({ handleChange }) => {
  return (
    <div>
      filter shown with <input onChange={handleChange} />
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.add}>
      <div>
        name: <input value={props.name} onChange={props.nameChange} />
      </div>
      <div>
        number: <input value={props.number} onChange={props.numberChange} />
      </div>
      <div>
        <button type='submit'>add</button>
      </div>
    </form>
  )
}

const Numbers = (props) => {
  return (
    <div>
      {props.persons.map((p) => (
        <Person
          key={p.name}
          name={p.name}
          number={p.number}
          handleDelete={() => props.handleDelete(p.id)}
        />
      ))}
    </div>
  )
}

const Notification = ({ message, success }) => {
  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    padding: 10,
    marginBottom: 10,
  }

  if (!success) {
    notificationStyle.color = 'red'
  }

  if (message === '') {
    return null
  }

  return <div style={notificationStyle}>{message}</div>
}

export default App
