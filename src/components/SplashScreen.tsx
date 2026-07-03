import { useEffect, useState } from 'react';
import { Factory, Wrench } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 500);
    const timer2 = setTimeout(() => setStep(2), 1500);
    const timer3 = setTimeout(() => setStep(3), 2500);
    const timer4 = setTimeout(() => onComplete(), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50">
      <div className="text-center px-6">
        <div className={`transition-all duration-700 ${step >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Factory className="w-12 h-12 text-amber-400 animate-pulse" />
            <Wrench className="w-10 h-10 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Bottoms Gallery Pvt. Ltd.</h1>
          <p className="text-amber-400 font-medium">Spider Group</p>
        </div>

        <div className={`mt-12 transition-all duration-700 ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 text-lg">Machine Issue Tracker</p>
        </div>

        <div className={`mt-16 transition-all duration-700 ${step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-slate-800/50 rounded-lg px-6 py-4 border border-slate-700">
            <p className="text-gray-300 text-sm mb-1">Developed by</p>
            <p className="text-white font-bold text-xl">Bayezid Miah</p>
            <p className="text-amber-400 mt-2 text-sm">Mechanic Section</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
        {[1, 2, 3].map((dot) => (
          <div key={dot} className="relative">
            <div
              className="w-3 h-3 rounded-full bg-slate-600 transition-all duration-700"
              style={{
                animationDelay: `${dot * 0.2}s`,
                backgroundColor: step >= dot ? '#f59e0b' : '#475569',
                transform: step >= dot ? 'scale(1.2)' : 'scale(1)',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
