
import React, { useState, useCallback } from 'react';
import { PVC_SCH40_PIPES } from './pipeConstants';
import type { PotableWaterResult } from './types';

const PotableWaterSizingCalculator = () => {
    const [flow, setFlow] = useState('');
    const [velocity, setVelocity] = useState('2.0');
    const [result, setResult] = useState<PotableWaterResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = useCallback(() => {
        const numFlow = parseFloat(flow);
        const numVelocity = parseFloat(velocity);

        if (isNaN(numFlow) || isNaN(numVelocity) || numFlow <= 0 || numVelocity <= 0) {
            setError('Por favor, ingresa valores numéricos positivos para todos los campos.');
            setResult(null);
            return;
        }
        
        setError(null);

        // Lógica de cálculo
        // 1. Convertir caudal de l/s a m³/s
        const flowM3s = numFlow / 1000;
        
        // 2. Calcular el área mínima necesaria
        const minAreaM2 = flowM3s / numVelocity;
        
        // 3. Calcular el diámetro teórico en metros
        const theoreticalDiameterM = Math.sqrt((4 * minAreaM2) / Math.PI);
        
        // 4. Convertir diámetro teórico a mm
        const theoreticalDiameterMm = theoreticalDiameterM * 1000;

        // 5. Encontrar el diámetro comercial adecuado
        const commercialPipe = PVC_SCH40_PIPES.find(pipe => pipe.id_mm >= theoreticalDiameterMm);

        if (!commercialPipe) {
             setError('No se encontró un diámetro comercial adecuado para el caudal y velocidad especificados. Intente con un valor mayor.');
             setResult(null);
             return;
        }

        setResult({
            theoreticalDiameter: theoreticalDiameterMm,
            commercialPipe: commercialPipe
        });

    }, [flow, velocity]);

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold text-slate-700">Dimensionamiento de Tuberías de Agua Potable</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="potable-flow" className="block text-sm font-medium text-slate-600">Caudal de Diseño</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input type="number" id="potable-flow" value={flow} onChange={e => setFlow(e.target.value)} placeholder="Ej: 1.5" className="block w-full p-3 pr-12 border-slate-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500" />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><span className="text-gray-500 text-sm">l/s</span></div>
                    </div>
                </div>
                <div>
                    <label htmlFor="potable-velocity" className="block text-sm font-medium text-slate-600">Velocidad Máxima Permitida</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input type="number" id="potable-velocity" value={velocity} onChange={e => setVelocity(e.target.value)} placeholder="Ej: 2.0" className="block w-full p-3 pr-12 border-slate-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500" />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><span className="text-gray-500 text-sm">m/s</span></div>
                    </div>
                </div>
            </div>

            <button onClick={handleCalculate} className="w-full px-8 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75 transition-transform transform hover:scale-105 active:scale-100">
                Dimensionar Tubería
            </button>

            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-r-lg" role="alert"><p>{error}</p></div>}

            {result && !error && (
                <section className="space-y-3 pt-6 border-t border-slate-200 animate-fade-in">
                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-slate-600">Diámetro Teórico Mínimo:</span>
                        <span className="font-bold text-slate-800">{result.theoreticalDiameter.toFixed(2)} mm</span>
                    </div>
                     <div className="flex justify-between p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
                        <span className="font-semibold text-cyan-800">Diámetro Comercial Recomendado:</span>
                        <span className="font-bold text-cyan-900">{result.commercialPipe.nominal} ({result.commercialPipe.nominal_mm}mm)</span>
                    </div>
                </section>
            )}
             <style>{`.animate-fade-in { animation: fade-in 0.5s ease-out forwards; } @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
    );
};

export default PotableWaterSizingCalculator;
