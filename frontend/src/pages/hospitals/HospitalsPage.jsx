"use client"

import { useState, useEffect } from "react"
import { FiPlus, FiMapPin, FiTrash2, FiNavigation } from "react-icons/fi"
import { toast } from "react-toastify"
import PageHeader from "../../components/common/PageHeader"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import EmptyState from "../../components/common/EmptyState"
import ConfirmDialog from "../../components/common/ConfirmDialog"
import { getFavoriteHospitals, deleteFavoriteHospital, addFavoriteHospital } from "../../services/hospitalService"

const HospitalsPage = () => {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newHospital, setNewHospital] = useState({
    hospital_name: "",
    hospital_address: "",
    hospital_phone: "",
    hospital_coordinates: "",
  })

  useEffect(() => {
    fetchHospitals()
  }, [])

  const fetchHospitals = async () => {
    try {
      setLoading(true)
      const data = await getFavoriteHospitals()
      setHospitals(data)
    } catch (error) {
      console.error("Error fetching hospitals:", error)
      toast.error("Gagal memuat daftar rumah sakit")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteFavoriteHospital(deleteId)
      setHospitals(hospitals.filter((hospital) => hospital.id !== deleteId))
      toast.success("Rumah sakit berhasil dihapus dari favorit")
    } catch (error) {
      console.error("Error deleting hospital:", error)
      toast.error("Gagal menghapus rumah sakit dari favorit")
    } finally {
      setShowDeleteConfirm(false)
      setDeleteId(null)
    }
  }

  const handleAddFormSubmit = async (e) => {
    e.preventDefault()

    if (!newHospital.hospital_name) {
      toast.error("Nama rumah sakit wajib diisi")
      return
    }

    try {
      const result = await addFavoriteHospital(newHospital)
      setHospitals([...hospitals, result])
      setNewHospital({
        hospital_name: "",
        hospital_address: "",
        hospital_phone: "",
        hospital_coordinates: "",
      })
      setShowAddForm(false)
      toast.success("Rumah sakit berhasil ditambahkan ke favorit")
    } catch (error) {
      console.error("Error adding hospital:", error)
      toast.error("Gagal menambahkan rumah sakit ke favorit")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewHospital({ ...newHospital, [name]: value })
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setNewHospital({
            ...newHospital,
            hospital_coordinates: `${latitude},${longitude}`,
          })
          toast.success("Lokasi berhasil didapatkan")
        },
        (error) => {
          console.error("Error getting location:", error)
          toast.error("Gagal mendapatkan lokasi")
        },
      )
    } else {
      toast.error("Geolocation tidak didukung oleh browser Anda")
    }
  }

  const openInMaps = (coordinates) => {
    if (!coordinates) return

    const [latitude, longitude] = coordinates.split(",")
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, "_blank")
  }

  if (loading) {
    return <LoadingSpinner className="py-12" />
  }

  return (
    <div>
      <PageHeader
        title="Rumah Sakit Favorit"
        description="Kelola daftar rumah sakit favorit Anda"
        action={
          <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
            <FiPlus className="mr-2 -ml-1 h-5 w-5" />
            Tambah Rumah Sakit
          </button>
        }
      />

      {showAddForm && (
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tambah Rumah Sakit Favorit</h2>
          <form onSubmit={handleAddFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="hospital_name" className="form-label">
                  Nama Rumah Sakit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="hospital_name"
                  name="hospital_name"
                  value={newHospital.hospital_name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label htmlFor="hospital_phone" className="form-label">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  id="hospital_phone"
                  name="hospital_phone"
                  value={newHospital.hospital_phone}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="hospital_address" className="form-label">
                Alamat
              </label>
              <textarea
                id="hospital_address"
                name="hospital_address"
                value={newHospital.hospital_address}
                onChange={handleInputChange}
                rows={2}
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="hospital_coordinates" className="form-label">
                Koordinat
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="hospital_coordinates"
                  name="hospital_coordinates"
                  value={newHospital.hospital_coordinates}
                  onChange={handleInputChange}
                  placeholder="latitude,longitude"
                  className="form-input flex-1"
                />
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="ml-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  title="Gunakan lokasi saat ini"
                >
                  <FiNavigation className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Klik tombol di samping untuk menggunakan lokasi saat ini</p>
            </div>

            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-outline">
                Batal
              </button>
              <button type="submit" className="btn btn-primary">
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      {hospitals.length === 0 ? (
        <EmptyState
          title="Belum ada rumah sakit favorit"
          description="Tambahkan rumah sakit favorit untuk akses cepat ke informasi rumah sakit."
          icon={FiMapPin}
          actionText="Tambah Rumah Sakit"
          actionLink="#"
          actionOnClick={() => setShowAddForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital) => (
            <div key={hospital.id} className="card">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">{hospital.hospital_name}</h3>
                <div className="flex space-x-2">
                  <button onClick={() => handleDeleteClick(hospital.id)} className="text-red-600 hover:text-red-900">
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {hospital.hospital_address && <p className="mt-2 text-sm text-gray-500">{hospital.hospital_address}</p>}

              {hospital.hospital_phone && (
                <p className="mt-1 text-sm text-gray-500">Telepon: {hospital.hospital_phone}</p>
              )}

              {hospital.hospital_coordinates && (
                <div className="mt-4">
                  <button
                    onClick={() => openInMaps(hospital.hospital_coordinates)}
                    className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                  >
                    <FiNavigation className="mr-1 h-4 w-4" /> Lihat di Peta
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Rumah Sakit"
        message="Apakah Anda yakin ingin menghapus rumah sakit ini dari favorit? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        type="danger"
      />
    </div>
  )
}

export default HospitalsPage

