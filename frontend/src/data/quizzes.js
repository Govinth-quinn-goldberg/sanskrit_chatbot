export const quizzesData = [
  {
    id: 1,
    lessonId: 1,
    question: "What does the word 'नमस्ते' (Namaste) mean?",
    options: [
      "Good night",
      "Greetings / Hello",
      "Thank you",
      "Goodbye"
    ],
    correctAnswer: 1, // 0-indexed: "Greetings / Hello"
    explanation: "'नमस्ते' (Namaste) is a traditional Sanskrit greeting meaning 'greetings' or 'I bow to you'."
  },
  {
    id: 2,
    lessonId: 2,
    question: "What does 'धन्यवादः' (Dhanyavādaḥ) mean?",
    options: [
      "Good morning",
      "Welcome",
      "Thank you",
      "Yes"
    ],
    correctAnswer: 2,
    explanation: "'धन्यवादः' means 'Thank you' in Sanskrit."
  },
  {
    id: 3,
    lessonId: 3,
    question: "What is the Sanskrit pronoun for 'I'?",
    options: [
      "सह (Saḥ)",
      "त्वम् (Tvam)",
      "अहम् (Aham)",
      "सा (Sā)"
    ],
    correctAnswer: 2,
    explanation: "'अहम्' (Aham) is the first-person singular pronoun meaning 'I'."
  },
  {
    id: 4,
    lessonId: 4,
    question: "Which gender does the word 'बालिका' (Bālikā - Girl) belong to?",
    options: [
      "Puṁlliṅga (Masculine)",
      "Strīliṅga (Feminine)",
      "Napuṁsakaliṅga (Neuter)",
      "Plural"
    ],
    correctAnswer: 1,
    explanation: "'बालिका' ends in long -ā and refers to a female, so it is Strīliṅga (Feminine)."
  },
  {
    id: 5,
    lessonId: 5,
    question: "What does 'रामः पठति' (Rāmaḥ paṭhati) mean?",
    options: [
      "Rama reads",
      "Rama sleeps",
      "Rama eats",
      "Rama runs"
    ],
    correctAnswer: 0,
    explanation: "'रामः' means Rama and 'पठति' means reads. So 'रामः पठति' means 'Rama reads'."
  },
  {
    id: 6,
    lessonId: 6,
    question: "What is the Sanskrit verb for 'eats'?",
    options: [
      "पिबति (Pibati)",
      "लिखति (Likhati)",
      "खादति (Khādati)",
      "गच्छति (Gacchati)"
    ],
    correctAnswer: 2,
    explanation: "'खादति' (Khādati) means 'eats', while 'पिबति' means 'drinks' and 'लिखति' means 'writes'."
  },
  {
    id: 7,
    lessonId: 7,
    question: "In the sentence 'बालकः जलम् पिबति', which word is the Direct Object (Dvitīyā Vibhakti)?",
    options: [
      "बालकः",
      "जलम्",
      "पिबति",
      "None"
    ],
    correctAnswer: 1,
    explanation: "'जलम्' (water) is the object being drunk, so it is in Dvitīyā Vibhakti (Accusative Case)."
  },
  {
    id: 8,
    lessonId: 8,
    question: "Translate 'Rama reads the book' into Sanskrit:",
    options: [
      "रामः जलम् पिबति।",
      "रामः पुस्तकं पठति।",
      "अहम् पुस्तकं लिखामि।",
      "सा विद्यालयम् गच्छति।"
    ],
    correctAnswer: 1,
    explanation: "'रामः' (Rama - Subject) + 'पुस्तकं' (Book - Object) + 'पठति' (Reads - Verb) = 'रामः पुस्तकं पठति।'"
  }
];
