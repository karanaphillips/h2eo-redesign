/* =========================================================
   Hero Academy — Course Data
   "Activate Your Superpowers™"
   8 modules × 4 archetypes | All learner levels
   ========================================================= */

window.HERO_COURSE_DATA = (function () {

  /* ── Archetype registry ─────────────────────────────── */
  const archetypes = {
    strategicArchitect: {
      key: 'strategicArchitect',
      name: 'Strategic Architect',
      emoji: '🏛️',
      tagline: 'Structure is your superpower.',
      color: '#1a3a6b',
      badgeClass: 'badge-blue',
      brief: 'You thrive on organization, planning, and clear systems. You learn best when you know exactly what to expect and can build a structured path to mastery.',
    },
    precisionOperator: {
      key: 'precisionOperator',
      name: 'Precision Operator',
      emoji: '🎯',
      tagline: 'Accuracy is your superpower.',
      color: '#0d9488',
      badgeClass: 'badge-teal',
      brief: 'You thrive on logic, depth, and evidence. You learn best when information is accurate, verifiable, and analytically rich.',
    },
    visionIntegrator: {
      key: 'visionIntegrator',
      name: 'Vision Integrator',
      emoji: '🔭',
      tagline: 'Imagination is your superpower.',
      color: '#7c3aed',
      badgeClass: 'badge-purple',
      brief: 'You thrive on creativity, meaning, and connection. You learn best when ideas connect to bigger concepts and you have room to explore.',
    },
    appliedExecutor: {
      key: 'appliedExecutor',
      name: 'Applied Executor',
      emoji: '⚡',
      tagline: 'Action is your superpower.',
      color: '#d4a843',
      badgeClass: 'badge-gold',
      brief: 'You thrive through hands-on practice, movement, and real-world application. You learn best when you can immediately try what you\'re studying.',
    },
  };

  /* Legacy archetype key aliases */
  const legacyMap = {
    mastermind: 'strategicArchitect',
    brainiac: 'precisionOperator',
    crusader: 'visionIntegrator',
    hero: 'appliedExecutor',
    // The Mastermind → Strategic Architect
    'The Mastermind': 'strategicArchitect',
    'Strategic Architect': 'strategicArchitect',
    // The Brainiac → Precision Operator
    'The Brainiac': 'precisionOperator',
    'Precision Operator': 'precisionOperator',
    // Creative Crusader → Vision Integrator
    'Creative Crusader': 'visionIntegrator',
    'The Creative Crusader': 'visionIntegrator',
    'Vision Integrator': 'visionIntegrator',
    // Hands-on Hero → Applied Executor
    'Hands-on Hero': 'appliedExecutor',
    'The Hands-on Hero': 'appliedExecutor',
    'Applied Executor': 'appliedExecutor',
  };

  function resolveArchetype(raw) {
    if (!raw) return null;
    if (archetypes[raw]) return raw;
    return legacyMap[raw] || null;
  }

  /* ── Module data ────────────────────────────────────── */
  const modules = [

    /* ─── MODULE 1: Reading Intelligence ──────────────── */
    {
      id: 'reading-intelligence',
      number: 1,
      title: 'Reading Intelligence',
      subtitle: 'The PREP Reading Method',
      icon: '📖',
      accentColor: '#0d9488',
      objective: 'Transform passive reading into active understanding using the PREP framework, personalized to your learning archetype.',
      intro: [
        'Most learners aren\'t bad readers. They\'ve simply never been taught how to read for learning. There\'s a meaningful difference between reading a novel for entertainment and reading a textbook, technical manual, or research article for understanding.',
        'Passive reading — highlighting everything, rereading paragraphs, finishing chapters without retention — is the default for most people. The result is a familiar frustration: you finish a chapter and think, "What did I just read?"',
        'The PREP Reading Method gives you a structured, four-stage process that works with your natural learning style. By the end of this module, you\'ll know exactly how to read any text deeply and efficiently.',
      ],
      framework: {
        name: 'PREP',
        steps: [
          { letter: 'P', word: 'Preview', desc: 'Before reading deeply, survey headings, vocabulary, charts, and summaries. Ask: What am I trying to learn from this?' },
          { letter: 'R', word: 'Read', desc: 'Engage in smaller sections (1–3 pages at a time). Highlight only major concepts, definitions, formulas, or key examples — not entire paragraphs.' },
          { letter: 'E', word: 'Extract', desc: 'After each section, write down the main idea, important vocabulary, key process, and any confusing concepts. Move information from passive reading into active processing.' },
          { letter: 'P', word: 'Prove', desc: 'Test yourself. Can you explain this without the book? Can you solve a problem using it? If not, review again. This is where learning becomes real.' },
        ],
      },
      universalTips: [
        { title: 'Stop highlighting everything', body: 'If everything is highlighted, nothing stands out. Use a simple color system: yellow for key concepts, blue for vocabulary, green for examples, and pink for questions or confusion.' },
        { title: 'Reading technical material in layers', body: 'For dense content (coding docs, scientific papers, legal text), approach it in four layers: first understand the big picture, then learn the vocabulary, then study examples, then practice application.' },
        { title: 'Protect your reading environment', body: 'Avoid reading while notifications are active. Try quiet spaces, focused reading blocks, and phone-silent sessions. Environmental control dramatically increases retention.' },
      ],
      archetypes: {
        strategicArchitect: {
          headline: 'Read Like a Strategic Architect',
          intro: 'You crave structure before you dive in. Use the Preview step as your blueprint — build a mental architecture of the chapter before reading a word.',
          strategies: [
            { title: 'Create a chapter outline first', body: 'Before reading, write a skeleton outline using only the headings and subheadings. This gives your brain a map to fill in as you read.' },
            { title: 'Build a reading schedule', body: 'Assign specific reading blocks in your calendar. Know in advance that today you\'re covering pages 40–65 and what you need to understand from them.' },
            { title: 'Use structured annotations', body: 'In the margin or in a notes doc, use consistent labels: DEF (definition), KEY (key concept), EX (example), ? (confused). Your notes will be scannable and organized.' },
            { title: 'Section summaries as you go', body: 'After each major section, write 2–3 sentences summarizing what you just read. Don\'t move forward until you can do this clearly.' },
          ],
          tools: ['Notion (structured notes)', 'Google Docs (outline template)', 'Physical planner', 'Cornell notes layout'],
          watchOut: 'Avoid spending so much time building the perfect reading system that you delay actually reading. Structure supports the reading — it doesn\'t replace it.',
          weeklyChallenge: 'For 7 days, create a chapter outline from headings before reading any assigned text. Then fill in your outline after each section. At the end of the week, compare your outlined summaries to the actual content.',
        },
        precisionOperator: {
          headline: 'Read Like a Precision Operator',
          intro: 'You want depth, not speed. Your job during reading is to question, verify, and understand the logic — not just absorb facts.',
          strategies: [
            { title: 'Ask analytical questions while reading', body: 'As you read each section, generate questions: Why does this work this way? What evidence supports this claim? What are the exceptions? Where does this break down?' },
            { title: 'Identify patterns and systems', body: 'Look for the underlying formula, rule, or structure behind the content. Whether it\'s a historical cause-and-effect pattern or a coding algorithm, find the system.' },
            { title: 'Challenge assumptions', body: 'When the author makes a claim, ask yourself if it holds up. This critical lens deepens understanding and improves retention.' },
            { title: 'Research what you don\'t understand', body: 'When something seems incomplete or vague, go deeper. Look up the primary source. Read the referenced study. This is your learning strength — use it.' },
          ],
          tools: ['Research databases', 'Digital flashcards (Anki)', 'Mind maps', 'Quizlet for self-testing'],
          watchOut: 'You may get so deep into one section or one question that you spend too long without covering the material. Set a time limit per section: understand it well, then move forward.',
          weeklyChallenge: 'For 7 days, read one assigned section and generate at least 3 analytical questions per page. Then research or answer at least one. Record your questions and answers in a dedicated "Deep Reading Log."',
        },
        visionIntegrator: {
          headline: 'Read Like a Vision Integrator',
          intro: 'Dry text feels like a wall to you. Your power is finding meaning and story inside information. Transform what you\'re reading into something that connects to the bigger picture.',
          strategies: [
            { title: 'Create a concept map as you read', body: 'Instead of linear notes, draw connections. Place the main topic in the center and map out how each new idea relates. Let the visual structure emerge as you read.' },
            { title: 'Find the story inside the content', body: 'Every textbook chapter has a story arc: a problem, a set of solutions, and a resolution. Identify the narrative before you read. It makes even technical content feel alive.' },
            { title: 'Use analogies to anchor new concepts', body: 'When you encounter something new and abstract, immediately create an analogy: "This is like..." This bridges the unfamiliar to what you already know.' },
            { title: 'Record yourself explaining it', body: 'After reading a section, record a 60-second voice note explaining it in your own words. This forces synthesis and builds memory through storytelling.' },
          ],
          tools: ['Miro or Canva (concept maps)', 'Voice memos app', 'Sketchbook for visual notes', 'Mind mapping apps'],
          watchOut: 'You may get so engrossed in making the content meaningful that you lose track of specific facts, definitions, or formulas. Balance the big-picture connections with concrete details.',
          weeklyChallenge: 'For 7 days, read one section and draw a mini concept map connecting the major ideas. At the end of the week, review your maps — do they tell a coherent story of what you\'ve learned?',
        },
        appliedExecutor: {
          headline: 'Read Like an Applied Executor',
          intro: 'Passive reading is your enemy. You retain information when you immediately do something with it. Build action into every reading session.',
          strategies: [
            { title: 'Practice as you read, not after', body: 'Whenever you encounter a process, formula, or concept — stop and try it immediately. Read about the coding concept, then write the code. Read about the math theorem, then solve a problem.' },
            { title: 'Write examples by hand', body: 'After reading each section, write (don\'t type) one concrete real-world example of what you just learned. The physical act of writing and the act of inventing an example both strengthen retention.' },
            { title: 'Use the prove step aggressively', body: 'Don\'t just ask "can I explain this?" — physically demonstrate it. Solve the problem, build the thing, teach it out loud to someone (or a rubber duck).' },
            { title: 'Pair reading with doing', body: 'If you\'re reading about a skill, have the thing you\'re practicing in front of you at the same time. Read one step, do one step. Alternating activates both learning and retention.' },
          ],
          tools: ['Whiteboards', 'Practice worksheets', 'Coding playgrounds (JSFiddle, Replit)', 'Flashcards for active recall'],
          watchOut: 'You may rush through the reading to get to the action and miss critical foundational concepts. Slow down on the Preview and Extract steps — they make your practice significantly more effective.',
          weeklyChallenge: 'For 7 days, after reading each section, immediately create one practice problem, example, or mini-demonstration of what you learned. Don\'t move on until you\'ve "done" something with the content.',
        },
      },
      reflectionPrompts: [
        'Do I currently preview material before reading? How might the Preview step change my approach?',
        'When I finish reading, can I explain the main ideas without looking back? If not, which part of PREP am I skipping?',
        'What\'s my biggest reading challenge: starting, staying focused, or retaining information?',
        'How does your archetype\'s recommended strategy feel compared to how you currently read?',
      ],
    },

    /* ─── MODULE 2: Note-Taking Mastery ──────────────── */
    {
      id: 'note-taking-mastery',
      number: 2,
      title: 'Note-Taking Mastery',
      subtitle: 'The CAPTURE Method',
      icon: '📝',
      accentColor: '#1a3a6b',
      objective: 'Build a note-taking system that creates usable knowledge — not just beautiful notebooks — using the CAPTURE framework.',
      intro: [
        'Taking a lot of notes does not automatically mean you\'re learning. Many learners write everything the instructor says, copy slides word-for-word, and fill notebooks with notes they never understand later.',
        'The problem isn\'t effort — it\'s strategy. Notes often fail because they\'re too detailed, too vague, disorganized, passive (copied without thinking), or never reviewed.',
        'The CAPTURE Method is a seven-stage framework for turning any information source — lectures, books, videos, or discussions — into organized, usable knowledge that actually helps you perform.',
      ],
      framework: {
        name: 'CAPTURE',
        steps: [
          { letter: 'C', word: 'Collect', desc: 'Gather key concepts from lectures, books, videos, or discussions. Focus on key concepts — not every word.' },
          { letter: 'A', word: 'Analyze', desc: 'Ask: What matters most here? What concepts are repeated? What seems truly important vs. minor?' },
          { letter: 'P', word: 'Prioritize', desc: 'Identify definitions, formulas, concepts, deadlines, and action items. Not everything deserves equal space.' },
          { letter: 'T', word: 'Translate', desc: 'Rewrite information in your own words. This step alone significantly improves understanding and retention.' },
          { letter: 'U', word: 'Use', desc: 'Apply your notes: practice problems, discussions, teaching others, projects. Notes that are never used are just archived information.' },
          { letter: 'R', word: 'Review', desc: 'Review notes within 24 hours. This dramatically improves long-term retention over re-reading right before a test.' },
          { letter: 'E', word: 'Execute', desc: 'Use your notes to perform — on exams, in projects, during presentations. Notes should lead to action, not just storage.' },
        ],
      },
      universalTips: [
        { title: 'Don\'t copy slides word-for-word', body: 'Instead of transcribing, ask: What is the instructor emphasizing? What examples matter? What questions do I have? The act of making those decisions activates memory.' },
        { title: 'Build a review habit', body: 'Review notes the same day (quick pass), weekly (deeper review), and before exams (active recall). Three review cycles dramatically outperform one cramming session.' },
        { title: 'Organize your note system', body: 'Sort notes by subject, date, topic, and project. Future you will be grateful when you can locate exactly what you need in 30 seconds.' },
      ],
      archetypes: {
        strategicArchitect: {
          headline: 'Take Notes Like a Strategic Architect',
          intro: 'Cornell Notes were practically designed for you. You love a clear structure that separates lecture content from key questions and a summary. Use that structure consistently.',
          strategies: [
            { title: 'Use Cornell Notes religiously', body: 'Divide your page into three sections: main notes area (right, larger), key terms/questions (left, narrow), summary (bottom). This structure forces both capture and analysis.' },
            { title: 'Build a master outline for each course', body: 'Maintain a running outline of the whole course, not just individual sessions. Every lecture\'s notes should plug into the larger architecture.' },
            { title: 'Number and index your notes', body: 'Use consistent numbering, headers, and footers. Create a table of contents for each subject. Your notes should be as navigable as a textbook.' },
            { title: 'Create action items in every session', body: 'Always end a note-taking session with a "To Do" section: what to review, what to practice, what to look up. Connect your notes to your task system.' },
          ],
          tools: ['Cornell Notes template', 'Notion (hierarchical notes)', 'Microsoft OneNote (structured notebooks)', 'Google Docs with headings'],
          watchOut: 'Don\'t spend so much time making your notes perfectly formatted that you miss the actual content being delivered. Capture first, format second.',
          weeklyChallenge: 'For 7 days, take all notes in Cornell format. At the end of each session, write a 3-sentence summary at the bottom. Review those summaries daily. By day 7, you should be able to recall the full week from summaries alone.',
        },
        precisionOperator: {
          headline: 'Take Notes Like a Precision Operator',
          intro: 'Your note-taking goal is depth, not breadth. Instead of recording everything, your job is to extract the underlying logic and verify accuracy.',
          strategies: [
            { title: 'Capture the logic, not just the facts', body: 'For every concept, note not just "what" but "why." Write: "This works because..." or "The relationship between X and Y is..." Your notes should reveal the mechanism, not just the outcome.' },
            { title: 'Create a "Questions" column', body: 'While taking notes, maintain a running list of questions — things that seem incomplete, contradictory, or that you want to investigate further. These become your study agenda.' },
            { title: 'Use mind maps for complex systems', body: 'When content involves many interconnected parts (a system, a theorem, a process), draw a mind map that shows relationships. This reveals structure that linear notes miss.' },
            { title: 'Annotate with evidence ratings', body: 'Mark how confident you are in each claim: ✓ (verified), ? (uncertain), ! (important to confirm). This keeps your notes intellectually honest.' },
          ],
          tools: ['Anki (for self-testing notes)', 'MindMeister or XMind (mind maps)', 'Notion (linked databases)', 'Research databases for verification'],
          watchOut: 'Avoid the trap of over-analyzing during capture. During lectures or reading, capture first — analyze in the Translate and Review steps, when you can think without a time constraint.',
          weeklyChallenge: 'For 7 days, add a "Logic" column to every set of notes — one sentence explaining WHY each key concept is true or how it works. Review your logic notes before any quiz or assignment.',
        },
        visionIntegrator: {
          headline: 'Take Notes Like a Vision Integrator',
          intro: 'Bullet points on a white page feel like a prison. Your note-taking system should look more like a mind map, concept diagram, or illustrated story than a traditional outline.',
          strategies: [
            { title: 'Use visual note-taking (sketchnotes)', body: 'Draw diagrams, arrows, boxes, icons, and concept maps. You don\'t need to be artistic — rough visuals are more memorable for you than perfect bullet points.' },
            { title: 'Color-code by concept type', body: 'Assign colors meaningfully: blue for facts, green for examples, orange for connections between ideas, red for things you don\'t understand yet. Color becomes memory.' },
            { title: 'Make concept maps instead of outlines', body: 'Place the central theme in the middle of the page. Branch out to sub-themes. Connect related ideas with arrows and labels. This reflects how your mind naturally organizes information.' },
            { title: 'Record a 60-second summary after each session', body: 'Using your phone, record yourself explaining the main concept of each session in 60 seconds. This synthesizes your notes through your strength: creative verbal expression.' },
          ],
          tools: ['Canva or Miro (digital visual notes)', 'Apple Pencil / iPad (handwritten visual notes)', 'Sketchbook', 'Notion with embed + diagrams'],
          watchOut: 'Visual notes can become so elaborate that you lose track of the specific, testable facts and definitions. Make sure your beautiful diagrams also include precise vocabulary and formulas.',
          weeklyChallenge: 'For 7 days, take all notes in concept map or visual format instead of bullet points. At the end of the week, review your visual notes — which ones help you recall the most information?',
        },
        appliedExecutor: {
          headline: 'Take Notes Like an Applied Executor',
          intro: 'Your note-taking works best when it\'s directly connected to doing something. Think of your notes less as a record of information and more as an instruction manual for action.',
          strategies: [
            { title: 'Write action notes, not passive notes', body: 'For every concept, immediately write an application: "I can use this to..." or "Next time I [situation], I will [action]." Action-oriented notes connect directly to performance.' },
            { title: 'Include examples and demonstrations', body: 'Your notes should be full of examples, especially ones you created yourself. If the instructor gives an example, write it — then add your own version next to it.' },
            { title: 'Use practice steps as your notes', body: 'For procedural content (coding, math, lab work), write your notes as step-by-step instructions you could follow to reproduce the process. Your notes become a how-to guide.' },
            { title: 'Review notes while doing something', body: 'Study your notes while standing up, pacing, or using a whiteboard to recreate the content from memory. Physical engagement while reviewing dramatically improves retention.' },
          ],
          tools: ['Whiteboard (physical or digital)', 'Practice environments (code editors, labs)', 'Index cards for active recall', 'Voice-to-text for capturing notes while moving'],
          watchOut: 'Don\'t skip the Review step. Applied Executors often feel that once they\'ve done something once, they know it. Scheduled review — even for things you already executed well — prevents forgetting.',
          weeklyChallenge: 'For 7 days, end every note-taking session with a "What I\'ll Do" section: 2–3 specific ways you plan to apply what you just learned. Track whether you follow through.',
        },
      },
      reflectionPrompts: [
        'Are my current notes organized enough that I could find a specific concept from 2 weeks ago in under 60 seconds?',
        'Do I review my notes within 24 hours of taking them? What would change if I did?',
        'Which step of CAPTURE do I currently skip most often?',
        'What does my note-taking style reveal about my archetype?',
      ],
    },

    /* ─── MODULE 3: Lecture & Video Learning ──────────── */
    {
      id: 'lecture-video-learning',
      number: 3,
      title: 'Lecture & Video Learning',
      subtitle: 'The WATCH Method',
      icon: '🎥',
      accentColor: '#7c3aed',
      objective: 'Stop zoning out in class and during online courses by using the WATCH method to transform passive watching into active learning.',
      intro: [
        'Watching educational content can feel productive without actually producing results. You may have finished a two-hour lecture, completed a video module, or attended class — and immediately thought, "What did I actually learn?"',
        'This happens because most people consume educational content passively. They watch, listen, nod, take a few random notes, and move on. But learning requires active engagement, which looks completely different.',
        'The WATCH Method gives you a five-stage system for engaging with any educational content — whether it\'s a live classroom, a YouTube tutorial, a Coursera module, or a corporate training video — so that you actually retain and use what you consume.',
      ],
      framework: {
        name: 'WATCH',
        steps: [
          { letter: 'W', word: 'Watch With Purpose', desc: 'Before starting, ask: Why am I watching this? What do I need to learn? What problem am I trying to solve? Purpose transforms passive viewing into active learning.' },
          { letter: 'A', word: 'Actively Take Notes', desc: 'Pause frequently. Write concepts, examples, questions, and action steps as you go — not just at the end.' },
          { letter: 'T', word: 'Test Your Understanding', desc: 'Pause at intervals and ask: Can I explain this concept? Can I solve a related problem? Can I summarize what I just watched?' },
          { letter: 'C', word: 'Create Practice Opportunities', desc: 'Immediately apply what you just learned: solve a problem, practice a skill, create flashcards, or teach the concept to someone else.' },
          { letter: 'H', word: 'Help Your Brain Retain It', desc: 'Review content after a delay. Spaced review — coming back the next day, then three days later — builds long-term retention far better than one long session.' },
        ],
      },
      universalTips: [
        { title: 'Stop binge-learning', body: 'Watching 10 productivity videos, 8 coding tutorials, or multiple lectures in one sitting creates overload. Slow down and apply before consuming more.' },
        { title: 'Use playback speed strategically', body: 'For review of familiar content: 1.25×–1.5× may help. For difficult new concepts: slow down and pause often. Never speed through content you haven\'t understood yet.' },
        { title: 'Ask better questions in class', body: 'Instead of "I don\'t get it," ask: "Can you explain step two again?" or "How would this apply in a real situation?" Specific questions get specific, useful answers.' },
      ],
      archetypes: {
        strategicArchitect: {
          headline: 'Learn From Lectures Like a Strategic Architect',
          intro: 'You learn best when the lecture has a clear structure you can follow and organize. Your job is to build a framework from every learning session.',
          strategies: [
            { title: 'Create a lecture outline before class', body: 'If you have the syllabus or reading list, sketch the expected structure of the lecture before you attend. Then fill in details as the instructor covers them.' },
            { title: 'Use a structured note template every time', body: 'Date, topic, learning objectives, main sections, key terms, summary. Consistent structure means you always know how to engage and how to review.' },
            { title: 'Identify the lecture\'s structure in the first 5 minutes', body: 'Listen for: "Today we\'re covering three things..." or "This week we\'re building on..." These cues tell you the architecture of the session.' },
            { title: 'Write a post-lecture action plan', body: 'At the end of every session, write 3 things: what you learned, what you need to follow up on, and what you\'ll do in the next 24 hours to consolidate it.' },
          ],
          tools: ['Pre-made note templates', 'Google Calendar (scheduled review blocks)', 'Notion (structured lecture notes)', 'Cornell Notes'],
          watchOut: 'If the lecture doesn\'t follow your expected structure, don\'t freeze. Adapt your outline in real time. Flexibility within structure is a skill worth building.',
          weeklyChallenge: 'For 7 days, write a 5-minute pre-lecture outline before every class or video. Fill in details during the session. Compare your pre-outline to what actually happened — this trains your ability to anticipate and structure learning.',
        },
        precisionOperator: {
          headline: 'Learn From Lectures Like a Precision Operator',
          intro: 'You process information analytically, so your job during lectures is to identify the underlying logic, verify claims, and find gaps in the explanation.',
          strategies: [
            { title: 'Listen for cause-and-effect relationships', body: 'In every lecture, identify the logical chains: what causes what, what explains what. These relationships are the skeleton of the content and help you see the full system.' },
            { title: 'Note what the instructor doesn\'t explain', body: 'Pay attention to assumptions and gaps. When an instructor skips a step or makes an unexplained leap, mark it. That gap is your research homework.' },
            { title: 'Supplement lectures with primary sources', body: 'After any important lecture, find one additional source that covers the same topic from a different angle. This builds the verification habit that is your natural strength.' },
            { title: 'Create "question-and-answer" notes', body: 'Convert every major lecture point into a question-answer pair. "What is the difference between X and Y?" "What are the conditions under which Z is true?" These become your self-testing material.' },
          ],
          tools: ['Research databases', 'Anki (for Q&A flashcards)', 'Wikipedia for concept overviews', 'YouTube explanations for alternative perspectives'],
          watchOut: 'Don\'t wait for the perfect explanation before engaging. If you spend the whole lecture identifying gaps without capturing the core content, you\'ll leave with questions but no answers.',
          weeklyChallenge: 'For 7 days, convert every major concept from your lectures into a question-answer pair within 1 hour of the session. Review those Q&A pairs the next day.',
        },
        visionIntegrator: {
          headline: 'Learn From Lectures Like a Vision Integrator',
          intro: 'Dry lectures feel suffocating to you. Your job is to find the story, the bigger meaning, and the connection between ideas — even when the instructor doesn\'t provide it.',
          strategies: [
            { title: 'Find the "so what?" of every lecture', body: 'For every concept introduced, ask: why does this matter? What\'s the bigger purpose? What problem does this solve in the real world? The "so what?" makes content stick.' },
            { title: 'Connect new content to what you already know', body: 'After every major concept, write a connection: "This reminds me of..." or "This is similar to...". These bridges make new information memorable.' },
            { title: 'Create visual summaries after every session', body: 'Instead of reviewing text notes, draw a diagram, mind map, or illustrated summary of what the lecture covered. This turns abstract information into visual memory.' },
            { title: 'Imagine a real application before the lecture ends', body: 'Before the session ends, visualize one real-world scenario where the concept you just learned would matter. This "future projection" deeply anchors the learning.' },
          ],
          tools: ['Miro (concept boards)', 'Canva (illustrated summaries)', 'Sketchbook', 'Voice memos for creative reflections'],
          watchOut: 'When a lecture is heavily factual or technical, make sure you capture precise definitions and formulas — not just creative interpretations. Both are needed for tests and projects.',
          weeklyChallenge: 'For 7 days, create one visual summary (drawn or digital) for every major lecture or video. Review your visuals at the end of the week — which ones best captured the core ideas?',
        },
        appliedExecutor: {
          headline: 'Learn From Lectures Like an Applied Executor',
          intro: 'You need to do something with what you\'re learning before the lecture ends. Build a habit of immediate application so knowledge doesn\'t evaporate.',
          strategies: [
            { title: 'Write your own examples as the instructor speaks', body: 'When an instructor gives an example, immediately write your own version. Don\'t just record theirs — create one from your own experience or context.' },
            { title: 'Pause videos and try things immediately', body: 'For video-based learning especially: when a process or skill is demonstrated, pause and try it yourself before watching the next step. Practice-then-watch outperforms watch-then-practice.' },
            { title: 'Use the T step (Test) after every major point', body: 'After each major concept in a lecture, pause (mentally in live class, literally in video) and test yourself: can you do the thing that was just taught? If not, that\'s what you need to practice.' },
            { title: 'Bring something to do to every lecture', body: 'For skill-based content, bring the practice material with you: a coding laptop, a sketchpad, math scratch paper. The ability to try it immediately is the difference between watching and learning.' },
          ],
          tools: ['Practice environments (code editor, lab notebook)', 'Whiteboard', 'Printed practice problems', 'Scratch paper for working through examples'],
          watchOut: 'Don\'t jump straight to practice without absorbing the foundational concept. If you try before you understand the why, you may practice incorrectly and reinforce the wrong habits.',
          weeklyChallenge: 'For 7 days, apply at least one concept from every lecture or video within 30 minutes of finishing it. Document what you applied and what happened.',
        },
      },
      reflectionPrompts: [
        'When do I zone out most — during live lectures, recorded videos, or long sessions? What does this reveal about my learning needs?',
        'Do I watch educational content with a clear purpose, or do I hope something sticks?',
        'Have I ever binge-watched tutorials without actually practicing? What was the result?',
        'How does the WATCH step that matches your archetype change how you plan to approach your next class or video?',
      ],
    },

    /* ─── MODULE 4: Memory & Retention ───────────────── */
    {
      id: 'memory-retention',
      number: 4,
      title: 'Memory & Retention',
      subtitle: 'The STORE Method',
      icon: '🧠',
      accentColor: '#0d9488',
      objective: 'Move from cramming and forgetting to consistent long-term retention using the STORE framework and spaced repetition.',
      intro: [
        'Have you ever studied hard for something only to forget it hours later? You read the chapter, attended class, watched the lecture, took notes — and the information disappeared when you needed it most.',
        'The problem usually isn\'t your memory. It\'s your learning process. Passive review, cramming, and multitasking are the enemies of retention. Memory improves when your brain is repeatedly asked to retrieve, organize, and use information.',
        'The STORE Method is a five-stage retention system that replaces cramming with strategic practice. Combined with spaced repetition — reviewing information at increasing intervals — it builds memory that lasts weeks, months, and years.',
      ],
      framework: {
        name: 'STORE',
        steps: [
          { letter: 'S', word: 'Study in Smaller Sessions', desc: 'Avoid marathon study sessions. Three focused one-hour sessions outperform one exhausting six-hour session almost every time.' },
          { letter: 'T', word: 'Test Yourself', desc: 'Close your notes. Ask: What do I remember? Can I explain this concept? Can I solve a problem? This is active recall — the most evidence-backed retention technique.' },
          { letter: 'O', word: 'Organize Information', desc: 'Your brain remembers organized information better. Use categories, mind maps, frameworks, and flashcards to give information a home in your mental architecture.' },
          { letter: 'R', word: 'Repeat Over Time', desc: 'Spaced repetition: study today, review tomorrow, again in 3 days, again in a week, again in 2 weeks. This spacing effect dramatically improves long-term retention.' },
          { letter: 'E', word: 'Execute What You Learn', desc: 'Apply information quickly. Teach it, practice it, use it in a project. Action strengthens memory more powerfully than re-reading.' },
        ],
      },
      universalTips: [
        { title: 'Active recall beats re-reading every time', body: 'Instead of rereading your notes, close them and ask yourself: What are the major concepts? What formulas do I remember? What steps can I explain? Your brain strengthens retrieval pathways through practice retrieving.' },
        { title: 'Sleep is part of your study plan', body: 'Your brain consolidates memory while you sleep. All-night study sessions often backfire. Sleeping after studying is not laziness — it\'s neuroscience.' },
        { title: 'Use the brain dump before exams', body: 'Before studying for a test, write down everything you already remember without looking at notes. This identifies gaps precisely so you only review what you actually need.' },
      ],
      archetypes: {
        strategicArchitect: {
          headline: 'Build Memory Like a Strategic Architect',
          intro: 'Your structured mind is a memory asset — but only if you use it intentionally. Build organized review systems rather than hoping information stays in your head.',
          strategies: [
            { title: 'Create a spaced repetition schedule', body: 'Plan your review dates in advance. For every topic you study, schedule: Day 1 (learn), Day 2 (review), Day 5 (review), Day 14 (review). Put these in your calendar.' },
            { title: 'Organize information into hierarchical outlines', body: 'For every subject, maintain a master outline that shows how concepts relate. When information has a clear place in a structure, retrieval is dramatically faster.' },
            { title: 'Use checklists for memory systems', body: 'Track your review schedule with checkboxes: which topics have you reviewed once, twice, three times? This gamifies retention and ensures nothing falls through the cracks.' },
            { title: 'Summary sheets before every exam', body: 'Create a one-page summary for each major topic. Writing the summary forces you to identify what\'s most important. Reviewing just that summary page daily is high-efficiency retention.' },
          ],
          tools: ['Anki (spaced repetition flashcards)', 'Google Calendar (review scheduling)', 'Notion (master outlines)', 'One-page summary templates'],
          watchOut: 'Don\'t confuse a beautiful, well-organized summary sheet with actual retention. Organize your material — then close it and test yourself on it. Organization is a tool, not the goal.',
          weeklyChallenge: 'Create a spaced repetition schedule for one subject this week. Set calendar reminders for Day 1, 2, 5, and 14 reviews. Use active recall (no notes) for every review after Day 1.',
        },
        precisionOperator: {
          headline: 'Build Memory Like a Precision Operator',
          intro: 'You remember information better when you understand the logic behind it. Surface memorization is inefficient for you — deep conceptual understanding is your path to lasting retention.',
          strategies: [
            { title: 'Understand before memorizing', body: 'For every fact or formula you need to remember, understand why it\'s true first. When you understand the derivation or logic, you can reconstruct the answer even if you forget the exact form.' },
            { title: 'Build concept breakdowns', body: 'For complex ideas, write a breakdown that goes from the overarching principle down to specific details. This hierarchical understanding anchors everything in the memory of the big picture.' },
            { title: 'Use advanced problem-solving for retention', body: 'Instead of rereading notes, solve complex practice problems that require you to apply multiple concepts simultaneously. This stress-tests your understanding and reveals gaps.' },
            { title: 'Create logic chains', body: 'For memorizing processes: "If A, then B, because C." Building explicit logical connections between facts makes them sticky in a way that rote memorization never does.' },
          ],
          tools: ['Anki with cloze-deletion cards', 'Mind maps showing concept relationships', 'Practice problem sets', 'Feynman technique (explain simply to self)'],
          watchOut: 'You may delay testing yourself because you feel you need to understand more first. Set a deadline: after 2 study sessions, you must switch to self-testing regardless of whether you feel "ready."',
          weeklyChallenge: 'For one difficult topic this week, write a one-page explanation of the concept as if teaching a 10-year-old. Then solve 5 hard problems using that concept. Identify any gaps between your explanation and your performance.',
        },
        visionIntegrator: {
          headline: 'Build Memory Like a Vision Integrator',
          intro: 'You remember stories, images, and meaning far better than you remember facts in isolation. Build a memory system that exploits your creative strength.',
          strategies: [
            { title: 'Create memory stories for abstract concepts', body: 'Turn complex concepts into narratives: characters, events, cause-and-effect. The more vivid and emotionally resonant the story, the more memorable the concept becomes.' },
            { title: 'Use visual memory maps', body: 'For complex topics, draw a visual memory map — a diagram that shows how every major concept connects to every other. Revisiting this map is faster and more effective than rereading notes.' },
            { title: 'Use analogies as memory hooks', body: 'For every difficult concept, create a powerful analogy that connects it to something you already understand deeply. "Mitosis is like..." "Recursion is like..." Analogies are memory architecture.' },
            { title: 'Draw from memory before reviewing notes', body: 'Before reviewing your notes, try to recreate your concept map or visual summary from memory. This is active recall through your visual strength and reveals exactly what you\'ve forgotten.' },
          ],
          tools: ['Canva or Miro (visual memory maps)', 'Sketchbook', 'Color-coded flashcards', 'Storytelling journals'],
          watchOut: 'Analogies and stories are powerful but can sometimes distort the exact details. After using a story or analogy to remember a concept, verify that the specific facts and definitions are still accurate.',
          weeklyChallenge: 'For one difficult topic this week, create a visual story: a narrative told in images and diagrams that explains the full concept from beginning to end. Review that story (not your text notes) for retention.',
        },
        appliedExecutor: {
          headline: 'Build Memory Like an Applied Executor',
          intro: 'You don\'t remember things you\'ve only read about — you remember things you\'ve done. The STORE method for you means doing something with every piece of information.',
          strategies: [
            { title: 'Practice repeatedly — not just once', body: 'Doing a thing once doesn\'t mean you\'ll remember how to do it. Schedule repeated practice sessions: Day 1 (learn and do), Day 3 (do again from memory), Day 7 (do again with difficulty variations).' },
            { title: 'Use physical recall alongside mental recall', body: 'Write information by hand when reviewing — not just reading it. The motor memory from writing reinforces the conceptual memory. Even better: write from memory without looking at notes.' },
            { title: 'Simulate real performance conditions', body: 'Practice under conditions similar to the actual test or application. Timed practice problems, mock presentations, simulated projects — these build performance memory, not just theoretical knowledge.' },
            { title: 'Teach it to retain it', body: 'For each concept you need to remember, teach it to someone (or explain it out loud to yourself). The act of translating knowledge into instruction is the strongest retention method for Applied Executors.' },
          ],
          tools: ['Whiteboards for writing from memory', 'Practice problem sets and labs', 'Timer for simulated test conditions', 'Voice recorder for teaching yourself'],
          watchOut: 'Don\'t mistake busy hands for retention. Copying notes by hand is not the same as writing from memory. Make sure your practice involves retrieval (generating the answer), not just reproduction (copying what you see).',
          weeklyChallenge: 'For one difficult topic this week, schedule three practice sessions: Day 1, 3, and 7. In each session, attempt the task from memory (no notes) before checking your work. Track your improvement across sessions.',
        },
      },
      reflectionPrompts: [
        'Do I typically cram the night before exams? What\'s been the result?',
        'When I review my notes, am I re-reading passively or testing myself actively? What would change if I switched?',
        'What\'s one topic I thought I understood but performed poorly on? What retention step did I likely skip?',
        'How does your archetype\'s memory system differ from what you currently do?',
      ],
    },

    /* ─── MODULE 5: Focus & Time Management ──────────── */
    {
      id: 'focus-time-management',
      number: 5,
      title: 'Focus & Time Management',
      subtitle: 'The FOCUS & FLOW Methods',
      icon: '⏱️',
      accentColor: '#d4a843',
      objective: 'Reclaim your attention and build productive momentum using the FOCUS Method for task management and the FLOW Method for deep work.',
      intro: [
        'Procrastination is not always laziness. Sometimes it looks like perfectionism, overthinking, cleaning everything except the assignment, or feeling so overwhelmed you shut down. Many capable learners procrastinate because they lack systems — not intelligence.',
        'In today\'s world, attention is constantly under attack — notifications, messages, streaming, social media, breaking news. Your ability to focus has become one of your greatest competitive advantages.',
        'This module gives you two powerful frameworks: the FOCUS Method for daily task management, and the FLOW Method for entering deep, high-performance work sessions. Together, they transform scattered busyness into intentional productivity.',
      ],
      framework: {
        name: 'FOCUS + FLOW',
        steps: [
          { letter: 'F', word: 'Find Your Priorities', desc: '(FOCUS) Ask: What must get done today? Choose your top 3 priorities — not 12.' },
          { letter: 'O', word: 'Organize Your Tasks', desc: '(FOCUS) Break large tasks into smaller actions. "Study for exam" becomes "review notes, create flashcards, solve 10 problems."' },
          { letter: 'C', word: 'Create Time Blocks', desc: '(FOCUS) Assign dedicated work periods to each task. Schedule them like appointments you cannot cancel.' },
          { letter: 'U', word: 'Unplug Distractions', desc: '(FOCUS) Silence notifications, close unnecessary tabs, protect your focus window.' },
          { letter: 'S', word: 'Start Small', desc: '(FOCUS) Action creates momentum. Start with 5 minutes if needed. Momentum builds from motion, not from feeling ready.' },
          { letter: 'F', word: 'Focus on One Task', desc: '(FLOW) Choose one task only. Not three, not five. One. Single-tasking dramatically outperforms multitasking.' },
          { letter: 'L', word: 'Limit Distractions', desc: '(FLOW) Silence everything. Put your phone away. Close all non-relevant tabs. Create a distraction-free container.' },
          { letter: 'O', word: 'Optimize Your Environment', desc: '(FLOW) Choose a space that supports focus. Same location, same music, same ritual — your brain will begin associating these cues with concentration.' },
          { letter: 'W', word: 'Work in Deep Sessions', desc: '(FLOW) Aim for 45–90 minute focused blocks. Take real breaks between sessions. Deep, recovered effort beats shallow, continuous effort.' },
        ],
      },
      universalTips: [
        { title: 'Motivation shows up after action — not before', body: 'Stop waiting to feel motivated before starting. Start messy, start imperfectly, start anyway. Motivation almost always follows action, not the other way around.' },
        { title: 'Manage your energy, not just your time', body: 'Schedule difficult tasks during your peak energy hours (morning for most people). Save administrative tasks for low-energy windows. Time management without energy management is incomplete.' },
        { title: 'The 25-minute focus rule (Pomodoro)', body: 'Work for 25 minutes, take a 5-minute break, repeat. Four cycles, then take a longer break. This rhythm respects your brain\'s natural attention patterns.' },
      ],
      archetypes: {
        strategicArchitect: {
          headline: 'Manage Focus Like a Strategic Architect',
          intro: 'You already love planning — but the gap between your beautiful plans and actual execution is where most Strategic Architects lose time. Bridge that gap with action-oriented systems.',
          strategies: [
            { title: 'Use time blocking with specific tasks', body: 'Don\'t just block "Study" from 4–6 PM. Write exactly what you\'ll do: "4:00–4:45 → Read Chapter 7, pages 80–110. 4:45–5:15 → Cornell Notes review. 5:15–6:00 → Practice problems 1–15."' },
            { title: 'Weekly review and planning sessions', body: 'Every Sunday, review the previous week and plan the next one in full. Identify your three most important outcomes. This 30-minute investment saves 5+ hours of scattered effort.' },
            { title: 'Use checklists as momentum tools', body: 'Your checklist isn\'t just a memory aid — it\'s a completion ritual. Each checkmark is a small dopamine hit. Design your task list to give you frequent wins throughout the day.' },
            { title: 'Build contingency plans', body: 'When life disrupts your schedule (it always does), have a backup plan: "If I miss my 4 PM session, I use the 8 PM slot." Systems with flexibility survive reality.' },
          ],
          tools: ['Google Calendar (time blocking)', 'Notion (weekly planner)', 'Trello (task management)', 'Physical planner for daily structure'],
          watchOut: 'Over-planning is procrastination in disguise. If you spend 45 minutes planning a 2-hour study session, recalibrate. Build your plan in 5 minutes, then spend the next 2 hours executing it.',
          weeklyChallenge: 'For 7 days, time-block every study session with specific tasks before it begins. At the end of each day, rate your execution: did you follow the plan? Note what caused any deviation.',
        },
        precisionOperator: {
          headline: 'Manage Focus Like a Precision Operator',
          intro: 'Your risk is over-researching and under-deciding. You can spend hours on background reading and arrive at a task with zero work done. Set decision deadlines and use research time limits.',
          strategies: [
            { title: 'Set research time limits', body: 'Before starting any research or background investigation, set a timer: "I have 30 minutes to gather context on this topic. Then I must begin executing." Time-boxing your research habit prevents analysis paralysis.' },
            { title: 'Create decision deadlines', body: 'If you\'re stuck choosing between approaches, give yourself a deadline: "I will decide by 3 PM." After the deadline, pick the best available option and proceed. Perfect decisions arrived at after the deadline are worthless.' },
            { title: 'Solve the hardest problem first', body: 'Tackle your most intellectually demanding task when your mind is sharpest (usually early in the day). Save administrative work for when mental energy is lower. This aligns your cognitive peak with your priority work.' },
            { title: 'Track your focus patterns', body: 'Keep a brief log: when did you have your deepest focus today? What was your environment? What preceded it? Precision Operators excel at identifying and replicating performance patterns.' },
          ],
          tools: ['Timer (for research time limits)', 'Focus tracking logs', 'Forest or Focus@Will apps', 'Priority matrices (urgent/important quadrant)'],
          watchOut: 'If you notice you\'re spending more time refining your productivity system than actually working, that\'s a signal. Systems serve execution — they don\'t replace it.',
          weeklyChallenge: 'For 7 days, track the first 10 minutes of every study session: what did you actually do? Did you start the work, or did you start something adjacent (organizing, researching, setting up)? Adjust accordingly.',
        },
        visionIntegrator: {
          headline: 'Manage Focus Like a Vision Integrator',
          intro: 'Rigid schedules feel suffocating to you, but total freedom leads to scattered, unfinished work. Your focus system needs structure with creative flexibility built in.',
          strategies: [
            { title: 'Use flexible planning boards instead of rigid schedules', body: 'Instead of a minute-by-minute calendar, use a Kanban board (Trello, Miro, or sticky notes): "To Do," "In Progress," and "Done." Move tasks across columns as you work — this gives you visual progress and creative control.' },
            { title: 'Create a meaningful context for each work session', body: 'Before starting, answer: why does this work matter today? What will I be able to create or understand that I can\'t right now? Connecting work to meaning is your most powerful focus trigger.' },
            { title: 'Design inspiring work environments', body: 'Your environment dramatically affects your focus. Identify the space, sound, lighting, and aesthetic that helps you enter flow. Create that environment intentionally and use it only for focused work.' },
            { title: 'Use "theme days" for deep focus', body: 'Instead of doing a little of everything every day, assign themes: Monday for research, Wednesday for creative work, Friday for review. Theme days allow deeper immersion than context-switching.' },
          ],
          tools: ['Miro (visual planning boards)', 'Trello (flexible Kanban)', 'Curated focus playlists', 'Aesthetic, intentional workspace design'],
          watchOut: 'Your creative energy can pull you toward interesting tangents during work sessions. When a brilliant unrelated idea strikes, write it down in a "Parking Lot" note and return to the current task. Capture it — don\'t follow it.',
          weeklyChallenge: 'For 7 days, begin every work session with one sentence: the meaningful purpose of this session. At the end of the day, review whether that purpose helped you stay focused.',
        },
        appliedExecutor: {
          headline: 'Manage Focus Like an Applied Executor',
          intro: 'You work best in short, intense bursts with regular movement. Build a focus system designed around your energy and physical engagement — not around sitting still for hours.',
          strategies: [
            { title: 'Use short work sprints', body: 'Work in 25–30 minute focused sprints with physical breaks (stretch, walk, stand). This matches your natural energy rhythm and prevents the restlessness that kills Applied Executor focus.' },
            { title: 'Remove digital distractions physically, not just mentally', body: 'Put your phone in another room. Close the browser entirely, not just minimize it. Physical removal is more effective than willpower — your environment controls your attention.' },
            { title: 'Build movement into your study sessions', body: 'Use a standing desk, pace while reviewing flashcards, or use a whiteboard that requires you to stand and write. Physical engagement while studying improves both focus and retention.' },
            { title: 'Tie focus to concrete deliverables', body: 'Frame each session around producing something, not just studying something: "I\'m working until I finish 10 practice problems," not "I\'m studying for 2 hours." Completion-based sessions feel motivating to Applied Executors.' },
          ],
          tools: ['Timer (25-min sprints)', 'Standing desk or treadmill desk', 'Whiteboard for active problem-solving', 'Phone app blockers (Freedom, Cold Turkey)'],
          watchOut: 'Short sprints are effective — but only if you don\'t spend the first 10 minutes of each sprint re-establishing context. Have your materials organized before each sprint starts so you can begin immediately.',
          weeklyChallenge: 'For 7 days, use only completion-based session goals ("finish X") rather than time-based goals ("study for Y hours"). Track your productivity and stress levels. Compare to your usual approach.',
        },
      },
      reflectionPrompts: [
        'What is my most common form of procrastination? Does it look like avoidance, perfectionism, or busyness without progress?',
        'When in my day do I have my best focus? Am I using that time for my hardest work?',
        'What one distraction, if removed, would have the biggest positive impact on my productivity?',
        'Have I ever experienced a "flow state"? What conditions made it possible?',
      ],
    },

    /* ─── MODULE 6: Test-Taking Systems ──────────────── */
    {
      id: 'test-taking-systems',
      number: 6,
      title: 'Test-Taking Systems',
      subtitle: 'The SCORE Method',
      icon: '✅',
      accentColor: '#1a3a6b',
      objective: 'Build the preparation habits and in-exam strategies to perform consistently under pressure using the SCORE framework.',
      intro: [
        'Test anxiety is one of the most common and least talked-about learning challenges. You may know the material cold, studied hard, and still sat down for the exam to find your mind blank, your heart racing, and your confidence evaporating.',
        'Here\'s the truth: tests don\'t always measure intelligence. They measure preparation systems, stress management, recall ability under pressure, and familiarity with the format. All of these are trainable.',
        'The SCORE Method is a five-stage approach that transforms how you prepare for and perform on every kind of assessment — multiple choice, essays, coding exams, oral presentations, and project-based evaluations.',
      ],
      framework: {
        name: 'SCORE',
        steps: [
          { letter: 'S', word: 'Study Early', desc: 'Avoid last-minute cramming. Use spaced repetition and begin reviewing material at least a week before any major exam.' },
          { letter: 'C', word: 'Clarify the Format', desc: 'Ask: Is this multiple choice, essay, practical, oral, or coding? Each format requires different preparation and different in-exam strategy.' },
          { letter: 'O', word: 'Organize Your Time', desc: 'Know the total time available. Plan how many minutes per question or section. Don\'t spend 80% of your time on 20% of the points.' },
          { letter: 'R', word: 'Read Carefully', desc: 'Many mistakes happen because learners rush. Read every instruction carefully. Look for keywords that define exactly what\'s being asked.' },
          { letter: 'E', word: 'Evaluate Your Answers', desc: 'If time allows, review your work before submitting. Catch simple mistakes, incomplete answers, and misread questions.' },
        ],
      },
      universalTips: [
        { title: 'Multiple choice strategy', body: 'Read the full question first, then the options. Eliminate obviously wrong answers. Watch for extreme language ("always," "never") — these are often traps. When torn between two answers, trust your prepared knowledge over your anxious instinct.' },
        { title: 'Essay exam strategy', body: 'Before writing, create a quick 90-second outline: thesis, 3 supporting ideas, evidence for each. Structure matters as much as content in essay assessments.' },
        { title: 'Post-test reflection', body: 'After every exam, ask: What worked? What didn\'t? What preparation strategy should I change? One test score is a data point — use it to improve your system, not to judge your intelligence.' },
      ],
      archetypes: {
        strategicArchitect: {
          headline: 'Take Tests Like a Strategic Architect',
          intro: 'You are at your best on tests when you\'ve built a structured preparation plan and you follow a clear strategy on test day. Your risk is over-studying familiar material at the expense of weak areas.',
          strategies: [
            { title: 'Build a test prep timeline', body: 'Backwards-plan from the exam date: what do you need to know, by when? Create a daily review schedule for the week leading up to the exam. Stick to it even when you feel confident.' },
            { title: 'Prioritize by weight, not comfort', body: 'Study what the exam values most, not what you find easiest. If essays are worth 60% and multiple choice 40%, spend at least 60% of prep time on essay practice.' },
            { title: 'Simulate the exam before exam day', body: 'Do at least one full practice exam under realistic conditions: same time limit, no notes, real environment. This builds both confidence and strategy.' },
            { title: 'Create a test-day protocol', body: 'Plan the exam day itself: when to arrive, what to bring, how to begin (preview all questions first vs. start immediately), how to pace yourself. Routine reduces anxiety.' },
          ],
          tools: ['Test prep timeline template', 'Practice exams (printed or timed)', 'Flashcard review', 'Checklist for exam day preparation'],
          watchOut: 'If your plan is too rigid and the exam surprises you with an unexpected format or question, adapt. A good plan is a guide, not a cage.',
          weeklyChallenge: 'Before your next exam, create a 7-day prep timeline. Assign specific topics to specific days. Do one timed practice session at least 48 hours before the real thing.',
        },
        precisionOperator: {
          headline: 'Take Tests Like a Precision Operator',
          intro: 'You perform well on tests that reward depth and analysis. Your risk is overthinking simple questions — getting trapped by nuance when the answer is straightforward.',
          strategies: [
            { title: 'Practice "first answer" trust', body: 'On multiple choice, if you know the answer immediately — trust it. Precision Operators often second-guess correct initial responses. Mark your first answer, then flag it and move on. Only change it if you find clear evidence against it.' },
            { title: 'Identify the simplest interpretation first', body: 'Before diving into complex analysis on any question, ask: "What is the most straightforward reading of this question?" Many test items are simpler than they appear.' },
            { title: 'Use concept-to-problem mapping', body: 'Before the exam, create a mapping of concepts to problem types. "Whenever I see X pattern in a question, I apply Y framework." This transforms analytical knowledge into exam performance.' },
            { title: 'Write logic chains in essays', body: 'In essay questions, structure your argument as an explicit logic chain: premise → evidence → reasoning → conclusion. This plays to your analytical strength and makes your writing compelling.' },
          ],
          tools: ['Past exams and answer keys (to study question patterns)', 'Concept-to-problem mapping sheets', 'Practice under timed conditions', 'First-answer training exercises'],
          watchOut: 'Beware of the "it can\'t be that simple" trap. Not every question is hiding complexity. Train yourself to recognize when a straightforward answer is the right one.',
          weeklyChallenge: 'For every practice test you take this week, note how many times you changed an answer from correct to incorrect. This data will calibrate your trust in your initial responses.',
        },
        visionIntegrator: {
          headline: 'Take Tests Like a Vision Integrator',
          intro: 'You can struggle on tests that reward isolated fact recall — but you excel on tests that reward synthesis, connection, and written expression. Build your prep around your creative strengths.',
          strategies: [
            { title: 'Use memory stories and analogies during review', body: 'Instead of drilling isolated facts, encode them in vivid stories and analogies during your prep. On test day, these stories serve as retrieval cues that pull the facts forward.' },
            { title: 'Create visual summaries for each major topic', body: 'One visual map per major topic during prep. On test day (if allowed), you can recreate your visual map in the margin before answering questions — this unlocks related memories.' },
            { title: 'Excel in essay questions — practice them first', body: 'Essays are your arena. Practice writing full essay responses for likely prompts before the exam. Time yourself. The combination of creative narrative and structured argument is your competitive advantage.' },
            { title: 'Ground creative answers in facts', body: 'In both written and multiple choice responses, ensure your creative synthesis is backed by specific facts, dates, names, or formulas. Creative answers without factual grounding lose points.' },
          ],
          tools: ['Visual memory maps (pre-exam review)', 'Timed essay practice', 'Story-based flashcards', 'Color-coded review material'],
          watchOut: 'Don\'t spend exam time on elaborate creative frameworks at the expense of completing the test. If you\'re running short on time, shift to direct, efficient answers.',
          weeklyChallenge: 'Write one practice essay response per day this week on a topic from your upcoming exam. Focus on synthesis: how do different concepts connect? Review your essays and identify where factual grounding was strong or weak.',
        },
        appliedExecutor: {
          headline: 'Take Tests Like an Applied Executor',
          intro: 'Practice-based preparation is your superpower. You retain and perform best when your exam prep mirrors the actual testing experience — not just reading about the content.',
          strategies: [
            { title: 'Take as many practice exams as possible', body: 'For every exam you face, complete at least 2–3 full practice versions under real conditions. Timed, no notes, same environment you\'ll test in. Repetition builds performance memory.' },
            { title: 'Identify patterns in practice questions', body: 'After completing practice tests, analyze the questions you got wrong: is there a type of question, a concept area, or a format pattern? Targeted practice on your weak spots is more efficient than general review.' },
            { title: 'Pace yourself physically', body: 'During long exams, physical state matters. If you can take a 2-minute stretch break mid-exam, do it. Your physical energy affects cognitive performance more than you may realize.' },
            { title: 'Build a pre-exam physical ritual', body: 'Physical movement before an exam — a short walk, stretching, light exercise — reduces cortisol and improves focus and recall. Build this into your exam-day routine.' },
          ],
          tools: ['Practice exam banks', 'Timed practice environments', 'Physical movement routine (pre-exam)', 'Flashcard apps (active recall practice)'],
          watchOut: 'Don\'t mistake quantity of practice for quality. Random practice without reviewing your mistakes is less effective than deliberate practice that analyzes and corrects errors.',
          weeklyChallenge: 'Complete one timed practice exam this week. Immediately after, categorize every wrong answer: wrong concept, wrong strategy, or careless error? Build your next study session around your specific error patterns.',
        },
      },
      reflectionPrompts: [
        'Do I experience test anxiety? If so, does it come from lack of preparation, fear of judgment, or in-the-moment panic?',
        'Which test format (multiple choice, essay, practical, oral) is hardest for me? What does that reveal about my learning style?',
        'Have I ever done a post-test reflection? What would I have learned from it?',
        'How does your archetype\'s test preparation strategy differ from how you currently prepare?',
      ],
    },

    /* ─── MODULE 7: Project & Problem Solving ────────── */
    {
      id: 'project-problem-solving',
      number: 7,
      title: 'Project & Problem Solving',
      subtitle: 'The BUILD Method',
      icon: '🔧',
      accentColor: '#7c3aed',
      objective: 'Turn large, overwhelming projects into manageable systems using the BUILD framework — and learn to solve complex problems through your archetype\'s natural strengths.',
      intro: [
        'Many learners who do well on quizzes and individual assignments completely freeze when faced with a large project. Projects feel overwhelming because they require multiple skills simultaneously: planning, research, time management, execution, communication, revision, and presentation.',
        'And unlike tests, projects unfold over days, weeks, or months — which means procrastination is baked right into the format. The good news: projects don\'t have to feel chaotic. They can be managed with the right systems.',
        'The BUILD Method breaks any project — academic, professional, or personal — into five clear stages that prevent last-minute panic and produce work you\'re actually proud of.',
      ],
      framework: {
        name: 'BUILD',
        steps: [
          { letter: 'B', word: 'Break Down the Assignment', desc: 'Read all instructions carefully. Identify the final deliverable, all deadlines, every required component, and the grading criteria. Then break the large task into specific sub-tasks.' },
          { letter: 'U', word: 'Understand Expectations', desc: 'Ask: What does success look like? Review rubrics, examples, and instructions. Ask clarifying questions early — before you\'ve built in the wrong direction.' },
          { letter: 'I', word: 'Identify Milestones', desc: 'Create mini-deadlines between now and the final due date. "Research complete by Tuesday. First draft by Friday. Final edits Sunday." Self-imposed milestones prevent last-minute disasters.' },
          { letter: 'L', word: 'Launch the Work', desc: 'Start before you feel ready. A rough first draft is infinitely better than a blank page. Progress beats perfection — always.' },
          { letter: 'D', word: 'Deliver and Review', desc: 'Before submitting, review for errors, completeness, and alignment with the rubric. Ask: Did I meet the requirements? Did I proofread? Did I complete everything asked?' },
        ],
      },
      universalTips: [
        { title: 'Group project survival guide', body: 'Set expectations in the first meeting: who handles what, when are internal deadlines, how will you communicate? Use Google Docs, Microsoft Teams, or Trello to maintain shared visibility.' },
        { title: 'Project recovery plan', body: 'Falling behind? Immediately: reassess priorities, communicate with your team or instructor early (not at the deadline), break remaining tasks to the smallest actionable steps, and focus on highest-impact work first.' },
        { title: 'Presentation projects', body: 'Simplify your slides (max one idea per slide), practice your spoken words out loud at least three times, time your delivery, and anticipate 2–3 questions you might receive.' },
      ],
      archetypes: {
        strategicArchitect: {
          headline: 'Execute Projects Like a Strategic Architect',
          intro: 'Planning is your superpower — and your greatest risk. You may spend so much time building the perfect project plan that you delay the actual work. Build the plan quickly, then execute.',
          strategies: [
            { title: 'Build the project plan in one sitting', body: 'Sit down and complete the full BUILD framework for your project in one 30-minute session. All milestones, all deliverables, all responsibilities. Done. Then begin executing the next day.' },
            { title: 'Create a project dashboard', body: 'Use Notion or Trello to build a visual dashboard: current status of each deliverable, upcoming deadlines, blockers, and next actions. Update it weekly. Visibility prevents missed handoffs.' },
            { title: 'Build revision time into your schedule', body: 'Strategic Architects often produce excellent work but rush the final review. Build an explicit "Revision Day" into your project timeline — 48 hours before the deadline — so you\'re reviewing, not finishing.' },
            { title: 'Communicate progress proactively', body: 'For group projects, send a brief status update to your team every 2–3 days. This demonstrates leadership and catches misalignments before they become crises.' },
          ],
          tools: ['Trello (project kanban)', 'Notion (project dashboard)', 'Google Docs (shared documents)', 'Milestone calendar'],
          watchOut: 'Overplanning is the Strategic Architect\'s most common project failure mode. If your project plan is more elaborate than the project itself, simplify. Ship something great rather than planning something perfect.',
          weeklyChallenge: 'For your current or next project, complete the full BUILD framework in one sitting. Then begin the actual work within 24 hours of completing the plan.',
        },
        precisionOperator: {
          headline: 'Execute Projects Like a Precision Operator',
          intro: 'Your work quality is exceptional — but you may struggle with the Launch and Deliver steps because nothing feels "ready." Set performance standards, then ship to those standards without infinite refinement.',
          strategies: [
            { title: 'Define "good enough" before you start', body: 'Before launching any project, define explicit quality standards: what does a B look like? An A? Once your work meets the A standard, stop revising. This prevents the perfection trap.' },
            { title: 'Prototype early and often', body: 'Build a rough version of your deliverable early — before you feel ready. A rough prototype reveals real problems that no amount of planning uncovers. Revise from something concrete.' },
            { title: 'Research-to-execution ratio', body: 'Set a limit: no more than 30% of your project time on research/planning, 60% on execution, 10% on review. Precision Operators often invert this ratio and run out of execution time.' },
            { title: 'Peer review before final submission', body: 'Share your work with one trusted reviewer before submitting. Your high standards can create blind spots — a fresh set of eyes catches things you\'ve become immune to.' },
          ],
          tools: ['Quality rubrics (self-defined)', 'Prototype tools (Google Slides draft, rough code, outline)', 'GitHub (for code projects)', 'Peer review checklist'],
          watchOut: 'Perfection paralysis is real. When you find yourself making tiny refinements at the expense of completing the project, ask: "Would the target audience notice this change?" If no, move on.',
          weeklyChallenge: 'For your next project, build a rough first draft within the first 24% of your project timeline. Share it with one person for feedback before refining it further. Track whether early feedback improved the final product.',
        },
        visionIntegrator: {
          headline: 'Execute Projects Like a Vision Integrator',
          intro: 'You produce some of the most creative, compelling work of any archetype — but you can struggle to finish, structure, or scope your projects. Your implementation needs to match your vision.',
          strategies: [
            { title: 'Scope the project before you begin', body: 'Vision Integrators often start with infinite possibilities and struggle to narrow down. Before beginning, define specifically: what is the project, what is NOT the project, and what is the single most important outcome? Constraints fuel creativity.' },
            { title: 'Set execution deadlines for each creative phase', body: 'Ideas phase: Day 1. Structure phase: Days 2–3. First draft: Days 4–6. Revision: Days 7–8. Final: Day 9. Naming phases and setting deadlines converts vision into delivered work.' },
            { title: 'Use a "parking lot" for extra ideas', body: 'As you work, brilliant tangential ideas will arise. Write them in a "parking lot" document instead of following them. This protects your creative energy while keeping you on track.' },
            { title: 'Find the story in every deliverable', body: 'Whether it\'s a research paper, a code project, or a presentation — find the narrative. What\'s the problem, the journey, and the resolution? Story-driven structure makes your work memorable and persuasive.' },
          ],
          tools: ['Miro (project brainstorming + scoping)', 'Canva (visual project planning)', 'Google Docs (collaborative drafting)', 'Parking lot doc for tangent ideas'],
          watchOut: 'A vision without a completion plan is a daydream. Make sure your most beautiful ideas are matched by realistic execution timelines. Check weekly: am I on track to finish, or am I still "planning the vision?"',
          weeklyChallenge: 'For your next project, spend the first session defining scope: what is included AND what is explicitly excluded. Then set a "minimum viable deliverable" — the simplest version that meets requirements. Build that first.',
        },
        appliedExecutor: {
          headline: 'Execute Projects Like an Applied Executor',
          intro: 'You\'re often the most productive person in any group project once things get moving — but you can struggle with the planning and communication stages. Build just enough structure to channel your execution energy.',
          strategies: [
            { title: 'Launch immediately — plan minimally', body: 'You don\'t need a perfect plan to start. Read the instructions, identify the first concrete deliverable, and begin within the first day. Momentum is your fuel. Planning beyond 30 minutes is usually procrastination for you.' },
            { title: 'Break projects into "can I do this in one session?" tasks', body: 'If a task would take more than one focused session, it\'s not small enough. Break it further. Applied Executors work best with tasks that have a clear start and end they can complete in one sitting.' },
            { title: 'Build prototypes over plans', body: 'Instead of planning what a presentation looks like, build a rough draft in 30 minutes. Instead of planning what code should do, write a working version that does one thing. Real feedback from real work beats planned perfection.' },
            { title: 'Check against the rubric before delivering', body: 'Applied Executors can get so into execution mode that they forget to verify alignment with requirements. Always check the rubric or requirements before submitting — not as a final polish, but as a "did I answer the right question?" check.' },
          ],
          tools: ['Timer (momentum sprints)', 'Whiteboard (rapid prototyping)', 'Replit or Google Docs (quick builds)', 'Rubric checklist (pre-submission)'],
          watchOut: 'Execution without planning can lead to producing excellent work that doesn\'t meet the requirements. Read the full instructions twice before starting — then execute freely within those boundaries.',
          weeklyChallenge: 'For your next project, set a rule: begin producing something (even rough) within 2 hours of reading the assignment. Track how this early-action approach affects your stress levels and final quality.',
        },
      },
      reflectionPrompts: [
        'What\'s the last project I felt overwhelmed by? Which stage of BUILD did I skip?',
        'In group projects, what role do I naturally take on — planning, execution, communication, revision? Is that my archetype talking?',
        'Do I typically start projects early or at the deadline? What would 72 hours of buffer time do for my work quality?',
        'What does your archetype\'s biggest project risk reveal about how you should structure your next major assignment?',
      ],
    },

    /* ─── MODULE 8: Confidence & Discipline ──────────── */
    {
      id: 'confidence-discipline',
      number: 8,
      title: 'Confidence & Discipline',
      subtitle: 'The RISE Method',
      icon: '💪',
      accentColor: '#d4a843',
      objective: 'Rebuild academic confidence, replace limiting beliefs with evidence-based self-trust, and build sustainable learning habits using the RISE framework.',
      intro: [
        'School can hurt. Not physically — but emotionally. One failed exam, one harsh teacher, one moment of comparison, one semester that felt impossible. These experiences can quietly shape your identity, leading you to believe stories like: "I\'m not smart enough," "I\'m always behind," or "Everyone learns faster than me."',
        'These beliefs feel real. But they\'re often built on painful experiences — not objective truth. Confidence is not something you either have or don\'t have. It\'s built through evidence: small wins, consistent effort, and systems that make success repeatable.',
        'The RISE Method is a four-stage framework for rebuilding confidence and building the kind of discipline that doesn\'t rely on motivation — because motivation is temporary, but systems are permanent.',
      ],
      framework: {
        name: 'RISE',
        steps: [
          { letter: 'R', word: 'Recognize Old Beliefs', desc: 'Ask: What negative academic story have I been telling myself? Name it specifically. You cannot challenge a belief you won\'t acknowledge.' },
          { letter: 'I', word: 'Identify Evidence', desc: 'What proof exists that you are capable? List your wins — even small ones. A full list of small evidence outweighs one big failure.' },
          { letter: 'S', word: 'Shift Your Language', desc: '"I\'m terrible at math" becomes "I\'m developing stronger math skills." "I always fail" becomes "I\'m improving my systems." Language shapes identity. Identity shapes action.' },
          { letter: 'E', word: 'Execute Small Wins', desc: 'Build confidence through consistent action. Small daily wins — completing tasks, asking a question, sticking to a schedule — create compounding evidence that you are capable.' },
        ],
      },
      universalTips: [
        { title: 'Stop comparing your process to others\'', body: 'Someone else may have more experience, more support, fewer responsibilities, or simply different strengths. Comparison always distorts. The only relevant comparison is you vs. yesterday\'s you.' },
        { title: 'Progress over perfection', body: 'Perfectionism is often disguised procrastination. Done and improving beats perfect and unfinished — always. Done creates evidence. Unfinished creates anxiety.' },
        { title: 'Rewrite your academic story', body: 'Complete: "I used to believe __________. Now I choose to believe __________." Writing this down is more powerful than you might expect. It makes the shift conscious and intentional.' },
      ],
      archetypes: {
        strategicArchitect: {
          headline: 'Build Confidence Like a Strategic Architect',
          intro: 'Your confidence lives in your systems. When things feel uncertain or out of control, your natural response is anxiety — not because you\'re not capable, but because you rely on structure for your sense of security. The solution is building systems you trust.',
          strategies: [
            { title: 'Release the need for a perfect plan', body: 'Your confidence drops when you can\'t see the whole path. Practice beginning with a "good enough" plan and refining as you go. Most successful outcomes come from adaptive systems, not perfect upfront plans.' },
            { title: 'Track your systems, not just your results', body: 'Measure whether you followed your study plan — not just whether you got an A. Systems are in your control. Results are not always. Confidence grows from controllable actions.' },
            { title: 'Build evidence files', body: 'Keep a running document of completed projects, mastered skills, and successfully navigated challenges. When you face a new difficult situation, review your evidence file. You\'ve handled hard things before.' },
            { title: 'Discipline over motivation', body: 'You don\'t need to feel inspired to execute your system. Commit to the process: same study time, same structure, same review habits — regardless of motivation. Your consistency is your competitive advantage.' },
          ],
          tools: ['Evidence file (Notion or journal)', 'Daily habit tracker', 'Weekly review template', 'Commitment contract (written plan for the week)'],
          watchOut: 'Perfectionism is your confidence killer. Every time you wait for ideal conditions or a perfect plan before acting, you miss the evidence-building that confidence requires. Begin imperfectly. Adjust as you go.',
          weeklyChallenge: 'Every day this week, write one thing you completed, one thing you learned, and one thing you handled well. At the end of the week, read the full list. Notice what you\'ve built.',
        },
        precisionOperator: {
          headline: 'Build Confidence Like a Precision Operator',
          intro: 'Your confidence comes from competence — and your greatest enemy is the voice that says you need to know more before you act. Trust the evidence of what you already know.',
          strategies: [
            { title: 'Stop over-analyzing your mistakes', body: 'When you make an error, your instinct is to dissect it completely. One careful analysis is useful. Repeated rumination is self-punishment. Identify what to fix, fix it, and move forward.' },
            { title: 'Celebrate correct answers, not just corrections', body: 'You tend to focus on what you got wrong. Begin noting what you got right with equal attention. Accuracy tracking — "I got 17/20 right" — builds confidence alongside improvement.' },
            { title: 'Trust your preparation', body: 'You are usually more prepared than you feel. The Dunning-Kruger effect works both ways — highly knowledgeable people often underestimate their own competence. Before any exam or presentation, review what you know, not just what you don\'t.' },
            { title: 'Build discipline through logical reasoning', body: 'When you don\'t feel like studying, use your analytical strength: "If I study for 45 minutes now, I will understand this concept, which will improve my exam performance by approximately X." Logic-based commitment is more durable for you than feeling-based motivation.' },
          ],
          tools: ['Evidence log (tracking correct answers and mastered concepts)', 'Preparation checklist', 'Self-assessment rubric', 'Reflection journal'],
          watchOut: 'Your perfectionism can convince you that you\'re not ready when you are. Build a habit of asking: "Am I hesitating because I genuinely need more preparation, or because I\'m afraid to perform?" Honest self-assessment is your superpower — use it on yourself.',
          weeklyChallenge: 'For 7 days, end each study session with a "Competence Log": list three things you understood well, one thing you want to improve, and the specific action you\'ll take to improve it. Reread the log at week\'s end.',
        },
        visionIntegrator: {
          headline: 'Build Confidence Like a Vision Integrator',
          intro: 'Your imagination is both your greatest strength and your anxiety engine. You can vividly envision both magnificent success and catastrophic failure. Learning to direct that imagination toward evidence and possibility rather than threat is your confidence work.',
          strategies: [
            { title: 'Stop shrinking your creativity in the face of doubt', body: 'When your confidence dips, your first instinct may be to make your ideas smaller, safer, or more conventional. This is the wrong direction. Your creative confidence grows when you act on your vision despite doubt — not after doubt disappears.' },
            { title: 'Build a vision board for your learning journey', body: 'Create a visual representation of where your learning is taking you: the skills you\'re building, the person you\'re becoming, the work you\'ll eventually produce. Revisit it when motivation dips.' },
            { title: 'Use your storytelling to reframe setbacks', body: 'When something goes wrong, your strength is narrative. Actively rewrite the story: "This wasn\'t failure — it was a draft. This is chapter one of something better." Meaning-making is your resilience superpower.' },
            { title: 'Create something every week', body: 'Confidence for Vision Integrators is built through creative production. Create something each week — a written reflection, a visual project, a teaching moment — that demonstrates your growing capabilities to yourself.' },
          ],
          tools: ['Vision board (Canva or physical)', 'Creative output log', 'Gratitude and accomplishment journal', 'Portfolio of completed work'],
          watchOut: 'Your imagination can generate elaborate stories about how things will go wrong. When you catch yourself writing a detailed failure narrative, interrupt it: "That\'s one story. What\'s the evidence-based story?" Then write that one instead.',
          weeklyChallenge: 'Every day this week, write a two-sentence story about how you handled something well. It can be small. At the end of the week, read all seven stories — notice the character that emerges.',
        },
        appliedExecutor: {
          headline: 'Build Confidence Like an Applied Executor',
          intro: 'You build confidence by doing, not by thinking. The fastest path to self-belief for you is action — completing things, fixing things, building things. Your system is motion.',
          strategies: [
            { title: 'Trust your practical intelligence', body: 'You often underestimate how capable you are because the strengths you have (execution, adaptability, real-world problem-solving) aren\'t celebrated in traditional academic environments. They are enormously valuable. Name them specifically.' },
            { title: 'Build confidence through completion streaks', body: 'Track consecutive days of completing your study tasks. Not how hard you studied — just whether you showed up and did the thing. Streaks build identity: "I\'m the person who follows through."' },
            { title: 'Let doing resolve doubt', body: 'When you\'re not sure you can do something, try it before you decide. Applied Executors who wait until they feel confident before acting wait a long time. Start, observe what happens, adjust.' },
            { title: 'Celebrate what you build, not just what you score', body: 'Your intelligence shows in projects, labs, demonstrations, and applications — not always on paper tests. Build a portfolio of things you\'ve made, solved, and executed. This is your evidence file.' },
          ],
          tools: ['Habit streak tracker', 'Portfolio of completed projects', 'Daily "done" list', 'Physical movement (exercise as confidence builder)'],
          watchOut: 'You can build momentum so fast that you rush past reflection. Pause briefly after completing major tasks to absorb the win. Applied Executors who never pause to acknowledge their progress miss the confidence-building effect of their own success.',
          weeklyChallenge: 'Every day this week, complete one thing — even small — related to your learning, and write it down. At the end of 7 days, read your full "Done" list. This is your evidence.',
        },
      },
      reflectionPrompts: [
        'What\'s the most limiting academic belief I carry? Where did it come from?',
        'What evidence already exists that I am capable of more than I believe?',
        'What\'s the difference between motivation and discipline in your own life? Which do you rely on more?',
        'Looking at your archetype\'s confidence strategies, which one do you most need right now — and what\'s one action you\'ll take today?',
      ],
    },

  ]; // end modules

  /* ── Public API ─────────────────────────────────────── */
  return {
    course: {
      id: 'activate-superpowers',
      title: 'Activate Your Superpowers™',
      subtitle: '8 Modules. 4 Archetypes. One Powerful Learning System.',
      description: 'A comprehensive, personalized learning course that teaches you how to read, take notes, manage time, retain information, take tests, and build unshakeable confidence — all through the lens of your unique Academic Superpower.',
      icon: '⚡',
      totalModules: 8,
      estimatedHours: 12,
      price: 97,
    },
    archetypes,
    legacyMap,
    modules,
    resolveArchetype,

    getModule(numberOrId) {
      if (typeof numberOrId === 'number') {
        return modules.find(m => m.number === numberOrId) || null;
      }
      return modules.find(m => m.id === numberOrId) || null;
    },

    getArchetypeContent(module, archetypeKey) {
      const resolved = resolveArchetype(archetypeKey);
      if (!resolved) return null;
      return module.archetypes[resolved] || null;
    },

    getUserArchetype(email) {
      if (!email) return null;
      try {
        const raw = localStorage.getItem(`heroAssessment:${email}`);
        if (!raw) return null;
        const data = JSON.parse(raw);
        const key = data.superpower || data.type || data.key || null;
        return resolveArchetype(key) || resolveArchetype(data.name);
      } catch {
        return null;
      }
    },

    getModuleProgress(email, moduleId) {
      try {
        const raw = localStorage.getItem(`heroProgress:${email}:activate-superpowers:${moduleId}`);
        return raw ? JSON.parse(raw) : { completed: false, completedAt: null };
      } catch {
        return { completed: false };
      }
    },

    setModuleComplete(email, moduleId) {
      const data = { completed: true, completedAt: new Date().toISOString() };
      localStorage.setItem(`heroProgress:${email}:activate-superpowers:${moduleId}`, JSON.stringify(data));
    },

    getCourseProgress(email) {
      const total = modules.length;
      const completed = modules.filter(m => {
        try {
          const raw = localStorage.getItem(`heroProgress:${email}:activate-superpowers:${m.id}`);
          return raw ? JSON.parse(raw).completed : false;
        } catch { return false; }
      }).length;
      return { completed, total, percent: Math.round((completed / total) * 100) };
    },
  };
})();
