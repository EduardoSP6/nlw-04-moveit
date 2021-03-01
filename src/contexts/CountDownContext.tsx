import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { ChallengesContext } from './ChallengesContext';

interface CountDownContextData {
    minutes: number;
    seconds: number;
    hasFinished: boolean;
    isActive: boolean;
    startCountDown: () => void;
    resetCountDown: () => void;
}

interface CountDownProviderProps {
    children: ReactNode;
}

export const CountDownContext = createContext({} as CountDownContextData);

let countDownTimeout : NodeJS.Timeout;

let currentTime = 2 * 60; // tempo inicial 2 min.

export function CountDownProvider({ children } : CountDownProviderProps) {

    // dados do contexto do componente Challenge
    const { startNewChallenge } = useContext(ChallengesContext);

    const [time, setTime] = useState(currentTime);
    const [isActive, setIsActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    // inicia o contador
    function startCountDown() {
        setIsActive(true);
    }

    // reinicia o contador
    function resetCountDown() {
        clearTimeout(countDownTimeout);

        setIsActive(false);
        setHasFinished(false);

        currentTime = createRandTime();
        setTime(currentTime);
    }

    // retorna tempo randomico entre 1 e 25 min. para o contador
    function createRandTime() {
        return Math.floor(Math.random() * 25 + 1) * 60; 
    } 

    useEffect(() => {
        if (isActive && time > 0) {
            countDownTimeout = setTimeout(() => {
                setTime(time - 1);
            }, 1000);
        } else if (isActive && time === 0) {
            setHasFinished(true);
            setIsActive(false);
            startNewChallenge();
        }
    }, 
    [isActive, time])

    return (
        <CountDownContext.Provider value={{
            minutes,
            seconds,
            hasFinished,
            isActive,
            startCountDown,
            resetCountDown
        }}>
            {children}
        </CountDownContext.Provider>
    );
}