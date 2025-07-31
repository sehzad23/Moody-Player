import { FaGithub, FaLinkedin, FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-purple-950 text-white py-6 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4 text-center">
        {/* Branding */}
        <div>
          <h1 className="text-xl font-bold tracking-wide">Moody Player</h1>
          <p className="text-sm text-gray-300">
            Feel the Mood, Play the Tune 🎧
          </p>
        </div>

        {/* Social Links */}
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:ml-auto">
          <a
            href="https://github.com/sehzad23"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-pink-400 transition-colors duration-200"
          >
            <FaGithub />
            <span>GitHub</span>
          </a>
          <a
            href="http://www.linkedin.com/in/ansari-sehzad-6b8528353"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-pink-400 transition-colors duration-200"
          >
            <FaLinkedin />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>

      
      {/* Bottom Line */}
      <div className="text-center text-sm text-gray-200 mt-4 ">
        © {new Date().getFullYear()} Moody Player. All rights reserved. <br />
        Made with <FaHeart className="inline text-red-500 mx-1" /> by Sehzad
        Ansari
      </div>
    </footer>
  );
};

export default Footer;
