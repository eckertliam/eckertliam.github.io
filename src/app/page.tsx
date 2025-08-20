"use client";

export default function Page() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur dark:bg-zinc-950/80 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4">
          <strong className="text-lg font-semibold">Liam Eckert</strong>
          <nav className="flex gap-4 text-sm">
            <a href="#about" className="hover:underline">About</a>
            <a href="#skills" className="hover:underline">Skills</a>
            <a href="#projects" className="hover:underline">Projects</a>
            <a href="#experience" className="hover:underline">Experience</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4">
        <section id="about" className="py-12">
          <h1 className="text-2xl font-bold">About</h1>
          <p className="mt-4 text-zinc-700 dark:text-zinc-300">
            Software Engineer with a background in the U.S. Army, bringing discipline, resilience, and a mission-driven mindset into engineering. 
            Experienced in full-stack development, systems programming, and compiler engineering, with a strong foundation in algorithms, data structures, and performance optimization. 
            Bachelor of Science in Computer Science (WGU, 2025).
          </p>
        </section>

        <section id="skills" className="py-12 border-t">
          <h2 className="text-xl font-bold">Skills</h2>
          <ul className="mt-4 list-disc space-y-1 pl-6 text-zinc-700 dark:text-zinc-300">
            <li><strong>Programming Languages:</strong> C/C++, Python, TypeScript/JavaScript, SQL</li>
            <li><strong>Frameworks & Tools:</strong> LLVM, Next.js, TailwindCSS, React, Node.js, PostgreSQL, OpenCV, PyTorch</li>
            <li><strong>Domains:</strong> Compiler development, systems programming, machine learning, full-stack web</li>
          </ul>
        </section>

        <section id="education" className="py-12 border-t">
          <h2 className="text-xl font-bold">Education</h2>
          <p className="mt-4 text-zinc-700 dark:text-zinc-300">
            <strong>Bachelor of Science in Computer Science</strong> — Western Governors University (Dec 2022 – May 2025)
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>Discrete Math I & II</li>
            <li>Data Structures and Algorithms</li>
            <li>Software Engineering</li>
            <li>Computer Architecture</li>
            <li>Computer Networking</li>
            <li>Operating Systems</li>
          </ul>
        </section>

        <section id="projects" className="py-12 border-t">
          <h2 className="text-xl font-bold">Projects</h2>
          <div className="mt-6 space-y-4">
            <article className="rounded border p-4">
              <h3 className="font-semibold">Vortex Allocator</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Arena-style C++ allocator, STL compatible, alignment-aware. Outperforms std::allocator by 5–10% for vector/list workloads.</p>
            </article>
            <article className="rounded border p-4">
              <h3 className="font-semibold">Inline-ML</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Machine learning-based LLVM inliner. Built feature extraction pipeline, trained classifier, predicts LLVM inlining with ~97% accuracy.</p>
            </article>
            <article className="rounded border p-4">
              <h3 className="font-semibold">Vulpes</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Work-in-progress programming language with recursive descent parser, stack VM, and AOT compilation using LLVM.</p>
            </article>
            <article className="rounded border p-4">
              <h3 className="font-semibold">ToyC</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Fully functional C-style compiler in Python. Outputs LLVM IR using llvmlite.</p>
            </article>
            <article className="rounded border p-4">
              <h3 className="font-semibold">Pong AI</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Webcam-controlled Pong clone with OpenCV + MediaPipe, low-latency real-time hand tracking.</p>
            </article>
          </div>
        </section>

        <section id="experience" className="py-12 border-t">
          <h2 className="text-xl font-bold">Experience</h2>
          <div className="mt-6 space-y-4">
            <article className="rounded border p-4">
              <h3 className="font-semibold">Infantry (Specialist) — U.S. Army</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">2020 – 2022</p>
              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">Led and supported teams in high-pressure environments requiring adaptability, precision, and mission focus. Experience in leadership, resilience, and collaboration that translates into engineering practice.</p>
            </article>
          </div>
        </section>

        <section id="contact" className="py-12 border-t">
          <h2 className="text-xl font-bold">Contact</h2>
          <p className="mt-4 text-zinc-700 dark:text-zinc-300">
            <a className="underline" href="mailto:liameckert17@gmail.com">liameckert17@gmail.com</a> · {" "}
            <a className="underline" href="https://github.com/eckertliam">GitHub</a> · {" "}
            <a className="underline" href="https://www.linkedin.com/in/liam-eckert-749b9b240/">LinkedIn</a> · {" "}
          </p>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Liam Eckert
      </footer>
    </>
  );
}