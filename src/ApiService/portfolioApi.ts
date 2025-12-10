// services/portfolioApi.ts
import type { Portfolio, Experience, Education, Skill, Reference } from './types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const getHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

export const portfolioApi = {
  // Portfolio
  get: (token: string): Promise<{ portfolio: Portfolio }> =>
    fetch(`${API_URL}/portfolio`, { headers: getHeaders(token) }).then(res => res.json()),

  getByUsername: (username: string): Promise<{ portfolio: Portfolio }> =>
    fetch(`${API_URL}/portfolio/${username}`).then(res => res.json()),

  update: (token: string, data: Partial<Portfolio>): Promise<{ portfolio: Portfolio }> =>
    fetch(`${API_URL}/portfolio`, {
      method: 'PATCH',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    }).then(res => res.json()),

  // Experiences
  addExperience: (token: string, data: Omit<Experience, 'id'>): Promise<{ experience: Experience }> =>
    fetch(`${API_URL}/portfolio/experiences`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    }).then(res => res.json()),

  updateExperience: (token: string, id: string, data: Partial<Experience>): Promise<{ experience: Experience }> =>
    fetch(`${API_URL}/portfolio/experiences/${id}`, {
      method: 'PATCH',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    }).then(res => res.json()),

  deleteExperience: (token: string, id: string): Promise<{ message: string }> =>
    fetch(`${API_URL}/portfolio/experiences/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    }).then(res => res.json()),

  // Education
  addEducation: (token: string, data: Omit<Education, 'id'>): Promise<{ education: Education }> =>
    fetch(`${API_URL}/portfolio/education`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    }).then(res => res.json()),

  updateEducation: (token: string, id: string, data: Partial<Education>): Promise<{ education: Education }> =>
    fetch(`${API_URL}/portfolio/education/${id}`, {
      method: 'PATCH',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    }).then(res => res.json()),

  deleteEducation: (token: string, id: string): Promise<{ message: string }> =>
    fetch(`${API_URL}/portfolio/education/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    }).then(res => res.json()),

  // Skills
  addSkill: (token: string, data: Omit<Skill, 'id'>): Promise<{ skill: Skill }> =>
    fetch(`${API_URL}/portfolio/skills`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    }).then(res => res.json()),

  updateSkill: (token: string, id: string, data: Partial<Skill>): Promise<{ skill: Skill }> =>
    fetch(`${API_URL}/portfolio/skills/${id}`, {
      method: 'PATCH',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    }).then(res => res.json()),

  deleteSkill: (token: string, id: string): Promise<{ message: string }> =>
    fetch(`${API_URL}/portfolio/skills/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    }).then(res => res.json()),

  // References
  addReference: (token: string, data: Omit<Reference, 'id'>): Promise<{ reference: Reference }> =>
    fetch(`${API_URL}/portfolio/references`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    }).then(res => res.json()),

  updateReference: (token: string, id: string, data: Partial<Reference>): Promise<{ reference: Reference }> =>
    fetch(`${API_URL}/portfolio/references/${id}`, {
      method: 'PATCH',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    }).then(res => res.json()),

  deleteReference: (token: string, id: string): Promise<{ message: string }> =>
    fetch(`${API_URL}/portfolio/references/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    }).then(res => res.json()),
}
