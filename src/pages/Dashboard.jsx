import { useState, useEffect } from 'react'
import axios from '../api/axios'
import toast from 'react-hot-toast'
import { ArrowTrendingUpIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const statCards = [
  { name: 'In Progress', icon: ArrowTrendingUpIcon, bgColor: 'bg-blue-500' },
  { name: 'Overdue', icon: ClockIcon, bgColor: 'bg-red-500' },
  { name: 'Completed', icon: CheckCircleIcon, bgColor: 'bg-green-500' },
]

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/tasks/stats')
      setStats(response.data)
    } catch (error) {
      toast.error('Failed to fetch task statistics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      <dl className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
          <dt>
            <div className="absolute rounded-md bg-blue-500 p-3">
              <ArrowTrendingUpIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">In Progress Tasks</p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">{stats?.inProgress || 0}</p>
          </dd>
        </div>

        <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
          <dt>
            <div className="absolute rounded-md bg-red-500 p-3">
              <ClockIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">ToDo Tasks</p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">{stats?.overdue || 0}</p>
          </dd>
        </div>

        <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
          <dt>
            <div className="absolute rounded-md bg-green-500 p-3">
              <CheckCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">Completed Tasks</p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">{stats?.done || 0}</p>
          </dd>
        </div>
      </dl>
    </div>
  )
}