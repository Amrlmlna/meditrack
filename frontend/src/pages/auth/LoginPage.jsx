"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useAuth } from "../../contexts/AuthContext"
import { FiMail, FiLock, FiLogIn } from "react-icons/fi"

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: Yup.string().required("Password wajib diisi"),
})

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (values) => {
    setIsSubmitting(true)

    try {
      const result = await login(values)

      if (result.success) {
        navigate("/dashboard")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">Login ke Akun Anda</h2>

      <Formik initialValues={{ email: "", password: "" }} validationSchema={LoginSchema} onSubmit={handleSubmit}>
        {({ errors, touched }) => (
          <Form className="space-y-6">
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
                  className={`form-input pl-10 ${errors.email && touched.email ? "border-red-500" : ""}`}
                  placeholder="nama@example.com"
                />
              </div>
              <ErrorMessage name="email" component="div" className="form-error" />
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
                  autoComplete="current-password"
                  className={`form-input pl-10 ${errors.password && touched.password ? "border-red-500" : ""}`}
                  placeholder="••••••••"
                />
              </div>
              <ErrorMessage name="password" component="div" className="form-error" />
            </div>

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
                    <FiLogIn className="mr-2" /> Login
                  </>
                )}
              </button>
            </div>

            <div className="text-center text-sm">
              <p className="text-gray-600">
                Belum punya akun?{" "}
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  Daftar sekarang
                </Link>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default LoginPage

