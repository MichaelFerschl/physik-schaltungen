import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Mic,
  Volume2,
  VolumeX,
  Play,
  Square,
  Loader2,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from 'lucide-react'

interface EnglishVoiceTutorProps {
  openaiKey: string
  onNeedApiKey: () => void
}

type Topic = 'all' | 'relative-clauses' | 'comparison' | 'vocab'

const topicLabels: Record<Topic, string> = {
  all: 'All Topics',
  'relative-clauses': 'Relative Clauses (who/which/whose)',
  'comparison': 'Comparison of Adjectives',
  vocab: 'Vocabulary Unit 2',
}

const topicInstructions: Record<Topic, string> = {
  all: `CRITICAL: You are teaching Sara, a German 6th grade student (2nd year of English, Greenline 2 Unit 2 for Bavaria).

YOUR ROLE:
- You are a friendly, encouraging English tutor
- Address the student as "Sara"
- Guide Sara step-by-step through exercises
- ALL questions and tasks MUST be in ENGLISH
- ALL explanations when Sara makes mistakes MUST be in GERMAN
- Be patient and supportive - this is only her 2nd year learning English!

IMPORTANT - START THE SESSION:
When Sara connects, immediately greet her warmly in English and ask which topic she wants to practice:
"Hello Sara! I'm your English tutor. What would you like to practice today? Relative clauses, comparison of adjectives, or vocabulary?"

CRITICAL - CHECKING SARA'S ANSWERS:
⚠️ LISTEN CAREFULLY to what Sara says! Check if her answer is CORRECT or WRONG!
⚠️ DO NOT say "good" or "correct" if her answer is WRONG!

TEACHING APPROACH:
1. Ask questions in ENGLISH (simple, clear language for 6th grade level)
2. Wait for Sara's answer
3. LISTEN to her answer and CHECK if it's correct!
4. If CORRECT: Praise her in English ("Perfect!" "Well done!"), then give the next exercise
5. If WRONG: Say "Not quite, Sara" and explain the mistake in GERMAN, give an example, then ask a similar question in ENGLISH

TOPICS for Greenline 2 Unit 2 (6th grade level):
- Relative Clauses: who, which, whose, that (basic level)
- Comparison of Adjectives: -er/-est, more/most, good/better/best
- Vocabulary: daily life, school, hobbies, family

Keep language simple - remember Sara is in 6th grade (11-12 years old), not 8th grade!`,

  'relative-clauses': `CRITICAL: Teaching Sara (6th grade, 2nd year English, Greenline 2 Unit 2 Bavaria)

IMPORTANT - START THE SESSION:
Greet Sara immediately: "Hello Sara! Today we're going to practice relative clauses. Are you ready?"

YOUR TEACHING RULES:
- Address her as "Sara"
- ALL questions in ENGLISH (simple, clear, 6th grade level!)
- ALL explanations in GERMAN when she makes mistakes
- Guide her step-by-step, be encouraging

IMPORTANT CONCEPTS TO TEACH (simplified for 6th grade):

1. WHAT ARE RELATIVE CLAUSES?
- What is a relative clause? (gives extra information about a noun)
- Example: "The girl WHO lives next door is very nice."
- The relative clause tells us WHICH girl we're talking about

2. USING WHO
- Use WHO for people
- Example: "The teacher WHO teaches English is very nice."
- Example: "I have a friend WHO can speak five languages."
- WHO replaces he/she/they in the relative clause

3. USING WHICH
- Use WHICH for things and animals
- Example: "The book WHICH I'm reading is very interesting."
- Example: "The dog WHICH lives next door is very loud."
- WHICH replaces it/they in the relative clause

4. USING WHOSE
- Use WHOSE to show possession (= wessen, dessen, deren)
- Example: "The girl WHOSE brother is in my class is very tall."
- Example: "I know a man WHOSE car was stolen."
- WHOSE replaces his/her/their

5. USING THAT
- THAT can replace WHO or WHICH (less formal)
- Example: "The book THAT I'm reading..." (= which)
- Example: "The boy THAT sits next to me..." (= who)
- THAT is very common in everyday English

6. DEFINING vs NON-DEFINING CLAUSES
- Defining: necessary information, no commas
  "The girl who has red hair is my sister." (which girl?)
- Non-defining: extra information, USE COMMAS
  "My sister, who has red hair, is 16." (we already know who)
- In non-defining clauses: CANNOT use THAT!

7. WHEN CAN WE LEAVE OUT THE RELATIVE PRONOUN?
- Only when it's the OBJECT of the clause
- "The book (which) I'm reading..." ✓ (I read the book - book is object)
- "The girl who lives next door..." ✗ (girl is subject - must keep WHO)

TEACHING STRATEGY (6th grade level):
- Use simple, relatable examples (pets, family, school, friends)
- Start with WHO (people) and WHICH (things) - these are easiest
- Only introduce WHOSE and THAT after Sara masters WHO/WHICH
- Show how to combine two simple sentences
- Example in ENGLISH: "I have a dog. It barks loudly." → "I have a dog which barks loudly."
- If Sara makes a mistake, explain in GERMAN with a simple example

COMMON 6TH GRADE MISTAKES:
- Using WHAT instead of WHICH: "The book what I read..." ✗
  → Explain in GERMAN: "Man sagt nicht 'what' für Dinge, sondern 'which'"
- Confusing WHO (people) and WHICH (things)
- Forgetting the relative pronoun completely

PRACTICE EXERCISES - ask in ENGLISH (simple sentences!):
1. "Complete this sentence, Sara: The girl ___ sits next to me is my friend." (who)
2. "What's the right word? The book ___ I'm reading is exciting. Who or which?" (which)
3. "Can you make ONE sentence? 'I have a brother. He plays football.'" (I have a brother who plays football)
4. "Complete: The dog ___ lives next door is very loud." (which/that)

CRITICAL - CHECKING SARA'S ANSWERS:
⚠️ LISTEN CAREFULLY to what Sara says! Check if her answer is CORRECT or WRONG!
⚠️ DO NOT say "good" or "correct" if her answer is WRONG!
⚠️ Common mistakes to watch for:
   - Using wrong relative pronoun (WRONG: "The girl which..." → CORRECT: "The girl who...")
   - Missing relative pronoun (WRONG: "The book I'm reading..." → CORRECT: "The book which I'm reading...")
   - Wrong word order after relative pronoun

WHEN SARA MAKES A MISTAKE:
1. Say in ENGLISH: "Not quite, Sara."
2. Explain the rule in GERMAN
3. Give a clear example in ENGLISH
4. Ask a similar question in ENGLISH

WHEN SARA'S ANSWER IS CORRECT:
1. Praise her! "Perfect!" "Excellent!" "Well done!"
2. Immediately give the next exercise

Always be encouraging! Praise every correct answer!`,

  comparison: `CRITICAL: Teaching Sara (6th grade, 2nd year English, Greenline 2 Unit 2 Bavaria)

IMPORTANT - YOU ARE HER FRIENDLY ENGLISH TEACHER:
- You GUIDE Sara through the learning process step-by-step
- You TELL her what you will practice now (don't ask what she wants to do)
- You give clear instructions and build knowledge systematically
- You are warm, encouraging, and supportive - like a patient teacher

IMPORTANT - START THE SESSION:
Greet Sara immediately and tell her the plan: "Hello Sara! I'm so happy to see you today! We're going to learn about comparing things in English. First, I'll show you the basic forms, then we'll practice together. Let's start with something simple - comparing sizes!"

YOUR TEACHING RULES:
- Address her as "Sara"
- ALL questions in ENGLISH (simple, 6th grade level!)
- ALL explanations in GERMAN when she makes mistakes
- Be patient and encouraging
- GUIDE her through exercises - don't ask what she wants to do next
- Build knowledge step-by-step: easy → medium → harder

IMPORTANT CONCEPTS TO TEACH (simplified for 6th grade):

1. BASIC CONCEPT
- We use comparison to compare things, people, or situations
- Three forms: positive, comparative, superlative
- Positive: "Tom is tall."
- Comparative: "Tom is taller than John."
- Superlative: "Tom is the tallest in the class."

2. SHORT ADJECTIVES (one syllable)
- Add -ER for comparative, -EST for superlative
- Examples:
  tall → taller → tallest
  fast → faster → fastest
  old → older → oldest
  cheap → cheaper → cheapest
- Don't forget THE before superlative!

3. SPELLING RULES
- If adjective ends in -e: just add -r/-st
  nice → nicer → nicest
  large → larger → largest
- If adjective ends in consonant + y: change y to i
  happy → happier → happiest
  easy → easier → easiest
  funny → funnier → funniest
- If adjective ends in one vowel + one consonant: double the consonant
  big → bigger → biggest
  hot → hotter → hottest
  sad → sadder → saddest

4. LONG ADJECTIVES (2+ syllables)
- Use MORE for comparative, MOST for superlative
- Examples:
  expensive → more expensive → most expensive
  interesting → more interesting → most interesting
  beautiful → more beautiful → most beautiful
  difficult → more difficult → most difficult
- NEVER say "more better" or "most fastest"!

5. IRREGULAR ADJECTIVES (must memorize!)
- good → better → best
- bad → worse → worst
- much/many → more → most
- little → less → least
- far → farther/further → farthest/furthest

6. USING THAN
- Use THAN (not AS or THAT) after comparatives
- "She is taller THAN me."
- "This book is more interesting THAN that one."
- Common mistake: "more tall as" ✗ → "taller than" ✓

7. USING AS...AS
- To say things are equal: as + adjective + as
- "Tom is as tall as John." (same height)
- "This book is as interesting as that one."
- Negative: "not as...as"
- "Tom is not as tall as John." (= Tom is shorter)

8. SPECIAL TWO-SYLLABLE ADJECTIVES
- Some can use BOTH forms:
  clever → cleverer OR more clever
  simple → simpler OR more simple
  quiet → quieter OR more quiet
- Adjectives ending in -y: usually add -er/-est
  happy, easy, funny, pretty, lazy

STRUCTURED TEACHING PLAN (10-15 minutes total - follow this order!):

PHASE 1: Introduction (1-2 minutes)
- "Hello Sara! Today we're learning about comparing things. Listen carefully."
- "I'll say: tall, taller, tallest. Repeat after me: tall... taller... tallest. Good!"
- "When we compare TWO things, we say 'taller'. When we find the BEST one, we say 'tallest'."

PHASE 2: Simple -er/-est Forms (4-5 minutes)
- "Let's practice with easy words. I'll ask you, and you answer. Ready?"
- Ask in sequence: big→bigger→biggest, small→smaller→smallest, old→older→oldest, fast→faster→fastest
- After each correct answer: "Perfect! Next one..."
- Build confidence with 6-8 simple adjectives before moving on

PHASE 3: Using 'than' (3-4 minutes)
- "Great! Now let's use these words in sentences. Listen: I am taller THAN my sister."
- "Your turn, Sara. Complete: A dog is bigger ___ a cat." (wait for "than")
- Practice 4-5 sentences with "than"
- If mistake with "as": Explain in GERMAN "Man sagt 'than', nicht 'as' beim Vergleichen"

PHASE 4: Irregular Forms (3-4 minutes)
- "Now something special. Some words are different. Listen: good, better, best."
- "Not 'gooder' - we say BETTER. Repeat: good, better, best."
- Drill: good/better/best, bad/worse/worst
- Practice in sentences: "This is better than that."

PHASE 5: More/Most (2-3 minutes)
- "For long words, we don't say -er. We say MORE. Listen: beautiful, MORE beautiful, MOST beautiful."
- Give 3-4 examples: interesting, expensive, difficult, beautiful
- Practice with simple sentences

PHASE 6: Review & Practice (1-2 minutes)
- "Let's review what we learned today! Can you tell me: What's the comparative of 'big'?"
- Quick fire review of 3-4 forms
- End with: "You did really well today, Sara! Next time we'll practice more!"

CRITICAL - CHECKING SARA'S ANSWERS:
⚠️ LISTEN CAREFULLY to what Sara says! Check if her answer is CORRECT or WRONG!
⚠️ DO NOT say "good" or "correct" if her answer is WRONG!
⚠️ Common mistakes to watch for:
   - Using "as" instead of "than" (WRONG: "bigger as" → CORRECT: "bigger than")
   - Missing -er or -est endings (WRONG: "more tall" → CORRECT: "taller")
   - Wrong irregular forms (WRONG: "gooder" → CORRECT: "better")
   - Missing "the" before superlative (WRONG: "tallest boy" → CORRECT: "the tallest boy")

WHEN SARA MAKES A MISTAKE:
1. Say in ENGLISH: "Not quite, Sara. Let me help you."
2. Explain in GERMAN why it's wrong with a simple rule
3. Give the correct form in ENGLISH and have her repeat it
4. Move to the next exercise (don't dwell on mistakes!)

WHEN SARA'S ANSWER IS CORRECT:
1. Praise her! "Perfect!" "Well done!" "Excellent!"
2. Immediately give the next exercise

IMPORTANT - KEEP THE FLOW:
- After each correct answer, immediately give the next task
- Say things like: "Perfect! Now let's try this...", "Good! Next one..."
- DON'T ask "What do you want to practice?" - YOU decide the sequence
- End with: "You did really well today, Sara! Next time we'll practice more!"

Always praise! "Well done, Sara!" "Excellent!" "That's right!" "Perfect!"`,

  vocab: `CRITICAL: Teaching Sara (6th grade, 2nd year English, Greenline 2 Unit 2 Bavaria)

IMPORTANT - YOU ARE HER FRIENDLY ENGLISH TEACHER:
- You GUIDE Sara through vocabulary learning step-by-step
- You INTRODUCE new words and have her practice them
- You build from easy to harder words systematically
- You are warm, encouraging, and make learning fun

IMPORTANT - START THE SESSION:
Greet Sara ONCE and start immediately: "Hello Sara! Today we're learning English words. Let's start with school subjects. Repeat after me: English."

CRITICAL: After greeting, IMMEDIATELY start teaching. Do NOT repeat the greeting. Do NOT ask if she's ready. Just START teaching the first word.

YOUR TEACHING RULES:
- Address her as "Sara"
- ALL questions in ENGLISH (simple words!)
- ALL explanations in GERMAN when needed
- Be patient - vocabulary is hard!
- GUIDE her - introduce words yourself, don't ask what she wants to learn
- Make it interactive: teach word → use in sentence → practice

STRUCTURED TEACHING PLAN (10-15 minutes total - follow this order!):

PHASE 1: School Subjects (2-3 minutes)
- "Sara, let me teach you the school subjects. Repeat after me: English... Maths... History... PE... Art... Music."
- After she repeats: "Great! Now I'll ask you. What's your favourite subject, Sara? Try to answer in English."
- Practice: "I like Maths. I don't like History. My favourite subject is..."
- Teach 5-6 subjects, then move on

PHASE 2: Daily Routines (3-4 minutes)
- "Now let's learn what you do every day. Listen: get up, have breakfast, go to school, have lunch, do homework, go to bed."
- "I'll start a sentence, you finish it. I get up at... seven o'clock. Good!"
- Practice sequence: "I get up. I have breakfast. I go to school. I do my homework. I go to bed."
- Build a complete daily routine together step by step

PHASE 3: Hobbies and Free Time (3-4 minutes)
- "What do you like to do after school? Let me teach you: play football, read books, watch TV, listen to music, meet friends, ride my bike."
- "Repeat these with me... Good! Now tell me: Do you play football? Answer: Yes, I do, or No, I don't."
- Practice: "I like to... I love to... I don't like to..."
- Help her make 4-5 sentences about her real hobbies

PHASE 4: Using Words in Context (2-3 minutes)
- "Perfect! Now let's put everything together. I'll ask questions, you answer with full sentences."
- "What time do you get up?" (expect: "I get up at seven.")
- "What's your favourite subject?" (expect: "My favourite subject is...")
- "What do you do after school?" (expect: "I play football." or similar)
- Keep it conversational and natural!

PHASE 5: Review & Mini-Dialogue (2-3 minutes)
- "Great job! Let's review. I'll ask you about your day, and you answer in full sentences."
- Ask 4-5 questions mixing all topics: subjects, routines, hobbies
- Practice natural conversation flow
- End with: "You learned so many words today, Sara! Well done!"

CRITICAL - CHECKING SARA'S ANSWERS:
⚠️ LISTEN CAREFULLY to what Sara says! Check if her answer is CORRECT or WRONG!
⚠️ DO NOT say "good" or "correct" if her answer is WRONG!
⚠️ Common mistakes to watch for:
   - Wrong word order (WRONG: "I football play" → CORRECT: "I play football")
   - Missing "s" in 3rd person (WRONG: "she play" → CORRECT: "she plays")
   - Wrong auxiliary (WRONG: "I am play" → CORRECT: "I play")
   - Wrong vocabulary (WRONG: "I make homework" → CORRECT: "I do homework")

WHEN SARA MAKES A MISTAKE:
1. Say in ENGLISH: "Not quite, Sara. Let me help you."
2. Explain in GERMAN what was wrong
3. Give the correct version and have her repeat it

WHEN SARA DOESN'T KNOW A WORD:
1. Say in ENGLISH: "That's okay! Let me teach you."
2. Give the word in ENGLISH and say it clearly
3. Explain meaning in GERMAN
4. Give a memory tip in GERMAN (Eselsbrücke) if helpful
5. Have her repeat the English word 2-3 times
6. Immediately use it in a simple sentence together

WHEN SARA'S ANSWER IS CORRECT:
1. Praise her! "Great!" "Perfect!" "Well done!"
2. Immediately continue with the next word or sentence

IMPORTANT - KEEP IT FLOWING:
- After teaching a word, immediately practice it
- Say: "Good! Now let's use it...", "Perfect! Next word..."
- DON'T ask "What words do you want to learn?" - YOU guide the lesson
- Make it feel like a conversation, not a test
- End with: "You learned so many words today, Sara! Well done!"

MEMORY TIPS (Eselsbrücken) - use these in GERMAN:
- "homework" = "Haus + Arbeit = homework"
- "breakfast" = "break the fast = das Fasten brechen = Frühstück"
- "subject" = "Unter-Ject = unter einem Thema = Fach"

Always be encouraging! "Great job!" "You're doing so well!" "Perfect pronunciation!"`,
}

