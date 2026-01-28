/**
 * Landing Page Component (src/pages/LandingPage.jsx)
 * 
 * WHAT IT DOES:
 * Public landing page styled after Linear.app featuring product description,
 * navigation header (Product, Features, Pricing, Contact), CTA buttons,
 * and a website mockup window preview.
 */

import React, { useState } from 'react';

const LandingPage = ({ setActivePage }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div style={{ backgroundColor: '#08090a', minHeight: '100vh', color: '#f7f8f8' }}>
      {/* Landing Navigation Header */}
      <header className="landing-navbar">
        <div className="nav-brand" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
          <div className="nav-brand-logo">L</div>
          <span>Linear Hub</span>
        </div>

        <div className="landing-nav-links">
          <a href="#product" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}>Product</a>
          <a href="#features" onClick={(e) => { e.preventDefault(); setActiveTab('features'); }}>Features</a>
          <a href="#pricing" onClick={(e) => { e.preventDefault(); setActiveTab('pricing'); }}>Pricing</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); setShowContactModal(true); }}>Contact</a>
        </div>

        <div className="landing-nav-actions">
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePage('login')}
          >
            Log In
          </button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setActivePage('register')}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Landing Content */}
      <main className="landing-hero-container">
        {activeTab === 'home' && (
          <>
            {/* Hero Section */}
            <div className="hero-text-content">
              <div className="hero-badge">
                <span className="hero-badge-new">New</span>
                <span>ProjectHub 2.0 is live &rarr;</span>
              </div>

              <h1 className="hero-headline">
                The product development system for teams and agents
              </h1>

              <p className="hero-subheadline">
                Purpose-built for planning and building products. Designed for students, teams, and developers.
              </p>

              <div className="hero-cta-buttons">
                <button 
                  className="btn btn-primary"
                  onClick={() => setActivePage('register')}
                  style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
                >
                  Get started for free →
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setActivePage('login')}
                  style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
                >
                  Log in to Workspace
                </button>
              </div>
            </div>

            {/* Showcase App Mockup Preview (Linear Style Web Frame) */}
            <div className="mockup-frame-container">
              <div className="mockup-header-bar">
                <div className="mockup-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <div className="mockup-url-bar">https://linear.hub/workspace/projects</div>
              </div>

              <div className="mockup-body">
                {/* Mockup Left Sidebar */}
                <div className="mockup-sidebar">
                  <div className="mockup-sidebar-header">
                    <div className="mockup-avatar">L</div>
                    <span>Linear Team ▾</span>
                  </div>
                  <div className="mockup-nav-item active">⚡ Pulse</div>
                  <div className="mockup-nav-item">📥 Inbox</div>
                  <div className="mockup-nav-item">🎯 My Issues</div>
                  <div className="mockup-nav-item">📁 Projects</div>
                  
                  <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#62666d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Workspace</div>
                  <div className="mockup-nav-item">🚀 Initiatives</div>
                  <div className="mockup-nav-item">👥 Team Members</div>
                </div>

                {/* Mockup Main Workspace Area */}
                <div className="mockup-main">
                  <div className="mockup-main-header">
                    <span className="mockup-issue-id">DRV-8852</span>
                    <span style={{ fontWeight: 600 }}>Faster app launch & REST API integration</span>
                    <span className="badge badge-in_progress" style={{ marginLeft: 'auto' }}>IN PROGRESS</span>
                    <span className="badge badge-high" style={{ marginLeft: '0.5rem' }}>HIGH</span>
                  </div>

                  <div className="mockup-card-content">
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#f7f8f8' }}>Faster app launch</h3>
                    <p style={{ color: '#8a8f98', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                      Render UI before <code style={{ background: '#1f2025', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>vehicle_state</code> sync when minimum required state is present, instead of blocking on full refresh during startup.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div className="mockup-info-box">
                        <span style={{ color: '#62666d', fontSize: '0.8rem' }}>Assigned To</span>
                        <div style={{ fontSize: '0.9rem', fontWeight: 500, marginTop: '0.2rem' }}>👤 Keshav (Lead Developer)</div>
                      </div>
                      <div className="mockup-info-box">
                        <span style={{ color: '#62666d', fontSize: '0.8rem' }}>Project</span>
                        <div style={{ fontSize: '0.9rem', fontWeight: 500, marginTop: '0.2rem' }}>📁 Mobile Banking System</div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                      <span style={{ color: '#8a8f98', fontSize: '0.85rem' }}>Activity & Comments (2)</span>
                      <div className="mockup-comment" style={{ marginTop: '0.5rem' }}>
                        <strong style={{ color: '#5e6ad2' }}>Admin User:</strong> Restructured MongoDB schema to speed up queries by 40%.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div style={{ paddingTop: '2rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>Features Built For Developers</h2>
            <div className="grid-3">
              <div className="card">
                <h3 className="card-title">🔐 JWT Authentication</h3>
                <p className="card-description">Access and Refresh tokens with secure password hashing using bcryptjs.</p>
              </div>
              <div className="card">
                <h3 className="card-title">📁 Projects & Teams</h3>
                <p className="card-description">Create projects, manage team members, and control access permissions.</p>
              </div>
              <div className="card">
                <h3 className="card-title">📝 Task Kanban Tracker</h3>
                <p className="card-description">Track task statuses from TODO to IN_PROGRESS and DONE with priority filters.</p>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div style={{ paddingTop: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Simple, Transparent Pricing</h2>
            <p style={{ color: '#8a8f98', marginBottom: '2.5rem' }}>Everything you need for college projects and small teams.</p>
            
            <div className="grid-3" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div className="card" style={{ borderColor: '#5e6ad2' }}>
                <h3 className="card-title" style={{ fontSize: '1.4rem' }}>Student Free Plan</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0' }}>$0 <span style={{ fontSize: '0.9rem', color: '#8a8f98' }}>/ forever</span></div>
                <ul style={{ textAlign: 'left', color: '#8a8f98', paddingLeft: '1.2rem', marginBottom: '1.5rem', lineHeight: '1.8' }}>
                  <li>Unlimited Projects</li>
                  <li>Unlimited Tasks & Comments</li>
                  <li>Node.js + Express Backend</li>
                  <li>MongoDB Mongoose Database</li>
                </ul>
                <button className="btn btn-primary btn-full" onClick={() => setActivePage('register')}>
                  Get Started Free
                </button>
              </div>

              <div className="card">
                <h3 className="card-title" style={{ fontSize: '1.4rem' }}>Pro Team Plan</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0' }}>$12 <span style={{ fontSize: '0.9rem', color: '#8a8f98' }}>/ month</span></div>
                <ul style={{ textAlign: 'left', color: '#8a8f98', paddingLeft: '1.2rem', marginBottom: '1.5rem', lineHeight: '1.8' }}>
                  <li>Advanced Role Authorization</li>
                  <li>Priority Support</li>
                  <li>Custom Webhooks</li>
                  <li>Unlimited Team Members</li>
                </ul>
                <button className="btn btn-secondary btn-full" onClick={() => setActivePage('register')}>
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Contact Support</h3>
              <button className="close-btn" onClick={() => setShowContactModal(false)}>&times;</button>
            </div>
            <p style={{ color: '#8a8f98', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Have questions about the project or REST APIs? Send us a message!
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); setShowContactModal(false); }}>
              <div className="form-group">
                <label className="form-label">Your Email</label>
                <input type="email" className="form-input" placeholder="student@college.edu" required />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-textarea" placeholder="How can we help?" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-full">
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
