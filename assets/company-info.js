/*
 * Curated organisation details for frequent PESU recruiters.
 * Only fields we are confident about are filled. Anything missing falls back to
 * a search link (clearly marked "search" in the UI) instead of a guessed URL.
 *
 * To add / fix a company: add an entry keyed by the exact name used in the
 * question data (or any new name). Fields:
 *   site, careers, linkedin, facebook, x, instagram, roles: [..], aliases: [..], category
 */
window.COMPANY_INFO = {
  "Aveva": {
    site: "https://www.aveva.com/",
    linkedin: "https://www.linkedin.com/company/aveva",
    facebook: "https://www.facebook.com/avevasolutions/",
    x: "https://twitter.com/AVEVAGroup",
    instagram: "https://www.instagram.com/avevagroup/",
    roles: ["Software Developer Intern"],
    category: "Service-based / Mass recruiters",
    highlights: [
      ["SDLC", "https://www.geeksforgeeks.org/software-development-life-cycle-sdlc/"],
      ["Web Development Basics", "https://www.geeksforgeeks.org/web-development/"],
      ["SCRUM", "https://www.scrumalliance.org/about-scrum"],
      ["Data Science Basics", "https://www.geeksforgeeks.org/data-science-tutorial/"],
      ["ML Basics", "https://www.geeksforgeeks.org/machine-learning/"],
      ["Cyclic Rotation", "https://www.geeksforgeeks.org/c-program-cyclically-rotate-array-one/"],
      ["Minimum Platforms", "https://www.geeksforgeeks.org/minimum-number-platforms-required-railwaybus-station/"],
      ["Binary Tree Diameter", "https://www.geeksforgeeks.org/diameter-of-a-binary-tree/"],
      ["Stack with Queue", "https://www.geeksforgeeks.org/implement-stack-using-queue/"],
      ["JVM", "https://www.geeksforgeeks.org/jvm-works-jvm-architecture/"]
    ]
  },
  "Amazon": { site: "https://www.amazon.com/", careers: "https://www.amazon.jobs/", linkedin: "https://www.linkedin.com/company/amazon", x: "https://twitter.com/amazon", instagram: "https://www.instagram.com/amazon/", facebook: "https://www.facebook.com/Amazon/", roles: ["SDE Intern", "SDE-1"] },
  "Google": { site: "https://about.google/", careers: "https://www.google.com/about/careers/applications/", linkedin: "https://www.linkedin.com/company/google", x: "https://twitter.com/Google", instagram: "https://www.instagram.com/google/", facebook: "https://www.facebook.com/Google/", roles: ["Software Engineering Intern", "Software Engineer (University Grad)"] },
  "Microsoft": { site: "https://www.microsoft.com/", careers: "https://careers.microsoft.com/", linkedin: "https://www.linkedin.com/company/microsoft", x: "https://twitter.com/Microsoft", instagram: "https://www.instagram.com/microsoft/", facebook: "https://www.facebook.com/Microsoft/", roles: ["Software Engineer Intern", "Software Engineer"] },
  "Meta": { aliases: ["Facebook"], site: "https://about.meta.com/", careers: "https://www.metacareers.com/", linkedin: "https://www.linkedin.com/company/meta", x: "https://twitter.com/Meta", instagram: "https://www.instagram.com/meta/", facebook: "https://www.facebook.com/Meta/", roles: ["Software Engineer Intern", "Software Engineer"] },
  "Apple": { site: "https://www.apple.com/", careers: "https://jobs.apple.com/", linkedin: "https://www.linkedin.com/company/apple", x: "https://twitter.com/Apple", instagram: "https://www.instagram.com/apple/", roles: ["Software Engineering Intern", "Software Engineer"] },
  "Adobe": { site: "https://www.adobe.com/", careers: "https://careers.adobe.com/", linkedin: "https://www.linkedin.com/company/adobe", x: "https://twitter.com/Adobe", instagram: "https://www.instagram.com/adobe/", facebook: "https://www.facebook.com/adobe/", roles: ["Member of Technical Staff (MTS)", "Software Development Engineer Intern"] },
  "Oracle": { site: "https://www.oracle.com/", careers: "https://www.oracle.com/careers/", linkedin: "https://www.linkedin.com/company/oracle", x: "https://twitter.com/Oracle", instagram: "https://www.instagram.com/oracle/", facebook: "https://www.facebook.com/Oracle/", roles: ["Member of Technical Staff", "Applications Engineer"] },
  "Salesforce": { site: "https://www.salesforce.com/", careers: "https://careers.salesforce.com/", linkedin: "https://www.linkedin.com/company/salesforce", x: "https://twitter.com/salesforce", instagram: "https://www.instagram.com/salesforce/", roles: ["Associate Member of Technical Staff (AMTS)", "Software Engineer Intern"] },
  "Intuit": { site: "https://www.intuit.com/", careers: "https://jobs.intuit.com/", linkedin: "https://www.linkedin.com/company/intuit", x: "https://twitter.com/Intuit", roles: ["Software Engineer 1", "Software Engineer Intern"] },
  "Cisco": { site: "https://www.cisco.com/", careers: "https://jobs.cisco.com/", linkedin: "https://www.linkedin.com/company/cisco", x: "https://twitter.com/Cisco", instagram: "https://www.instagram.com/cisco/", roles: ["Software Engineer", "Technical Undergraduate Intern"] },
  "SAP": { site: "https://www.sap.com/", careers: "https://jobs.sap.com/", linkedin: "https://www.linkedin.com/company/sap", x: "https://twitter.com/SAP", instagram: "https://www.instagram.com/sap/", roles: ["Associate Developer", "Developer Intern"] },
  "Goldman Sachs": { site: "https://www.goldmansachs.com/", careers: "https://www.goldmansachs.com/careers/", linkedin: "https://www.linkedin.com/company/goldman-sachs", x: "https://twitter.com/GoldmanSachs", instagram: "https://www.instagram.com/goldmansachs/", roles: ["Engineering Summer Analyst", "Engineering Analyst"] },
  "J.P. Morgan": { aliases: ["JP Morgan", "JPMorgan", "JPMorgan Chase", "JPMC"], site: "https://www.jpmorganchase.com/", careers: "https://careers.jpmorgan.com/", x: "https://twitter.com/jpmorgan", instagram: "https://www.instagram.com/jpmorgan/", roles: ["Software Engineer Program", "Code for Good / SEP Intern"] },
  "Morgan Stanley": { site: "https://www.morganstanley.com/", careers: "https://www.morganstanley.com/people", linkedin: "https://www.linkedin.com/company/morgan-stanley", x: "https://twitter.com/MorganStanley", instagram: "https://www.instagram.com/morganstanley/", roles: ["Technology Analyst", "Technology Summer Analyst"] },
  "Flipkart": { site: "https://www.flipkart.com/", careers: "https://www.flipkartcareers.com/", linkedin: "https://www.linkedin.com/company/flipkart", x: "https://twitter.com/Flipkart", instagram: "https://www.instagram.com/flipkart/", facebook: "https://www.facebook.com/flipkart/", roles: ["SDE-1", "SDE Intern"] },
  "Uber": { site: "https://www.uber.com/", careers: "https://www.uber.com/us/en/careers/", linkedin: "https://www.linkedin.com/company/uber-com", x: "https://twitter.com/Uber", instagram: "https://www.instagram.com/uber/", roles: ["Software Engineer I", "Software Engineer Intern"] },
  "Atlassian": { site: "https://www.atlassian.com/", careers: "https://www.atlassian.com/company/careers", linkedin: "https://www.linkedin.com/company/atlassian", x: "https://twitter.com/Atlassian", instagram: "https://www.instagram.com/atlassian/", roles: ["Graduate Software Engineer", "Software Engineer Intern"] },
  "Nvidia": { site: "https://www.nvidia.com/", careers: "https://www.nvidia.com/en-us/about-nvidia/careers/", linkedin: "https://www.linkedin.com/company/nvidia", x: "https://twitter.com/nvidia", instagram: "https://www.instagram.com/nvidia/", roles: ["System Software Engineer", "ASIC / Hardware Intern"] },
  "Intel": { site: "https://www.intel.com/", careers: "https://jobs.intel.com/", linkedin: "https://www.linkedin.com/company/intel-corporation", x: "https://twitter.com/intel", instagram: "https://www.instagram.com/intel/", roles: ["Graduate Technical Intern", "Software / Validation Engineer"] },
  "Qualcomm": { site: "https://www.qualcomm.com/", careers: "https://careers.qualcomm.com/", linkedin: "https://www.linkedin.com/company/qualcomm", x: "https://twitter.com/Qualcomm", instagram: "https://www.instagram.com/qualcomm/", roles: ["Associate Engineer (Software)", "Hardware / Embedded Intern"] },
  "TCS": { aliases: ["Tata Consultancy Services"], site: "https://www.tcs.com/", careers: "https://www.tcs.com/careers", linkedin: "https://www.linkedin.com/company/tata-consultancy-services", x: "https://twitter.com/TCS", facebook: "https://www.facebook.com/TataConsultancyServices/", roles: ["Ninja / Digital / Prime (via TCS NQT)"] },
  "Infosys": { site: "https://www.infosys.com/", careers: "https://www.infosys.com/careers/", linkedin: "https://www.linkedin.com/company/infosys", x: "https://twitter.com/Infosys", instagram: "https://www.instagram.com/infosys/", facebook: "https://www.facebook.com/Infosys/", roles: ["Systems Engineer", "Specialist Programmer", "Digital Specialist Engineer"] },
  "Wipro": { site: "https://www.wipro.com/", careers: "https://careers.wipro.com/", linkedin: "https://www.linkedin.com/company/wipro", x: "https://twitter.com/Wipro", roles: ["Project Engineer (Elite NTH)", "Turbo"] },
  "Accenture": { site: "https://www.accenture.com/", careers: "https://www.accenture.com/in-en/careers", linkedin: "https://www.linkedin.com/company/accenture", x: "https://twitter.com/Accenture", instagram: "https://www.instagram.com/accenture/", facebook: "https://www.facebook.com/accenture/", roles: ["Associate Software Engineer", "Advanced ASE"] },
  "Cognizant": { site: "https://www.cognizant.com/", careers: "https://careers.cognizant.com/", linkedin: "https://www.linkedin.com/company/cognizant", x: "https://twitter.com/Cognizant", instagram: "https://www.instagram.com/cognizant/", roles: ["Programmer Analyst Trainee (GenC / GenC Next)"] },
  "Capgemini": { site: "https://www.capgemini.com/", careers: "https://www.capgemini.com/careers/", linkedin: "https://www.linkedin.com/company/capgemini", x: "https://twitter.com/Capgemini", instagram: "https://www.instagram.com/capgemini/", roles: ["Analyst", "Senior Analyst"] },
  "Deloitte": { site: "https://www.deloitte.com/", careers: "https://www2.deloitte.com/in/en/careers.html", linkedin: "https://www.linkedin.com/company/deloitte", x: "https://twitter.com/Deloitte", instagram: "https://www.instagram.com/deloitte/", roles: ["Analyst (Technology Consulting)"] },
  "IBM": { site: "https://www.ibm.com/", careers: "https://www.ibm.com/careers", linkedin: "https://www.linkedin.com/company/ibm", x: "https://twitter.com/IBM", instagram: "https://www.instagram.com/ibm/", roles: ["Associate Developer", "Software Engineer"] },
  "VMware": { site: "https://www.vmware.com/", linkedin: "https://www.linkedin.com/company/vmware", x: "https://twitter.com/VMware", roles: ["Member of Technical Staff", "R&D Intern"] },
  "PayPal": { site: "https://www.paypal.com/", careers: "https://careers.pypl.com/", linkedin: "https://www.linkedin.com/company/paypal", x: "https://twitter.com/PayPal", instagram: "https://www.instagram.com/paypal/", roles: ["Software Engineer 1", "Software Engineer Intern"] },
  "Visa": { site: "https://www.visa.com/", careers: "https://corporate.visa.com/en/jobs/", linkedin: "https://www.linkedin.com/company/visa", x: "https://twitter.com/Visa", instagram: "https://www.instagram.com/visa/", roles: ["Software Engineer", "Software Engineer Intern"] },
  "American Express": { aliases: ["Amex"], site: "https://www.americanexpress.com/", careers: "https://www.americanexpress.com/en-us/careers/", linkedin: "https://www.linkedin.com/company/american-express", x: "https://twitter.com/AmericanExpress", instagram: "https://www.instagram.com/americanexpress/", roles: ["Engineer I", "Analyst Intern"] },
  "Swiggy": { site: "https://www.swiggy.com/", careers: "https://careers.swiggy.com/", linkedin: "https://www.linkedin.com/company/swiggy-in", x: "https://twitter.com/Swiggy", instagram: "https://www.instagram.com/swiggyindia/", roles: ["SDE-1", "SDE Intern"] },
  "Zomato": { aliases: ["Eternal"], site: "https://www.zomato.com/", linkedin: "https://www.linkedin.com/company/zomato", x: "https://twitter.com/zomato", instagram: "https://www.instagram.com/zomato/", roles: ["SDE-1", "SDE Intern"] },
  "Paytm": { site: "https://paytm.com/", linkedin: "https://www.linkedin.com/company/paytm", x: "https://twitter.com/Paytm", instagram: "https://www.instagram.com/paytm/", roles: ["Software Engineer", "SDE Intern"] },
  "Myntra": { site: "https://www.myntra.com/", linkedin: "https://www.linkedin.com/company/myntra", x: "https://twitter.com/myntra", instagram: "https://www.instagram.com/myntra/", roles: ["SDE-1", "SDE Intern"] },
  "Zoho": { site: "https://www.zoho.com/", careers: "https://www.zoho.com/careers/", linkedin: "https://www.linkedin.com/company/zoho", x: "https://twitter.com/Zoho", instagram: "https://www.instagram.com/zoho/", roles: ["Member Technical Staff", "Software Developer"] },
  "Siemens": { site: "https://www.siemens.com/", careers: "https://jobs.siemens.com/", linkedin: "https://www.linkedin.com/company/siemens", x: "https://twitter.com/Siemens", instagram: "https://www.instagram.com/siemens/", roles: ["Graduate Engineer Trainee", "Software Developer"] },
  "LinkedIn": { site: "https://www.linkedin.com/", careers: "https://careers.linkedin.com/", linkedin: "https://www.linkedin.com/company/linkedin", x: "https://twitter.com/LinkedIn", instagram: "https://www.instagram.com/linkedin/", roles: ["Software Engineer", "Software Engineering Intern"] },
  "Netflix": { site: "https://www.netflix.com/", careers: "https://jobs.netflix.com/", linkedin: "https://www.linkedin.com/company/netflix", x: "https://twitter.com/netflix", instagram: "https://www.instagram.com/netflix/", roles: ["Software Engineer"] },
  "Nutanix": { site: "https://www.nutanix.com/", careers: "https://www.nutanix.com/company/careers", linkedin: "https://www.linkedin.com/company/nutanix", x: "https://twitter.com/nutanix", roles: ["Member of Technical Staff", "MTS Intern"] },
  "ServiceNow": { site: "https://www.servicenow.com/", careers: "https://careers.servicenow.com/", linkedin: "https://www.linkedin.com/company/servicenow", x: "https://twitter.com/servicenow", roles: ["Associate Software Engineer", "Software Engineer Intern"] },
  "X (Twitter)": { aliases: ["Twitter", "X"] },
  "Snap": { aliases: ["Snapchat"] },
  "Walmart Labs": { aliases: ["Walmart", "Walmart Global Tech"] },
  "DE Shaw": { aliases: ["D. E. Shaw", "D.E. Shaw", "DE Shaw India"], site: "https://www.deshaw.com/", roles: ["Member Technical", "Software Development Engineer"] },
  "Samsung": { aliases: ["Samsung R&D", "SRI-B", "Samsung Research"], site: "https://www.samsung.com/", roles: ["Software Engineer (SRI-B)", "R&D Intern"] },
  "Ola Cabs": { aliases: ["Ola", "Krutrim"] },
  "Bloomberg": { site: "https://www.bloomberg.com/company/", careers: "https://www.bloomberg.com/company/what-we-do/careers/", linkedin: "https://www.linkedin.com/company/bloomberg", roles: ["Software Engineer"] },
  "Media.net": { site: "https://www.media.net/", roles: ["SDE", "SDE Intern"] }
};

