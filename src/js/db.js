/**
 * Madrasa Database & Authentication Engine
 * Ansarul Uloom Madrasa, Andona, Thamarassery, Kozhikkode
 * Includes 3 Teams (Quaf, Noon, Meem) & Protected Admin Authentication
 */
const MadrasaDB = (function() {
  const STORAGE_KEYS = {
    STUDENTS: 'ansarul_uloom_db_students_v4',
    PROGRAMS: 'ansarul_uloom_db_programs_v4',
    EVENTS: 'ansarul_uloom_db_events_v4',
    RESULTS: 'ansarul_uloom_db_results_v4',
    SETTINGS: 'ansarul_uloom_db_settings_v4',
    AUTH: 'ansarul_uloom_auth_session_v1'
  };

  const DEFAULT_SETTINGS = {
    madrasaName: "Ansarul Uloom Madrasa",
    location: "Andona, Thamarassery, Kozhikkode",
    tagline: "Meelad Fest Official Teams & Competition Roster",
    established: "Andona, Thamarassery",
    address: "Andona, Thamarassery, Kozhikkode District, Kerala",
    contactEmail: "info@ansarululoom-andona.edu",
    contactPhone: "+91 98470 12345",
    adminUsername: "admin",
    adminPassword: "ansarululoom2026"
  };

  const TEAMS = [
    { id: "QUAF", name: "Quaf", arabic: "ق", color: "emerald", description: "Team Quaf (ق)" },
    { id: "NOON", name: "Noon", arabic: "ن", color: "cyan", description: "Team Noon (ن)" },
    { id: "MEEM", name: "Meem", arabic: "م", color: "amber", description: "Team Meem (م)" }
  ];

  const DEFAULT_PROGRAMS = [
    {
      id: "PRG-KIDS",
      name: "Kids Division (Boys & Girls)",
      category: "Kids",
      duration: "Meelad Fest",
      timing: "Stage A & B | Morning Session",
      instructor: "Convenor: Usthad Mansoor",
      fee: "Meelad Entry",
      capacity: 100,
      enrolledCount: 0,
      icon: "fa-child",
      description: "Meelad stage & off-stage competitions for early kids.",
      subjects: [
        "KUTTIPPATTU",
        "PUSTHAKA BAITH",
        "LEMON SPOON",
        "KASERA KALI",
        "NOKKI EZHUTHU",
        "KETTEZHUTHU",
        "COLORING",
        "CHITHRA RACHANA PENCIL",
        "VAYANA",
        "AANGYAPPATTU"
      ]
    },
    {
      id: "PRG-SUBJR-B",
      name: "Sub Junior Boys Division",
      category: "Sub-Junior",
      duration: "Meelad Fest",
      timing: "Stage A | 10:00 AM Onwards",
      instructor: "Convenor: Usthad Faisal",
      fee: "Meelad Entry",
      capacity: 100,
      enrolledCount: 0,
      icon: "fa-child-reaching",
      description: "Recitation, memorization, and art competitions for Sub Junior Boys.",
      subjects: [
        "MADH GAANAM",
        "KHIRA’ATH",
        "HIF’L",
        "VAYANA",
        "KETTEZHUTHU",
        "NOKKI EZHUTHU",
        "CHITHRA RACHANA JALACHAYAM",
        "PAADA PUSTHAKA QUIZ",
        "SPELLING BEE",
        "MEMORY TEST",
        "KADHA PARAYAL",
        "ARABIC BAITH"
      ]
    },
    {
      id: "PRG-SUBJR-G",
      name: "Sub Junior Girls Division",
      category: "Sub-Junior",
      duration: "Meelad Fest",
      timing: "Stage B | 10:00 AM Onwards",
      instructor: "Convenor: Usthadh Shareefa",
      fee: "Meelad Entry",
      capacity: 100,
      enrolledCount: 0,
      icon: "fa-person-dress",
      description: "Meelad recitation, quiz, and writing competitions for Sub Junior Girls.",
      subjects: [
        "MADH GAANAM",
        "KHIRA’ATH",
        "HIF’L",
        "VAYANA",
        "KETTEZHUTHU",
        "NOKKI EZHUTHU",
        "CHITHRA RACHANA JALACHAYAM",
        "PAADA PUSTHAKA QUIZ",
        "SPELLING BEE",
        "MEMORY TEST"
      ]
    },
    {
      id: "PRG-JUNIOR-B",
      name: "Junior Boys Division",
      category: "Junior",
      duration: "Meelad Fest",
      timing: "Main Auditorium | Afternoon",
      instructor: "Convenor: Usthad Ibrahim",
      fee: "Meelad Entry",
      capacity: 100,
      enrolledCount: 0,
      icon: "fa-user-graduate",
      description: "Elocution, song, calligraphy, and literary arts for Junior Boys.",
      subjects: [
        "PRASANGAM MALAYALAM",
        "QUIZ",
        "MADH GAANAM",
        "MAPPILAPPATTU",
        "LANGUAGE GAME",
        "MEMORY TEST",
        "KAIYEZHUTHU (ARABIC)",
        "GANITHA KELI",
        "JALACHAYAM",
        "ARABIC GAANAM",
        "VAYANA (ARABIC MALAYALAM)",
        "KADHA RACHANA",
        "CALLIGRAPHY"
      ]
    },
    {
      id: "PRG-JUNIOR-G",
      name: "Junior Girls Division",
      category: "Junior",
      duration: "Meelad Fest",
      timing: "Hall 2 | Afternoon",
      instructor: "Convenor: Usthadh Khadeeja",
      fee: "Meelad Entry",
      capacity: 100,
      enrolledCount: 0,
      icon: "fa-hands-praying",
      description: "Calligraphy, poetry, story writing, and crafting for Junior Girls.",
      subjects: [
        "CALLIGRAPHY",
        "QUIZ",
        "MEMORY TEST",
        "CHITHRA RACHANA JALACHAYAM",
        "KADHA RACHANA",
        "CRAFTING",
        "KAVITHA RACHANA",
        "VAYANA (ARABIC MALAYALAM)"
      ]
    },
    {
      id: "PRG-SENIOR-B",
      name: "Senior Boys Division",
      category: "Senior",
      duration: "Meelad Fest",
      timing: "Grand Stage | Evening Session",
      instructor: "Convenor: Usthad Rashid",
      fee: "Meelad Entry",
      capacity: 100,
      enrolledCount: 0,
      icon: "fa-award",
      description: "Senior elocution, poster design, essay, and classical songs.",
      subjects: [
        "SUDOKU",
        "QUIZ",
        "MADH GAANAM",
        "ARABIC GAANAM",
        "MAPPILAPPATTU",
        "CALLIGRAPHY",
        "BOOK TEST",
        "KADHA RACHANA",
        "KAVITHA RACHANA",
        "CHITHRA RACHANA JALACHAYAM",
        "PRABANDHA RACHANA MALAYALAM",
        "CAPTION WRITING",
        "POSTER DESIGNING"
      ]
    },
    {
      id: "PRG-SENIOR-G",
      name: "Senior Girls Division",
      category: "Senior",
      duration: "Meelad Fest",
      timing: "Hall 1 | Evening Session",
      instructor: "Convenor: Usthadh Zainab",
      fee: "Meelad Entry",
      capacity: 100,
      enrolledCount: 0,
      icon: "fa-feather",
      description: "Senior girls digital poster, poem writing, painting, and Arabic calligraphy.",
      subjects: [
        "PADAPAYATT",
        "QUIZ",
        "CALLIGRAPHY",
        "E-POSTER",
        "KADHA RACHANA",
        "KAVITHA RACHANA",
        "PAINTING",
        "VAYANA (ARABIC MALAYALAM)",
        "HAND WRITING (ARABIC)",
        "MADH GAANAM",
        "CRAFT"
      ]
    },
    {
      id: "PRG-GENERAL",
      name: "General Group Category (Boys & Girls)",
      category: "General",
      duration: "Meelad Fest",
      timing: "Main Stage | Night Session",
      instructor: "Meelad General Committee",
      fee: "Meelad Entry",
      capacity: 150,
      enrolledCount: 0,
      icon: "fa-users-line",
      description: "Flagship group recitations including Qawali, Burda, Nasheed, Maalappattu, and Sanga Gaanam.",
      subjects: [
        "QAWALI",
        "BURDA",
        "NASHEED",
        "MAALAPPATTU",
        "SANGA GAANAM"
      ]
    }
  ];

  const DEFAULT_EVENTS = [
    {
      id: "EVT-2026-MEELAD-01",
      title: "Ansarul Uloom Meelad Fest Grand Stage Competitions",
      date: "2026-08-25",
      time: "08:00 AM - 10:00 PM",
      category: "Meelad Stage",
      location: "Ansarul Uloom Madrasa Campus, Andona, Thamarassery",
      rsvpCount: 520,
      badge: "Meelad Fest",
      imageIcon: "fa-star-and-crescent",
      description: "Grand Meelad competitions featuring Team Quaf, Team Noon, and Team Meem across Kids, Sub Junior, Junior, Senior, and General divisions."
    },
    {
      id: "EVT-2026-MEELAD-02",
      title: "Team Championship Finals (Qawali, Burda & Nasheed)",
      date: "2026-08-25",
      time: "07:30 PM - 09:30 PM",
      category: "Group Stage",
      location: "Main Auditorium, Andona, Thamarassery",
      rsvpCount: 680,
      badge: "Team Battle",
      imageIcon: "fa-shield-halved",
      description: "High-voltage group finals between Quaf, Noon, and Meem teams for Qawali, Burda Majeed, Arabic Nasheed, and Maalappattu."
    },
    {
      id: "EVT-2026-MEELAD-03",
      title: "Meelad Overall Championship Trophy & Prize Distribution",
      date: "2026-08-26",
      time: "04:30 PM - 08:30 PM",
      category: "Ceremony",
      location: "Grand Stage, Andona, Thamarassery",
      rsvpCount: 850,
      badge: "Championship",
      imageIcon: "fa-trophy",
      description: "Awarding the Meelad Overall Championship Trophy to the winning team (Quaf, Noon, or Meem) and individual top scorers."
    }
  ];

  function makeStudent(idNum, name, team, gender, programId, age = 12) {
    return {
      id: "ANS-2026-" + String(idNum).padStart(3, '0'),
      name: name,
      team: team,
      gender: gender,
      age: age,
      guardian: "Parent / Guardian",
      email: name.toLowerCase().replace(/[^a-z0-9]/g, '.') + "@ansarululoom.edu",
      phone: "+91 98470 " + String(Math.floor(10005 + Math.random() * 89990)),
      enrolledDate: "2026-01-10",
      assignedPrograms: [programId],
      status: "Active"
    };
  }

  let idCounter = 1;
  const rawStudents = [];

  // --- TEAM MEEM ---
  ["MUHAMMED FEZIN TM", "MUHAMMED ILAAN CV", "MUHAMMED FAIZ P.K", "MUHAMMED HADI VN"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Meem", "Male", "PRG-SENIOR-B", 16)));
  ["MUHAMMED REZEEN PK", "MUHAMMED RABEEH NV", "JASIM MUHAMMED SHAH", "MUHAMMED MIDLAJ TC", "NUAMANUL HAK", "MUHAMMED SHABEEB VC", "MUHAMMED RAYAN K.K", "MUHAMMED RAFEEQ VC", "MUHAMMED NAEEM PC"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Meem", "Male", "PRG-JUNIOR-B", 14)));
  ["MUHAMMED ABUBAKAR TM", "MUHAMMED SAVAD MP", "HADI AMAN P", "MUHAMMED HANI TC", "MUHAMMED MIKDAD V.C", "AYMAN MUHIYUDHEEN SHAH", "BISHURUL HAFI PK", "MUHAMMED JAVAD VC", "MUHAMMED NIHAL P.K", "MUHAMMED ZAYAN V.T", "IRFAN MUHAMMED NV", "MUHAMMED MUZAMMIL NV"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Meem", "Male", "PRG-SUBJR-B", 11)));
  ["BISHARUL HAFI V.C", "SHAFRAZ PK", "MUHAMMED RIZWAN TM"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Meem", "Male", "PRG-KIDS", 7)));
  ["FATHIMA HANA KK", "RINSHA FATHIMA P.K", "FATHIMA SAFA PK", "MINHA FATHIMA K.T", "AYISHA FIDHA VN", "ZEDA FATHIMA", "NAJA FATHIMA PK", "FATHIMA ZAYAN NK", "SAHAREEM"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Meem", "Female", "PRG-SENIOR-G", 15)));
  ["NOORA FATHIMA TM", "SAYYIDATH HUSNA SHAREEFA", "AYSHA ZAHRA NK", "FAIHA FATHIMA V.M", "FAIZA FATHIMA TM", "AYISHA ZANHA NK", "FATHIMA ZEHRA NV", "RAJA FATHIMA TK", "FATHIMA MEHARIN VT", "KHADEEJA NOORA"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Meem", "Female", "PRG-JUNIOR-G", 13)));
  ["NASHWA", "FINZA FATHIMA TM", "ALMIYA AAMIN", "IZZA NV", "KHAIRA AYMAN", "RIZA PK", "ISRA FATHIMA", "AYSHA JASRA", "NIMA FATHIMA", "SANA A.K", "FIDHA V.C", "AMANA", "AYISHA FATHIMA"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Meem", "Female", "PRG-SUBJR-G", 10)));
  ["RAIZA P.K", "AIZA MEHRE", "FALHA FATHIMA"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Meem", "Female", "PRG-KIDS", 7)));

  // --- TEAM NOON ---
  ["MUHAMMED ASLAH VC", "MUHAMMED THAMEEM AM", "NAJAD V", "MUHAMMED RIZWAN VC", "MUHAMMED HISHAM VC", "MUHAMMED SINAN MP"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Noon", "Male", "PRG-SENIOR-B", 16)));
  ["ALI MUHAMMED SHAH", "MUHAMMED IRFAN TT", "MHAMMED RAZVIN VC", "NUHMAN SHIBLY", "HADIL TC", "MUHAMMED RAYAN AP", "MUHAMMED RAYAN TM", "MUHAMMED HISAN VC", "LIYAN", "MUHAMMED RAZEEN MP", "HABEEBU RAHMAN"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Noon", "Male", "PRG-JUNIOR-B", 14)));
  ["AHMED KABEER", "MUHAMMED MISHAB NV", "HADI MUHAMMED", "SAYYID HIBATHULLA", "AFINTHAZ RAHMAN", "MUHAMMED NIDAL", "ABOO THWAHIR TM", "MUHAMMED AKMAL VC"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Noon", "Male", "PRG-SUBJR-B", 11)));
  ["AHMED RAZI NV", "MUHAMMED ALFID VC", "AYDIN AYBAK", "ADAM MUHAMMED", "ARMAN UP"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Noon", "Male", "PRG-KIDS", 7)));
  ["AYISHA HAMDA", "AYISHA FIDHA VN", "MINHA FATHIMA TK", "NAJA FATHIMA TC", "FATHIMA MEHERIN K", "SHAZANA TT", "HANA FATHIMA VC", "HANNA FATHIMA PK", "ANEEQA AJWA"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Noon", "Female", "PRG-SENIOR-G", 15)));
  ["HAMNA ABDUL MAJEED", "AYISHA HINA PK", "ZIYA FATHIMA PK", "FABI THAMANNA", "FATHIMA HADIYA VC", "NAFLA FATHIMA", "FADI THANHA"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Noon", "Female", "PRG-JUNIOR-G", 13)));
  ["SAFA FATHIMA EC", "FATHIMA BATHOOL PK", "MEHARIN NAFEESA", "AYISHA HAMNA NV", "CHANDINI", "FATHIMA NIHA VC", "AYISHA ZAHRA AT", "AMINA HIMIYA", "MISRIYYA MAIMOONA", "RIFA FATHIMA EC", "AYISHA HAYA PK"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Noon", "Female", "PRG-SUBJR-G", 10)));
  ["AYISHA LIYANA MK", "RAIFA FATHIMA KT", "LIYA FATHIMA PP", "FAIZA FATHIMA TM"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Noon", "Female", "PRG-KIDS", 6)));

  // --- TEAM QUAF ---
  ["MUHAMMED RIZWAN PK", "MUHAMMED SAFVAN TT", "MUHAMMED NAFI VT", "MUHAMMED ADIL VT", "MUHAMMED SHIHAN VC"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Quaf", "Male", "PRG-SENIOR-B", 16)));
  ["MUHAMMED RISHAL VC", "MUHAMMED BISHR PP", "MUHAMMED HISAN VC", "ABDU RAHMAN VC", "MUHAMMED SHABAS PK", "MUHAMMED SAFNAS", "MUHAMMED AMJAD VC", "MUHAMMED INSAF PK", "MUHAMMED SHADIL PK"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Quaf", "Male", "PRG-JUNIOR-B", 14)));
  ["MUHAMMED AFLAH VC", "BISHRUL MUAD TM", "MUHAMMED MINHAJ VC 4", "MUHAMMEDIQDAD AK", "MUHAMMED AHNAS", "MUHAMMED MIQDAD PK", "MUHAMMED MINHAJ VC 3", "LEZIN MUHAMMED PK", "MUHAMMED AYDIN", "MUHAMMED ZAYAN PK", "RASVIN VC"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Quaf", "Male", "PRG-SUBJR-B", 11)));
  ["MUHAMMED RIZWAN PK", "MUHAMMED AMEEN P", "MUHAMMED ZIDAN AC", "AMEEN K"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Quaf", "Male", "PRG-KIDS", 7)));
  ["RANA KHADEEJA", "MASHIDA KK", "HANNA PK", "AYISHA REEM", "AYISHA NARJIS", "SHAHANA VC", "HIBA FATHIMA PK", "NOORA CV", "AMINA NAJA", "MEHARIN VC", "RIFA ZAINAB", "SANA PK"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Quaf", "Female", "PRG-SENIOR-G", 15)));
  ["ZIYA FATHIMA MK", "BAHJA FATHIMA", "RAIHANA LUBABA", "RISHA MEHARIN PK", "FELLA MEHARIN VC", "AYISHA LUTHFIYA NV"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Quaf", "Female", "PRG-JUNIOR-G", 13)));
  ["SHALNA JAN", "NASHA AK", "BUSHRA LENA TT", "AZA MEHRISH", "FAIHA PK", "AYISHA BATHOOL PK", "HANA UP", "FATHIMA KM", "AYISHA IZZA VC", "RIZA PK"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Quaf", "Female", "PRG-SUBJR-G", 10)));
  ["KHADEEJA LUBABA", "GAREEMA MEHAR", "IZZA VM", "RABIYATHUL ADAVIYYA", "FATHIMA RAIFA KT"]
    .forEach(n => rawStudents.push(makeStudent(idCounter++, n, "Quaf", "Female", "PRG-KIDS", 7)));

  const DEFAULT_STUDENTS = rawStudents;

  const DEFAULT_RESULTS = [
    {
      id: "RES-MEELAD-01",
      studentId: "ANS-2026-001",
      programId: "PRG-SENIOR-B",
      term: "Meelad Fest 2026",
      marks: [
        { subject: "MADH GAANAM", score: 98, max: 100 },
        { subject: "PRASANGAM MALAYALAM", score: 95, max: 100 },
        { subject: "MAPPILAPPATTU", score: 96, max: 100 }
      ],
      totalPercentage: 96.3,
      grade: "1st Rank (A+)",
      pointsAwarded: 40,
      remarks: "1st Prize in Senior Madh Gaanam & Prasangam. Scored 40 Championship Points for Team Meem!"
    },
    {
      id: "RES-MEELAD-02",
      studentId: "ANS-2026-064",
      programId: "PRG-SENIOR-B",
      term: "Meelad Fest 2026",
      marks: [
        { subject: "MADH GAANAM", score: 96, max: 100 },
        { subject: "ARABIC GAANAM", score: 97, max: 100 },
        { subject: "CALLIGRAPHY", score: 94, max: 100 }
      ],
      totalPercentage: 95.6,
      grade: "1st Rank (A+)",
      pointsAwarded: 40,
      remarks: "1st Prize in Arabic Gaanam. Scored 40 Championship Points for Team Noon!"
    },
    {
      id: "RES-MEELAD-03",
      studentId: "ANS-2026-104",
      programId: "PRG-SENIOR-B",
      term: "Meelad Fest 2026",
      marks: [
        { subject: "SUDOKU", score: 99, max: 100 },
        { subject: "QUIZ", score: 95, max: 100 },
        { subject: "POSTER DESIGNING", score: 93, max: 100 }
      ],
      totalPercentage: 95.7,
      grade: "1st Rank (A+)",
      pointsAwarded: 40,
      remarks: "1st Prize in Senior Sudoku & Quiz. Scored 40 Championship Points for Team Quaf!"
    }
  ];

  function getStorage(key, defaultVal) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch (e) {
      console.error("Storage Error:", e);
      return defaultVal;
    }
  }

  function setStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Storage Save Error:", e);
    }
  }

  function init() {
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      setStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROGRAMS)) {
      setStorage(STORAGE_KEYS.PROGRAMS, DEFAULT_PROGRAMS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
      setStorage(STORAGE_KEYS.EVENTS, DEFAULT_EVENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      setStorage(STORAGE_KEYS.STUDENTS, DEFAULT_STUDENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.RESULTS)) {
      setStorage(STORAGE_KEYS.RESULTS, DEFAULT_RESULTS);
    }
  }

  init();

  return {
    // AUTHENTICATION ENGINE
    isAuthenticated() {
      const session = getStorage(STORAGE_KEYS.AUTH, null);
      return session && session.authenticated === true;
    },

    getAuthSession() {
      return getStorage(STORAGE_KEYS.AUTH, null);
    },

    login(username, password) {
      const settings = this.getSettings();
      const validUser = settings.adminUsername || "admin";
      const validPass = settings.adminPassword || "ansarululoom2026";

      // Also accept "admin" / "admin123" or "teacher" / "ansarululoom"
      const isValid = (username.trim().toLowerCase() === validUser.toLowerCase() && password === validPass) ||
                      (username.trim().toLowerCase() === "admin" && password === "admin123") ||
                      (username.trim().toLowerCase() === "teacher" && password === "ansarululoom");

      if (isValid) {
        const session = {
          authenticated: true,
          username: username.trim(),
          role: "Administrator",
          loginTime: new Date().toISOString()
        };
        setStorage(STORAGE_KEYS.AUTH, session);
        return { success: true, session };
      } else {
        return { success: false, error: "Invalid Username or Password." };
      }
    },

    logout() {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    },

    getTeams() {
      return TEAMS;
    },
    getSettings() {
      return getStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    },
    updateSettings(newSettings) {
      const current = this.getSettings();
      const updated = { ...current, ...newSettings };
      setStorage(STORAGE_KEYS.SETTINGS, updated);
      return updated;
    },

    getPrograms() {
      return getStorage(STORAGE_KEYS.PROGRAMS, DEFAULT_PROGRAMS);
    },
    getProgramById(id) {
      return this.getPrograms().find(p => p.id === id);
    },
    saveProgram(program) {
      const programs = this.getPrograms();
      if (program.id) {
        const index = programs.findIndex(p => p.id === program.id);
        if (index >= 0) programs[index] = program;
        else programs.push(program);
      } else {
        program.id = "PRG-" + (programs.length + 1);
        programs.push(program);
      }
      setStorage(STORAGE_KEYS.PROGRAMS, programs);
      return program;
    },

    getEvents() {
      return getStorage(STORAGE_KEYS.EVENTS, DEFAULT_EVENTS);
    },
    saveEvent(evt) {
      const events = this.getEvents();
      if (evt.id) {
        const idx = events.findIndex(e => e.id === evt.id);
        if (idx >= 0) events[idx] = evt;
        else events.push(evt);
      } else {
        evt.id = "EVT-2026-MEELAD-0" + (events.length + 1);
        events.push(evt);
      }
      setStorage(STORAGE_KEYS.EVENTS, events);
      return evt;
    },
    incrementRSVP(eventId) {
      const events = this.getEvents();
      const evt = events.find(e => e.id === eventId);
      if (evt) {
        evt.rsvpCount = (evt.rsvpCount || 0) + 1;
        setStorage(STORAGE_KEYS.EVENTS, events);
      }
      return evt;
    },

    getStudents() {
      return getStorage(STORAGE_KEYS.STUDENTS, DEFAULT_STUDENTS);
    },
    getStudentById(id) {
      return this.getStudents().find(s => s.id === id || s.id.toLowerCase() === id.toLowerCase());
    },
    saveStudent(student) {
      const students = this.getStudents();
      student.team = student.team || "Quaf";

      if (student.id) {
        const idx = students.findIndex(s => s.id === student.id);
        if (idx >= 0) {
          students[idx] = { ...students[idx], ...student };
        } else {
          students.push(student);
        }
      } else {
        const nextId = "ANS-2026-" + String(students.length + 1).padStart(3, '0');
        student.id = nextId;
        student.enrolledDate = new Date().toISOString().split('T')[0];
        student.status = student.status || "Active";
        student.assignedPrograms = student.assignedPrograms || [];
        students.push(student);
      }
      setStorage(STORAGE_KEYS.STUDENTS, students);
      this.recalculateProgramEnrollments();
      return student;
    },
    deleteStudent(studentId) {
      let students = this.getStudents();
      students = students.filter(s => s.id !== studentId);
      setStorage(STORAGE_KEYS.STUDENTS, students);
      
      let results = this.getResults();
      results = results.filter(r => r.studentId !== studentId);
      setStorage(STORAGE_KEYS.RESULTS, results);

      this.recalculateProgramEnrollments();
    },

    assignStudentToPrograms(studentId, programIds) {
      const student = this.getStudentById(studentId);
      if (student) {
        student.assignedPrograms = programIds;
        this.saveStudent(student);
      }
      return student;
    },

    recalculateProgramEnrollments() {
      const students = this.getStudents();
      const programs = this.getPrograms();
      
      programs.forEach(p => {
        const count = students.filter(s => s.assignedPrograms && s.assignedPrograms.includes(p.id)).length;
        p.enrolledCount = count;
      });
      setStorage(STORAGE_KEYS.PROGRAMS, programs);
    },

    getResults() {
      return getStorage(STORAGE_KEYS.RESULTS, DEFAULT_RESULTS);
    },
    getStudentResults(studentId) {
      return this.getResults().filter(r => r.studentId.toLowerCase() === studentId.toLowerCase());
    },
    saveResult(resultData) {
      const results = this.getResults();
      
      if (resultData.marks && resultData.marks.length > 0) {
        let totalObtained = 0;
        let totalMax = 0;
        resultData.marks.forEach(m => {
          totalObtained += parseFloat(m.score || 0);
          totalMax += parseFloat(m.max || 100);
        });
        const pct = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
        resultData.totalPercentage = parseFloat(pct.toFixed(1));
        
        if (pct >= 95) {
          resultData.grade = "1st Rank (A+)";
          resultData.pointsAwarded = 40;
        } else if (pct >= 90) {
          resultData.grade = "2nd Rank (A+)";
          resultData.pointsAwarded = 32;
        } else if (pct >= 85) {
          resultData.grade = "3rd Rank (A)";
          resultData.pointsAwarded = 25;
        } else if (pct >= 75) {
          resultData.grade = "Grade B+";
          resultData.pointsAwarded = 15;
        } else {
          resultData.grade = "Participated";
          resultData.pointsAwarded = 5;
        }
      }

      if (resultData.id) {
        const idx = results.findIndex(r => r.id === resultData.id);
        if (idx >= 0) results[idx] = resultData;
        else results.push(resultData);
      } else {
        resultData.id = "RES-MEELAD-" + String(results.length + 1).padStart(2, '0');
        results.push(resultData);
      }

      setStorage(STORAGE_KEYS.RESULTS, results);
      return resultData;
    },

    getTeamStandings() {
      const students = this.getStudents();
      const results = this.getResults();

      const teamsData = [
        { name: "Meem", arabic: "م", color: "amber", points: 0, firstPrizes: 0, totalStudents: 0 },
        { name: "Noon", arabic: "ن", color: "cyan", points: 0, firstPrizes: 0, totalStudents: 0 },
        { name: "Quaf", arabic: "ق", color: "emerald", points: 0, firstPrizes: 0, totalStudents: 0 }
      ];

      students.forEach(s => {
        const teamObj = teamsData.find(t => t.name.toLowerCase() === (s.team || 'quaf').toLowerCase());
        if (teamObj) {
          teamObj.totalStudents += 1;
          const sResults = results.filter(r => r.studentId === s.id);
          sResults.forEach(r => {
            teamObj.points += (r.pointsAwarded || 0);
            if (r.grade && r.grade.includes("1st")) {
              teamObj.firstPrizes += 1;
            }
          });
        }
      });

      return teamsData.sort((a, b) => b.points - a.points);
    },

    resetToDefault() {
      setStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
      setStorage(STORAGE_KEYS.PROGRAMS, DEFAULT_PROGRAMS);
      setStorage(STORAGE_KEYS.EVENTS, DEFAULT_EVENTS);
      setStorage(STORAGE_KEYS.STUDENTS, DEFAULT_STUDENTS);
      setStorage(STORAGE_KEYS.RESULTS, DEFAULT_RESULTS);
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  };
})();
