import { supabase, type Project, type ProjectDocument, type ProjectPhoto, type TimelineEvent, type TeamMember } from './supabase'

export class ProjectService {
  // Obtenir tous les projets d'un client
  static async getClientProjects(clientId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Obtenir un projet par ID
  static async getProject(projectId: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (error) {
      console.error('Error fetching project:', error)
      return null
    }
    return data
  }

  // Créer un nouveau projet
  static async createProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Mettre à jour un projet
  static async updateProject(projectId: string, updates: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', projectId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Supprimer un projet
  static async deleteProject(projectId: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (error) throw error
  }

  // Obtenir les documents d'un projet
  static async getProjectDocuments(projectId: string): Promise<ProjectDocument[]> {
    const { data, error } = await supabase
      .from('project_documents')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Ajouter un document à un projet
  static async addProjectDocument(documentData: Omit<ProjectDocument, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('project_documents')
      .insert(documentData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Obtenir les photos d'un projet
  static async getProjectPhotos(projectId: string): Promise<ProjectPhoto[]> {
    const { data, error } = await supabase
      .from('project_photos')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Ajouter une photo à un projet
  static async addProjectPhoto(photoData: Omit<ProjectPhoto, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('project_photos')
      .insert(photoData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Obtenir la timeline d'un projet
  static async getProjectTimeline(projectId: string): Promise<TimelineEvent[]> {
    const { data, error } = await supabase
      .from('timeline_events')
      .select('*')
      .eq('project_id', projectId)
      .order('date', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Ajouter un événement à la timeline
  static async addTimelineEvent(eventData: Omit<TimelineEvent, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('timeline_events')
      .insert(eventData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Obtenir l'équipe d'un projet
  static async getProjectTeam(projectId: string): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('project_id', projectId)

    if (error) throw error
    return data || []
  }

  // Ajouter un membre à l'équipe
  static async addTeamMember(memberData: Omit<TeamMember, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('team_members')
      .insert(memberData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Obtenir les statistiques d'un projet
  static async getProjectStats(projectId: string) {
    const [project, documents, photos, timeline, team] = await Promise.all([
      this.getProject(projectId),
      this.getProjectDocuments(projectId),
      this.getProjectPhotos(projectId),
      this.getProjectTimeline(projectId),
      this.getProjectTeam(projectId)
    ])

    return {
      project,
      documentCount: documents.length,
      photoCount: photos.length,
      timelineCount: timeline.length,
      teamCount: team.length,
      lastUpdate: timeline[0]?.created_at || project?.updated_at
    }
  }
}
