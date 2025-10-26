import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center mt-12 pt-6 border-t border-comet-blue-800">
      <div className="mt-4 text-xs text-comet-blue-700 space-y-1">
        <p>
          Analysis powered by OpenAI (GPT-4o-mini). &copy; {new Date().getFullYear()} Interstellar Watch Program.
        </p>
      </div>
    </footer>
  );
};

export default Footer;