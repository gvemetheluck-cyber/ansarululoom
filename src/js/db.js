/**
 * Madrasa Database Engine - Ansarul Uloom Madrasa, Andona, Thamarassery, Kozhikkode
 */
const MadrasaDB = (function() {
  const STORAGE_KEYS = {
    STUDENTS: 'ansarul_uloom_db_students_v2',
    PROGRAMS: 'ansarul_uloom_db_programs_v2',
    EVENTS: 'ansarul_uloom_db_events_v2',
    RESULTS: 'ansarul_uloom_db_results_v2',
    SETTINGS: 'ansarul_uloom_db_settings_v2'
  };

  // Specific Madrasa Settings
  const DEFAULT_SETTINGS = {
    madrasaName: "Ansarul Uloom Madrasa",
    location: "Andona, Thamarassery, Kozhikkode",
    tagline: "Meelad Fest Programs & Academic Competitions Portal",
    established: "Andona, Thamarassery",
    address: "Andona, Thamarassery, Kozhikkode District, Kerala",
    contactEmail: "info@ansarululoom-andona.edu",
    contactPhone: "+91 98470 12345"
  };

  // Meelad Programs Categorized by Category
  const DEFAULT_PROGRAMS = [
    {
      id: "PRG-KIDS",
      name: "Kids Division (Boys & Girls)",
      category: "Kids",
      duration: "Meelad Fest",
      timing: "Stage A & B | Morning Session",
      instructor: "Convenor: Usthad Mansoor",
      fee: "Meelad Entry",
      capacity: 60,
      enrolledCount: 42,
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
      capacity: 50,
      enrolledCount: 38,
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
      capacity: 50,
      enrolledCount: 36,
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
      capacity: 45,
      enrolledCount: 32,
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
      capacity: 45,
      enrolledCount: 30,
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
      capacity: 40,
      enrolledCount: 28,
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
      capacity: 40,
      enrolledCount: 26,
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
      capacity: 100,
      enrolledCount: 75,
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
      title: "Ansarul Uloom Meelad Fest 2026 Grand Stage Competitions",
      date: "2026-08-25",
      time: "08:00 AM - 10:00 PM",
      category: "Meelad Stage",
      location: "Ansarul Uloom Madrasa Campus, Andona, Thamarassery",
      rsvpCount: 520,
      badge: "Meelad Fest",
      imageIcon: "fa-star-and-crescent",
      description: "Grand Meelad competitions featuring Kids, Sub Junior, Junior, Senior, and General group performances."
    },
    {
      id: "EVT-2026-MEELAD-02",
      title: "General Group Recitation Finals (Qawali, Burda & Nasheed)",
      date: "2026-08-25",
      time: "07:30 PM - 09:30 PM",
      category: "Group Stage",
      location: "Main Auditorium, Andona, Thamarassery",
      rsvpCount: 680,
      badge: "Flagship Night",
      imageIcon: "fa-music",
      description: "High-octane group finals for Qawali, Burda Majeed, Arabic Nasheed, and Maalappattu."
    },
    {
      id: "EVT-2026-MEELAD-03",
      title: "Meelad Award Ceremony & Sanad Distribution",
      date: "2026-08-26",
      time: "04:30 PM - 08:30 PM",
      category: "Ceremony",
      location: "Grand Stage, Andona, Thamarassery",
      rsvpCount: 850,
      badge: "Prize Distribution",
      imageIcon: "fa-trophy",
      description: "Prize distribution and trophiess for top points winners across Kids, Sub-Junior, Junior, Senior, and General divisions."
    }
  ];

  const DEFAULT_STUDENTS = [
    {
      id: "ANS-2026-001",
      name: "Muhammed Sinan",
      age: 15,
      gender: "Male",
      guardian: "Abdurahiman Andona",
      email: "sinan.andona@example.com",
      phone: "+91 98470 11111",
      enrolledDate: "2026-01-10",
      assignedPrograms: ["PRG-SENIOR-B", "PRG-GENERAL"],
      status: "Active"
    },
    {
      id: "ANS-2026-002",
      name: "Fathima Rifa",
      age: 14,
      gender: "Female",
      guardian: "Musthafa Thamarassery",
      email: "rifa.t@example.com",
      phone: "+91 98470 22222",
      enrolledDate: "2026-01-12",
      assignedPrograms: ["PRG-SENIOR-G", "PRG-GENERAL"],
      status: "Active"
    },
    {
      id: "ANS-2026-003",
      name: "Muhammed Ameen",
      age: 11,
      gender: "Male",
      guardian: "Moideen Andona",
      email: "ameen.m@example.com",
      phone: "+91 98470 33333",
      enrolledDate: "2026-01-15",
      assignedPrograms: ["PRG-JUNIOR-B"],
      status: "Active"
    },
    {
      id: "ANS-2026-004",
      name: "Aisha Mehreen",
      age: 10,
      gender: "Female",
      guardian: "Usman Kozhikkode",
      email: "mehreen.a@example.com",
      phone: "+91 98470 44444",
      enrolledDate: "2026-01-18",
      assignedPrograms: ["PRG-JUNIOR-G"],
      status: "Active"
    },
    {
      id: "ANS-2026-005",
      name: "Muhammed Yaseen",
      age: 8,
      gender: "Male",
      guardian: "Hamza Andona",
      email: "yaseen.h@example.com",
      phone: "+91 98470 55555",
      enrolledDate: "2026-02-01",
      assignedPrograms: ["PRG-SUBJR-B"],
      status: "Active"
    },
    {
      id: "ANS-2026-006",
      name: "Mariyam Zoya",
      age: 6,
      gender: "Female",
      guardian: "Zakariya Thamarassery",
      email: "zoya.z@example.com",
      phone: "+91 98470 66666",
      enrolledDate: "2026-02-05",
      assignedPrograms: ["PRG-KIDS"],
      status: "Active"
    }
  ];

  const DEFAULT_RESULTS = [
    {
      id: "RES-MEELAD-01",
      studentId: "ANS-2026-001",
      programId: "PRG-SENIOR-B",
      term: "Meelad Fest 2026",
      marks: [
        { subject: "MADH GAANAM", score: 98, max: 100 },
        { subject: "PRASANGAM MALAYALAM", score: 95, max: 100 },
        { subject: "CALLIGRAPHY", score: 92, max: 100 },
        { subject: "MAPPILAPPATTU", score: 96, max: 100 }
      ],
      totalPercentage: 95.2,
      grade: "1st Rank (A+)",
      remarks: "Outstanding voice control in Madh Gaanam and eloquent Malayalam elocution."
    },
    {
      id: "RES-MEELAD-02",
      studentId: "ANS-2026-002",
      programId: "PRG-SENIOR-G",
      term: "Meelad Fest 2026",
      marks: [
        { subject: "CALLIGRAPHY", score: 97, max: 100 },
        { subject: "E-POSTER", score: 94, max: 100 },
        { subject: "KAVITHA RACHANA", score: 95, max: 100 },
        { subject: "MADH GAANAM", score: 93, max: 100 }
      ],
      totalPercentage: 94.7,
      grade: "1st Rank (A+)",
      remarks: "First prize in Arabic Calligraphy and exceptional E-Poster creative design."
    },
    {
      id: "RES-MEELAD-03",
      studentId: "ANS-2026-005",
      programId: "PRG-SUBJR-B",
      term: "Meelad Fest 2026",
      marks: [
        { subject: "MADH GAANAM", score: 92, max: 100 },
        { subject: "KHIRA’ATH", score: 90, max: 100 },
        { subject: "HIF’L", score: 94, max: 100 },
        { subject: "ARABIC BAITH", score: 88, max: 100 }
      ],
      totalPercentage: 91.0,
      grade: "A+",
      remarks: "Excellent Tajweed accuracy in Khira'ath and clear vocal projection."
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
        
        if (pct >= 95) resultData.grade = "1st Rank (A+)";
        else if (pct >= 90) resultData.grade = "2nd Rank (A+)";
        else if (pct >= 85) resultData.grade = "3rd Rank (A)";
        else if (pct >= 75) resultData.grade = "Grade B+";
        else resultData.grade = "Participated";
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

    resetToDefault() {
      setStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
      setStorage(STORAGE_KEYS.PROGRAMS, DEFAULT_PROGRAMS);
      setStorage(STORAGE_KEYS.EVENTS, DEFAULT_EVENTS);
      setStorage(STORAGE_KEYS.STUDENTS, DEFAULT_STUDENTS);
      setStorage(STORAGE_KEYS.RESULTS, DEFAULT_RESULTS);
    }
  };
})();
