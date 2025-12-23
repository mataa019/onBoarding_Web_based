import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { portfolioApi } from '../ApiService/portfolioApi'
import type { Experience, Education, Skill, Reference } from '../ApiService/types'

// Experiences
export function useExperiences(username?: string) {
  return useQuery<Experience[], Error>(['experiences', username || 'me'], async () => {
    if (username) {
      const p = await portfolioApi.getByUsername(username)
      return p?.experiences || []
    }
    return portfolioApi.getExperiences()
  })
}

export function useAddExperience() {
  const qc = useQueryClient()
  return useMutation((data: Omit<Experience, 'id'>) => portfolioApi.addExperience(data), {
    onSuccess: (_, __, context) => qc.invalidateQueries(['experiences'])
  })
}

export function useUpdateExperience() {
  const qc = useQueryClient()
  return useMutation(({ id, data }: { id: string; data: Partial<Experience> }) => portfolioApi.updateExperience(id, data), {
    onSuccess: () => qc.invalidateQueries(['experiences'])
  })
}

export function useDeleteExperience() {
  const qc = useQueryClient()
  return useMutation((id: string) => portfolioApi.deleteExperience(id), {
    onSuccess: () => qc.invalidateQueries(['experiences'])
  })
}

// Similar hooks can be added for Education, Skills and References
export function useEducation(username?: string) {
  return useQuery<Education[], Error>(['education', username || 'me'], async () => {
    if (username) {
      const p = await portfolioApi.getByUsername(username)
      return p?.education || []
    }
    return portfolioApi.getEducation()
  })
}

export function useSkills(username?: string) {
  return useQuery<Skill[], Error>(['skills', username || 'me'], async () => {
    if (username) {
      const p = await portfolioApi.getByUsername(username)
      return p?.skills || []
    }
    return portfolioApi.getSkills()
  })
}

export function useReferences(username?: string) {
  return useQuery<Reference[], Error>(['references', username || 'me'], async () => {
    if (username) {
      const p = await portfolioApi.getByUsername(username)
      return p?.references || []
    }
    return portfolioApi.getReferences()
  })
}