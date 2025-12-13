import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Settings, BookOpen, GraduationCap, Mic } from 'lucide-react'
import FormulaSheet from '@/components/FormulaSheet'
import PracticeArea from '@/components/PracticeArea'
import VoiceTutor from '@/components/VoiceTutor'
import ApiKeyDialog from '@/components/ApiKeyDialog'

function App() {
  const [showSettings, setShowSettings] = useState(false)

  // API Keys: Zuerst aus Umgebungsvariablen, dann aus localStorage als Fallback
  const [apiKey, setApiKey] = useState(() => {
    return import.meta.env.VITE_CLAUDE_API_KEY || localStorage.getItem('claude-api-key') || ''
  })
  const [openaiKey, setOpenaiKey] = useState(() => {
    return import.meta.env.VITE_OPENAI_API_KEY || localStorage.getItem('openai-api-key') || ''
  })

  // Prüfe ob Keys aus Umgebungsvariablen kommen (dann Settings verstecken)
  const hasEnvKeys = !!(import.meta.env.VITE_CLAUDE_API_KEY && import.meta.env.VITE_OPENAI_API_KEY)

  const handleSaveApiKeys = (claudeKey: string, oaiKey: string) => {
    setApiKey(claudeKey)
    setOpenaiKey(oaiKey)
    localStorage.setItem('claude-api-key', claudeKey)
    localStorage.setItem('openai-api-key', oaiKey)
    setShowSettings(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Physik Schaltungen</h1>
              <p className="text-sm text-gray-500">Lernapp für Reihen- und Parallelschaltungen · © Michael Ferschl 2025</p>
            </div>
          </div>
          {!hasEnvKeys && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSettings(true)}
              title="Einstellungen"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Tabs defaultValue="formulas" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="formulas" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Formeln</span>
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              <span className="hidden sm:inline">Sprach-Tutor</span>
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Übungen</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="formulas">
            <FormulaSheet />
          </TabsContent>

          <TabsContent value="voice">
            <VoiceTutor openaiKey={openaiKey} onNeedApiKey={() => setShowSettings(true)} />
          </TabsContent>

          <TabsContent value="practice">
            <PracticeArea apiKey={apiKey} onNeedApiKey={() => setShowSettings(true)} />
          </TabsContent>
        </Tabs>
      </main>

      {/* API Key Dialog */}
      <ApiKeyDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        apiKey={apiKey}
        openaiKey={openaiKey}
        onSave={handleSaveApiKeys}
      />
    </div>
  )
}

export default App
