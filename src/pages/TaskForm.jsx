import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../api/axios'
import toast from 'react-hot-toast'

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

export default function TaskForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [task, setTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    dueDate: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (id) {
      fetchTask()
    }
  }, [id])

  const fetchTask = async () => {
    try {
      const response = await axios.get(`/api/tasks/${id}`)
      const taskData = response.data
      setTask({
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString().split('T')[0],
      })
    } catch (error) {
      toast.error('Failed to fetch task')
      navigate('/tasks')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (id) {
        await axios.patch(`/api/tasks/${id}`, task)
        toast.success('Task updated successfully')
      } else {
        await axios.post('/api/tasks', task)
        toast.success('Task created successfully')
      }
      navigate('/tasks')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save task')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setTask((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            {id ? 'Edit Task' : 'Create Task'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="title"
              id="title"
              required
              value={task.title}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <div className="mt-2">
            <textarea
              name="description"
              id="description"
              rows={4}
              value={task.description}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <div className="mt-2">
            <select
              name="status"
              id="status"
              required
              value={task.status}
              onChange={handleChange}
              className="input-field"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="dueDate" className="form-label">
            Due Date
          </label>
          <div className="mt-2">
            <input
              type="date"
              name="dueDate"
              id="dueDate"
              required
              value={task.dueDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}