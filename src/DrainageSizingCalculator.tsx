
import React, { useState, useCallback } from 'react';
import { PVC_SANITARY_PIPES_MM } from './pipeConstants';
import type { DrainageResult } from './types';

const DrainageSizingCalculator = () => {
    const [flow, setFlow] = useState('');
    const [slope, setSlope] = useState('2.0');
    const [manningN, setManningN] = useState('0.009');
    const [fillRatio, setFillRatio] = useState('75');
    const [result, setResult] = useState<DrainageResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = useCallback(() => {
        const numFlow = parseFloat(flow);
        const numSlope = parseFloat(slope);
        const numManningN = parseFloat(manningN);
        const numFillRatio = parseFloat(fillRatio);

        if (isNaN(numFlow) || isNaN(numSlope) || isNaN(numManningN) || isNaN(numFillRatio) || numFlow <= 0 || numSlope <= 0 || numManningN <= 0 || numFillRatio <= 0 || numFillRatio >= 100) {
            setError('Por favor, ingresa valores numéricos positivos. El tirante debe ser entre 1 y 99%.');
            setResult(null);
            return;
        }
        
        setError(null);

        // --- Lógica de Cálculo Iterativa (Manning) ---

        // 1. Preparación de unidades
        const designFlowM3s = numFlow / 1000; // Caudal de diseño en m³/s
        const slopeMperM = numSlope / 100;    // Pendiente en m/m
        const fillRatioDecimal = numFillRatio / 100; // Tirante como relación

        let suitablePipeFound = false;

        // 2. Iterar a través de diámetros comerciales
        for (const diameterMm of PVC_SANITARY_PIPES_MM) {
            const D = diameterMm / 1000; // Diámetro en metros

            // a. Calcular geometría de sección parcial
            const y = D * fillRatioDecimal; // Altura del agua (tirante)
            // Ángulo theta (rad). Se protege acos de valores fuera de [-1, 1] por precisión de punto flotante.
            const acosArg = Math.max(-1, Math.min(1, 1 - (2 * y) / D));
            const theta = 2 * Math.acos(acosArg);

            const A = (Math.pow(D, 2) / 8) * (theta - Math.sin(theta)); // Área mojada
            const P = (D / 2) * theta; // Perímetro mojado
            const Rh = A / P; // Radio hidráulico

            // b. Calcular capacidad de caudal del tubo (Q_capacidad) con Manning
            const capacityM3s = A * (1 / numManningN) * Math.pow(Rh, 2/3) * Math.pow(slopeMperM, 1/2);

            // c. Condición de parada: si la capacidad es suficiente
            if (capacityM3s >= designFlowM3s) {
                // d. Calcular velocidad real con el caudal de diseño
                const realVelocity = designFlowM3s / A;

                setResult({
                    recommendedDiameter: diameterMm,
                    flowVelocity: realVelocity,
                    pipeCapacityLps: capacityM3s * 1000,
                    waterHeight: y * 1000,
                });
                suitablePipeFound = true;
                break; // Detener la iteración
            }
        }

        if (!suitablePipeFound) {
            setError('No se encontró un diámetro comercial suficiente para las condiciones dadas. Considere aumentar la pendiente o revisar los datos.');
            setResult(null);
        }

    }, [flow, slope, manningN, fillRatio]);
    
    const ResultItem = ({ label, value, unit }: { label: string, value: string, unit: string }) => (
         <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
            <span className="text-slate-600">{label}:</span>
            <p className="font-bold text-slate-800">{value} <span className="text-sm font-normal text-slate-500">{unit}</span></p>
        </div>
    );

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold text-slate-700">Dimensionamiento de Tuberías de Desagüe (Manning)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="drainage-flow" className="block text-sm font-medium text-slate-600">Caudal de Diseño (l/s)</label>
                    <input type="number" id="drainage-flow" value={flow} onChange={e => setFlow(e.target.value)} placeholder="5.0" className="mt-1 block w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-cyan-500 focus:border-cyan-500"/>
                </div>
                 <div>
                    <label htmlFor="drainage-slope" className="block text-sm font-medium text-slate-600">Pendiente (%)</label>
                    <input type="number" id="drainage-slope" value={slope} onChange={e => setSlope(e.target.value)} placeholder="2.0" className="mt-1 block w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-cyan-500 focus:border-cyan-500"/>
                </div>
                 <div>
                    <label htmlFor="drainage-n" className="block text-sm font-medium text-slate-600">Coef. 'n' de Manning</label>
                    <input type="number" id="drainage-n" step="0.001" value={manningN} onChange={e => setManningN(e.target.value)} placeholder="0.009" className="mt-1 block w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-cyan-500 focus:border-cyan-500"/>
                </div>
                 <div>
                    <label htmlFor="drainage-fill" className="block text-sm font-medium text-slate-600">Tirante de Diseño (%)</label>
                    <input type="number" id="drainage-fill" min="1" max="99" value={fillRatio} onChange={e => setFillRatio(e.target.value)} placeholder="75" className="mt-1 block w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-cyan-500 focus:border-cyan-500"/>
                </div>
            </div>

            <button onClick={handleCalculate} className="w-full px-8 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75 transition-transform transform hover:scale-105 active:scale-100">
                Dimensionar Desagüe
            </button>

            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-r-lg" role="alert"><p>{error}</p></div>}

            {result && !error && (
                <section className="space-y-4 pt-6 border-t border-slate-200 animate-fade-in">
                     <div className="flex justify-between p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
                        <span className="font-semibold text-cyan-800">Diámetro Comercial Recomendado:</span>
                        <span className="font-bold text-cyan-900">{result.recommendedDiameter} mm</span>
                    </div>
                    <div className="space-y-3">
                        <ResultItem label="Velocidad del Flujo" value={result.flowVelocity.toFixed(3)} unit="m/s" />
                        <ResultItem label="Capacidad del Tubo" value={result.pipeCapacityLps.toFixed(2)} unit="l/s" />
                        <ResultItem label="Tirante Resultante" value={result.waterHeight.toFixed(2)} unit="mm" />
                    </div>
                </section>
            )}
             <style>{`.animate-fade-in { animation: fade-in 0.5s ease-out forwards; } @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
    );
};

export default DrainageSizingCalculator;
