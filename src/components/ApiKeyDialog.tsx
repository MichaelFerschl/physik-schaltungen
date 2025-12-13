import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ApiKeyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  apiKey: string
  openaiKey: string
  onSave: (claudeKey: string, openaiKey: string) => void
}

export default function ApiKeyDialog({
  open,
  onOpenChange,
  apiKey,
  openaiKey,
  onSave,
}: ApiKeyDialogProps) {
  const [claudeKey, setClaudeKey] = useState(apiKey)
  const [oaiKey, setOaiKey] = useState(openaiKey)

  useEffect(() => {
    setClaudeKey(apiKey)
  }, [apiKey])

  useEffect(() => {
    setOaiKey(openaiKey)
  }, [openaiKey])

  const handleSave = () => {
    onSave(claudeKey, oaiKey)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API-Einstellungen</DialogTitle>
          <DialogDescription>
            Gib deine API-Keys ein, um die KI-Funktionen zu nutzen.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="claude-key">Claude API-Key (für Übungen)</Label>
            <Input
              id="claude-key"
              type="password"
              placeholder="sk-ant-..."
              value={claudeKey}
              onChange={(e) => setClaudeKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Für Übungsaufgaben und Formel-Trainer.{' '}
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Key holen
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="openai-key">OpenAI API-Key (für Sprach-Tutor)</Label>
            <Input
              id="openai-key"
              type="password"
              placeholder="sk-..."
              value={oaiKey}
              onChange={(e) => setOaiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Für den interaktiven Sprach-Tutor mit Echtzeit-Audio.{' '}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Key holen
              </a>
            </p>
          </div>

          <p className="text-sm text-muted-foreground border-t pt-3">
            Die Keys werden nur lokal in deinem Browser gespeichert und nie an andere Server gesendet.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSave}>Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
