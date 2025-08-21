import React, { useState } from 'react'
import { useAuth } from '../../contexts/ClerkAuthContext'
import { useClerk } from '@clerk/clerk-react'

const AgentProfile: React.FC = () => {
  const { agent, user, updateAgentProfile } = useAuth()
  const { signOut } = useClerk()
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
    <div className="max-w-2xl mx-auto">
      <div className="card fade-in">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Agent Profile</h2>
            <button
              onClick={() => signOut()}
              className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="card-body">
          {error && (
            <div className="alert alert-error mb-4">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success mb-4">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          )}

          {!isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{user?.primaryEmailAddress?.emailAddress || agent?.email}</p>
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
                  className="btn-primary"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-500">{user?.primaryEmailAddress?.emailAddress || agent?.email} (cannot be changed)</p>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
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
                  value={npnNumber}
                  onChange={(e) => setNpnNumber(e.target.value)}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary"
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
