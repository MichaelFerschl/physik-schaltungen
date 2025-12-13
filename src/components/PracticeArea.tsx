import { useState } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, CheckCircle, XCircle, Sparkles, RefreshCw, Lightbulb, Eye, HelpCircle } from 'lucide-react'
import CircuitDiagram from '@/components/circuit/CircuitDiagram'
import { generateExercise, checkAnswers, getSolutionSteps, getHint } from '@/services/claude'
import type { CircuitType, Difficulty, Exercise, UserAnswer, CheckResult } from '@/types/circuit'

interface PracticeAreaProps {
  apiKey: string
  onNeedApiKey: () => void
}

export default function PracticeArea({ apiKey, onNeedApiKey }: PracticeAreaProps) {
  const [circuitType, setCircuitType] = useState<CircuitType>('series')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [isLoadingSolution, setIsLoadingSolution] = useState(false)
  const [solutionSteps, setSolutionSteps] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showCircuit, setShowCircuit] = useState(false)
  const [isLoadingHint, setIsLoadingHint] = useState(false)
  const [hintText, setHintText] = useState<string | null>(null)

  const handleGenerateExercise = async () => {
    if (!apiKey) {
      onNeedApiKey()
      return
    }

    setIsLoading(true)
    setError(null)
    setExercise(null)
    setCheckResult(null)
    setUserAnswers({})
    setSolutionSteps(null)
    setShowCircuit(false)
    setHintText(null)

    try {
      const newExercise = await generateExercise(apiKey, circuitType, difficulty)
      setExercise(newExercise)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerChange = (answerId: string, value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [answerId]: value,
    }))
  }

  const handleCheckAnswers = async () => {
    if (!exercise || !apiKey) return

    setIsChecking(true)
    setError(null)

    try {
      const answers: UserAnswer[] = exercise.requiredAnswers.map((req) => ({
        answerId: req.id,
        value: userAnswers[req.id] ? parseFloat(userAnswers[req.id].replace(',', '.')) : null,
      }))

      const result = await checkAnswers(apiKey, exercise, answers)
      setCheckResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setIsChecking(false)
    }
  }

  const handleNewExercise = () => {
    setExercise(null)
    setCheckResult(null)
    setUserAnswers({})
    setError(null)
    setSolutionSteps(null)
    setShowCircuit(false)
    setHintText(null)
  }

  const handleShowSolution = async () => {
    if (!exercise || !apiKey) return

    setIsLoadingSolution(true)
    setError(null)

    try {
      const solution = await getSolutionSteps(apiKey, exercise)
      setSolutionSteps(solution)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Lösung')
    } finally {
      setIsLoadingSolution(false)
    }
  }

  const handleGetHint = async () => {
    if (!exercise || !apiKey) return

    setIsLoadingHint(true)
    setError(null)

    try {
      const hint = await getHint(apiKey, exercise)
      setHintText(hint)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Hilfe')
    } finally {
      setIsLoadingHint(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Exercise Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Übungsaufgabe erstellen
          </CardTitle>
          <CardDescription>
            Wähle den Schaltungstyp und die Schwierigkeit für deine Übungsaufgabe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label>Schaltungstyp</Label>
              <Select
                value={circuitType}
                onValueChange={(v) => setCircuitType(v as CircuitType)}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="series">Reihenschaltung</SelectItem>
                  <SelectItem value="parallel">Parallelschaltung</SelectItem>
                  <SelectItem value="mixed">Gemischte Schaltung</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Schwierigkeit</Label>
              <Select
                value={difficulty}
                onValueChange={(v) => setDifficulty(v as Difficulty)}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Leicht</SelectItem>
                  <SelectItem value="medium">Mittel</SelectItem>
                  <SelectItem value="hard">Schwer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleGenerateExercise} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird erstellt...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Aufgabe erstellen
                </>
              )}
            </Button>
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

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Fehler</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Exercise Display */}
      {exercise && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Aufgabe</CardTitle>
                <CardDescription>
                  {exercise.circuitType === 'series' && 'Reihenschaltung'}
                  {exercise.circuitType === 'parallel' && 'Parallelschaltung'}
                  {exercise.circuitType === 'mixed' && 'Gemischte Schaltung'}
                  {' • '}
                  {exercise.difficulty === 'easy' && 'Leicht'}
                  {exercise.difficulty === 'medium' && 'Mittel'}
                  {exercise.difficulty === 'hard' && 'Schwer'}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleNewExercise}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Neue Aufgabe
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question - jetzt OBEN */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start justify-between gap-4">
                <p className="text-blue-900 flex-1">{exercise.question}</p>
                {!hintText && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGetHint}
                    disabled={isLoadingHint}
                    className="shrink-0"
                  >
                    {isLoadingHint ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Lädt...
                      </>
                    ) : (
                      <>
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Hilfe erhalten
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Hint Display */}
            {hintText && (
              <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-amber-800 text-lg flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-amber-500" />
                    Hinweise zur Lösung
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-sm max-w-none text-amber-900"
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdown(hintText),
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Circuit Diagram - versteckt bis Button geklickt */}
            {!showCircuit ? (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowCircuit(true)}
                  className="w-full max-w-md"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Schaltung anzeigen
                </Button>
              </div>
            ) : (
              <div className="flex justify-center overflow-x-auto">
                <CircuitDiagram circuit={exercise.circuit} width={700} height={350} />
              </div>
            )}

            {/* Answer Inputs */}
            <div className="space-y-4">
              <h4 className="font-semibold">Deine Antworten:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {exercise.requiredAnswers.map((req) => {
                  const result = checkResult?.answers.find((a) => a.answerId === req.id)
                  const hasResult = result !== undefined

                  return (
                    <div key={req.id} className="space-y-2">
                      <Label
                        htmlFor={req.id}
                        className={`flex items-center gap-2 ${
                          hasResult
                            ? result.isCorrect
                              ? 'text-green-700'
                              : 'text-red-700'
                            : ''
                        }`}
                      >
                        {req.label}
                        {hasResult && (
                          result.isCorrect ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )
                        )}
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id={req.id}
                          type="text"
                          placeholder="0.00"
                          value={userAnswers[req.id] || ''}
                          onChange={(e) => handleAnswerChange(req.id, e.target.value)}
                          disabled={checkResult !== null}
                          className={
                            hasResult
                              ? result.isCorrect
                                ? 'border-green-500 bg-green-50'
                                : 'border-red-500 bg-red-50'
                              : ''
                          }
                        />
                        <span className="text-sm text-gray-500 w-8">{req.unit}</span>
                      </div>
                      {hasResult && !result.isCorrect && (
                        <p className="text-xs text-red-600">
                          Richtige Antwort: {result.correctValue} {req.unit}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              {!checkResult && (
                <Button
                  onClick={handleCheckAnswers}
                  disabled={isChecking || Object.keys(userAnswers).length === 0}
                  className="flex-1"
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wird überprüft...
                    </>
                  ) : (
                    'Antworten prüfen'
                  )}
                </Button>
              )}

              {!solutionSteps && (
                <Button
                  variant="outline"
                  onClick={handleShowSolution}
                  disabled={isLoadingSolution}
                  className={checkResult ? 'flex-1' : ''}
                >
                  {isLoadingSolution ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Lösung wird geladen...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Lösung zeigen
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Solution Steps */}
            {solutionSteps && (
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800 text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Lösungsweg
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-sm max-w-none text-blue-900"
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdown(solutionSteps),
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {checkResult && (
              <div className="space-y-4">
                {checkResult.isCorrect ? (
                  <Alert variant="success" className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Perfekt!</AlertTitle>
                    <AlertDescription className="text-green-700">
                      Alle Antworten sind richtig! Super gemacht!
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <Alert variant="destructive" className="bg-red-50 border-red-200">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>Nicht ganz richtig</AlertTitle>
                      <AlertDescription>
                        Einige Antworten waren leider falsch. Schau dir die Erklärung unten an!
                      </AlertDescription>
                    </Alert>

                    {checkResult.explanation && (
                      <Card className="bg-yellow-50 border-yellow-200">
                        <CardHeader>
                          <CardTitle className="text-yellow-800 text-lg">
                            So löst du die Aufgabe richtig:
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div
                            className="prose prose-sm max-w-none text-yellow-900"
                            dangerouslySetInnerHTML={{
                              __html: formatMarkdown(checkResult.explanation),
                            }}
                          />
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}

                <Button onClick={handleNewExercise} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Neue Aufgabe
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Markdown to HTML converter with LaTeX support
function formatMarkdown(text: string): string {
  // First, process LaTeX formulas
  let processed = text

  // Block math ($$...$$)
  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_, latex) => {
    try {
      return `<div class="my-2 text-center">${katex.renderToString(latex.trim(), {
        displayMode: true,
        throwOnError: false
      })}</div>`
    } catch {
      return `<code class="bg-red-100 px-1 rounded">${latex}</code>`
    }
  })

  // Inline math ($...$) - but avoid matching things like "$5" (currency)
  processed = processed.replace(/\$([^$\n]+?)\$/g, (_, latex) => {
    // Skip if it looks like currency (just a number)
    if (/^\d+([.,]\d+)?$/.test(latex.trim())) {
      return `$${latex}$`
    }
    try {
      return katex.renderToString(latex.trim(), {
        displayMode: false,
        throwOnError: false
      })
    } catch {
      return `<code class="bg-red-100 px-1 rounded">${latex}</code>`
    }
  })

  return processed
    // Headers
    .replace(/^### (.*$)/gm, '<h3 class="font-bold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="font-bold text-lg mt-4 mb-2">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="font-bold text-xl mt-4 mb-2">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic (be careful not to match already processed content)
    .replace(/(?<![a-zA-Z])\*([^*]+?)\*(?![a-zA-Z])/g, '<em>$1</em>')
    // Code
    .replace(/`(.*?)`/g, '<code class="bg-yellow-100 px-1 rounded">$1</code>')
    // Line breaks
    .replace(/\n/g, '<br />')
    // Lists
    .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
    .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4">$2</li>')
}
