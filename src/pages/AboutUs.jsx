import React from "react";

const AboutUs = () => {
  const developer = {
    name: "Aanan Munna",
    role: "Junior MERN Stack Developer",
    bio: `Hey, I’m Munna — a passionate MERN stack developer honing my craft at Programming Hero. I build sleek, scalable web apps with MongoDB, Express, React, and Node.js, and I’m always hungry to learn and grow.`,
    projectsCount: 15,  // Change this as per your real number
    projects: [
      {
        name: "StudySync",
        description: "An assignment management platform for group studies with real-time collaboration.",
        github: "https://github.com/AananMunna/studySync",
        live: "https://studysync-d270a.web.app/"
      },
      {
        name: "Gardening Hub",
        description: "A community-driven gardening website with user profiles and plant care guides.",
        github: "https://github.com/AananMunna/gardening-hub",
        live: "https://gardening-hub-a68ec.web.app/"
      },
      {
        name: "TripTale",
        description: "A tourism management platform to connect tourists and tour guides seamlessly.",
        github: "https://github.com/AananMunna/trip-tale-client",
        live: "https://trip-tale-3fd61.web.app/"
      }
    ],
    socials: {
      linkedin: "https://linkedin.com/in/aanan-munna-6948b8245",
      github: "https://github.com/AananMunna",
    },
  };

  return (
    <section className="max-w-4xl mx-auto p-6 py-30 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      

      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-lg">
        {developer.bio}
      </p>

      <p className="mb-6 font-semibold text-gray-800 dark:text-gray-200">
        I have built <span className="text-blue-600 dark:text-blue-400">{developer.projectsCount}</span> projects so far including:
      </p>

      <ul className="space-y-4 mb-8">
        {developer.projects.map((project, i) => (
          <li
            key={i}
            className="border-l-4 border-blue-600 dark:border-blue-400 pl-4"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {project.name}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-1">{project.description}</p>
            <div className="flex gap-4">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                GitHub
              </a>
              {project.live !== "#" && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 dark:text-green-400 hover:underline"
                >
                  Live Demo
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t border-gray-300 dark:border-gray-700 pt-6">
        <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
          Connect with me:
        </h2>
        <div className="flex gap-6 text-gray-600 dark:text-gray-400">
          <a
            href={developer.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700 dark:hover:text-blue-300"
            aria-label="LinkedIn"
          >
            LinkedIn
          </a>
          <a
            href={developer.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 dark:hover:text-white"
            aria-label="GitHub"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
