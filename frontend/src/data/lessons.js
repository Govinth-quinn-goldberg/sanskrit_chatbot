// 3 Levels of Sanskrit Lessons: Beginner (12), Intermediate (12), Advanced (12)

export const UNLOCK_THRESHOLD = 6; // Completing 6 lessons in a level unlocks the next level

export const levelInfo = {
  beginner: {
    id: "beginner",
    name: "Beginner",
    badge: "🟢 Beginner",
    color: "#22c55e",
    description: "Start learning Sanskrit fundamentals, script, basic words, and simple sentences.",
    requiredCount: 0
  },
  intermediate: {
    id: "intermediate",
    name: "Intermediate",
    badge: "🟡 Intermediate",
    color: "#eab308",
    description: "Build grammar, case endings, verb conjugations, and sentence structure skills.",
    requiredLevel: "beginner",
    requiredCount: UNLOCK_THRESHOLD
  },
  advanced: {
    id: "advanced",
    name: "Advanced",
    badge: "🔴 Advanced",
    color: "#ef4444",
    description: "Advanced Sandhi, Samāsa compound rules, classical passage analysis, and fluent communication.",
    requiredLevel: "intermediate",
    requiredCount: UNLOCK_THRESHOLD
  }
};

export const beginnerLessons = [
  {
    id: "beg-1",
    numericId: 1,
    level: "beginner",
    title: "1. Introduction to Sanskrit",
    objective: "Understand Sanskrit history, Devanagari script origins, and phonetic purity.",
    shortExplanation: "Overview of Samskritam as a refined, phonetic classical language.",
    explanation: "Sanskrit ('Saṃskṛtam' meaning well-formed or refined) is one of the oldest languages of human civilization. It is strictly phonetic: every character represents one invariant sound. Writing in Sanskrit is done primarily using the Devanagari script, which is organized scientifically according to the vocal organ positions.",
    examples: [
      { sanskrit: "संस्कृतम् (Saṃskṛtam)", meaning: "Refined / Sanskrit language" },
      { sanskrit: "नमस्ते (Namaste)", meaning: "Greetings / I bow to you" },
      { sanskrit: "शुभप्रभातम् (Śubhabrabhātam)", meaning: "Good morning" }
    ],
    practice: "Pronounce 'संस्कृतम्' slowly: Sam - skri - tam."
  },
  {
    id: "beg-2",
    numericId: 2,
    level: "beginner",
    title: "2. Devanagari Alphabet",
    objective: "Identify Sanskrit Vowels (Swaras) and Consonants (Vyanjanas).",
    shortExplanation: "Learn Swaras (vowels) and Vyanjanas (consonants) sound classification.",
    explanation: "Devanagari has 13 basic vowels (Swaras) categorized into short (Hrasva like अ, इ, उ) and long (Dīrgha like आ, ई, ऊ). Consonants (Vyanjanas) are grouped in 5 phonetic classes (Vargas): Guttural (क-वर्ग), Palatal (च-वर्ग), Retroflex (ट-वर्ग), Dental (त-वर्ग), and Labial (प-वर्ग).",
    examples: [
      { sanskrit: "अ, आ, इ, ई, उ, ऊ", meaning: "Basic Vowels (a, ā, i, ī, u, ū)" },
      { sanskrit: "क, ख, ग, घ, ङ", meaning: "Guttural Consonants (ka, kha, ga, gha, ṅa)" },
      { sanskrit: "त, थ, द, ध, न", meaning: "Dental Consonants (ta, tha, da, dha, na)" }
    ],
    practice: "Practice reciting the 5 guttural consonants: क, ख, ग, घ, ङ."
  },
  {
    id: "beg-3",
    numericId: 3,
    level: "beginner",
    title: "3. Sanskrit Pronunciation",
    objective: "Master mouth positions (Sthānas) and aspiration (Prāṇa).",
    shortExplanation: "Guide to accurate aspiration (Mahāprāṇa) and nasalization (Anusvāra).",
    explanation: "Consonants are un-aspirated (Alpaprāṇa like क, ग) or aspirated (Mahāprāṇa like ख, घ). The dot above a letter (अं) is Anusvāra, sounding like 'm' or nasalization. The double dots (ः) are Visarga, sounding like a soft breath ('ha').",
    examples: [
      { sanskrit: "रामः (Rāmaḥ)", meaning: "Rama (Visarga ः pronounced -ah)" },
      { sanskrit: "अहम् (Aham) / अहँ", meaning: "I (Anusvāra/Halanta m)" },
      { sanskrit: "फलम् (Phalam)", meaning: "Fruit (Ph is aspirated P)" }
    ],
    practice: "Feel the puff of air when pronouncing 'ख' vs 'क'."
  },
  {
    id: "beg-4",
    numericId: 4,
    level: "beginner",
    title: "4. Basic Vocabulary",
    objective: "Build essential vocabulary for family, objects, and nature.",
    shortExplanation: "Everyday nouns for essential objects and people.",
    explanation: "Building core nouns enables early sentence comprehension. Sanskrit words often end in a Visarga (ः) for masculine, long ā for feminine, or -am for neuter.",
    examples: [
      { sanskrit: "बालकः (Bālakaḥ)", meaning: "Boy" },
      { sanskrit: "बालिका (Bālikā)", meaning: "Girl" },
      { sanskrit: "पुस्तकम् (Pustakam)", meaning: "Book" },
      { sanskrit: "जलम् (Jalam)", meaning: "Water" },
      { sanskrit: "मित्रम् (Mitram)", meaning: "Friend" }
    ],
    practice: "Categorize: बालकः (boy), बालिका (girl), पुस्तकम् (book)."
  },
  {
    id: "beg-5",
    numericId: 5,
    level: "beginner",
    title: "5. Greetings and Common Expressions",
    objective: "Learn everyday conversational greetings and politeness words.",
    shortExplanation: "Polite expressions like thank you, yes, no, welcome.",
    explanation: "Sanskrit conversation uses respectful phrases. 'Dhanyavādaḥ' means thank you, 'Kṛpayā' means please, 'Ām' means yes, and 'Na' means no.",
    examples: [
      { sanskrit: "धन्यवादः (Dhanyavādaḥ)", meaning: "Thank you" },
      { sanskrit: "स्वागतम् (Svāgatam)", meaning: "Welcome" },
      { sanskrit: "कृप‍या (Kṛpayā)", meaning: "Please" },
      { sanskrit: "आम (Ām) / न (Na)", meaning: "Yes / No" },
      { sanskrit: "पुनः मिलामः (Punaḥ milāmaḥ)", meaning: "See you again" }
    ],
    practice: "Say: 'धन्यवादः मित्रम्' (Thank you friend)."
  },
  {
    id: "beg-6",
    numericId: 6,
    level: "beginner",
    title: "6. Pronouns",
    objective: "Master personal pronouns in 1st, 2nd, and 3rd person.",
    shortExplanation: "Understand Aham (I), Tvam (You), Sah (He), Sa (She), Tat (It).",
    explanation: "Pronouns substitute nouns. First person: 'अहम्' (I). Second person: 'त्वम्' (You). Third person depends on gender: 'सह' (He), 'सा' (She), 'तत्' (It).",
    examples: [
      { sanskrit: "अहम् (Aham)", meaning: "I" },
      { sanskrit: "त्वम् (Tvam)", meaning: "You" },
      { sanskrit: "सह (Saḥ)", meaning: "He (male)" },
      { sanskrit: "सा (Sā)", meaning: "She (female)" },
      { sanskrit: "तत् (Tat)", meaning: "It (neuter)" }
    ],
    practice: "Identify pronouns: अहम् (I), सह (He), सा (She)."
  },
  {
    id: "beg-7",
    numericId: 7,
    level: "beginner",
    title: "7. Nouns and Gender",
    objective: "Recognize Puṃlliṅga, Strīliṅga, and Napuṃsakaliṅga genders.",
    shortExplanation: "Learn how word endings indicate grammatical gender.",
    explanation: "Sanskrit has three grammatical genders: Puṁlliṅga (Masculine), Strīliṅga (Feminine), and Napuṁsakaliṅga (Neuter). Unlike English, grammatical gender is tied to the word structure.",
    examples: [
      { sanskrit: "रामः (Rāmaḥ)", meaning: "Rama (Masculine - ends in ः)" },
      { sanskrit: "लता (Latā)", meaning: "Creeper/Vine (Feminine - ends in ā)" },
      { sanskrit: "फलम् (Phalam)", meaning: "Fruit (Neuter - ends in m)" }
    ],
    practice: "Identify gender: सूर्यः is Masculine, नदी is Feminine, द्वारम् is Neuter."
  },
  {
    id: "beg-8",
    numericId: 8,
    level: "beginner",
    title: "8. Singular, Dual and Plural",
    objective: "Understand Sanskrit's three numbers: Ekavacana, Dvivacana, and Bahuvacana.",
    shortExplanation: "Sanskrit uniquely features a Dual number for exactly two items.",
    explanation: "Unlike English (singular/plural), Sanskrit has three numbers: Ekavacana (one item), Dvivacana (two items), and Bahuvacana (three or more items). Example: Bālakaḥ (one boy), Bālakau (two boys), Bālakāḥ (many boys).",
    examples: [
      { sanskrit: "बालकः (Bālakaḥ)", meaning: "One boy (Singular)" },
      { sanskrit: "बालकौ (Bālakau)", meaning: "Two boys (Dual)" },
      { sanskrit: "बालकाः (Bālakāḥ)", meaning: "Many boys (Plural)" }
    ],
    practice: "What does 'बालकौ' mean? Two boys."
  },
  {
    id: "beg-9",
    level: "beginner",
    title: "9. Basic Cases",
    objective: "Introduction to Subject (Prathamā) and Object (Dvitīyā) cases.",
    shortExplanation: "Learn how noun case endings change function in a sentence.",
    explanation: "Cases (Vibhaktis) show the role of a noun. Prathamā Vibhakti marks the Subject (doer). Dvitīyā Vibhakti marks the Direct Object (the recipient of action).",
    examples: [
      { sanskrit: "रामः (Rāmaḥ)", meaning: "Rama (Subject - Nominative)" },
      { sanskrit: "पुस्तकम् (Pustakam)", meaning: "Book (Object - Accusative)" },
      { sanskrit: "जलम् (Jalam)", meaning: "Water (Object - Accusative)" }
    ],
    practice: "In 'बालकः फलम् खादति', 'बालकः' is Subject and 'फलम्' is Object."
  },
  {
    id: "beg-10",
    level: "beginner",
    title: "10. Basic Verbs",
    objective: "Learn essential present tense action verbs (Laṭ Lakāra).",
    shortExplanation: "Common verbs for reading, writing, eating, drinking, going.",
    explanation: "Verbs (Dhātus) express actions. In present tense third person singular (He/She/It), regular verbs end in '-ति' (-ti).",
    examples: [
      { sanskrit: "पठति (Paṭhati)", meaning: "Reads" },
      { sanskrit: "लिखति (Likhati)", meaning: "Writes" },
      { sanskrit: "खादति (Khādati)", meaning: "Eats" },
      { sanskrit: "पिबति (Pibati)", meaning: "Drinks" },
      { sanskrit: "गच्छति (Gacchati)", meaning: "Goes" }
    ],
    practice: "Translate: 'He reads' -> 'सह पठति'."
  },
  {
    id: "beg-11",
    level: "beginner",
    title: "11. Simple Sentences",
    objective: "Combine Subject, Object, and Verb into basic Sanskrit sentences.",
    shortExplanation: "Subject-Object-Verb (SOV) order in short sentences.",
    explanation: "Standard Sanskrit word order is Subject - Object - Verb (SOV). Example: 'रामः (Subject) पुस्तकम् (Object) पठति (Verb)'.",
    examples: [
      { sanskrit: "अहम् पठामि।", meaning: "I read." },
      { sanskrit: "सह पुस्तकम् पठति।", meaning: "He reads the book." },
      { sanskrit: "बालिका जलम् पिबति।", meaning: "The girl drinks water." }
    ],
    practice: "Form sentence: 'I drink water' -> 'अहम् जलम् पिबामि'."
  },
  {
    id: "beg-12",
    level: "beginner",
    title: "12. Everyday Sanskrit Conversation",
    objective: "Participate in short everyday dialogues and questions.",
    shortExplanation: "Asking name, location, and simple questions.",
    explanation: "Asking questions: 'भवतः नाम किम्?' (What is your name - male?), 'भवत्याः नाम किम्?' (What is your name - female?). Answer: 'मम नाम ...' (My name is ...).",
    examples: [
      { sanskrit: "भवतः नाम किम्?", meaning: "What is your name? (to male)" },
      { sanskrit: "मम नाम आनन्दः।", meaning: "My name is Anand." },
      { sanskrit: "कथम् अस्ति?", meaning: "How are you?" },
      { sanskrit: "अहम् कुशली अस्मि।", meaning: "I am fine." }
    ],
    practice: "Answer the question: 'भवतः नाम किम्?' with 'मम नाम [Your Name]'."
  }
];

