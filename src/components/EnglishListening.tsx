import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Volume2,
  Headphones,
  FileText,
  Loader2,
} from 'lucide-react'
import { generateListeningExercise, checkListeningAnswer, type ListeningExercise, type AnswerCheckResult } from '@/services/claude'

interface EnglishListeningProps {
  apiKey: string
  onNeedApiKey: () => void
}

interface QuestionResult {
  isCorrect: boolean
  feedback: string
  spellingErrors: string[]
  grammarErrors: string[]
  encouragement: string
}

export default function EnglishListening({ apiKey, onNeedApiKey }: EnglishListeningProps) {
  const [exercise, setExercise] = useState<ListeningExercise | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudio] = useState<HTMLAudioElement | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  // Question answers
  const [questionAnswers, setQuestionAnswers] = useState<string[]>([])
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([])

  // Gap fill answers
  const [gapAnswers, setGapAnswers] = useState<string[]>([])
  const [gapResults, setGapResults] = useState<boolean[]>([])

  const [showResults, setShowResults] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const generateExercise = async () => {
    if (!apiKey) {
      onNeedApiKey()
      return
    }

    setIsGenerating(true)
    try {
      const newExercise = await generateListeningExercise(apiKey)
      setExercise(newExercise)
      setQuestionAnswers(new Array(newExercise.questions.length).fill(''))
      setQuestionResults([])
      setGapAnswers(new Array(newExercise.gapFill.gaps.length).fill(''))
      setGapResults([])
      setShowResults(false)
      setHasSubmitted(false)
    } catch (error) {
      console.error('Error generating exercise:', error)
      alert('Fehler beim Erstellen der Übung. Bitte prüfe deinen API Key.')
    } finally {
      setIsGenerating(false)
    }
  }

  const playAudio = async () => {
    if (!exercise) return

    setIsPlaying(true)

    // Use Web Speech API for text-to-speech
    const utterance = new SpeechSynthesisUtterance(exercise.text)
    utterance.lang = 'en-GB' // British English
    utterance.rate = 0.9 // Slightly slower for learning

    utterance.onend = () => {
      setIsPlaying(false)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
      alert('Audio playback error. Please try again.')
    }

    window.speechSynthesis.speak(utterance)
  }

  const stopAudio = () => {
    window.speechSynthesis.cancel()
    setIsPlaying(false)
  }

  const checkAnswers = async () => {
    if (!exercise || !apiKey) return

    setIsChecking(true)
    try {
      // Check comprehension questions with AI
      const qResultsPromises = exercise.questions.map(async (q, idx) => {
        const userAnswer = questionAnswers[idx].trim()
        if (!userAnswer) {
          return {
            isCorrect: false,
            feedback: 'Du hast keine Antwort gegeben.',
            spellingErrors: [],
            grammarErrors: [],
            encouragement: 'Versuche es beim nächsten Mal!'
          }
        }
        return await checkListeningAnswer(apiKey, q.question, q.answer, userAnswer)
      })
      const qResults = await Promise.all(qResultsPromises)
      setQuestionResults(qResults)

      // Check gap fill (simple string comparison for gaps)
      const gResults = exercise.gapFill.gaps.map((gap, idx) => {
        const userAnswer = gapAnswers[idx].trim().toLowerCase()
        const correctAnswer = gap.answer.toLowerCase()

        // Check for exact match or acceptable alternative
        return userAnswer === correctAnswer || gap.acceptableAnswers?.some(a => a.toLowerCase() === userAnswer) || false
      })
      setGapResults(gResults)

      setShowResults(true)
      setHasSubmitted(true)
    } catch (error) {
      console.error('Error checking answers:', error)
      alert('Fehler beim Prüfen der Antworten. Bitte versuche es erneut.')
    } finally {
      setIsChecking(false)
    }
  }

  const resetExercise = () => {
    setQuestionAnswers(new Array(exercise?.questions.length || 0).fill(''))
    setGapAnswers(new Array(exercise?.gapFill.gaps.length || 0).fill(''))
    setQuestionResults([])
    setGapResults([])
    setShowResults(false)
    setHasSubmitted(false)
  }

  const calculateScore = () => {
    if (!showResults) return 0
    const correctQuestions = questionResults.filter(r => r.isCorrect).length
    const correctGaps = gapResults.filter(r => r).length
    const totalQuestions = questionResults.length + gapResults.length
    return Math.round(((correctQuestions + correctGaps) / totalQuestions) * 100)
  }

  const renderTextWithGaps = () => {
    if (!exercise) return null

    // Split text by ___ placeholder
    const textParts = exercise.gapFill.text.split('___')
    const parts: JSX.Element[] = []

    textParts.forEach((textPart, index) => {
      // Add text part
      parts.push(
        <span key={`text-${index}`}>{textPart}</span>
      )

      // Add gap input (except after the last text part)
      if (index < textParts.length - 1 && index < exercise.gapFill.gaps.length) {
        const gapIdx = index
        const gap = exercise.gapFill.gaps[gapIdx]

        parts.push(
          <span key={`gap-${gapIdx}`} className="inline-flex items-center mx-1">
            <Input
              value={gapAnswers[gapIdx] || ''}
              onChange={(e) => {
                const newAnswers = [...gapAnswers]
                newAnswers[gapIdx] = e.target.value
                setGapAnswers(newAnswers)
              }}
              disabled={hasSubmitted}
              className={`w-32 h-8 text-sm inline-block ${
                showResults
                  ? gapResults[gapIdx]
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : ''
              }`}
              placeholder={`(${gapIdx + 1})`}
            />
            {showResults && !gapResults[gapIdx] && (
              <span className="ml-2 text-xs text-green-700 font-medium">
                → {gap.answer}
              </span>
            )}
          </span>
        )
      }
    })

    return parts
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 text-white p-3 rounded-lg">
                <Headphones className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl text-indigo-900">Listening Comprehension</CardTitle>
                <CardDescription className="text-indigo-700">
                  Greenline 2 Unit 2 - Test your listening skills
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={generateExercise}
              disabled={isGenerating}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  New Exercise
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* No Exercise Yet */}
      {!exercise && !isGenerating && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Headphones className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Ready to practice listening?</h3>
              <p className="text-gray-600 mb-4">
                Click "New Exercise" to generate a listening comprehension task
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exercise Content */}
      {exercise && (
        <>
          {/* Audio Player Card */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Audio Text
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                {!isPlaying ? (
                  <Button
                    onClick={playAudio}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Play Audio
                  </Button>
                ) : (
                  <Button
                    onClick={stopAudio}
                    size="lg"
                    variant="destructive"
                  >
                    <Pause className="mr-2 h-5 w-5" />
                    Stop
                  </Button>
                )}
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 text-center italic">
                  Listen carefully! You can play the audio as many times as you need.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Comprehension Questions */}
          <Card>
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-900 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Comprehension Questions
              </CardTitle>
              <CardDescription>Answer the questions about the text in English</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {exercise.questions.map((q, idx) => (
                <div key={idx} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">
                      {idx + 1}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">{q.question}</p>
                      <Textarea
                        value={questionAnswers[idx]}
                        onChange={(e) => {
                          const newAnswers = [...questionAnswers]
                          newAnswers[idx] = e.target.value
                          setQuestionAnswers(newAnswers)
                        }}
                        disabled={hasSubmitted}
                        placeholder="Your answer in English..."
                        className={`min-h-[80px] ${
                          showResults
                            ? questionResults[idx]
                              ? 'border-green-500 bg-green-50'
                              : 'border-red-500 bg-red-50'
                            : ''
                        }`}
                      />
                      {showResults && questionResults[idx] && (
                        <div className="mt-2 space-y-2">
                          <div className="flex items-start gap-2">
                            {questionResults[idx].isCorrect ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="text-sm flex-1">
                              <p className="font-medium text-gray-800">{questionResults[idx].feedback}</p>
                            </div>
                          </div>

                          {/* Spelling Errors */}
                          {questionResults[idx].spellingErrors.length > 0 && (
                            <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                              <p className="text-xs font-semibold text-yellow-800 mb-1">✏️ Rechtschreibfehler:</p>
                              {questionResults[idx].spellingErrors.map((err, errIdx) => (
                                <p key={errIdx} className="text-xs text-yellow-700">{err}</p>
                              ))}
                            </div>
                          )}

                          {/* Grammar Errors */}
                          {questionResults[idx].grammarErrors.length > 0 && (
                            <div className="bg-orange-50 p-2 rounded border border-orange-200">
                              <p className="text-xs font-semibold text-orange-800 mb-1">📚 Grammatikfehler:</p>
                              {questionResults[idx].grammarErrors.map((err, errIdx) => (
                                <p key={errIdx} className="text-xs text-orange-700">{err}</p>
                              ))}
                            </div>
                          )}

                          {/* Model Answer */}
                          <div className="bg-blue-50 p-2 rounded border border-blue-200">
                            <p className="text-xs font-semibold text-blue-800 mb-1">Model answer:</p>
                            <p className="text-xs text-blue-700">{q.answer}</p>
                          </div>

                          {/* Encouragement */}
                          <p className="text-xs text-green-700 italic">{questionResults[idx].encouragement}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Gap Fill Exercise */}
          <Card>
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-purple-900 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Gap Fill Exercise
              </CardTitle>
              <CardDescription>Fill in the missing words</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 leading-relaxed text-gray-800">
                {renderTextWithGaps()}
              </div>
            </CardContent>
          </Card>

          {/* Submit & Results */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-3">
                  {!hasSubmitted ? (
                    <Button
                      onClick={checkAnswers}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isChecking}
                    >
                      {isChecking ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Checking with AI...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-5 w-5" />
                          Check Answers
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={resetExercise}
                      size="lg"
                      variant="outline"
                    >
                      <RotateCcw className="mr-2 h-5 w-5" />
                      Try Again
                    </Button>
                  )}
                </div>
                {showResults && (
                  <div className="text-right">
                    <p className="text-3xl font-bold text-indigo-600">{calculateScore()}%</p>
                    <p className="text-sm text-gray-600">Your Score</p>
                  </div>
                )}
              </div>

              {showResults && (
                <div className="space-y-3">
                  <Progress value={calculateScore()} className="h-2" />
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                    <p className="text-sm text-indigo-800">
                      <strong>
                        {calculateScore() >= 90
                          ? 'Excellent! 🌟'
                          : calculateScore() >= 70
                          ? 'Good job! 👍'
                          : calculateScore() >= 50
                          ? 'Keep practicing! 💪'
                          : 'Don\'t give up! 📚'}
                      </strong>
                      {' '}
                      You got {questionResults.filter(r => r.isCorrect).length + gapResults.filter(r => r).length} out of{' '}
                      {questionResults.length + gapResults.length} correct.
                      {calculateScore() < 70 && ' Listen to the audio again and try once more!'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
