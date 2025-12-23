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

export function useAddEducation() {
  const qc = useQueryClient()
  return useMutation((data: Omit<Education, 'id'>) => portfolioApi.addEducation(data), {
    onSuccess: () => qc.invalidateQueries(['education'])
  })
}

export function useUpdateEducation() {
  const qc = useQueryClient()
  return useMutation(({ id, data }: { id: string; data: Partial<Education> }) => portfolioApi.updateEducation(id, data), {
    onSuccess: () => qc.invalidateQueries(['education'])
  })
}

export function useDeleteEducation() {
  const qc = useQueryClient()
  return useMutation((id: string) => portfolioApi.deleteEducation(id), {
    onSuccess: () => qc.invalidateQueries(['education'])
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

export function useAddSkill() {
  const qc = useQueryClient()
  return useMutation((data: Omit<Skill, 'id'>) => portfolioApi.addSkill(data), {
    onSuccess: () => qc.invalidateQueries(['skills'])
  })
}

export function useUpdateSkill() {
  const qc = useQueryClient()
  return useMutation(({ id, data }: { id: string; data: Partial<Skill> }) => portfolioApi.updateSkill(id, data), {
    onSuccess: () => qc.invalidateQueries(['skills'])
  })
}

export function useDeleteSkill() {
  const qc = useQueryClient()
  return useMutation((id: string) => portfolioApi.deleteSkill(id), {
    onSuccess: () => qc.invalidateQueries(['skills'])
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

export function useAddReference() {
  const qc = useQueryClient()
  return useMutation((data: Omit<Reference, 'id'>) => portfolioApi.addReference(data), {
    onSuccess: () => qc.invalidateQueries(['references'])
  })
}

export function useUpdateReference() {
  const qc = useQueryClient()
  return useMutation(({ id, data }: { id: string; data: Partial<Reference> }) => portfolioApi.updateReference(id, data), {
    onSuccess: () => qc.invalidateQueries(['references'])
  })
}

export function useDeleteReference() {
  const qc = useQueryClient()
  return useMutation((id: string) => portfolioApi.deleteReference(id), {
    onSuccess: () => qc.invalidateQueries(['references'])
  })
}