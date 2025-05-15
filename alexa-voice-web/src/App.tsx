import React, { useState, useEffect } from 'react';
import AlexisApi from './alexaApi';
import VoiceInput from './components/VoiceInput';
import ScreenOutput from './components/ScreenOutput';
import './styles/App.css';

const App: React.FC = () => {
    const [response, setResponse] = useState<string>('');
    const alexisApi = new AlexisApi();

    useEffect(() => {
        const connectToApi = async () => {
            await alexisApi.connect();
        };
        connectToApi();
    }, []);

    const handleCommand = async (command: string) => {
        const apiResponse = await alexisApi.sendCommand(command);
        setResponse(apiResponse);
    };

    return (
        <div className="App">
            <h1>Alexa Voice Interaction</h1>
            <VoiceInput onCommand={handleCommand} />
            <ScreenOutput response={response} />
        </div>
    );
};

export default App;