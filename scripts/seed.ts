// Define a type for JobApplication sample data
interface SampleJob {
  company: string;
  position: string;
  location: string;
  tags: string[]; // use array instead of string
  description: string;
  jobUrl: string;
  salary: string;
}

const USER_ID = "6a071fef1871bacf6391f06e";

const SAMPLE_JOBS: SampleJob[] = [
  {
    company: "Funds Web Developer",
    position: "Front-end Developer",
    location: "Lagos",
    tags: ["React", "TypeScript"],
    description: "Cool job",
    jobUrl: "http://localhost:3000/dashboard",
    salary: "$300k",
  },
  {
    company: "Funds Web Developer",
    position: "Front-end Developer",
    location: "Lagos",
    tags: ["React", "TypeScript"],
    description: "Cool job",
    jobUrl: "http://localhost:3000/dashboard",
    salary: "$300k",
  },
  {
    company: "Funds Web Developer",
    position: "Front-end Developer",
    location: "Lagos",
    tags: ["React", "TypeScript"],
    description: "Cool job",
    jobUrl: "http://localhost:3000/dashboard",
    salary: "$300k",
  },
];

export { USER_ID, SAMPLE_JOBS };
