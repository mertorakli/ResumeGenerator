'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DebugPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runFirebaseTest = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/firebase-test')
      const data = await response.json()
      setTestResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run test')
    } finally {
      setIsLoading(false)
    }
  }

  const testFormSubmission = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Create minimal test data
      const testData = {
        personalInfo: {
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '555-1234',
          location: 'Test City',
          summary: 'This is a test submission.'
        },
        experience: [
          {
            title: 'Test Job',
            company: 'Test Company',
            location: 'Test Location',
            startDate: '2022-01-01',
            endDate: '',
            description: 'Test description'
          }
        ],
        skills: ['Test Skill 1', 'Test Skill 2'],
        education: [],
        languages: [],
        customSections: []
      }
      
      // Submit to the API
      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      })
      
      const data = await response.json()
      setTestResult({
        apiResponse: data,
        submitted: true,
        apiStatus: response.status
      })
      
      if (data.id) {
        // Try to retrieve the data
        const getResponse = await fetch(`/api/resume?id=${data.id}`)
        const getData = await getResponse.json()
        
        setTestResult((prevState: any) => ({
          ...prevState,
          retrieveStatus: getResponse.status,
          retrievedData: getData
        }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test form submission')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Debug Page</h1>
          <Link href="/" className="text-indigo-600 hover:text-indigo-800">
            Return to Home
          </Link>
        </div>
        
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Firebase Connection Test</h2>
            <button
              onClick={runFirebaseTest}
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Run Firebase Test'}
            </button>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Test Form Submission</h2>
            <button
              onClick={testFormSubmission}
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Resume API'}
            </button>
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              <h3 className="font-medium">Error</h3>
              <p>{error}</p>
            </div>
          )}
          
          {testResult && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-lg mb-2">Test Result</h3>
              <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 