import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const AgentProfile: React.FC = () => {
  const { agent, user, updateAgentProfile, signOut } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(agent?.name || '')
  const [npnNumber, setNpnNumber] = useState(agent?.npn_number || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const { error } = await updateAgentProfile(name, npnNumber)

    if (error) {
      setError(error.message)
    } else {
      setSuccess('Profile updated successfully!')
      setIsEditing(false)
    }

    setLoading(false)
  }

  const handleCancel = () => {
    setName(agent?.name || '')
    setNpnNumber(agent?.npn_number || '')
    setIsEditing(false)
    setError('')
    setSuccess('')
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Agent Profile</h2>
            <button
              onClick={() => signOut()}
              className="text-sm text-red-600 hover:text-red-500"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="px-6 py-4">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {!isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-sm text-gray-900">{agent?.name || 'Not set'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">NPN Number</label>
                <p className="mt-1 text-sm text-gray-900">{agent?.npn_number || 'Not set'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Member Since</label>
                <p className="mt-1 text-sm text-gray-900">
                  {agent?.created_at ? new Date(agent.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-500">{user?.email} (cannot be changed)</p>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="npn" className="block text-sm font-medium text-gray-700">
                  NPN Number
                </label>
                <input
                  id="npn"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={npnNumber}
                  onChange={(e) => setNpnNumber(e.target.value)}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default AgentProfile
