
import { FaGithub, FaLinkedin } from 'react-icons/fa'

const About = () => {
  return (
    <div className="h-full max-h-max flex items-center justify-center bg-white mt-4">
      <div className="w-full max-w-md p-8 rounded-xl bg-[#8ff3ce] shadow text-gray-800">
        <h2 className="text-2xl font-bold text-center mb-4">About ClipSync</h2>

        <p className="text-sm mb-4">
          Ever found yourself copying something on your phone and needing it instantly on your PC?
          Or typing something on your laptop and wanting it on your tablet?
          We had the same problem — and now, it's solved.
        </p>

        <p className="text-sm mb-6">
          <strong>ClipSync</strong> makes it effortless to transfer notes and clipboard content
          between any two browsers or devices in real time — no email, no WhatsApp, just sync.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="https://linkedin.com/in/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800 transition"
          >
            <FaLinkedin className="text-lg" />
            Follow
          </a>

          <a
            href="https://github.com/your-repo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900 transition"
          >
            <FaGithub className="text-lg" />
            Star
          </a>
        </div>
      </div>
    </div>
  )
}

export default About
