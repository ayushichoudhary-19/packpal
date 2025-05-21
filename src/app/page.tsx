'use client';

import Head from 'next/head';
import { useState, FormEvent } from 'react';
import {
  Briefcase, Sun, Mountain, Info, Package, AlertTriangle, CheckCircle,
  ChevronDown, Send, Loader2, Sparkles, Clipboard, ClipboardCheck,
  Calendar, Music, Utensils, Plane, Heart, Camera, Landmark, Users, MapPin
} from 'lucide-react';
import { DateRange, Range } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';

type ChecklistItem = {
  item: string;
  emoji: string;
};

type PackingResponse = {
  checklist: ChecklistItem[];
  advice: string;
};

type PurposeIconProps = {
  purpose: string;
};

export default function PackPalPage() {
  const [destination, setDestination] = useState<string>('');
  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [weather, setWeather] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('leisure');
  const [packingStyle, setPackingStyle] = useState<string>('normal');
  const [additionalContext, setAdditionalContext] = useState<string>('');
  const [tripDetailsEntered, setTripDetailsEntered] = useState<boolean>(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [advice, setAdvice] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const formatDateRange = (): string => {
    if (dateRange[0].startDate && dateRange[0].endDate) {
      const start = format(dateRange[0].startDate, 'MMM dd, yyyy');
      const end = format(dateRange[0].endDate, 'MMM dd, yyyy');
      return `${start} to ${end}`;
    }
    return '';
  };

  const handleGenerateChecklist = async (e: FormEvent) => {
    e.preventDefault();
    if (!destination || !dateRange[0].startDate || !weather) {
      setError('Please fill in Destination, Dates, and Weather to generate your packing list.');
      return;
    }

    setError('');
    setIsLoading(true);
    setChecklist([]);
    setAdvice('');
    setTripDetailsEntered(true);

    const formattedDates = formatDateRange();

    const prompt = `
      Create a personalized packing checklist and packing advice for a trip.
      Destination: ${destination}
      Dates: ${formattedDates}
      Expected Weather: ${weather}
      Purpose of trip: ${purpose}
      Traveler's packing style: ${packingStyle}
      Additional context: ${additionalContext}

      Respond with a JSON object adhering to the following schema:
      {
        "checklist": [{ "item": "...", "emoji": "..." }],
        "advice": "..."
      }
    `;

    try {
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        }
      };

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData?.error?.message || response.status}`);
      }

      const result = await response.json();

      const parsedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!parsedText) throw new Error('No content from AI');

      const parsedJson: PackingResponse = JSON.parse(parsedText);
      setChecklist(parsedJson.checklist || []);
      setAdvice(parsedJson.advice || 'No specific advice generated.');
    } catch (err: any) {
      console.error("Error generating checklist:", err);
      setError(`Sorry, I couldn't generate your packing list. ${err.message}`);
      setChecklist([]);
      setAdvice('');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    let textToCopy = `Packing List for ${destination}:\n\n`;
    checklist.forEach(listItem => {
      textToCopy += `${listItem.emoji} ${listItem.item}\n`;
    });
    textToCopy += `\nPacking Advice:\n${advice}`;

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Clipboard error:', err);
        setError('Failed to copy. Please try manually.');
      });
  };

  const PurposeIcon = ({ purpose }: PurposeIconProps) => {
    switch (purpose) {
      case 'work': return <Briefcase className="inline mr-2 opacity-70" size={18} />;
      case 'beach': return <Sun className="inline mr-2 opacity-70" size={18} />;
      case 'hiking': return <Mountain className="inline mr-2 opacity-70" size={18} />;
      case 'festival': return <Music className="inline mr-2 opacity-70" size={18} />;
      case 'food': return <Utensils className="inline mr-2 opacity-70" size={18} />;
      case 'city': return <Landmark className="inline mr-2 opacity-70" size={18} />;
      case 'photography': return <Camera className="inline mr-2 opacity-70" size={18} />;
      case 'romantic': return <Heart className="inline mr-2 opacity-70" size={18} />;
      case 'family': return <Users className="inline mr-2 opacity-70" size={18} />;
      case 'adventure': return <MapPin className="inline mr-2 opacity-70" size={18} />;
      case 'event': return <Calendar className="inline mr-2 opacity-70" size={18} />;
      default: return <Package className="inline mr-2 opacity-70" size={18} />;
    }
  };

  return (
    <>
      <Head>
        <title>PackPal - Your Smart Packing Assistant</title>
        <meta name="description" content="Generate personalized packing checklists for any trip." />
        <link rel="icon" href="/favicon.ico" />
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex flex-col items-center justify-center p-4 font-sans">
        <header className="text-center mb-6 md:mb-10">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-700 drop-shadow-md">
            <Package size={60} className="inline-block mr-3 mb-2" />
            PackPal
          </h1>
          <p className="text-slate-600 text-lg mt-2">Your AI-powered smart packing assistant!</p>
        </header>

        <main className="bg-white p-6 md:p-10 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-500">
          {!tripDetailsEntered || (!isLoading && checklist.length === 0 && !error) ? (
            <form onSubmit={handleGenerateChecklist} className="space-y-6">
              <div>
                <label htmlFor="destination" className="block text-sm font-medium text-slate-700 mb-1">Destination</label>
                <input type="text" id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g., Paris, France" className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
              </div>
              <div>
                <label htmlFor="dates" className="block text-sm font-medium text-slate-700 mb-1">Dates of Travel</label>
                <div className="relative">
                  <div 
                    onClick={() => setShowCalendar(!showCalendar)} 
                    className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors flex justify-between items-center cursor-pointer"
                  >
                    <span>{formatDateRange() || 'Select date range'}</span>
                    <Calendar size={20} className="text-slate-400" />
                  </div>
                  {showCalendar && (
                    <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-lg p-2 border border-slate-200">
                      <DateRange
                        editableDateInputs={true}
                        onChange={item => setDateRange([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={dateRange}
                        months={1}
                        direction="horizontal"
                        className="border-0"
                      />
                      <div className="flex justify-end mt-2">
                        <button 
                          type="button" 
                          onClick={() => setShowCalendar(false)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="weather" className="block text-sm font-medium text-slate-700 mb-1">Expected Weather</label>
                <input type="text" id="weather" value={weather} onChange={(e) => setWeather(e.target.value)} placeholder="e.g., Sunny, 25°C" className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="purpose" className="block text-sm font-medium text-slate-700 mb-1">Purpose of Trip</label>
                  <div className="relative">
                    <select id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg shadow-sm appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10">
                      <option value="leisure">Leisure / Vacation</option>
                      <option value="work">Work / Business</option>
                      <option value="beach">Beach Holiday</option>
                      <option value="hiking">Hiking / Adventure</option>
                      <option value="city">City Exploration</option>
                      <option value="food">Food Tourism</option>
                      <option value="festival">Festival / Concert</option>
                      <option value="photography">Photography Trip</option>
                      <option value="romantic">Romantic Getaway</option>
                      <option value="family">Family Visit</option>
                      <option value="adventure">Adventure Travel</option>
                      <option value="event">Special Event (Wedding, etc.)</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                  </div>
                </div>
                <div>
                  <label htmlFor="packingStyle" className="block text-sm font-medium text-slate-700 mb-1">Packing Style</label>
                   <div className="relative">
                    <select id="packingStyle" value={packingStyle} onChange={(e) => setPackingStyle(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg shadow-sm appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10">
                      <option value="normal">Normal</option>
                      <option value="minimalist">Minimalist</option>
                      <option value="chaotic">A Bit Chaotic</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="additionalContext" className="block text-sm font-medium text-slate-700 mb-1">Additional Context (Optional)</label>
                <textarea 
                  id="additionalContext" 
                  value={additionalContext} 
                  onChange={(e) => setAdditionalContext(e.target.value)} 
                  placeholder="Any special requirements or additional information about your trip..." 
                  className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[100px]"
                />
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center space-x-2 disabled:opacity-50">
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                <span>{isLoading ? 'Summoning Packing Wisdom...' : 'Generate My PackPal List'}</span>
              </button>
            </form>
          ) : null}

          {isLoading && (
            <div className="text-center py-10">
              <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
              <p className="text-slate-600 text-lg">Your personalized packing list is materializing...</p>
              <p className="text-sm text-slate-500">This might take a moment, good things come to those who wait!</p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
              <AlertTriangle className="mr-3" size={24} />
              <div>
                <p className="font-semibold">Oops! Something went wrong.</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
          
          {tripDetailsEntered && !isLoading && (checklist.length > 0 || advice) && (
            <div className="mt-8 animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold text-blue-700 flex items-center">
                  <PurposeIcon purpose={purpose} /> Your PackPal Checklist for {destination}
                </h2>
                <button
                    onClick={copyToClipboard}
                    title="Copy to Clipboard"
                    className={`p-2 rounded-lg transition-colors duration-200 ${copied ? 'bg-green-500 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
                >
                    {copied ? <ClipboardCheck size={20} /> : <Clipboard size={20} />}
                </button>
              </div>

              {checklist.length > 0 ? (
                <ul className="space-y-3 mb-8">
                  {checklist.map((listItem, index) => (
                    <li key={index} className="flex items-center p-3 bg-sky-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-2xl mr-3">{listItem.emoji || '✅'}</span>
                      <span className="text-slate-700 text-lg">{listItem.item}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-slate-600 mb-6">Hmm, looks like your checklist is empty. Try adjusting your inputs?</p> }

              {advice && (
                <div className="p-6 bg-amber-50 border border-amber-300 rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold text-amber-800 mb-2 flex items-center">
                    <Info size={22} className="mr-2 text-amber-600" />
                    PackPal Wisdom for a '{packingStyle.charAt(0).toUpperCase() + packingStyle.slice(1)}' Packer:
                  </h3>
                  <p className="text-amber-700 leading-relaxed">{advice}</p>
                </div>
              )}
              <button 
                onClick={() => {
                  setTripDetailsEntered(false);
                  setChecklist([]);
                  setAdvice('');
                  setError('');
                  // Optionally reset form fields too
                  // setDestination(''); setDates(''); setWeather('');
                }}
                className="mt-8 w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center space-x-2"
              >
                <Package size={20} />
                <span>Start a New PackPal List</span>
              </button>
            </div>
          )}
        </main>

        <footer className="text-center mt-10 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} PackPal. Travel Smarter, Not Harder.</p>
          <button onClick={() => setShowInfoModal(true)} className="mt-2 text-blue-500 hover:underline">
            How does this work?
          </button>
        </footer>

        {showInfoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300 animate-fadeIn">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full transform transition-transform duration-300 animate-scaleUp">
              <h3 className="text-2xl font-semibold text-blue-700 mb-4">How PackPal Works</h3>
              <p className="text-slate-600 mb-3">
                PackPal uses Google's Gemini AI to generate your personalized packing list. When you provide your trip details (destination, dates, weather, purpose, and packing style), PackPal sends this information to the AI.
              </p>
              <p className="text-slate-600 mb-3">
                The AI then crafts a checklist and packing advice tailored to your specific needs. No login is required, and your data is only used to generate the list for your current session.
              </p>
              <p className="text-slate-600 mb-6">
                The goal is to make packing simpler and smarter, so you can focus on your trip!
              </p>
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg shadow-md hover:shadow-lg transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        )}

        {/* Basic CSS for animations if not using a framework that handles this */}
        <style jsx global>{`
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
          .animate-scaleUp {
            animation: scaleUp 0.3s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scaleUp {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          /* Ensure Tailwind JIT picks up dynamic classes if any, though here they are mostly static */
        `}</style>
      </div>
    </>
  );
};
