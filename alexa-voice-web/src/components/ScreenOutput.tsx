import React from 'react';

interface ScreenOutputProps {
    response: string;
}

const ScreenOutput: React.FC<ScreenOutputProps> = ({ response }) => {
    return (
        <div className="screen-output">
            <h2>Response from Alexa:</h2>
            <p>{response}</p>
        </div>
    );
};

export default ScreenOutput;