
import React, { useState, useCallback } from 'react';
import { HUNTER_DATA_TANQUE, HUNTER_DATA_FLUXO } from './constants';
import { getCaudalInterpolado } from './services/interpolationService';

interface ResultItemProps {
    label: string;
    value: number | null;
}

const ResultItem: React.FC<ResultItemProps> = ({ label, value }) => {
    return (
        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg transition-all duration-300 hover:bg-slate-100">
            <span className="text-lg text-slate-600">{label}:</span>
            {value !== null ? (
                <p className="text-xl font-bold text-slate-800">
                    {value.toFixed(3)}
                    <span className="ml-2 text-sm font-normal text-slate-500">l/s</span>
                </p>
            ) : (
                <span className="text-lg text-slate-400">-</span>
            )}
        </div>
    );
};

const HunterCalculator = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [tankResult, setTankResult] = useState<number | null>(null);
    const [fluxoResult, setFluxoResult] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hasCalculated, setHasCalculated] = useState<boolean>(false);

    const handleCalculate = useCallback(() => {
        setError(null);
        const hunterUnits = parseFloat(inputValue);

        if (isNaN(hunterUnits) || hunterUnits <= 0) {
            setError("Por favor, ingresa un valor numérico válido y positivo.");
            setTankResult(null);
            setFluxoResult(null);
            setHasCalculated(false);
            return;
        }

        const caudalTanque = getCaudalInterpolado(HUNTER_DATA_TANQUE, hunterUnits);
        const caudalFluxo = getCaudalInterpolado(HUNTER_DATA_FLUXO, hunterUnits);

        setTankResult(caudalTanque);
        setFluxoResult(caudalFluxo);
        setHasCalculated(true);

    }, [inputValue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (hasCalculated) {
            setHasCalculated(false);
            setError(null);
        }
    }

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                 <label htmlFor="unidades-hunter" className="block text-md font-medium text-slate-700">
                    Introduce el valor de Unidades Hunter
                </label>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <input
                        type="number"
                        id="unidades-hunter"
                        step="0.1"
                        min="0.1"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
                        placeholder="Ej: 25.5"
                        className="flex-grow p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow w-full"
                    />
                    <button
                        onClick={handleCalculate}
                        className="px-8 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75 transition-all transform hover:scale-105 active:scale-100 w-full sm:w-auto"
                    >
                        Calcular
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-r-lg" role="alert">
                    <p className="font-semibold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            {hasCalculated && !error && (
                <section className="space-y-4 pt-6 border-t border-slate-200 animate-fade-in">
                    <h2 className="text-xl font-semibold text-slate-700">Resultados del Caudal Probable</h2>
                    <ResultItem label="Sistema con Tanque" value={tankResult} />
                    <ResultItem label="Sistema con Fluxómetro" value={fluxoResult} />
                </section>
            )}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default HunterCalculator;
