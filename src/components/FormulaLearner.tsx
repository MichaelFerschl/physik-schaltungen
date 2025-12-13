import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Loader2,
  CheckCircle,
  XCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Brain,
  Lightbulb,
  RotateCcw,
  Play,
  Trophy,
} from 'lucide-react'
import {
  formulaQuestions,
  checkFormulaAnswer,
  generateVoiceResponse,
  type FormulaQuestion,
  type FormulaCheckResult,
} from '@/services/claude'

interface FormulaLearnerProps {
  apiKey: string
  onNeedApiKey: () => void
}

type Category = 'all' | 'ohm' | 'series' | 'parallel' | 'kirchhoff'

const categoryLabels: Record<Category, string> = {
  all: 'Alle Themen',
  ohm: 'Ohmsches Gesetz',
  series: 'Reihenschaltung',
  parallel: 'Parallelschaltung',
  kirchhoff: 'Kirchhoffsche Regeln',
}

export default function FormulaLearner({ apiKey, onNeedApiKey }: FormulaLearnerProps) {
  const [category, setCategory] = useState<Category>('all')
  const [questions, setQuestions] = useState<FormulaQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [checkResult, setCheckResult] = useState<FormulaCheckResult | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizFinished, setQuizFinished] = useState(false)

  // Speech states
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [speechSupported, setSpeechSupported] = useState(false)

  // Check for Speech API support
  useEffect(() => {
    const supported = 'speechSynthesis' in window && 'webkitSpeechRecognition' in window
    setSpeechSupported(supported)
  }, [])

  // Filter questions by category
  useEffect(() => {
    const filtered = category === 'all'
      ? [...formulaQuestions]
      : formulaQuestions.filter(q => q.category === category)
    // Shuffle questions
    setQuestions(filtered.sort(() => Math.random() - 0.5))
  }, [category])

  const currentQuestion = questions[currentIndex]

  // Text-to-Speech function
  const speak = useCallback((text: string) => {
    if (!voiceEnabled || !speechSupported) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'de-DE'
    utterance.rate = 0.9
    utterance.pitch = 1

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [voiceEnabled, speechSupported])

  // Speech recognition
  const startListening = useCallback(() => {
    if (!speechSupported) return

    // @ts-expect-error - webkitSpeechRecognition is not in TypeScript types
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = 'de-DE'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)

    recognition.onresult = (event: { results: { transcript: string }[][] }) => {
      const transcript = event.results[0][0].transcript
      setUserAnswer(transcript)
    }

    recognition.start()
  }, [speechSupported])

  const stopListening = useCallback(() => {
    setIsListening(false)
  }, [])

  // Start quiz
  const startQuiz = () => {
    if (!apiKey) {
      onNeedApiKey()
      return
    }
    setQuizStarted(true)
    setQuizFinished(false)
    setCurrentIndex(0)
    setScore({ correct: 0, total: 0 })
    setCheckResult(null)
    setUserAnswer('')
    setShowHint(false)

    // Speak first question
    if (voiceEnabled && currentQuestion) {
      setTimeout(() => speak(questions[0]?.question || ''), 500)
    }
  }

  // Check answer
  const handleCheckAnswer = async () => {
    if (!currentQuestion || !userAnswer.trim() || !apiKey) return

    setIsChecking(true)
    try {
      const result = await checkFormulaAnswer(apiKey, currentQuestion, userAnswer)
      setCheckResult(result)
      setScore(prev => ({
        correct: prev.correct + (result.isCorrect ? 1 : 0),
        total: prev.total + 1,
      }))

      // Generate and speak response
      if (voiceEnabled) {
        const nextQ = questions[currentIndex + 1]
        const voiceText = await generateVoiceResponse(
          apiKey,
          result.isCorrect,
          result.feedback,
          nextQ?.question
        )
        speak(voiceText)
      }
    } catch (err) {
      console.error('Fehler beim Prüfen:', err)
    } finally {
      setIsChecking(false)
    }
  }

  // Next question
  const handleNextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setQuizFinished(true)
      if (voiceEnabled) {
        const percentage = Math.round((score.correct / score.total) * 100)
        speak(`Super, du hast das Quiz beendet! Du hast ${score.correct} von ${score.total} Fragen richtig beantwortet, das sind ${percentage} Prozent.`)
      }
    } else {
      setCurrentIndex(prev => prev + 1)
      setCheckResult(null)
      setUserAnswer('')
      setShowHint(false)

      // Speak next question
      if (voiceEnabled) {
        setTimeout(() => speak(questions[currentIndex + 1]?.question || ''), 300)
      }
    }
  }

  // Restart quiz
  const handleRestart = () => {
    setQuestions(prev => [...prev].sort(() => Math.random() - 0.5))
    startQuiz()
  }

  // Toggle voice
  const toggleVoice = () => {
    if (voiceEnabled) {
      window.speechSynthesis.cancel()
    }
    setVoiceEnabled(prev => !prev)
  }

  // Progress calculation
  const progress = questions.length > 0 ? ((currentIndex + (checkResult ? 1 : 0)) / questions.length) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Formel-Trainer
          </CardTitle>
          <CardDescription>
            Lerne die wichtigsten Formeln für elektrische Schaltungen - mit KI-Überprüfung und Sprachunterstützung
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Themenbereich</label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as Category)}
                disabled={quizStarted && !quizFinished}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {speechSupported && (
              <Button
                variant="outline"
                size="icon"
                onClick={toggleVoice}
                title={voiceEnabled ? 'Sprache deaktivieren' : 'Sprache aktivieren'}
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            )}

            {!quizStarted || quizFinished ? (
              <Button onClick={startQuiz}>
                <Play className="mr-2 h-4 w-4" />
                Quiz starten ({questions.length} Fragen)
              </Button>
            ) : (
              <Button variant="outline" onClick={handleRestart}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Neu starten
              </Button>
            )}
          </div>

          {!apiKey && (
            <Alert className="mt-4">
              <AlertTitle>API-Key fehlt</AlertTitle>
              <AlertDescription>
                Bitte gib zuerst deinen Claude API-Key in den Einstellungen ein.
                <Button variant="link" className="px-1" onClick={onNeedApiKey}>
                  Einstellungen öffnen
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Quiz Card */}
      {quizStarted && !quizFinished && currentQuestion && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  Frage {currentIndex + 1} von {questions.length}
                </CardTitle>
                <CardDescription>
                  {categoryLabels[currentQuestion.category as Category]}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {score.correct}/{score.total}
                </div>
                <div className="text-xs text-gray-500">Richtig</div>
              </div>
            </div>
            <Progress value={progress} className="mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Question */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-start justify-between gap-4">
                <p className="text-purple-900 text-lg font-medium flex-1">
                  {currentQuestion.question}
                </p>
                {voiceEnabled && speechSupported && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => speak(currentQuestion.question)}
                    disabled={isSpeaking}
                    title="Frage vorlesen"
                  >
                    <Volume2 className={`h-4 w-4 ${isSpeaking ? 'text-purple-600 animate-pulse' : ''}`} />
                  </Button>
                )}
              </div>
            </div>

            {/* Hint */}
            {!checkResult && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                  className="text-amber-600"
                >
                  <Lightbulb className="mr-1 h-4 w-4" />
                  {showHint ? 'Hinweis verstecken' : 'Hinweis zeigen'}
                </Button>
                {showHint && currentQuestion.hint && (
                  <span className="text-amber-700 text-sm italic">{currentQuestion.hint}</span>
                )}
              </div>
            )}

            {/* Answer Input */}
            {!checkResult && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Deine Antwort:</label>
                <div className="flex gap-2">
                  <Input
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="z.B. U = R × I oder I gleich U durch R"
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckAnswer()}
                    className="flex-1"
                  />
                  {speechSupported && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={isListening ? stopListening : startListening}
                      title={isListening ? 'Aufnahme stoppen' : 'Spracheingabe'}
                    >
                      {isListening ? (
                        <MicOff className="h-4 w-4 text-red-500 animate-pulse" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                <Button
                  onClick={handleCheckAnswer}
                  disabled={isChecking || !userAnswer.trim()}
                  className="w-full"
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wird geprüft...
                    </>
                  ) : (
                    'Antwort prüfen'
                  )}
                </Button>
              </div>
            )}

            {/* Result */}
            {checkResult && (
              <div className="space-y-4">
                <Alert
                  variant={checkResult.isCorrect ? 'default' : 'destructive'}
                  className={checkResult.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}
                >
                  {checkResult.isCorrect ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertTitle className={checkResult.isCorrect ? 'text-green-800' : 'text-red-800'}>
                    {checkResult.isCorrect ? 'Richtig!' : 'Nicht ganz richtig'}
                  </AlertTitle>
                  <AlertDescription className={checkResult.isCorrect ? 'text-green-700' : 'text-red-700'}>
                    {checkResult.feedback}
                    <br />
                    <span className="italic">{checkResult.encouragement}</span>
                  </AlertDescription>
                </Alert>

                {!checkResult.isCorrect && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Korrekte Antwort:</strong> {currentQuestion.correctFormula}
                    </p>
                  </div>
                )}

                <Button onClick={handleNextQuestion} className="w-full">
                  {currentIndex + 1 >= questions.length ? (
                    <>
                      <Trophy className="mr-2 h-4 w-4" />
                      Quiz beenden
                    </>
                  ) : (
                    'Nächste Frage'
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quiz Finished Card */}
      {quizFinished && (
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-800 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Quiz beendet!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <div className="text-5xl font-bold text-purple-700">
                {Math.round((score.correct / score.total) * 100)}%
              </div>
              <div className="text-lg text-purple-600 mt-2">
                {score.correct} von {score.total} Fragen richtig
              </div>
              <div className="text-gray-600 mt-4">
                {score.correct === score.total && 'Perfekt! Du hast alle Fragen richtig beantwortet!'}
                {score.correct >= score.total * 0.8 && score.correct < score.total && 'Sehr gut! Du kennst die Formeln schon richtig gut!'}
                {score.correct >= score.total * 0.5 && score.correct < score.total * 0.8 && 'Gut gemacht! Mit etwas mehr Übung wirst du noch besser!'}
                {score.correct < score.total * 0.5 && 'Nicht schlecht für den Anfang! Wiederhole die Formeln und versuche es nochmal!'}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleRestart} className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                Nochmal spielen
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setQuizStarted(false)
                  setQuizFinished(false)
                }}
                className="flex-1"
              >
                Thema wechseln
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card for Speech */}
      {!speechSupported && (
        <Alert>
          <Volume2 className="h-4 w-4" />
          <AlertTitle>Sprachfunktion nicht verfügbar</AlertTitle>
          <AlertDescription>
            Dein Browser unterstützt leider keine Sprachein-/ausgabe.
            Die App funktioniert trotzdem - du kannst Antworten normal eintippen.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
