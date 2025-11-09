import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Project = Database['public']['Tables']['user_projects']['Row']

export function useRealtimeProjects(userId: string | undefined) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    // Initial fetch
    const fetchProjects = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('user_projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching projects:', error)
      } else if (data) {
        setProjects(data)
      }
      setIsLoading(false)
    }
    
    fetchProjects()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('user-projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_projects',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Project changed:', payload)
          
          // Update local state based on event type
          if (payload.eventType === 'INSERT') {
            setProjects(prev => [payload.new as Project, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setProjects(prev => prev.map(p => 
              p.id === (payload.new as Project).id ? payload.new as Project : p
            ))
          } else if (payload.eventType === 'DELETE') {
            setProjects(prev => prev.filter(p => p.id !== (payload.old as Project).id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return { projects, isLoading }
}

