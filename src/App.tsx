import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/hooks/use-auth'
import { Toaster } from '@/components/ui/sonner'
import { ProtectedRoute, PublicRoute } from '@/components/ProtectedRoute'
// appConfig removed as it's not used in Vite version

// Layout components
import RootLayout from '@/layouts/RootLayout'
import LoginLayout from '@/layouts/LoginLayout'
import DashboardLayout from '@/layouts/DashboardLayout'

// Pages
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import EmailConfirmationPage from '@/pages/EmailConfirmationPage'
import PhoneVerificationPage from '@/pages/PhoneVerificationPage'
import DashboardPage from '@/pages/DashboardPage'
import AnalyticsPage from '@/pages/AnalyticsPage'
import CampaignsPage from '@/pages/CampaignsPage'
import CampaignsCreatePage from '@/pages/CampaignsCreatePage'
import CampaignsSettingsPage from '@/pages/CampaignsSettingsPage'
import CampaignsTemplatesPage from '@/pages/CampaignsTemplatesPage'
import CampaignsAiBotsPage from '@/pages/CampaignsAiBotsPage'
import ContactsPage from '@/pages/ContactsPage'
import ContactsCreatePage from '@/pages/ContactsCreatePage'
import ContactDetailPage from '@/pages/ContactDetailPage'
import MessagesPage from '@/pages/MessagesPage'
import NotificationsPage from '@/pages/NotificationsPage'
import SettingsPage from '@/pages/SettingsPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginLayout>
              <LoginPage />
            </LoginLayout>
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <LoginLayout>
              <SignupPage />
            </LoginLayout>
          </PublicRoute>
        } />
        <Route path="/email-confirmation" element={
          <PublicRoute>
            <LoginLayout>
              <EmailConfirmationPage />
            </LoginLayout>
          </PublicRoute>
        } />
        <Route path="/phone-verification" element={
          <PublicRoute>
            <LoginLayout>
              <PhoneVerificationPage />
            </LoginLayout>
          </PublicRoute>
        } />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <AnalyticsPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/campaigns" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <CampaignsPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/campaigns/create" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <CampaignsCreatePage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/campaigns/settings" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <CampaignsSettingsPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/campaigns/templates" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <CampaignsTemplatesPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/campaigns/ai-bots" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <CampaignsAiBotsPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/contacts" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <ContactsPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/contacts/create" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <ContactsCreatePage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/contacts/:id" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <ContactDetailPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/messages" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <MessagesPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <NotificationsPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <SettingsPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        
        {/* Redirect unmatched routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  )
}

export default App
