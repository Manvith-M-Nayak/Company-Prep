/* Static prep content shown on the Resources page and inside company PDFs. */
window.RESOURCES = {
  dsaSheets: [
    ["Striver A2Z DSA Sheet", "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2"],
    ["Striver SDE Sheet (top coding interview problems)", "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems"],
    ["NeetCode 150 / roadmap", "https://neetcode.io/roadmap"],
    ["LeetCode Top Interview 150", "https://leetcode.com/studyplan/top-interview-150/"],
    ["LeetCode 75", "https://leetcode.com/studyplan/leetcode-75/"],
    ["GfG Must-Do Coding Questions", "https://www.geeksforgeeks.org/must-do-coding-questions-for-companies-like-amazon-microsoft-adobe/"]
  ],
  core: [
    { name: "Operating Systems", links: [["GfG OS tutorial", "https://www.geeksforgeeks.org/operating-systems/"], ["OS interview questions", "https://www.geeksforgeeks.org/operating-systems-interview-questions/"]],
      focus: "Processes vs threads, scheduling, deadlocks (Banker's), paging & virtual memory, page replacement, semaphores / mutex, producer–consumer." },
    { name: "DBMS & SQL", links: [["GfG DBMS", "https://www.geeksforgeeks.org/dbms/"], ["SQL tutorial", "https://www.geeksforgeeks.org/sql-tutorial/"], ["LeetCode SQL 50", "https://leetcode.com/studyplan/top-sql-50/"]],
      focus: "Normalisation (1NF–BCNF), ACID, transactions & isolation levels, indexing (B+ trees), joins, GROUP BY / HAVING, Nth highest salary, window functions." },
    { name: "Computer Networks", links: [["GfG CN tutorial", "https://www.geeksforgeeks.org/computer-network-tutorials/"], ["CN interview questions", "https://www.geeksforgeeks.org/computer-network-interview-questions/"]],
      focus: "OSI vs TCP/IP, TCP vs UDP, 3-way handshake, DNS, HTTP/HTTPS & TLS, what happens when you type a URL, subnetting." },
    { name: "OOPs", links: [["OOPs in Java", "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/"], ["OOPs interview questions", "https://www.geeksforgeeks.org/oops-interview-questions/"]],
      focus: "4 pillars, overloading vs overriding, abstract class vs interface, SOLID, common design patterns (Singleton, Factory, Observer)." },
    { name: "System / Low-Level Design", links: [["System design tutorial", "https://www.geeksforgeeks.org/system-design-tutorial/"], ["LLD tutorial", "https://www.geeksforgeeks.org/low-level-design-lld-tutorial/"]],
      focus: "Design parking lot / LRU cache / URL shortener, load balancing, caching, sharding, CAP theorem (SDE-1 level)." },
    { name: "Software Engineering", links: [["SDLC", "https://www.geeksforgeeks.org/software-development-life-cycle-sdlc/"], ["About Scrum", "https://www.scrumalliance.org/about-scrum"]],
      focus: "SDLC models (Waterfall, Agile, Spiral), Scrum roles & ceremonies, testing levels, Git basics." }
  ],
  aptitude: [
    ["IndiaBix — Quant, Logical, Verbal", "https://www.indiabix.com/"],
    ["PrepInsta — company-wise aptitude patterns", "https://prepinsta.com/"],
    ["GfG Aptitude", "https://www.geeksforgeeks.org/aptitude-questions-and-answers/"],
    ["Sanfoundry MCQs (CS subjects)", "https://www.sanfoundry.com/"],
    ["GfG Puzzles", "https://www.geeksforgeeks.org/puzzles/"]
  ],
  experiences: [
    ["GfG Interview Experiences", "https://www.geeksforgeeks.org/company-interview-corner/"],
    ["LeetCode Discuss — Interview Experience", "https://leetcode.com/discuss/interview-experience"],
    ["AmbitionBox Interviews", "https://www.ambitionbox.com/interviews"],
    ["Glassdoor Interviews", "https://www.glassdoor.co.in/Interview/index.htm"]
  ],
  hr: [
    ["Tell me about yourself.", "60–90 sec: who you are → 1–2 strongest projects/internships with impact → why this role. Don't recite your resume."],
    ["Why do you want to join us?", "Mention a specific product, tech blog or value of the company and connect it to your projects. Research the company page above first."],
    ["Describe a challenging project / bug.", "Use STAR: Situation, Task, Action (what YOU did), Result with a number if possible."],
    ["Tell me about a conflict in a team.", "Show you listened, used data to decide, and kept the relationship. End with what you learned."],
    ["What are your strengths and weaknesses?", "Strength with proof; a real weakness plus what you are actively doing about it."],
    ["Where do you see yourself in 5 years?", "Growing depth in an area relevant to the role, taking ownership, mentoring — not 'doing an MBA'."],
    ["Are you open to relocation / shifts / bond?", "Know the placement notice terms beforehand and answer honestly."],
    ["Do you have any questions for us?", "Always ask 1–2: team's tech stack, what a new grad's first 90 days look like, how success is measured."]
  ],
  resume: [
    "One page. PDF. File name: Name_PESU_Resume.pdf",
    "Projects: action verb + what you built + tech + measurable result (e.g. 'reduced latency 40%').",
    "Put links (GitHub, LeetCode, LinkedIn, deployed project) at the top — make sure they work.",
    "Only list skills you can be grilled on; interviewers pick from your resume.",
    "Keep CGPA, relevant coursework (DSA, OS, DBMS, CN, OOP) and achievements (hackathons, CP ratings).",
    "Run it through an ATS check; avoid tables/columns that break parsing."
  ],
  oaFormats: [
    ["Indian startups / product", "2–4 coding problems, 60–120 min; sometimes MCQs (OS / DBMS / CN / OOPS)", "Arrays, strings, hashing, sliding window, greedy, binary search on answer, graphs (BFS/DFS), DP (1D/2D, knapsack)"],
    ["Quant / HFT", "2–3 hard problems + math / probability / puzzles; strict time limit", "DP, greedy proofs, bit manipulation, combinatorics, expected value. C++ speed helps"],
    ["Big Tech", "2 problems in 60–90 min (Amazon also adds a work-style survey)", "Medium-level: trees, graphs, heaps, intervals, DP"],
    ["Service-based", "Aptitude + verbal + 1–2 easy/medium coding problems", "Strings, arrays, math, basic recursion. Aptitude decides who gets shortlisted"],
    ["Semis / hardware", "Coding + C/C++ output MCQs + OS / digital / COA", "Bit manipulation, pointers, linked lists, memory"]
  ],
  oaHabits: [
    "Read the constraints first. n ≤ 10^5 means O(n log n) or better, n ≤ 20 means bitmask / backtracking, n ≤ 500 means O(n³) is OK.",
    "Use long long / long for sums and products. Overflow is the #1 cause of hidden test cases failing.",
    "Partial scoring is common, so submit a brute force first, then optimise.",
    "Keep a fast-I/O template ready (C++ ios::sync_with_stdio(false), Java BufferedReader).",
    "Timebox: if you can't get an approach in 20–25 min, read the solution, then re-solve it from scratch after 2–3 days."
  ],
  // Companies with little / no data → which lists to use instead (from the PDF, section 4)
  proxies: [
    { names: ["Postman"], type: "SaaS / API platform", use: ["Atlassian", "Rippling", "Freshworks"], pack: 2 },
    { names: ["BrowserStack"], type: "SaaS / dev tools", use: ["Atlassian", "Sprinklr", "Media.net"] },
    { names: ["Chargebee", "CleverTap", "Innovaccer", "Whatfix", "Atlan", "HighRadius", "Eightfold AI"], type: "SaaS (B2B)", use: ["Freshworks", "Darwinbox", "MoEngage", "Mindtickle"], pack: 2 },
    { names: ["Codenation"], type: "Product, known for hard OAs", use: ["Trilogy", "Directi", "Media.net", "DE Shaw"] },
    { names: ["Gameberry Labs", "Games24x7", "MPL", "Mobile Premier League", "Nazara"], type: "Gaming", use: ["Dream11", "Gameskraft", "WinZO"], pack: 2 },
    { names: ["Spinny", "Porter", "Livspace", "Udaan", "Rapido", "PolicyBazaar", "Unacademy", "PhysicsWallah"], type: "Indian consumer / edtech startups", use: ["Swiggy", "Meesho", "Zepto", "Flipkart"], pack: 2 },
    { names: ["CoinDCX", "Fi", "Rupeek", "Zerodha", "Upstox", "Jupiter", "Jar", "Pine Labs", "MobiKwik"], type: "Indian fintech", use: ["PhonePe", "Razorpay", "CRED", "Groww", "Paytm", "Juspay"] },
    { names: ["Quadeye", "AlphaGrep", "NK Securities"], type: "HFT / quant", use: ["Tower Research Capital", "Graviton", "Optiver"], pack: 3 },
    { names: ["Notion"], type: "Product", use: ["Atlassian", "Asana", "Airbnb"] },
    { names: ["MediaTek", "NXP", "Infineon", "Analog Devices", "Micron"], type: "Semiconductors", use: ["Qualcomm", "Texas Instruments", "Nvidia", "Intel"] }
  ],
  youtube: [
    ["take U forward (Striver)", "https://www.youtube.com/@takeUforward"],
    ["NeetCode", "https://www.youtube.com/@NeetCode"],
    ["Aditya Verma (DP / recursion playlists)", "https://www.youtube.com/@TheAdityaVerma"],
    ["Gate Smashers (OS / DBMS / CN)", "https://www.youtube.com/@GateSmashers"],
    ["CareerRide (aptitude)", "https://www.youtube.com/@CareerRide"]
  ],
  timeline: [
    ["8+ weeks before", "Finish one DSA sheet pass (arrays → DP). 2–3 problems daily. Revise OS / DBMS / CN / OOP basics."],
    ["4 weeks before", "Company-wise lists from this site: recent (red) problems first, then top 30 by frequency. 2 timed mock OAs per week."],
    ["2 weeks before", "Read 10+ interview experiences for your target companies (GfG, LeetCode Discuss, YouTube). Polish resume & projects."],
    ["Last 3 days", "Re-solve problems you got wrong, revise core-subject notes, prepare HR answers, sleep well."]
  ]
};
