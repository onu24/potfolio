"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Send, Loader2, AlertCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { addMessage } from "@/lib/firestore"
import { cn } from "@/lib/utils"

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
}

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: ""
  })

  // Track focused field for active styling
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Refs for keyboard navigation
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  const validate = () => {
    const newErrors = { name: "", email: "", message: "" }
    let isValid = true

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      isValid = false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
      isValid = false
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl + Enter to submit
    if (e.ctrlKey && e.key === "Enter") {
      handleSubmit(e)
    }
  }

  const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault()

    if (!validate()) {
      toast.error("Please assign the highlighted errors")
      return
    }

    setIsSubmitting(true)

    try {
      await addMessage({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      })

      setIsSuccess(true)
      toast.success("Message sent successfully!")

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })

      // Reset form after delay
      setTimeout(() => {
        setFormData({ name: "", email: "", message: "" })
        setIsSuccess(false)
      }, 3000)

    } catch (error: any) {
      console.error("Failed to send message:", error)
      toast.error("Failed to send message. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="relative py-16 md:py-24 bg-background overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-screen-xl mx-auto px-6">
        <motion.div
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          transition={{ duration: 0.8, staggerChildren: 0.15, ease: [0.19, 1, 0.22, 1] }}
          className="text-center mb-12 md:mb-20"
        >
          <motion.span
            variants={fadeUp}
            className="text-[11px] font-medium tracking-[0.4em] uppercase text-slate-500 mb-8 block"
          >
            CONTACT
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-8 leading-tight"
          >
            Let’s build something
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-pretty"
          >
            Have a project idea? Let's talk about building it together.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Left Column: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="space-y-10"
          >
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white tracking-tight">Get in touch</h3>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                Open to freelance work and collaboration. Reach out if you have a project or opportunity.
              </p>
            </div>

            <Button
              asChild
              size="lg"
              className="rounded-full bg-white text-black hover:bg-slate-200 hover:scale-105 transition-all duration-500 px-10 py-7 text-lg font-bold shadow-2xl relative overflow-hidden group"
            >
              <a href="mailto:hello@mayank.dev" className="flex items-center gap-3 relative z-10">
                <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Email me
              </a>
            </Button>
          </motion.div>

          {/* Right Column: Interactive Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="relative"
          >
            {/* Success Overlay */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 z-20 bg-slate-900/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center text-center p-8 border border-green-500/20"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6 text-green-400">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-400 max-w-xs">
                    Thanks for reaching out. I'll get back to you within 24 hours.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-white/[0.02] border border-white/[0.06] p-8 md:p-12 rounded-3xl backdrop-blur-xl shadow-2xl"
            >
              {/* Name Field */}
              <div className="space-y-2 relative group">
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    disabled={isSubmitting}
                    className={cn(
                      "peer w-full bg-white/[0.03] border rounded-xl px-5 pt-6 pb-2 text-white outline-none transition-all duration-300 placeholder-transparent",
                      errors.name ? "border-red-500/50 focus:border-red-500" : "border-white/10 hover:border-white/20 focus:border-purple-500/50 focus:shadow-[0_0_20px_rgba(168,85,247,0.15)]",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                    placeholder="Name"
                  // autoFocus removed to prevent page jump on load
                  />
                  <label
                    htmlFor="name"
                    className={cn(
                      "absolute left-5 top-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-all duration-300 pointer-events-none",
                      "peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-4",
                      "peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest",
                      focusedField === 'name' ? "text-purple-400" : "",
                      errors.name ? "text-red-400" : ""
                    )}
                  >
                    Name <span className="text-red-400">*</span>
                  </label>
                </div>
                <AnimatePresence>
                  {errors.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                      className="flex items-start gap-2 text-red-400 text-xs mt-1 ml-1"
                    >
                      <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" /> {errors.name}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Email Field */}
              <div className="space-y-2 relative group">
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    ref={emailRef}
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    disabled={isSubmitting}
                    className={cn(
                      "peer w-full bg-white/[0.03] border rounded-xl px-5 pt-6 pb-2 text-white outline-none transition-all duration-300 placeholder-transparent",
                      errors.email ? "border-red-500/50 focus:border-red-500" : "border-white/10 hover:border-white/20 focus:border-purple-500/50 focus:shadow-[0_0_20px_rgba(168,85,247,0.15)]",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                    placeholder="Email"
                  />
                  <label
                    htmlFor="email"
                    className={cn(
                      "absolute left-5 top-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-all duration-300 pointer-events-none",
                      "peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-4",
                      "peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest",
                      focusedField === 'email' ? "text-purple-400" : "",
                      errors.email ? "text-red-400" : ""
                    )}
                  >
                    Email <span className="text-red-400">*</span>
                  </label>
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                      className="flex items-start gap-2 text-red-400 text-xs mt-1 ml-1"
                    >
                      <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" /> {errors.email}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Message Field */}
              <div className="space-y-2 relative group">
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    ref={messageRef}
                    value={formData.message}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    disabled={isSubmitting}
                    maxLength={500}
                    rows={4}
                    className={cn(
                      "peer w-full bg-white/[0.03] border rounded-2xl px-5 pt-6 pb-2 text-white outline-none transition-all duration-300 placeholder-transparent resize-none min-h-[160px]",
                      errors.message ? "border-red-500/50 focus:border-red-500" : "border-white/10 hover:border-white/20 focus:border-purple-500/50 focus:shadow-[0_0_20px_rgba(168,85,247,0.15)]",
                      "disabled:opacity-50 disabled:cursor-not-allowed custom-scrollbar"
                    )}
                    placeholder="Message"
                  />
                  <label
                    htmlFor="message"
                    className={cn(
                      "absolute left-5 top-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-all duration-300 pointer-events-none",
                      "peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-4",
                      "peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest",
                      focusedField === 'message' ? "text-purple-400" : "",
                      errors.message ? "text-red-400" : ""
                    )}
                  >
                    Message <span className="text-red-400">*</span>
                  </label>

                  {/* Character Counter */}
                  <div className="absolute bottom-4 right-4 text-[10px] font-mono text-slate-600 pointer-events-none">
                    <span className={formData.message.length >= 500 ? "text-red-400" : "text-slate-500"}>
                      {formData.message.length}
                    </span>
                    <span className="text-slate-700"> / 500</span>
                  </div>
                </div>
                <AnimatePresence>
                  {errors.message && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                      className="flex items-start gap-2 text-red-400 text-xs mt-1 ml-1"
                    >
                      <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" /> {errors.message}
                    </motion.div>
                  )}
                </AnimatePresence>
                <p className="text-[10px] text-slate-600 px-1">
                  Press <kbd className="font-sans bg-white/10 px-1 rounded text-slate-400">Ctrl</kbd> + <kbd className="font-sans bg-white/10 px-1 rounded text-slate-400">Enter</kbd> to send
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                suppressHydrationWarning
                className="w-full rounded-2xl bg-white/[0.05] border border-white/10 text-white hover:bg-white/[0.1] h-16 text-lg font-bold transition-all duration-500 flex items-center justify-center gap-3 group overflow-hidden relative"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                    <span className="animate-pulse">Sending...</span>
                  </div>
                ) : (
                  <>
                    <span className="relative z-10">Send Message</span>
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
