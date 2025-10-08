import { useState, useEffect } from 'react'
import { supabase, type User } from './supabase'

export class AuthService {
  // Connexion
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  // Inscription
  static async signUp(email: string, password: string, userData: {
    first_name?: string
    last_name?: string
    phone?: string
    role?: 'client' | 'admin' | 'employee'
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })

    if (error) throw error
    return data
  }

  // Déconnexion
  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Obtenir l'utilisateur actuel
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }

  // Obtenir les détails complets de l'utilisateur
  static async getUserProfile(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
    return data
  }

  // Mettre à jour le profil utilisateur
  static async updateUserProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Vérifier si l'utilisateur est admin
  static async isAdmin(userId: string): Promise<boolean> {
    const user = await this.getUserProfile(userId)
    return user?.role === 'admin'
  }

  // Vérifier si l'utilisateur est client
  static async isClient(userId: string): Promise<boolean> {
    const user = await this.getUserProfile(userId)
    return user?.role === 'client'
  }
}

// Hook React pour l'authentification
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtenir la session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        AuthService.getUserProfile(session.user.id).then(setUser)
      }
      setLoading(false)
    })

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (session?.user) {
          const userProfile = await AuthService.getUserProfile(session.user.id)
          setUser(userProfile)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    loading,
    signIn: AuthService.signIn,
    signUp: AuthService.signUp,
    signOut: AuthService.signOut,
    isAdmin: user?.role === 'admin',
    isClient: user?.role === 'client'
  }
}