/** Fresher roles that companies in each category usually advertise. Used only when no curated roles exist. */
window.CATEGORY_ROLES = {
  "Big Tech / FAANG+": ["SDE / Software Engineer Intern", "SDE-1 / New Grad Software Engineer"],
  "Indian product companies & startups (OA-heavy)": ["SDE Intern", "SDE-1 (Backend / Full-stack)"],
  "Service-based / Mass recruiters": ["Software Engineer Trainee / Associate Engineer", "Software Developer Intern"],
  "Banks, Payments & FinServ": ["Technology Analyst", "Software Engineer / Summer Analyst"],
  "Infra / Storage / Security / Networking": ["Member of Technical Staff (MTS)", "Systems Software Engineer Intern"],
  "Semiconductors & Hardware": ["Embedded / Firmware Engineer", "Design / Verification Engineer", "Software Engineer"],
  "Quant / HFT / Trading": ["Software Developer / Core Engineer", "Quant Research / Trading Intern"],
  "": ["Software Developer Intern", "Software Engineer (Fresher)"]
};

/** What each kind of company tends to test, with core study links. */
window.CATEGORY_HIGHLIGHTS = {
  "Big Tech / FAANG+": [
    ["Graphs (BFS / DFS / Topo sort)", "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/"],
    ["Dynamic Programming", "https://www.geeksforgeeks.org/dynamic-programming/"],
    ["Heaps & Priority Queues", "https://www.geeksforgeeks.org/heap-data-structure/"],
    ["System Design basics (for SDE-1)", "https://www.geeksforgeeks.org/system-design-tutorial/"],
    ["Low-Level Design / OOP design", "https://www.geeksforgeeks.org/low-level-design-lld-tutorial/"],
    ["Behavioural rounds — STAR method", "https://www.amazon.jobs/content/en/our-workplace/leadership-principles"]
  ],
  "Indian product companies & startups (OA-heavy)": [
    ["Sliding Window & Two Pointers", "https://www.geeksforgeeks.org/window-sliding-technique/"],
    ["Binary Search on Answer", "https://www.geeksforgeeks.org/binary-search/"],
    ["Dynamic Programming (1D / 2D / Knapsack)", "https://www.geeksforgeeks.org/dynamic-programming/"],
    ["Graphs (BFS / DFS)", "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/"],
    ["DBMS for interviews", "https://www.geeksforgeeks.org/dbms/"],
    ["Operating Systems", "https://www.geeksforgeeks.org/operating-systems/"]
  ],
  "Service-based / Mass recruiters": [
    ["Aptitude Preparation", "https://www.indiabix.com/"],
    ["Verbal Ability", "https://www.indiabix.com/verbal-ability/questions-and-answers/"],
    ["SDLC", "https://www.geeksforgeeks.org/software-development-life-cycle-sdlc/"],
    ["OOPs Concepts", "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/"],
    ["SQL basics", "https://www.geeksforgeeks.org/sql-tutorial/"],
    ["SCRUM / Agile", "https://www.scrumalliance.org/about-scrum"]
  ],
  "Banks, Payments & FinServ": [
    ["OOPs + Java internals (JVM)", "https://www.geeksforgeeks.org/jvm-works-jvm-architecture/"],
    ["SQL & DBMS", "https://www.geeksforgeeks.org/sql-tutorial/"],
    ["Arrays & Strings", "https://www.geeksforgeeks.org/array-data-structure-guide/"],
    ["Probability puzzles", "https://www.geeksforgeeks.org/puzzles/"],
    ["Multithreading basics", "https://www.geeksforgeeks.org/multithreading-in-java/"]
  ],
  "Infra / Storage / Security / Networking": [
    ["Operating Systems", "https://www.geeksforgeeks.org/operating-systems/"],
    ["Computer Networks", "https://www.geeksforgeeks.org/computer-network-tutorials/"],
    ["C pointers & memory", "https://www.geeksforgeeks.org/c-pointers/"],
    ["Linux commands", "https://www.geeksforgeeks.org/linux-commands/"],
    ["Bit Manipulation", "https://www.geeksforgeeks.org/bitwise-algorithms/"]
  ],
  "Semiconductors & Hardware": [
    ["C programming & output questions", "https://www.geeksforgeeks.org/c-programming-language/"],
    ["Digital Electronics", "https://www.geeksforgeeks.org/digital-electronics-logic-design-tutorials/"],
    ["Computer Organisation & Architecture", "https://www.geeksforgeeks.org/computer-organization-and-architecture-tutorials/"],
    ["Operating Systems", "https://www.geeksforgeeks.org/operating-systems/"],
    ["Bit Manipulation", "https://www.geeksforgeeks.org/bitwise-algorithms/"]
  ],
  "Quant / HFT / Trading": [
    ["Probability & Expected value", "https://www.geeksforgeeks.org/probability-gq/"],
    ["Puzzles", "https://www.geeksforgeeks.org/puzzles/"],
    ["Combinatorics", "https://www.geeksforgeeks.org/combinatorics/"],
    ["Bit Manipulation", "https://www.geeksforgeeks.org/bitwise-algorithms/"],
    ["C++ STL", "https://www.geeksforgeeks.org/the-c-standard-template-library-stl/"]
  ],
  "": [
    ["OOPs Concepts", "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/"],
    ["DBMS", "https://www.geeksforgeeks.org/dbms/"],
    ["Operating Systems", "https://www.geeksforgeeks.org/operating-systems/"],
    ["Computer Networks", "https://www.geeksforgeeks.org/computer-network-tutorials/"]
  ]
};

