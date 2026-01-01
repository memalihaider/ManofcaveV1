'use client'

import { useState } from 'react'
import { 
  BriefcaseIcon, 
  UserGroupIcon, 
  PlusIcon, 
  TrashIcon, 
  PencilSquareIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  LinkIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { mockJobs, mockApplications } from '@/lib/mock-data'
import { format } from 'date-fns'

export default function CareersAdmin() {
  const [activeSubTab, setActiveSubTab] = useState<'applications' | 'jobs'>('applications')
  const [applications, setApplications] = useState(mockApplications)
  const [jobs, setJobs] = useState(mockJobs)
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [isJobModalOpen, setIsJobModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<any>(null)

  // Application handlers
  const handleUpdateAppStatus = (id: string, status: string) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app))
    if (selectedApplication?.id === id) {
      setSelectedApplication({ ...selectedApplication, status })
    }
  }

  const handleDeleteApplication = (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      setApplications(prev => prev.filter(app => app.id !== id))
      if (selectedApplication?.id === id) setSelectedApplication(null)
    }
  }

  // Job handlers
  const handleDeleteJob = (id: string) => {
    if (confirm('Are you sure you want to delete this job posting?')) {
      setJobs(prev => prev.filter(job => job.id !== id))
    }
  }

  const handleSaveJob = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const jobData = {
      id: editingJob?.id || `job-${Date.now()}`,
      title: formData.get('title') as string,
      department: formData.get('department') as string,
      location: formData.get('location') as string,
      type: formData.get('type') as string,
      description: formData.get('description') as string,
      requirements: (formData.get('requirements') as string).split('\n').filter(r => r.trim()),
      salary: formData.get('salary') as string,
      posted_at: editingJob?.posted_at || new Date().toISOString(),
      status: 'active'
    }

    if (editingJob) {
      setJobs(prev => prev.map(j => j.id === editingJob.id ? jobData : j))
    } else {
      setJobs(prev => [jobData, ...prev])
    }
    setIsJobModalOpen(false)
    setEditingJob(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Career Management</h2>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveSubTab('applications')}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeSubTab === 'applications' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserGroupIcon className="w-5 h-5 mr-2" />
            Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveSubTab('jobs')}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeSubTab === 'jobs' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BriefcaseIcon className="w-5 h-5 mr-2" />
            Job Postings ({jobs.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'applications' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications List */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Recent Applications</h3>
            </div>
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {applications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No applications found</div>
              ) : (
                applications.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApplication(app)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      selectedApplication?.id === app.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-gray-900">{app.full_name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        app.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                        app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 truncate">{app.job_title}</div>
                    <div className="text-xs text-gray-400 mt-2 flex items-center">
                      <ClockIcon className="w-3 h-3 mr-1" />
                      {format(new Date(app.applied_at), 'MMM d, yyyy')}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Application Detail */}
          <div className="lg:col-span-2">
            {selectedApplication ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedApplication.full_name}</h3>
                    <p className="text-blue-600 font-medium">{selectedApplication.job_title}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleUpdateAppStatus(selectedApplication.id, 'accepted')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Accept"
                    >
                      <CheckCircleIcon className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => handleUpdateAppStatus(selectedApplication.id, 'rejected')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Reject"
                    >
                      <XCircleIcon className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => handleDeleteApplication(selectedApplication.id)}
                      className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Contact Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-700">
                          <EnvelopeIcon className="w-5 h-5 mr-3 text-gray-400" />
                          {selectedApplication.email}
                        </div>
                        <div className="flex items-center text-gray-700">
                          <PhoneIcon className="w-5 h-5 mr-3 text-gray-400" />
                          {selectedApplication.phone}
                        </div>
                        <div className="flex items-center text-gray-700">
                          <GlobeAltIcon className="w-5 h-5 mr-3 text-gray-400" />
                          {selectedApplication.nationality}
                        </div>
                        {selectedApplication.linkedin && (
                          <div className="flex items-center text-gray-700">
                            <LinkIcon className="w-5 h-5 mr-3 text-gray-400" />
                            <a href={selectedApplication.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              LinkedIn Profile
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Professional Details</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">Experience</div>
                        <div className="font-semibold text-gray-900">{selectedApplication.experience}</div>
                      </div>
                      <a 
                        href={selectedApplication.resume_url} 
                        className="flex items-center justify-center w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        View Resume / CV
                      </a>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Cover Letter / Message</h4>
                    <div className="bg-gray-50 p-6 rounded-xl text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selectedApplication.cover_letter}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserGroupIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Select an application</h3>
                <p className="text-gray-500 mt-1">Choose an application from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditingJob(null)
                setIsJobModalOpen(true)
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Post New Job
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      <div className="text-xs text-gray-500">{job.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        {job.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(job.posted_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditingJob(job)
                            setIsJobModalOpen(true)
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteJob(job.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Job Modal */}
      {isJobModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">
                {editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
              </h3>
              <button onClick={() => setIsJobModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSaveJob} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Job Title</label>
                  <input
                    name="title"
                    defaultValue={editingJob?.title}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Senior Real Estate Agent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Department</label>
                  <select
                    name="department"
                    defaultValue={editingJob?.department || 'Sales'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option>Sales</option>
                    <option>Marketing</option>
                    <option>Operations</option>
                    <option>Management</option>
                    <option>HR</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <input
                    name="location"
                    defaultValue={editingJob?.location || 'Dubai, UAE'}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Job Type</label>
                  <select
                    name="type"
                    defaultValue={editingJob?.type || 'Full-time'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Freelance</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingJob?.description}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Describe the role and responsibilities..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Requirements (one per line)</label>
                <textarea
                  name="requirements"
                  defaultValue={editingJob?.requirements?.join('\n')}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="List the key requirements..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Salary</label>
                <input
                  name="salary"
                  defaultValue={editingJob?.salary}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. AED 25,000 - 35,000 + Benefits"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingJob ? 'Update Job' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
