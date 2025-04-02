"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import { FiUser, FiMail, FiLock, FiUserPlus } from "react-icons/fi";

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Nama wajib diisi"),
  email: Yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: Yup.string()
    .min(6, "Password minimal 6 karakter")
    .required("Password wajib diisi"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Password tidak cocok")
    .required("Konfirmasi password wajib diisi"),
  role: Yup.string().required("Pilih jenis pengguna"),

  // Spesialisasi wajib diisi hanya jika role adalah "doctor"
  specialization: Yup.string()
    .nullable()
    .when("role", (role, schema) =>
      role === "doctor" ? schema.required("Spesialisasi wajib diisi") : schema
    ),

  // Nomor lisensi wajib diisi hanya jika role adalah "doctor"
  doctor_license: Yup.string()
    .nullable()
    .when("role", (role, schema) =>
      role === "doctor" ? schema.required("Nomor lisensi wajib diisi") : schema
    ),
});

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState("patient");

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      const result = await register(values);

      if (result.success) {
        navigate("/dashboard");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
        Daftar Akun Baru
      </h2>

      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "patient",
          specialization: "",
          practice_years: "",
          doctor_license: "",
          doctor_bio: "",
          category: "umum",
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <Form className="space-y-6">
            <div>
              <label className="form-label">Jenis Pengguna</label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`border rounded-lg p-4 cursor-pointer text-center transition-colors ${
                    values.role === "patient"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setFieldValue("role", "patient");
                    setSelectedRole("patient");
                  }}
                >
                  <FiUser className="mx-auto h-6 w-6 mb-2" />
                  <div className="font-medium">Pasien</div>
                  <div className="text-xs text-gray-500">
                    Akses layanan kesehatan
                  </div>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer text-center transition-colors ${
                    values.role === "doctor"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setFieldValue("role", "doctor");
                    setSelectedRole("doctor");
                  }}
                >
                  <FiUser className="mx-auto h-6 w-6 mb-2" />
                  <div className="font-medium">Dokter</div>
                  <div className="text-xs text-gray-500">
                    Berikan layanan konsultasi
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="form-label">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className={`form-input pl-10 ${
                    errors.name && touched.name ? "border-red-500" : ""
                  }`}
                  placeholder="Nama lengkap Anda"
                />
              </div>
              <ErrorMessage
                name="name"
                component="div"
                className="form-error"
              />
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`form-input pl-10 ${
                    errors.email && touched.email ? "border-red-500" : ""
                  }`}
                  placeholder="nama@example.com"
                />
              </div>
              <ErrorMessage
                name="email"
                component="div"
                className="form-error"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  className={`form-input pl-10 ${
                    errors.password && touched.password ? "border-red-500" : ""
                  }`}
                  placeholder="••••••••"
                />
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="form-error"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Konfirmasi Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className={`form-input pl-10 ${
                    errors.confirmPassword && touched.confirmPassword
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="••••••••"
                />
              </div>
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="form-error"
              />
            </div>

            {/* Tampilkan form tambahan untuk dokter */}
            {values.role === "doctor" && (
              <>
                <div>
                  <label htmlFor="specialization" className="form-label">
                    Spesialisasi <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="specialization"
                    name="specialization"
                    type="text"
                    className={`form-input ${
                      errors.specialization && touched.specialization
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="Contoh: Kardiologi, Umum, Anak"
                  />
                  <ErrorMessage
                    name="specialization"
                    component="div"
                    className="form-error"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="form-label">
                    Kategori
                  </label>
                  <Field
                    as="select"
                    id="category"
                    name="category"
                    className={`form-input ${
                      errors.category && touched.category
                        ? "border-red-500"
                        : ""
                    }`}
                  >
                    <option value="umum">Umum</option>
                    <option value="spesialis">Spesialis</option>
                    <option value="gigi">Gigi</option>
                    <option value="anak">Anak</option>
                    <option value="kulit">Kulit</option>
                    <option value="mata">Mata</option>
                    <option value="jantung">Jantung</option>
                    <option value="saraf">Saraf</option>
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="form-error"
                  />
                </div>

                <div>
                  <label htmlFor="practice_years" className="form-label">
                    Tahun Pengalaman
                  </label>
                  <Field
                    id="practice_years"
                    name="practice_years"
                    type="number"
                    min="0"
                    className={`form-input ${
                      errors.practice_years && touched.practice_years
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="Contoh: 5"
                  />
                  <ErrorMessage
                    name="practice_years"
                    component="div"
                    className="form-error"
                  />
                </div>

                <div>
                  <label htmlFor="doctor_license" className="form-label">
                    Nomor Lisensi/STR <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="doctor_license"
                    name="doctor_license"
                    type="text"
                    className={`form-input ${
                      errors.doctor_license && touched.doctor_license
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="Nomor STR/Lisensi Dokter"
                  />
                  <ErrorMessage
                    name="doctor_license"
                    component="div"
                    className="form-error"
                  />
                </div>

                <div>
                  <label htmlFor="doctor_bio" className="form-label">
                    Biografi Singkat
                  </label>
                  <Field
                    as="textarea"
                    id="doctor_bio"
                    name="doctor_bio"
                    rows="3"
                    className={`form-input ${
                      errors.doctor_bio && touched.doctor_bio
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="Ceritakan tentang pengalaman dan keahlian Anda"
                  />
                  <ErrorMessage
                    name="doctor_bio"
                    component="div"
                    className="form-error"
                  />
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center btn btn-primary"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FiUserPlus className="mr-2" /> Daftar
                  </>
                )}
              </button>
            </div>

            <div className="text-center text-sm">
              <p className="text-gray-600">
                Sudah punya akun?{" "}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Login
                </Link>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterPage;