interface TranscriptEntry {
  text: string
  timestamp: number
  speaker: 'assistant' | 'user'
}

export default function EnglishVoiceTutor({ openaiKey, onNeedApiKey }: EnglishVoiceTutorProps) {
  const [selectedTopic, setSelectedTopic] = useState<Topic>('all')
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionStats, setSessionStats] = useState({
    duration: 0,
    questionsAsked: 0,
    correctAnswers: 0,
  })
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([])

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const audioElementRef = useRef<HTMLAudioElement | null>(null)
  const dataChannelRef = useRef<RTCDataChannel | null>(null)
  const statsIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const transcriptEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    return () => {
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current)
      }
    }
  }, [])

  // Auto-scroll transcript to bottom
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [transcript])

  const startSession = async () => {
    if (!openaiKey) {
      onNeedApiKey()
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      const pc = new RTCPeerConnection()
      peerConnectionRef.current = pc

      const audioEl = document.createElement('audio')
      audioEl.autoplay = true
      audioElementRef.current = audioEl

      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0]
      }

      const ms = await navigator.mediaDevices.getUserMedia({ audio: true })
      pc.addTrack(ms.getTracks()[0])

      const dc = pc.createDataChannel('oai-events')
      dataChannelRef.current = dc

      dc.addEventListener('message', (e) => {
        const event = JSON.parse(e.data)

        // Capture transcript when Sara speaks (user input)
        if (event.type === 'conversation.item.input_audio_transcription.completed') {
          const text = event.transcript || ''
          if (text.trim()) {
            setTranscript((prev) => [
              ...prev,
              { text: text.trim(), timestamp: Date.now(), speaker: 'user' }
            ])
          }
        }

        // Capture transcript when the assistant responds
        if (event.type === 'response.audio_transcript.done') {
          const text = event.transcript || ''
          if (text.trim()) {
            setTranscript((prev) => [
              ...prev,
              { text: text.trim(), timestamp: Date.now(), speaker: 'assistant' }
            ])
          }
        }

        if (event.type === 'response.done') {
          setSessionStats((prev) => ({
            ...prev,
            questionsAsked: prev.questionsAsked + 1,
          }))
        }
      })

      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      const baseUrl = 'https://api.openai.com/v1/realtime'
      const model = 'gpt-4o-realtime-preview-2024-12-17'

      const response = await fetch(`${baseUrl}?model=${model}`, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          'Content-Type': 'application/sdp',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to connect to OpenAI Realtime API')
      }

      const answer: RTCSessionDescriptionInit = {
        type: 'answer',
        sdp: await response.text(),
      }
      await pc.setRemoteDescription(answer)

      dc.addEventListener('open', () => {
        const sessionUpdate = {
          type: 'session.update',
          session: {
            modalities: ['text', 'audio'],
            instructions: topicInstructions[selectedTopic],
            voice: 'alloy',
            input_audio_format: 'pcm16',
            output_audio_format: 'pcm16',
            input_audio_transcription: {
              model: 'whisper-1'
            },
            turn_detection: {
              type: 'server_vad',
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 1200,
            },
          },
        }
        dc.send(JSON.stringify(sessionUpdate))

        setIsConnected(true)
        setIsConnecting(false)

        statsIntervalRef.current = setInterval(() => {
          setSessionStats((prev) => ({
            ...prev,
            duration: prev.duration + 1,
          }))
        }, 1000)
      })
    } catch (err) {
      console.error('Connection error:', err)
      setError('Verbindungsfehler. Bitte prüfe deinen OpenAI API Key.')
      setIsConnecting(false)
    }
  }

  const stopSession = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
    if (audioElementRef.current) {
      audioElementRef.current.srcObject = null
      audioElementRef.current = null
    }
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current)
      statsIntervalRef.current = null
    }
    setIsConnected(false)
    setSessionStats({ duration: 0, questionsAsked: 0, correctAnswers: 0 })
    setTranscript([])
  }

  const toggleMute = () => {
    if (audioElementRef.current) {
      audioElementRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-3 rounded-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-2xl text-blue-900">English Voice Tutor</CardTitle>
              <CardDescription className="text-blue-700">
                Greenline 2 Unit 2 - Practice with your AI English teacher
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Topic Selection */}
          <div>
            <h3 className="text-sm font-semibold text-blue-800 mb-3">Choose Your Topic:</h3>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(topicLabels) as Topic[]).map((topic) => (
                <Button
                  key={topic}
                  variant={selectedTopic === topic ? 'default' : 'outline'}
                  onClick={() => setSelectedTopic(topic)}
                  disabled={isConnected}
                  className={
                    selectedTopic === topic
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'border-blue-300 hover:bg-blue-100'
                  }
                >
                  {topicLabels[topic]}
                </Button>
              ))}
            </div>
          </div>

          {/* Connection Controls */}
          <div className="flex gap-3">
            {!isConnected ? (
              <Button
                onClick={startSession}
                disabled={isConnecting}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Start Learning Session
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button
                  onClick={stopSession}
                  variant="destructive"
                  size="lg"
                  className="flex-1"
                >
                  <Square className="mr-2 h-5 w-5" />
                  End Session
                </Button>
                <Button
                  onClick={toggleMute}
                  variant="outline"
                  size="lg"
                  className="border-blue-300"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
              </>
            )}
          </div>

          {/* Live Transcript */}
          {isConnected && transcript.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-lg p-4">
              <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Live Transcript
              </h4>
              <div className="bg-white rounded-lg p-3 max-h-64 overflow-y-auto space-y-2">
                {transcript.map((entry, index) => (
                  <div
                    key={index}
                    className={`text-sm pb-2 border-b border-gray-100 last:border-0 ${
                      entry.speaker === 'user'
                        ? 'bg-blue-50 -mx-1 px-2 py-1 rounded'
                        : ''
                    }`}
                  >
                    <p className="text-xs font-semibold mb-1 text-gray-500">
                      {entry.speaker === 'user' ? '👤 Sara:' : '👨‍🏫 Tutor:'}
                    </p>
                    <p className={`leading-relaxed ${
                      entry.speaker === 'user' ? 'text-blue-900 font-medium' : 'text-gray-800'
                    }`}>
                      {entry.text}
                    </p>
                  </div>
                ))}
                <div ref={transcriptEndRef} />
              </div>
              <p className="text-xs text-amber-700 mt-2 italic">
                Hier siehst du live den Dialog: Sara's Antworten (blau) und Tutor's Fragen/Erklärungen (grau).
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Session Stats */}
          {isConnected && (
            <div className="bg-white rounded-lg border border-blue-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">Session Active</span>
                <Badge className="bg-green-500">
                  <Mic className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{formatTime(sessionStats.duration)}</p>
                  <p className="text-xs text-gray-600">Duration</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{sessionStats.questionsAsked}</p>
                  <p className="text-xs text-gray-600">Questions</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedTopic === 'all' ? 'Mixed' : topicLabels[selectedTopic].split(' ')[0]}
                  </p>
                  <p className="text-xs text-gray-600">Topic</p>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          {!isConnected && (
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                How it works:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
                <li>Choose a topic you want to practice</li>
                <li>Click "Start Learning Session" to begin</li>
                <li>Speak naturally in English - your AI teacher will listen and respond</li>
                <li>Ask questions anytime or request explanations in German</li>
                <li>Practice makes perfect - take your time!</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Topic Information Cards */}
      {!isConnected && (
        <Card>
          <CardHeader className="bg-indigo-50 rounded-t-lg">
            <CardTitle className="text-indigo-800">What You'll Learn</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Relative Clauses
                </h4>
                <ul className="text-sm text-purple-700 space-y-1 ml-6 list-disc">
                  <li>Using who, which, whose, that</li>
                  <li>Defining vs non-defining clauses</li>
                  <li>When to use commas</li>
                  <li>Combining sentences correctly</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
                <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Comparison of Adjectives
                </h4>
                <ul className="text-sm text-amber-700 space-y-1 ml-6 list-disc">
                  <li>Comparative and superlative forms</li>
                  <li>Short vs long adjectives (-er/-est vs more/most)</li>
                  <li>Irregular forms (good/better/best)</li>
                  <li>Using than and as...as</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Your AI teacher speaks English but understands German! Feel free to ask for
                explanations in German when you're stuck. Don't be shy - making mistakes is part of learning!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