/** Always-useful prep links (from the PESU prep template). */
window.CORE_HIGHLIGHTS = [
  ["All-in-one Core Preparation Materials", "https://www.geeksforgeeks.org/interview-preparation/"],
  ["All-in-one MCQ Preparation Material", "https://www.sanfoundry.com/"],
  ["Interview Preparation Kit", "https://www.hackerrank.com/interview/preparation-kits"],
  ["DP Questions", "https://www.geeksforgeeks.org/dynamic-programming/"],
  ["Aptitude Preparation", "https://www.indiabix.com/"]
];

/** GfG pages for LeetCode topic tags. Unknown topics fall back to a search. */
window.TOPIC_LINKS = {
  "Array": "https://www.geeksforgeeks.org/array-data-structure-guide/",
  "String": "https://www.geeksforgeeks.org/string-data-structure/",
  "Hash Table": "https://www.geeksforgeeks.org/hashing-data-structure/",
  "Dynamic Programming": "https://www.geeksforgeeks.org/dynamic-programming/",
  "Two Pointers": "https://www.geeksforgeeks.org/two-pointers-technique/",
  "Sliding Window": "https://www.geeksforgeeks.org/window-sliding-technique/",
  "Binary Search": "https://www.geeksforgeeks.org/binary-search/",
  "Tree": "https://www.geeksforgeeks.org/binary-tree-data-structure/",
  "Binary Tree": "https://www.geeksforgeeks.org/binary-tree-data-structure/",
  "Binary Search Tree": "https://www.geeksforgeeks.org/binary-search-tree-data-structure/",
  "Graph": "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/",
  "Depth-First Search": "https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/",
  "Breadth-First Search": "https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/",
  "Greedy": "https://www.geeksforgeeks.org/greedy-algorithms/",
  "Stack": "https://www.geeksforgeeks.org/stack-data-structure/",
  "Queue": "https://www.geeksforgeeks.org/queue-data-structure/",
  "Linked List": "https://www.geeksforgeeks.org/data-structures/linked-list/",
  "Heap (Priority Queue)": "https://www.geeksforgeeks.org/heap-data-structure/",
  "Backtracking": "https://www.geeksforgeeks.org/backtracking-algorithms/",
  "Bit Manipulation": "https://www.geeksforgeeks.org/bitwise-algorithms/",
  "Sorting": "https://www.geeksforgeeks.org/sorting-algorithms/",
  "Math": "https://www.geeksforgeeks.org/mathematical-algorithms/",
  "Trie": "https://www.geeksforgeeks.org/trie-insert-and-search/",
  "Union-Find": "https://www.geeksforgeeks.org/union-find/",
  "Recursion": "https://www.geeksforgeeks.org/recursion/",
  "Matrix": "https://www.geeksforgeeks.org/matrix/",
  "Prefix Sum": "https://www.geeksforgeeks.org/prefix-sum-array-implementation-applications-competitive-programming/",
  "Database": "https://www.geeksforgeeks.org/sql-tutorial/",
  "Design": "https://www.geeksforgeeks.org/system-design-tutorial/",
  "Divide and Conquer": "https://www.geeksforgeeks.org/divide-and-conquer/",
  "Memoization": "https://www.geeksforgeeks.org/dynamic-programming/",
  "Topological Sort": "https://www.geeksforgeeks.org/topological-sorting/",
  "Combinatorics": "https://www.geeksforgeeks.org/combinatorics/"
};
