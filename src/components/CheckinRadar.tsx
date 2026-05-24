'use client';

import { MapPin, CheckCircle2, AlertTriangle, Loader2, FileText } from "lucide-react";

export type CheckinState = 'idle' | 'locating' | 'verifying' | 'success' | 'outofrange';

export function CheckinRadar({
  state,
  onCheckIn,
  onVirtual,
  onTryAgain,
}: {
  state: CheckinState;
  onCheckIn: () => void;
  onVirtual: () => void;
  onTryAgain: () => void;
}) {
  const isSearching = state === 'locating' || state === 'verifying';

  const accentColor =
    state === 'success'    ? '#4ade80' :
    state === 'outofrange' ? '#fb923c' :
    isSearching            ? '#60a5fa' :
                             '#4ade80';

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-8 flex flex-col items-center w-80">

      <div className="relative z-10 text-center pb-4 px-2">
        {state === 'idle' && (
          <>
            <h2 className="text-white text-2xl font-bold">Ready to Check In?</h2>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              We&apos;ll verify your location to confirm<br />you&apos;re in the classroom
            </p>
          </>
        )}
        {state === 'locating' && (
          <>
            <h2 className="text-white text-2xl font-bold">Locating you...</h2>
            <p className="text-slate-400 mt-2 text-sm">Getting your GPS position</p>
          </>
        )}
        {state === 'verifying' && (
          <>
            <h2 className="text-white text-2xl font-bold">Verifying...</h2>
            <p className="text-slate-400 mt-2 text-sm">Checking proximity to classroom</p>
          </>
        )}
        {state === 'success' && (
          <h2 className="text-green-400 text-2xl font-bold">Attendance Verified</h2>
        )}
        {state === 'outofrange' && (
          <>
            <h2 className="text-orange-400 text-2xl font-bold"> Out of Range</h2>
            <p className="text-slate-400 mt-2 text-sm">You&apos;re too far from the classroom</p>
          </>
        )}
      </div>

      <div className="relative flex items-center justify-center w-64 h-64 -mt-14">

        //static rings for the radar background
        <div className="absolute inset-0 rounded-full border"
          style={{ borderColor: `${accentColor}22` }} />
        <div className="absolute inset-8 rounded-full border border-slate-600/40" />
        <div className="absolute inset-16 rounded-full border border-slate-600/30" />

        //animated ping rings when searching for location
        {isSearching && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping pointer-events-none"
              style={{ opacity: 0.15, animationDuration: '1.5s' }} />
            <div className="absolute inset-8 rounded-full border-2 border-blue-400 animate-ping pointer-events-none"
              style={{ opacity: 0.2, animationDuration: '1.5s', animationDelay: '0.4s' }} />
            <div className="absolute inset-16 rounded-full border-2 border-blue-400 animate-ping pointer-events-none"
              style={{ opacity: 0.25, animationDuration: '1.5s', animationDelay: '0.8s' }} />
          </>
        )}

       

        // The main icon in the center, which changes based on state
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className={`
            w-14 h-14 rounded-full flex items-center justify-center border-2
            ${state === 'success'    ? 'bg-green-900/50 border-green-500/70' :
              state === 'outofrange' ? 'bg-orange-900/50 border-orange-500/70' :
              isSearching            ? 'bg-blue-900/50 border-blue-500/50' :
                                       'bg-slate-800/90 border-green-500/50'}
          `}>
            {state === 'idle'       && <MapPin        className="w-6 h-6 text-green-400" />}
            {state === 'locating'   && <Loader2       className="w-6 h-6 text-blue-400 animate-spin" />}
            {state === 'verifying'  && <Loader2       className="w-6 h-6 text-blue-400 animate-spin" />}
            {state === 'success'    && <CheckCircle2  className="w-6 h-6 text-green-400" />}
            {state === 'outofrange' && <AlertTriangle className="w-6 h-6 text-orange-400" />}
          </div>

          // In-Person badge below the icon, only on success
          {state === 'success' && (
            <div className="inline-flex items-center bg-green-900/50 border border-green-600 rounded-full px-4 py-1">
              <span className="text-green-300 text-sm font-medium">In-Person</span>
            </div>
          )}
        </div>

      </div>

      //action buttons below the radar, which change based on state
      <div className="flex flex-col gap-3 w-full mt-10">
        {state === 'idle' && (
          <>
            <button
              onClick={onCheckIn}
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white py-3 rounded-xl font-bold text-base transition"
            >
              <CheckCircle2 className="w-5 h-5" />
              Check In Now
            </button>
            <button className="w-full flex items-center justify-center gap-2 bg-slate-700/80 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-medium text-base transition">
              <FileText className="w-5 h-5" />
              Request Excuse
            </button>
          </>
        )}
        {state === 'success' && (
          <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-bold text-base transition">
            Back to Dashboard
          </button>
        )}
        {state === 'outofrange' && (
          <>
            <button onClick={onVirtual} className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-xl font-bold text-base transition">
              Switch to Virtual
            </button>
            <button onClick={onTryAgain} className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-bold text-base transition">
              Try Again
            </button>
          </>
        )}
      </div>

    </div>
  );
}
