'use client'

import { useState, useEffect } from 'react'
import Properties from '@/components/admin/Properties'

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [agents, setAgents] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, agentsRes, propertiesRes] = await Promise.all([
          fetch('/api/admin/categories'),
          fetch('/api/admin/agents'),
          fetch('/api/admin/properties')
        ])

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData)
        }

        if (agentsRes.ok) {
          const agentsData = await agentsRes.json()
          setAgents(agentsData.agents || [])
        }

        if (propertiesRes.ok) {
          const propertiesData = await propertiesRes.json()
          setProperties(propertiesData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Properties Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage all properties from the website and agent portal
        </p>
      </div>

      <Properties
        activeTab="properties"
        properties={properties}
        setProperties={setProperties}
        agents={agents}
        categories={categories}
      />
    </div>
  )
}