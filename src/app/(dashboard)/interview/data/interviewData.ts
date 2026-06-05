export type InterviewResult = "passed" | "rejected" | null;
export type InterviewStatus = "upcoming" | "completed";

export interface Interview {
  id: number;
  role: string;
  company: string;
  date: string;
  round: string;
  status: InterviewStatus;
  result: InterviewResult;
  score: number | null;
  tech: TechKey;
  feedback: string;
  interviewer: string;
}

export interface Question {
  q: string;
  hint: string;
}
export type TechKey = "React" | "Node.js" | "Java" | "AWS" | ".NET" | "System Design";
export type SubTopicMap = Record<TechKey, string[]>;
export type QuestionBank = Record<TechKey, Record<string, Question[]>>;

export const IV_DATA: Interview[] = [
  {
    id: 1,
    role: "Senior React Developer",
    company: "FinTech Corp",
    date: "Jun 8, 2025 · 2:00 PM",
    round: "Technical Round 1",
    status: "upcoming",
    result: null,
    score: null,
    tech: "React",
    feedback: "",
    interviewer: "Rahul Sharma",
  },
  {
    id: 2,
    role: "Full Stack Engineer",
    company: "HealthAI Systems",
    date: "Jun 12, 2025 · 11:00 AM",
    round: "HR Discussion",
    status: "upcoming",
    result: null,
    score: null,
    tech: "Node.js",
    feedback: "",
    interviewer: "Priya Nair",
  },
  {
    id: 3,
    role: "Cloud Architect",
    company: "RetailX",
    date: "May 28, 2025 · 3:00 PM",
    round: "System Design",
    status: "completed",
    result: "passed",
    score: 4.2,
    tech: "AWS",
    feedback:
      "Strong fundamentals shown throughout. Suggested improvement: dive deeper into multi-region failover setups and cross-AZ latency optimisation.",
    interviewer: "Amit Singh",
  },
  {
    id: 4,
    role: "Java Lead",
    company: "BankSecure",
    date: "May 22, 2025 · 10:00 AM",
    round: "Technical Round 2",
    status: "completed",
    result: "rejected",
    score: 2.9,
    tech: "Java",
    feedback:
      "Lacked depth on Java concurrency — specifically around ReentrantLock, volatile, and thread-safe collections. Recommend focused practice on multithreading.",
    interviewer: "Sanjay Kumar",
  },
  {
    id: 5,
    role: "React Frontend Developer",
    company: "EduTech Ltd",
    date: "May 10, 2025 · 4:00 PM",
    round: "Technical + HR",
    status: "completed",
    result: "passed",
    score: 4.6,
    tech: "React",
    feedback: "Excellent performance across both rounds. Offer extended.",
    interviewer: "Neha Gupta",
  },
];

export const SUBTOPICS: SubTopicMap = {
  React: ["All", "Basics", "Hooks", "Redux", "Performance", "Testing"],
  "Node.js": ["All", "Event Loop", "Streams", "Express", "Auth", "Clustering"],
  Java: ["All", "OOP", "Collections", "Concurrency", "Spring Boot", "JVM"],
  AWS: ["All", "EC2/VPC", "S3/Storage", "Lambda", "RDS", "Security"],
  ".NET": ["All", "C# Core", "ASP.NET", "EF Core", "DI/IoC", "Testing"],
  "System Design": [
    "All",
    "Databases",
    "Caching",
    "Messaging",
    "APIs",
    "Scalability",
  ],
};

