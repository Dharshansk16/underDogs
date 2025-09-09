"use client";
import { useState, useEffect } from "react";

const historicalFigures = [
  {
    id: 1,
    name: "Albert Einstein",
    description: "Physicist, Theory of Relativity",
    period: "1879-1955",
    field: "Physics",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/d/d3/Albert_Einstein_Head.jpg",
    bgColor: "from-purple-600 to-blue-600",
    accentColor: "purple",
  },
  {
    id: 2,
    name: "Isaac Newton",
    description: "Mathematician, Laws of Motion",
    period: "1643-1727",
    field: "Mathematics & Physics",
    avatar: "/netwon.jpg",
    bgColor: "from-green-600 to-teal-600",
    accentColor: "green",
  },
  {
    id: 3,
    name: "Marie Curie",
    description: "Chemist, Radioactivity Pioneer",
    period: "1867-1934",
    field: "Chemistry & Physics",
    avatar: "/marie.jpg",
    bgColor: "from-pink-600 to-rose-600",
    accentColor: "pink",
  },
];

export default function Home() {
  const [selected, setSelected] = useState<number | null>(null);
  const [chat, setChat] = useState<{ sender: string; message: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chat]);

  const sendMessage = async () => {
    if (selected === null || !input.trim()) return;

    const figure = historicalFigures[selected];
    const question = input.trim();

    // Add user's message to chat
    setChat((prev) => [...prev, { sender: "You", message: question }]);
    setInput("");
    setLoading(true);
    setIsTyping(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pdfs/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          figure_id: figure.id,
          question,
        }),
      });

      const data = await res.json();

      // Simulate typing delay for better UX
      setTimeout(() => {
        setIsTyping(false);
        if (res.ok) {
          setChat((prev) => [
            ...prev,
            { sender: figure.name, message: data.answer },
          ]);
        } else {
          setChat((prev) => [
            ...prev,
            { sender: "System", message: data.error || "Something went wrong." },
          ]);
        }
      }, 1000);
    } catch (err) {
      setTimeout(() => {
        setIsTyping(false);
        setChat((prev) => [
          ...prev,
          { sender: "System", message: "Failed to reach the server." },
        ]);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <main className="relative z-10 p-4 md:p-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 tracking-tight">
            TimeTalks
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Step into history and engage in meaningful conversations with the greatest minds of all time
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Historical Figures Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Choose Your Conversation Partner
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {historicalFigures.map((fig, idx) => {
              const isSelected = selected === idx;
              return (
                <div
                  key={fig.id}
                  className={`group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    isSelected ? 'scale-105' : ''
                  }`}
                  onClick={() => {
                    setSelected(idx);
                    setChat([]);
                  }}
                >
                  <div className={`relative bg-gradient-to-br ${fig.bgColor} p-1 rounded-2xl shadow-2xl ${
                    isSelected 
                      ? 'ring-4 ring-white/50 shadow-3xl' 
                      : 'hover:shadow-3xl'
                  }`}>
                    <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-6 h-full">
                      {/* Avatar with glow effect */}
                      <div className="relative mb-4">
                        <div className={`absolute inset-0 bg-gradient-to-br ${fig.bgColor} rounded-full blur-md opacity-50 animate-pulse`}></div>
                        <img
                          src={fig.avatar}
                          alt={fig.name}
                          className="relative w-24 h-24 object-cover rounded-full mx-auto border-4 border-white/20 shadow-xl"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                          {fig.name}
                        </h3>
                        <p className="text-slate-300 text-sm mb-2">
                          {fig.period}
                        </p>
                        <p className="text-slate-400 text-sm mb-3">
                          {fig.description}
                        </p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${fig.bgColor} text-white shadow-lg`}>
                          {fig.field}
                        </span>
                      </div>
                      
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Section */}
        {selected !== null && (
          <div className="max-w-4xl mx-auto">
            <div className={`bg-gradient-to-br ${historicalFigures[selected].bgColor} p-1 rounded-2xl shadow-2xl`}>
              <div className="bg-slate-900/95 backdrop-blur-sm rounded-xl p-6">
                {/* Chat Header */}
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-700">
                  <img
                    src={historicalFigures[selected].avatar}
                    alt={historicalFigures[selected].name}
                    className="w-12 h-12 object-cover rounded-full border-2 border-white/20"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {historicalFigures[selected].name}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {historicalFigures[selected].field} • {historicalFigures[selected].period}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">Online</span>
                  </div>
                </div>

                {/* Chat Messages */}
                <div 
                  id="chat-container"
                  className="h-96 overflow-y-auto mb-6 space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
                >
                  {chat.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-slate-300 text-lg mb-2">
                        Welcome! I'm {historicalFigures[selected].name}
                      </p>
                      <p className="text-slate-400 max-w-md">
                        Ask me anything about my life, work, or the era I lived in. I'm here to share my knowledge and experiences with you.
                      </p>
                    </div>
                  ) : (
                    <>
                      {chat.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"} animate-slideIn`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${
                              msg.sender === "You"
                                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                                : msg.sender === "System"
                                ? "bg-red-500/20 border border-red-500/30 text-red-300"
                                : `bg-gradient-to-br ${historicalFigures[selected].bgColor} text-white`
                            }`}
                          >
                            <div className="text-xs opacity-75 mb-1">
                              {msg.sender}
                            </div>
                            <div className="text-sm leading-relaxed">
                              {msg.message}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start animate-slideIn">
                          <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-gradient-to-br ${historicalFigures[selected].bgColor} text-white shadow-lg`}>
                            <div className="text-xs opacity-75 mb-1">
                              {historicalFigures[selected].name}
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Input Form */}
                <form
                  className="flex gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                >
                  <div className="flex-1 relative">
                    <input
                      className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={`Ask ${historicalFigures[selected].name} anything...`}
                      disabled={loading}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none bg-gradient-to-r ${historicalFigures[selected].bgColor} hover:shadow-xl`}
                    disabled={loading || !input.trim()}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
