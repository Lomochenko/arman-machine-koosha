import { defineStore } from 'pinia'

export interface Work {
  id: number
  title: string
  category: string
  description: string
  image?: string
}

export const useWorksStore = defineStore('works', () => {
  const works = ref<Work[]>([
    { id: 1, title: 'Project 1', category: 'Web', description: 'Web project' },
    { id: 2, title: 'Project 2', category: 'Mobile', description: 'Mobile project' },
    { id: 3, title: 'Project 3', category: 'Design', description: 'Design project' },
    { id: 4, title: 'Project 4', category: 'Web', description: 'Web project' },
    { id: 5, title: 'Project 5', category: 'Mobile', description: 'Mobile project' },
    { id: 6, title: 'Project 6', category: 'Design', description: 'Design project' },
  ])

  const getWorksByCategory = (category: string) => {
    if (category === 'All') return works.value
    return works.value.filter(w => w.category === category)
  }

  const addWork = (work: Work) => {
    works.value.push(work)
  }

  return {
    works,
    getWorksByCategory,
    addWork
  }
})

