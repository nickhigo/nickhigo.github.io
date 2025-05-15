import React, { useState } from 'react';
import AlexisApi from '../alexaApi';

const VoiceInput: React.FC = () => {
    const [command, setCommand] = useState('');
    const [response, setResponse] = useState('');
    const alexisApi = new AlexisApi();

    const handleVoiceInput = async () => {
        // Simulate voice input for demonstration purposes
        const simulatedCommand = 'Turn on the lights';
        setCommand(simulatedCommand);
        const apiResponse = await alexisApi.sendCommand(simulatedCommand);
        setResponse(apiResponse);
    };

    return (
        <div>
            <h2>Voice Command Input</h2>
            <button onClick={handleVoiceInput}>Send Voice Command</button>
            <p>Command: {command}</p>
            <p>Response: {response}</p>
        </div>
    );
};

export default VoiceInput;