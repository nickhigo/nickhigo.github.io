# Alexa Voice Web Project

This project is a web application that enables voice interaction with the Alexa API. Users can input voice commands, and the application will display the responses from Alexa on the screen.

## Project Structure

```
alexa-voice-web
├── public
│   └── index.html          # Main HTML document for the website
├── src
│   ├── alexaApi.ts        # Class for interacting with the Alexa API
│   ├── App.tsx            # Main React component that sets up the application
│   ├── components
│   │   ├── VoiceInput.tsx  # Component for voice command input
│   │   └── ScreenOutput.tsx # Component for displaying output from Alexa
│   └── styles
│       └── App.css        # CSS styles for the application
├── package.json            # npm configuration file
├── tsconfig.json           # TypeScript configuration file
└── README.md               # Documentation for the project
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd alexa-voice-web
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to view the application.

## Usage Guidelines

- Use the voice input component to speak commands to Alexa.
- The screen output component will display the responses received from the Alexa API.
- Ensure your microphone is enabled and accessible by the browser for voice recognition to work.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.