export const intermediateLessons = [
  {
    id: "int-1",
    level: "intermediate",
    title: "1. Case Endings in Detail",
    objective: "Understand the 8 Vibhaktis (Nominative to Vocative).",
    shortExplanation: "In-depth breakdown of case roles: Instrumental, Dative, Ablative, Genitive, Locative.",
    explanation: "Sanskrit has 8 cases: Prathamā (Subject), Dvitīyā (Object), Tṛtīyā (By/With), Caturthī (For/To), Pañcamī (From), Ṣaṣṭhī (Of/Possessive), Saptamī (In/On), and Sambodhana (O!).",
    examples: [
      { sanskrit: "रामेण (Rāmeṇa)", meaning: "By/With Rama (Instrumental - Tṛtīyā)" },
      { sanskrit: "रामाय (Rāmāya)", meaning: "For Rama (Dative - Caturthī)" },
      { sanskrit: "रामात् (Rāmāt)", meaning: "From Rama (Ablative - Pañcamī)" },
      { sanskrit: "रामस्य (Rāmasya)", meaning: "Of Rama / Rama's (Genitive - Ṣaṣṭhī)" },
      { sanskrit: "रामे (Rāme)", meaning: "In/On Rama (Locative - Saptamī)" }
    ],
    practice: "What case is 'रामस्य'? Genitive (Ṣaṣṭhī - Of Rama)."
  },
  {
    id: "int-2",
    level: "intermediate",
    title: "2. Verb Conjugation",
    objective: "Conjugate verbs across Person (Puruṣa) and Number.",
    shortExplanation: "First, Second, and Third Person verb endings.",
    explanation: "Verbs conjugate across three Purushas: Prathama Purusha (Third person - He/She/They), Madhyama Purusha (Second person - You), and Uttama Purusha (First person - I/We). Endings for present tense singular: -ति (-ti), -सि (-si), -मि (-mi).",
    examples: [
      { sanskrit: "सह पठति (Saḥ paṭhati)", meaning: "He reads (3rd person)" },
      { sanskrit: "त्वम् पठसि (Tvam paṭhasi)", meaning: "You read (2nd person)" },
      { sanskrit: "अहम् पठामि (Aham paṭhāmi)", meaning: "I read (1st person)" }
    ],
    practice: "Match: त्वम् uses verb ending '-सि'."
  },
  {
    id: "int-3",
    level: "intermediate",
    title: "3. Present Tense",
    objective: "Master Laṭ Lakāra paradigm across singular, dual, and plural.",
    shortExplanation: "Complete present tense table: ti-taḥ-anti, si-thaḥ-tha, mi-vaḥ-maḥ.",
    explanation: "Present tense (Laṭ Lakāra) suffix pattern:\nSingular: -ति, -सि, -मि\nDual: -तः, -थः, -वः\nPlural: -न्ति, -थ, -मः",
    examples: [
      { sanskrit: "पठति - पठतः - पठन्ति", meaning: "He reads - They two read - They all read" },
      { sanskrit: "पठसि - पठथः - पठथ", meaning: "You read - You two read - You all read" },
      { sanskrit: "पठामि - पठावः - पठामः", meaning: "I read - We two read - We all read" }
    ],
    practice: "What is the plural form of 'पठामि'? 'पठामः' (We all read)."
  },
  {
    id: "int-4",
    level: "intermediate",
    title: "4. Past Tense",
    objective: "Form past tense verbs using Laṅ Lakāra (Imperfect).",
    shortExplanation: "Past tense prefix 'a-' (aṭ āgama) and endings.",
    explanation: "Past tense (Laṅ Lakāra) adds an 'अ-' prefix to the verb root. Example: Paṭhati (reads) becomes 'अपठत्' (read - past tense). Gacchati (goes) becomes 'अगच्छत्' (went).",
    examples: [
      { sanskrit: "सह अगच्छत् (Saḥ agacchat)", meaning: "He went." },
      { sanskrit: "अहम् अपठम् (Aham apaṭham)", meaning: "I read (past)." },
      { sanskrit: "सा अलिखत् (Sā alikhat)", meaning: "She wrote." }
    ],
    practice: "Convert 'सह खादति' (He eats) into past tense: 'सह अखादत्'."
  },
  {
    id: "int-5",
    level: "intermediate",
    title: "5. Future Tense",
    objective: "Form future tense verbs using Lṛṭ Lakāra.",
    shortExplanation: "Future tense infix '-ṣya-' or '-iṣya-'.",
    explanation: "Future tense (Lṛṭ Lakāra) inserts '-ष्य-' (-ṣya-) into the verb root. Example: Paṭhati becomes 'पठिष्यति' (will read). Gacchati becomes 'गमिष्यति' (will go).",
    examples: [
      { sanskrit: "अहम् गमिष्यामि (Aham gamiṣyāmi)", meaning: "I will go." },
      { sanskrit: "सह पठिष्यति (Saḥ paṭhiṣyati)", meaning: "He will read." },
      { sanskrit: "त्वम् लेखिष्यसि (Tvam lekiṣyasi)", meaning: "You will write." }
    ],
    practice: "Translate: 'I will go' -> 'अहम् गमिष्यामि'."
  },
  {
    id: "int-6",
    level: "intermediate",
    title: "6. Adjectives",
    objective: "Match Viśeṣana (adjective) with Viśeṣya (noun) in gender, case, and number.",
    shortExplanation: "Adjectives must agree with the modified noun.",
    explanation: "Rule: 'यल्लिङ्गं यद्वचनं या च विभक्तिर्विशेष्यस्य, तल्लिङ्गं तद्वचनं सा च विभक्तिर्विशेषणस्य।' An adjective must have the exact same gender, case, and number as the noun it describes.",
    examples: [
      { sanskrit: "सुन्दरः बालकः (Sundaraḥ bālakaḥ)", meaning: "Handsome boy (Masculine)" },
      { sanskrit: "सुन्दरी बालिका (Sundarī bālikā)", meaning: "Beautiful girl (Feminine)" },
      { sanskrit: "सुन्दरम् पुष्पम् (Sundaram puṣpam)", meaning: "Beautiful flower (Neuter)" }
    ],
    practice: "Match adjective for 'पुष्पम्' (flower): 'सुन्दरम् पुष्पम्'."
  },
  {
    id: "int-7",
    level: "intermediate",
    title: "7. Sandhi Basics",
    objective: "Understand euphonic sound combination at word boundaries.",
    shortExplanation: "Svara Sandhi (Vowel combination) basics like Dīrgha and Guṇa Sandhi.",
    explanation: "Sandhi is the blending of adjacent sounds. When 'a' + 'a' join, they form long 'ā' (Dīrgha Sandhi). Example: 'Deva' + 'Ālayaḥ' = 'Devālayaḥ'. When 'a' + 'i' join, they form 'e' (Guṇa Sandhi). Example: 'Maha' + 'Iśaḥ' = 'Maheśaḥ'.",
    examples: [
      { sanskrit: "देव + आलयः = देवालयः", meaning: "Temple (Devālayaḥ)" },
      { sanskrit: "महा + ईशः = महेशः", meaning: "Mahesha / Great Lord" },
      { sanskrit: "सूर्य + उदयः = सूर्योदयः", meaning: "Sunrise (Sūryodayaḥ)" }
    ],
    practice: "Combine: 'गण + ईशः' = 'गणेशः'."
  },
  {
    id: "int-8",
    level: "intermediate",
    title: "8. Samāsa Basics",
    objective: "Introduction to compound words (Samāsa).",
    shortExplanation: "Combining two or more words into a single compound.",
    explanation: "Samāsa merges words into a single compound noun. Tatpuruṣa Samāsa is a determinative compound where the second word is principal. Example: 'Rājñaḥ puruṣaḥ' (King's man) = 'Rājapuruṣaḥ'.",
    examples: [
      { sanskrit: "राजपुरुषः (Rājapuruṣaḥ)", meaning: "King's servant/officer" },
      { sanskrit: "देवगृहम् (Devagṛham)", meaning: "House of God / Temple" },
      { sanskrit: "रामलक्ष्मणौ (Rāmalakṣmaṇau)", meaning: "Rama and Lakshmana (Dvandva compound)" }
    ],
    practice: "What type of compound is 'रामलक्ष्मणौ'? Dvandva (Copulative - Rama and Lakshmana)."
  },
  {
    id: "int-9",
    level: "intermediate",
    title: "9. Sentence Construction",
    objective: "Construct complex sentences using multiple Vibhaktis.",
    shortExplanation: "Using prepositions, indirect objects, and locations.",
    explanation: "Expand sentences by adding location (Locative Saptamī) and instrument (Instrumental Tṛtīyā). Example: 'Bālakaḥ (Subject) hastena (by hand) patram (letter) gṛhe (at home) likhati (writes).'",
    examples: [
      { sanskrit: "बालकः हस्तेन लिखति।", meaning: "The boy writes with a hand." },
      { sanskrit: "सः विद्यालये पठति।", meaning: "He studies in the school." },
      { sanskrit: "माता बालकाय दुग्धम् ददाति।", meaning: "Mother gives milk to the boy." }
    ],
    practice: "Identify location in 'सः गृहे वसति': 'गृहे' (at home - Locative)."
  },
  {
    id: "int-10",
    level: "intermediate",
    title: "10. Translation Practice",
    objective: "Translate multi-word English sentences accurately into Sanskrit.",
    shortExplanation: "Step-by-step English to Sanskrit sentence translation method.",
    explanation: "1. Identify Subject and set Nominative case. 2. Identify Verb and match person/number. 3. Identify Object and set Accusative case. 4. Apply Sandhi rules if needed.",
    examples: [
      { sanskrit: "The teacher speaks Sanskrit -> शिक्षकः संस्कृतम् वदति।", meaning: "Teacher speaks Sanskrit" },
      { sanskrit: "We drink water -> वयं जलम् पिबामः।", meaning: "We drink water" },
      { sanskrit: "She goes to school -> सा विद्यालयम् गच्छति।", meaning: "She goes to school" }
    ],
    practice: "Translate: 'The teacher speaks Sanskrit'."
  },
  {
    id: "int-11",
    level: "intermediate",
    title: "11. Reading Short Passages",
    objective: "Read and comprehend simple Sanskrit stories and fables.",
    shortExplanation: "Reading passages from Panchatantra.",
    explanation: "Reading prose helps build intuitive vocabulary. Practice separating joined Sandhi words in your mind while reading.",
    examples: [
      { sanskrit: "एकः काकः अस्ति। सः तृषितः अस्ति। सः जलम् अन्वेषयति।", meaning: "There is a crow. He is thirsty. He searches for water." },
      { sanskrit: "वने एकः सिंहः वसति स्म।", meaning: "A lion used to live in a forest." }
    ],
    practice: "What does 'सः तृषितः अस्ति' mean? 'He is thirsty'."
  },
  {
    id: "int-12",
    level: "intermediate",
    title: "12. Conversation Practice",
    objective: "Engage in paragraph-length Sanskrit conversations.",
    shortExplanation: "Discussing daily schedule, hobbies, and study.",
    explanation: "Combine past, present, and future verbs in dialogue: 'अद्य अहम् पठामि। श्वः अहम् गमिष्यामि।' (Today I read. Tomorrow I will go.)",
    examples: [
      { sanskrit: "भवान् कुत्र गच्छति?", meaning: "Where are you going? (to male)" },
      { sanskrit: "अहम् पण्यम् गच्छामि।", meaning: "I am going to the market." },
      { sanskrit: "किम् आनेष्यति?", meaning: "What will you bring?" },
      { sanskrit: "अहम् फलानि आनेष्यामि।", meaning: "I will bring fruits." }
    ],
    practice: "Ask someone where they are going: 'भवान् कुत्र गच्छति?'"
  }
];

