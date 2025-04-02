import api from "./api"

// Get all favorite hospitals
export const getFavoriteHospitals = async () => {
  try {
    const response = await api.get("/hospitals/favorites")
    return response.data.data
  } catch (error) {
    throw error
  }
}

// Get favorite hospital by ID
export const getFavoriteHospitalById = async (id) => {
  try {
    const response = await api.get(`/hospitals/favorites/${id}`)
    return response.data.data
  } catch (error) {
    throw error
  }
}

// Add hospital to favorites
export const addFavoriteHospital = async (hospitalData) => {
  try {
    const response = await api.post("/hospitals/favorites", hospitalData)
    return response.data.data
  } catch (error) {
    throw error
  }
}

// Update favorite hospital
export const updateFavoriteHospital = async (id, hospitalData) => {
  try {
    const response = await api.put(`/hospitals/favorites/${id}`, hospitalData)
    return response.data.data
  } catch (error) {
    throw error
  }
}

// Delete favorite hospital
export const deleteFavoriteHospital = async (id) => {
  try {
    const response = await api.delete(`/hospitals/favorites/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Search nearby hospitals
export const searchNearbyHospitals = async (latitude, longitude, radius) => {
  try {
    const response = await api.get("/hospitals/nearby", {
      params: { latitude, longitude, radius },
    })
    return response.data.data
  } catch (error) {
    throw error
  }
}

