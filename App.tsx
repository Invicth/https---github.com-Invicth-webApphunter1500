
import React, { useState, FC, Dispatch, SetStateAction } from 'react';
import HunterCalculator from './HunterCalculator';
import PotableWaterSizingCalculator from './PotableWaterSizingCalculator';
import DrainageSizingCalculator from './DrainageSizingCalculator';

const CaudalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 2.25A2.25 2.25 0 0112 4.5v1.875c0 .394.129.771.359 1.079 1.4.232 2.643.232 4.041 0 .23-.308.359-.685.359-1.08V4.5a2.25 2.25 0 012.25-2.25h.75a2.25 2.25 0 012.25 2.25v15a2.25 2.25 0 01-2.25-2.25h-15a2.25 2.25 0 01-2.25-2.25v-15A2.25 2.25 0 014.5 2.25h.75A2.25 2.25 0 017.5 4.5v1.875c0 .394.129.771.359 1.079 1.4.232 2.643.232 4.041 0 .23-.308.359-.685.359-1.08V4.5a2.25 2.25 0 012.25-2.25h.75z" />
    </svg>
);

type Tab = 'hunter' | 'potable' | 'drainage';

interface TabButtonProps {
    name: string;
    id: Tab;
    activeTab: Tab;
    setActiveTab: Dispatch<SetStateAction<Tab>>;
}

const TabButton: FC<TabButtonProps> = ({ name, id, activeTab, setActiveTab }) => {
    const isActive = activeTab === id;
    const activeClasses = 'border-cyan-500 text-cyan-600';
    const inactiveClasses = 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';

    return (
        <button
            onClick={() => setActiveTab(id)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${isActive ? activeClasses : inactiveClasses}`}
        >
            {name}
        </button>
    );
};


function App() {
    const [activeTab, setActiveTab] = useState<Tab>('hunter');

    return (
        <div className="min-h-screen bg-slate-100 flex items-start justify-center p-4 font-sans selection:bg-cyan-100">
            <main className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 transform transition-all mt-8 mb-8">
                
                <header className="flex items-center">
                    <CaudalIcon />
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Calculadoras Hidráulicas</h1>
                        <p className="text-slate-500">Herramientas para ingeniería sanitaria</p>
                    </div>
                </header>

                <div className="mt-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-2 sm:space-x-6" aria-label="Tabs">
                        <TabButton name="Caudal Hunter" id="hunter" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton name="Tubería Presión" id="potable" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton name="Tubería Desagüe" id="drainage" activeTab={activeTab} setActiveTab={setActiveTab} />
                    </nav>
                </div>

                <div className="mt-8">
                    {activeTab === 'hunter' && <HunterCalculator />}
                    {activeTab === 'potable' && <PotableWaterSizingCalculator />}
                    {activeTab === 'drainage' && <DrainageSizingCalculator />}
                </div>

                <footer className="mt-8 pt-6 border-t border-slate-200">
                    <p className="text-center text-sm text-slate-500 font-medium tracking-wider">
                        Made by Victor Diaz
                    </p>
                </footer>

            </main>
        </div>
    );
}

export default App;
