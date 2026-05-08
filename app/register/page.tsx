import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import RegisterForm from '@/components/RegisterForm'

export const metadata: Metadata = {
  title: 'Register Your Pet | Way2Pets Lucknow',
  description: 'Register your pet with Way2Pets for better care, reminders, and quick boarding booking. Join our pet parent community.',
}

export default function RegisterPage() {
  return (
    <>
      <Hero
        title="Register Your Pet With Us"
        subtitle="Join the Way2Pets family. Registering helps us provide personalized care, reminders for mess/boarding, and faster booking."
        imageUrl="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        minHeight="50vh"
      />

      <section className="contact-section">
        <div style={{ maxWidth: '700px', margin: '0 auto', background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 15px 40px rgba(0,0,0,0.08)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Pet Registration Form</h2>
          <RegisterForm />
        </div>
      </section>
    </>
  )
}
