import React, { useState, useEffect } from "react"
import Header from "./components/Header"
import Tasks from "./components/Tasks"
import AddTask from "./components/AddTask"
import Footer from "./components/Footer"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import About from "./components/About"
import Selector from "./components/Selector"

const App = () => {

  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])
  const [selectedSort, setSelectedSort] = useState('')

  useEffect(
    () => {
      const getTasks = async () => {
        const tasksFromServer = await fetchTasks()
        setTasks(tasksFromServer)
      }
      getTasks()
    }, []
  )

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    return data
  }

  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    return data
  }

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' })

    setTasks(tasks.filter(
      (task) => task.id !== id

    ))
  }

  const addTask = async (task) => {
    const res = await fetch(
      `http://localhost:5000/tasks`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(task)
      }
    )
    const data = await res.json()
    setTasks([...tasks, data])
  }

  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }
    const res = await fetch(
      `http://localhost:5000/tasks/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(updTask)
      }
    )
    const data = await res.json()

    setTasks(tasks.map(
      (task) => task.id === id ? { ...task, reminder: data.reminder } : task
    ))
  }

  const sortTasks = (sort) => {
    setSelectedSort(sort)
    setTasks([...tasks].sort((a, b) => a[sort].localeCompare(b[sort])))
  }

  return (
    <BrowserRouter>
      <div className="container">
        <Header
          showAdd={showAddTask}
          onAdd={() => setShowAddTask(!showAddTask)}
          title={"Task Tracker"} />
        <Selector
          defaultValue={'Sort by'}
          value={selectedSort}
          onChange={sortTasks}
          options={[
            { value: 'text', name: 'By name' },
            { value: 'day', name: 'By date' }
          ]} />
        <Routes>
          <Route
            path={'/'}
            exact
            element={
              <React.Fragment>
                {
                  showAddTask && <AddTask onAdd={addTask} />
                }
                {
                  tasks.length > 0 ?
                    <Tasks
                      tasks={tasks}
                      onDelete={deleteTask}
                      onToggle={toggleReminder} />
                    :
                    'No task to show'
                }
              </React.Fragment>
            } />
          <Route
            path={'/about'}
            element={<About />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App