export const advancedLessons = [
  {
    id: "adv-1",
    level: "advanced",
    title: "1. Advanced Sandhi",
    objective: "Master Visarga Sandhi and Hal (Consonant) Sandhi transformation rules.",
    shortExplanation: "Rules governing Visarga transformations (Utva, Rutva, Lopas) and Anusvāra.",
    explanation: "Visarga Sandhi transforms ः based on following sounds: 1. Visarga before voiced consonants becomes 'o' (Utva): 'Rāmaḥ' + 'gacchati' = 'Rāmo gacchati'. 2. Visarga drops before vowels: 'Bālakāḥ' + 'agacchan' = 'Bālakā agacchan'.",
    examples: [
      { sanskrit: "रामः + गच्छति = रामो गच्छति", meaning: "Rama goes (Utva Sandhi)" },
      { sanskrit: "नमः + ते = नमस्ते", meaning: "Greetings (Sattva Sandhi)" },
      { sanskrit: "सत + चित + आनन्द = सचिदानन्द", meaning: "Sat-Chit-Ananda (Consonant Sandhi)" }
    ],
    practice: "Combine: 'शिवः + वहति' = 'शिवो वहति'."
  },
  {
    id: "adv-2",
    level: "advanced",
    title: "2. Advanced Samāsa",
    objective: "Analyze Bahuvrīhi, Dvigu, and Avyayībhāva complex compound structures.",
    shortExplanation: "Exocentric compounds (Bahuvrīhi) and adverbial compounds.",
    explanation: "Bahuvrīhi compound points to a third entity not named in the compound. Example: 'Pītāmbaraḥ' (Yellow-clothed) = Vishnu. Avyayībhāva creates indeclinable adverbs. Example: 'Yathāśakti' (According to power).",
    examples: [
      { sanskrit: "पीताम्बरः (Pītāmbaraḥ)", meaning: "One who wears yellow garments (Lord Vishnu)" },
      { sanskrit: "यथाशक्ति (Yathāśakti)", meaning: "According to one's capacity (Adverbial compound)" },
      { sanskrit: "त्रिभुवनम् (Tribhuvanam)", meaning: "The three worlds (Dvigu numerical compound)" }
    ],
    practice: "What does 'यथाशक्ति' mean? According to one's capacity."
  },
  {
    id: "adv-3",
    level: "advanced",
    title: "3. Participles",
    objective: "Use Ktvā (-tvā), Lyap (-ya), and Tumun (-tum) indeclinable participles.",
    shortExplanation: "Connecting sequential actions without multiple main verbs.",
    explanation: "Ktvā / Lyap expresses 'having done X': 'Gatvā' = having gone; 'Ānīya' = having brought. Tumun expresses 'in order to do X': 'Paṭhitum' = in order to read.",
    examples: [
      { sanskrit: "गत्वा (Gatvā)", meaning: "Having gone" },
      { sanskrit: "पठित्वा (Paṭhitvā)", meaning: "Having read" },
      { sanskrit: "पठितुम् (Paṭhitum)", meaning: "In order to read / To read" },
      { sanskrit: "बालकः पुस्तकम् पठित्वा क्रीडति।", meaning: "Having read the book, the boy plays." }
    ],
    practice: "Form participle: 'Having gone' -> 'गत्वा'."
  },
  {
    id: "adv-4",
    level: "advanced",
    title: "4. Complex Verb Forms",
    objective: "Understand Passive (Karmani), Causal (Ṇijanta), and Desiderative (Sannanta) forms.",
    shortExplanation: "Passive voice and causative action structures.",
    explanation: "Passive voice (Karmaṇi) adds '-ya-' to the root and uses Ātmanepada endings. Example: 'Paṭhyate' (is read). Causative (Ṇijanta) means causing someone to do: 'Pāṭhayati' (causes to read / teaches).",
    examples: [
      { sanskrit: "मया ग्रन्थः पठ्यते। (Mayā granthaḥ paṭhyate)", meaning: "The book is being read by me. (Passive)" },
      { sanskrit: "शिक्षकः छात्रम् पाठयति।", meaning: "The teacher causes the student to read. (Causative)" },
      { sanskrit: "जिज्ञासा (Jijñāsā)", meaning: "Desire to know (Desiderative)" }
    ],
    practice: "Passive vs Active: 'अहम् पठामि' (Active) vs 'मया पठ्यते' (Passive)."
  },
  {
    id: "adv-5",
    level: "advanced",
    title: "5. Complex Sentence Construction",
    objective: "Construct relative and conditional sentences using Yad-Tad correlates.",
    shortExplanation: "Using Yah... Sah (He who... that person) and Yadi... Tarhi (If... then).",
    explanation: "Correlative pronouns link subordinate and main clauses: 'यः परिश्रमम् करोति, सः फलम् लभते।' (He who works hard, he gets fruit). 'यदि वर्षति, तर्हि जलम् भविष्यति।' (If it rains, then water will be there).",
    examples: [
      { sanskrit: "यः पठति, सः जानाति।", meaning: "He who reads, knows." },
      { sanskrit: "यदि त्वम् आगच्छसि, तर्हि अहम् गमिष्यामि।", meaning: "If you come, then I will go." },
      { sanskrit: "यथा राजा, तथा प्रजा।", meaning: "As the king, so the subjects." }
    ],
    practice: "Complete sentence: 'यदि त्वम् आगच्छसि, तर्हि...'"
  },
  {
    id: "adv-6",
    level: "advanced",
    title: "6. Sanskrit Grammar Analysis",
    objective: "Perform Padaccheda (word splitting) and Anvaya (prose ordering).",
    shortExplanation: "Analyzing classical poetic verses into standard prose word order.",
    explanation: "Sanskrit poetry rearranges words for meter. Anvaya is the process of rearranging poetic words into logical Subject -> Adjective -> Object -> Verb prose order.",
    examples: [
      { sanskrit: "विद्या ददाति विनयम्।", meaning: "Knowledge gives humility." },
      { sanskrit: "अन्वयः: विद्या विनयम् ददाति।", meaning: "Prose order: Knowledge humility gives." }
    ],
    practice: "Rearrangeverse into prose (Anvaya)."
  },
  {
    id: "adv-7",
    level: "advanced",
    title: "7. Classical Sanskrit Reading",
    objective: "Read and analyze verses from Subhāṣitas and Bhagavad Gītā.",
    shortExplanation: "Understanding classical Subhāṣita ethical maxims.",
    explanation: "Subhāṣitas are wise sayings composed in classical meters like Anuṣṭubh (8 syllables per quarter line). Example: 'सत्यमेव जयते नानृतम्' (Truth alone triumphs, not falsehood).",
    examples: [
      { sanskrit: "सत्यमेव जयते नानृतम्।", meaning: "Truth alone triumphs, not untruth." },
      { sanskrit: "वसुधैव कुटुम्बकम्।", meaning: "The entire world is one family." },
      { sanskrit: "उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः।", meaning: "Tasks are accomplished by hard work, not by mere wishing." }
    ],
    practice: "What does 'वसुधैव कुटुम्बकम्' mean? 'The world is one family'."
  },
  {
    id: "adv-8",
    level: "advanced",
    title: "8. Sanskrit → English Translation",
    objective: "Translate authentic classical Sanskrit passages into English.",
    shortExplanation: "Translating classical prose with sandhi resolution.",
    explanation: "When translating classical Sanskrit, first resolve Sandhis (Padaccheda), identify noun Vibhaktis, locate main verb, and synthesize natural English phrasing.",
    examples: [
      { sanskrit: "अयं निजः परो वेति गणना लघुचेतसाम्।", meaning: "'This is mine, that is a stranger's' is the calculation of narrow-minded people." },
      { sanskrit: "उदारचरितानां तु वसुधैव कुटुम्बकम्।", meaning: "For broad-minded people, the entire world is family." }
    ],
    practice: "Translate: 'उद्यमेन हि सिध्यन्ति कार्याणि'."
  },
  {
    id: "adv-9",
    level: "advanced",
    title: "9. English → Sanskrit Translation",
    objective: "Translate nuanced English thoughts and metaphors into Sanskrit.",
    shortExplanation: "Handling abstract ideas and metaphorical expressions.",
    explanation: "Metaphors in English ('He was like the sun to me') require selecting appropriate comparative particles in Sanskrit ('सूर्य इव' - like the sun). Example: 'सः मम कृते सूर्यः इव आसीत्।'",
    examples: [
      { sanskrit: "He was like the sun to me -> सः मम कृते सूर्यः इव आसीत्।", meaning: "He was like the sun to me" },
      { sanskrit: "Knowledge is the greatest wealth -> विद्या परमम् धनम् अस्ति।", meaning: "Knowledge is supreme wealth" }
    ],
    practice: "Translate: 'Knowledge is supreme wealth'."
  },
  {
    id: "adv-10",
    level: "advanced",
    title: "10. Advanced Conversation",
    objective: "Express abstract thoughts, philosophy, and debates in Sanskrit.",
    shortExplanation: "Fluid Sanskrit discussion on literature, science, and life.",
    explanation: "Use connectors like 'तथापि' (even then / nonethless), 'अतएव' (therefore), and 'किञ्च' (furthermore) to construct sophisticated discourse.",
    examples: [
      { sanskrit: "अस्य विषयस्य मुख्यं कारणम् किम्?", meaning: "What is the main cause of this matter?" },
      { sanskrit: "अतएव अस्माभिः प्रयत्नः करणीयः।", meaning: "Therefore, effort must be made by us." }
    ],
    practice: "Use 'अतएव' (therefore) in a sentence."
  },
  {
    id: "adv-11",
    level: "advanced",
    title: "11. Passage Analysis",
    objective: "Dissect complex prose line-by-line analyzing grammar and figures of speech.",
    shortExplanation: "Analyzing Alaṅkāra (metaphor/simile) and grammatical structure.",
    explanation: "Identify poetic ornaments (Alaṅkāras) such as Upamā (Simile - using 'iva') and Rūpaka (Metaphor).",
    examples: [
      { sanskrit: "मुखम् कमलम् इव विकसति।", meaning: "The face blooms like a lotus (Upamā Alaṅkāra - Simile)." },
      { sanskrit: "विद्याधनम् सर्वधनप्रधानम्।", meaning: "The wealth of knowledge is chief among all wealth." }
    ],
    practice: "Identify figure of speech: 'कमलम् इव' (like a lotus - Simile)."
  },
  {
    id: "adv-12",
    level: "advanced",
    title: "12. Free Sanskrit Practice",
    objective: "Compose original Sanskrit prose, verses, and creative essays.",
    shortExplanation: "Writing essays and creative compositions in Sanskrit.",
    explanation: "Congratulations! You have reached the final lesson. Practice writing original short essays in Sanskrit on topics like nature, study, or philosophy.",
    examples: [
      { sanskrit: "मम प्रियः ग्रन्थः (Mama priyaḥ granthaḥ)", meaning: "My favorite book" },
      { sanskrit: "संस्कृतभाषायाः महत्वम्", meaning: "The importance of Sanskrit language" }
    ],
    practice: "Write 3 sentences in Sanskrit about your favorite topic."
  }
];

// Helper mapping for easy access by level
export const lessonsByLevel = {
  beginner: beginnerLessons,
  intermediate: intermediateLessons,
  advanced: advancedLessons
};

// Combined array for backward compatibility
export const lessonsData = [
  ...beginnerLessons,
  ...intermediateLessons,
  ...advancedLessons
];