export const QB: QuestionBank = {
  React: {
    Basics: [
      {
        q: "What is JSX and how is it compiled?",
        hint: "Babel transforms JSX to React.createElement calls.",
      },
      {
        q: "Explain the component lifecycle in class components.",
        hint: "Mount, update, unmount phases and their methods.",
      },
    ],
    Hooks: [
      {
        q: "What are the rules of hooks?",
        hint: "Only call at top level, only in React functions.",
      },
      {
        q: "Explain the useEffect cleanup function.",
        hint: "Return a function to unsubscribe/cleanup on unmount.",
      },
      {
        q: "When to use useReducer over useState?",
        hint: "Complex state transitions with multiple sub-values.",
      },
    ],
    Redux: [
      {
        q: "Explain Redux data flow.",
        hint: "Action → Dispatch → Reducer → Store → View.",
      },
      {
        q: "What is Redux Thunk?",
        hint: "Middleware enabling async action creators.",
      },
    ],
    Performance: [
      {
        q: "How does React.memo work?",
        hint: "Shallow props comparison to skip re-renders.",
      },
      {
        q: "useMemo vs useCallback?",
        hint: "useMemo caches value, useCallback caches function reference.",
      },
    ],
    Testing: [
      {
        q: "How would you test a custom hook?",
        hint: "Use renderHook from @testing-library/react-hooks.",
      },
    ],
  },
  "Node.js": {
    "Event Loop": [
      {
        q: "Explain the Node.js event loop phases.",
        hint: "timers, pending callbacks, poll, check, close callbacks.",
      },
    ],
    Streams: [
      {
        q: "What are the 4 stream types in Node.js?",
        hint: "Readable, Writable, Duplex, Transform.",
      },
    ],
    Express: [
      {
        q: "How does Express middleware chaining work?",
        hint: "next() passes control, order matters, error middleware has 4 params.",
      },
    ],
    Auth: [
      {
        q: "JWT vs Session-based auth — when to use each?",
        hint: "Stateless vs stateful, scalability implications.",
      },
    ],
    Clustering: [
      {
        q: "How do you scale a Node.js app?",
        hint: "cluster module, PM2, load balancing strategies.",
      },
    ],
  },
  Java: {
    OOP: [
      {
        q: "Explain SOLID principles with Java examples.",
        hint: "One principle per concrete example.",
      },
    ],
    Collections: [
      {
        q: "HashMap vs LinkedHashMap vs TreeMap?",
        hint: "Order, performance characteristics of each.",
      },
    ],
    Concurrency: [
      {
        q: "Explain the volatile keyword in Java.",
        hint: "Visibility guarantee, happens-before relationship.",
      },
      {
        q: "What is ConcurrentHashMap?",
        hint: "Segment-based locking, better than synchronized HashMap.",
      },
    ],
    "Spring Boot": [
      {
        q: "How does Spring dependency injection work?",
        hint: "IoC container, @Autowired, constructor vs field injection.",
      },
    ],
    JVM: [
      {
        q: "GC types in JVM?",
        hint: "Serial, Parallel, CMS, G1, ZGC — use cases.",
      },
    ],
  },
  AWS: {
    "EC2/VPC": [
      {
        q: "Explain VPC, subnets, and route tables.",
        hint: "Public/private subnets, IGW, NAT gateway.",
      },
    ],
    "S3/Storage": [
      {
        q: "S3 storage classes and their use cases?",
        hint: "Standard, IA, Glacier — cost vs access frequency.",
      },
    ],
    Lambda: [
      {
        q: "Cold start problem in Lambda — how to mitigate?",
        hint: "Provisioned concurrency, keep-warm patterns.",
      },
    ],
    RDS: [
      {
        q: "RDS Multi-AZ vs Read Replica?",
        hint: "HA vs read scalability — failover behaviour.",
      },
    ],
    Security: [
      {
        q: "IAM roles vs IAM users — best practices?",
        hint: "Least privilege, assume role, no long-lived keys.",
      },
    ],
  },
  ".NET": {
    "C# Core": [
      {
        q: "Explain async/await state machine in C#.",
        hint: "Compiler-generated StateMachine class, MoveNext().",
      },
    ],
    "ASP.NET": [
      {
        q: "Middleware pipeline in ASP.NET Core?",
        hint: "Use(), Run(), Map() — order matters.",
      },
    ],
    "EF Core": [
      {
        q: "Lazy vs Eager loading in EF Core?",
        hint: "Include() for eager, virtual nav props for lazy.",
      },
    ],
    "DI/IoC": [
      {
        q: "Service lifetimes in ASP.NET Core DI?",
        hint: "Transient, Scoped, Singleton — when to use each.",
      },
    ],
    Testing: [
      {
        q: "How to mock dependencies in .NET unit tests?",
        hint: "Moq library, IServiceProvider, in-memory DB.",
      },
    ],
  },
  "System Design": {
    Databases: [
      {
        q: "SQL vs NoSQL — when to choose what?",
        hint: "ACID, CAP theorem, data model considerations.",
      },
    ],
    Caching: [
      {
        q: "Cache invalidation strategies?",
        hint: "TTL, LRU, write-through, write-behind, cache-aside.",
      },
    ],
    Messaging: [
      {
        q: "Design a distributed message queue.",
        hint: "Kafka partitions, consumer groups, delivery guarantees.",
      },
    ],
    APIs: [
      {
        q: "REST vs GraphQL vs gRPC?",
        hint: "Use cases, payload efficiency, type safety.",
      },
    ],
    Scalability: [
      {
        q: "Design a URL shortener for 1 billion URLs.",
        hint: "Hashing strategy, DB sharding, CDN, analytics.",
      },
    ],
  },
};
