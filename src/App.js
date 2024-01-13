
function Header() {
    return (
        <header>
            <h1>Liam Eckert</h1>
            <h2>Software Engineer</h2>
        </header>
    );
}

function AboutMeP(text) {
    return (
        <p>{text}</p>
    );
}

const aboutMeParagraphs = [
    "Hello, my name is Liam Eckert. I am a passionate developer with a growing interest in full-stack development. I began programming in elementary school, hacking around with Python. My early experiments quickly led me to Linux as well as an interest in programming language design.",
    "In high school, I began to understand how to implement scripting languages, and compilers through self-study. After graduation, I enlisted in the United States Army where I served in the Infantry and learned how to work as a team, embrace hardship, and be a leader. I am now pursuing my Bachelors in Computer Science at Western Governors University.",
    "I am interested in full-stack development because the web is the frontier of all technology. I believe I am a great fit for a job as a web developer because of my deep understanding of how Javascript, Typescript, and similar languages work under the hood, enabling me to write optimized code as well as learn new languages quickly."
];

function AboutMe() {
    return (
        <div className="about-me">
            <h3>About Me</h3>
            {aboutMeParagraphs.map(AboutMeP)}
        </div>
    );
}

function Skill(title, description) {
    return (
        <div className="skill">
            <h4>{title}</h4>
            <p>{description}</p>
        </div>
    );
}

const skills = [
    {
        title: "Javascript",
        desc: "I have been writing Javascript for over 5 years. I have an intuitive understanding of Javascript and can quickly deliver high-quality code."
    },
    {
        title: "Typescript",
        desc: "I only recently began writing Typescript, but I have quickly grown to love it. I can work productively in Typescript and have a deep appreciation for its type system."
    },
    {
        title: "Rust",
        desc: "I began writing Rust for personal projects in 2017. I understand the Rust borrow checker, traits, and I enjoy writing Rust. I have used Rust to write a stack based virtual machine and other hobby projects."
    },
    {
        title: "Python",
        desc: "My first programming language. I have used Python for many things, including scripting, server-side applications, and some small games."
    },
    {
        title: "React",
        desc: "This website is written in React, and although I am not an expert, I am comfortable writing React applications."
    },
    {
        title: "Node.js",
        desc: "I have used Node.js for many projects dating back to 2017. I am comfortable writing asynchronous application in Node.js. I have written an asynchronous web scraper in Node.js."
    },
    {
        title: "SQL",
        desc: "I have taken multiple database courses during my studies at WGU. I am comfortable writing SQL queries and designing databases."
    },
    {
        title: "HTML/CSS",
        desc: "HTML and CSS are the backbone of the web and I am comfortable with all their intricacies."
    },
    {
        title: "Git",
        desc: "I am experienced with Git and Github. I have used Git for all my projects since 2017."
    }
];

function Skills() {
    return (
        <div className="skills-container">
            <h3>Skills</h3>
            <div className="skills">
                {skills.map(skill => Skill(skill.title, skill.desc))}
            </div>
        </div>
    );
}

export default function App() {
    return (
        <div className="App">
            <Header />
            <AboutMe />
            <Skills />
        </div>
    );
}