import api from "./api"

// Get all consultations
export const getConsultations = async () => {
  try {
    const response = await api.get("/consultations")
    return response.data.data
  } catch (error) {
    throw error
  }
}

// Get upcoming consultations
export const getUpcomingConsultations = async () => {
  try {
    const response = await api.get("/consultations/upcoming")
    return response.data.data
  } catch (error) {
    throw error
  }
}

// Get consultation by ID
export const getConsultationById = async (id) => {
  try {
    const response = await api.get(`/consultations/${id}`)
    return response.data.data
  } catch (error) {
    throw error
  }
}

// Create consultation
export const createConsultation = async (consultationData) => {
  try {
    const response = await api.post("/consultations", consultationData)
    return response.data.data
  } catch (error) {
    throw error
  }
}

// Update consultation
export const updateConsultation = async (id, consultationData) => {
  try {
    const response = await api.put(`/consultations/${id}`, consultationData)
    return response.data.data
  } catch (error) {
    throw error
  }
}

// Delete consultation
export const deleteConsultation = async (id) => {
  try {
    const response = await api.delete(`/consultations/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get all doctors
export const getAllDoctors = async () => {
  try {
    const response = await api.get("/users/doctors")
    return response.data.data
  } catch (error) {
    throw error
  }
}

