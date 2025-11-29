import { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSessionAndRole = async () => {
      setLoading(true); // Ensure loading is true at the start of fetch
      const { data: { session: initialSession } } = await supabase.auth.getSession()
      setSession(initialSession)
      console.log("useAuth: initial session fetched:", initialSession);
      
      if (initialSession?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', initialSession.user.id)
          .single()
        
        if (error) {
            console.error("useAuth: Error fetching profile role (initial):", error);
            setRole(null); // Set role to null on error
        } else {
            setRole(data?.role || 'officer')
            console.log("useAuth: initial role set to:", data?.role || 'officer');
        }
      }
      
      setLoading(false)
      console.log("useAuth: initial loading set to false");
    }

    getSessionAndRole()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      console.log("useAuth: auth state changed, new session:", newSession);
      if (newSession?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', newSession.user.id)
          .single()
        
        if (error) {
            console.error("useAuth: Error fetching profile role on auth state change:", error);
            setRole(null); // Set role to null on error
        } else {
            setRole(data?.role || 'officer')
            console.log("useAuth: role set to (on auth state change):", data?.role || 'officer');
        }
      } else {
        setRole(null)
        console.log("useAuth: no user in session, role set to null");
      }
      setLoading(false)
      console.log("useAuth: loading set to false (on auth state change)");
    })

    return () => subscription.unsubscribe()
  }, [])

  return { session, role, loading }
}
