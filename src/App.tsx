import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/hooks/use-auth'
import { OnboardingProvider } from '@/contexts/onboarding-context'
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
import NewUserOnboardingPage from '@/pages/NewUserOnboardingPage'
import DashboardPage from '@/pages/DashboardPage'
import AnalyticsPage from '@/pages/AnalyticsPage'
import CampaignsPage from '@/pages/CampaignsPage'
import CampaignsCreatePage from '@/pages/CampaignsCreatePage'
import CampaignsSettingsPage from '@/pages/CampaignsSettingsPage'
import CampaignsTemplatesPage from '@/pages/CampaignsTemplatesPage'
import CampaignsAiBotsPage from '@/pages/CampaignsAiBotsPage'
import CampaignsAutomationPage from '@/pages/CampaignsAutomationPage'
import ContactsPage from '@/pages/ContactsPage'
import ContactsCreatePage from '@/pages/ContactsCreatePage'
import ContactDetailPage from '@/pages/ContactDetailPage'
import ContactsSegmentsPage from '@/pages/ContactsSegmentsPage'
import ContactsTagsPage from '@/pages/ContactsTagsPage'
import MessagesPage from '@/pages/MessagesPage'
import InboxPage from '@/pages/InboxPage'
import InboxRequestsPage from '@/pages/InboxRequestsPage'
import InboxSettingsPage from '@/pages/InboxSettingsPage'
import AutomationPage from '@/pages/AutomationPage'
import AutomationJourneyPage from '@/pages/AutomationJourneyPage'
import AutomationTemplatesPage from '@/pages/AutomationTemplatesPage'
import AutomationBotsPage from '@/pages/AutomationBotsPage'
import ChannelsPage from '@/pages/ChannelsPage'
import ChannelsSmsPage from '@/pages/ChannelsSmsPage'
import ChannelsWhatsAppPage from '@/pages/ChannelsWhatsAppPage'
import ChannelsMessengerPage from '@/pages/ChannelsMessengerPage'
import ChannelsInstagramPage from '@/pages/ChannelsInstagramPage'
import ChannelsApplePage from '@/pages/ChannelsApplePage'
import ChannelsEmailPage from '@/pages/ChannelsEmailPage'
import ChannelsCallPage from '@/pages/ChannelsCallPage'
import ChannelsPushPage from '@/pages/ChannelsPushPage'
import ChannelsRcsPage from '@/pages/ChannelsRcsPage'
import NotificationsPage from '@/pages/NotificationsPage'
import SettingsPage from '@/pages/SettingsPage'


function App() {
  return (
    <AuthProvider>
      <OnboardingProvider>
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
        
        {/* New User Onboarding */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <NewUserOnboardingPage />
          </ProtectedRoute>
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
        <Route path="/campaigns/automation" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <CampaignsAutomationPage />
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
        <Route path="/contacts/segments" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <ContactsSegmentsPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/contacts/tags" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <ContactsTagsPage />
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
        <Route path="/inbox" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <InboxPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/inbox/requests" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <InboxRequestsPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/inbox/settings" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <InboxSettingsPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/automation" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <AutomationPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/automation/journey" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <AutomationJourneyPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/automation/templates" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <AutomationTemplatesPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/automation/bots" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <AutomationBotsPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/channels" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <ChannelsPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/channels/sms" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <ChannelsSmsPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/channels/whatsapp" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <ChannelsWhatsAppPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/channels/messenger" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <ChannelsMessengerPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/channels/instagram" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <ChannelsInstagramPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/channels/apple" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <ChannelsApplePage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/channels/email" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <ChannelsEmailPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/channels/call" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <ChannelsCallPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/channels/push" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <ChannelsPushPage />
              </DashboardLayout>
            </RootLayout>
          </ProtectedRoute>
        } />
        <Route path="/channels/rcs" element={
          <ProtectedRoute>
            <RootLayout>
              <DashboardLayout>
                <ChannelsRcsPage />
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
      </OnboardingProvider>
    </AuthProvider>
  )
}

export default App
