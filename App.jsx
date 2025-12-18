import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { 
  Search, MapPin, Bed, Bath, Home, Camera, 
  MessageSquare, X, Send, Menu, ChevronRight, 
  PlayCircle, Users, CheckCircle, Smartphone,
  Star, Lock, Car, Trees, Code, Copy, Eye, EyeOff,
  ImageIcon, Facebook, Instagram, Mail, Sparkles, Wand2, 
  Link as LinkIcon 
} from 'lucide-react';

// --- CONFIGURACIÓN DE GEMINI API ---
const apiKey = ""; 

const callGemini = async (prompt, systemInstruction = "") => {
  if (!apiKey && window.location.hostname !== 'localhost') console.warn("⚠️ Falta API Key");
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: systemInstruction }] } }),
      }
    );
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, no pude procesar eso.";
  } catch (error) { return "Error de conexión con IA."; }
};

// --- DATOS INICIALES ---
const INITIAL_PROPERTIES = [
  {
    "title": "Coto Nísperos",
    "location": "Fracc. Los Camichines, Cd. Guzmán, Jal.",
    "price": "$3,000,000",
    "type": "venta",
    "beds": "2",
    "baths": "1.5",
    "sqft": "84.64",
    "landSqft": "110.50",
    "parking": 2,
    "image": "https://i.ibb.co/s9yq9Rhb/12132025-015104-defurnished.jpg",
    "matterportId": "P32n2mSGnrQ",
    "description": "✨ ¡Oportunidad Única en Coto Privado! ✨\n\n🏡 Casa moderna lista para habitar\n📍 Ubicación privilegiada en Los Camichines\n🛡️ Seguridad y tranquilidad garantizada\n\nCaracterísticas principales:\n🛏️ 2 Recámaras amplias\n🚿 1.5 Baños de lujo\n🚗 Cochera para 2 autos\n🌳 Terreno excedente\n\n¡Agenda tu cita hoy mismo y conócela!",
    "id": 1,
    "gallery": [
      "https://i.ibb.co/s9yq9Rhb/12132025-015104-defurnished.jpg",
      "https://i.ibb.co/N66rHYdf/12132025-015127-defurnished.jpg",
      "https://i.ibb.co/3mM4mm7w/12132025-015226-defurnished.jpg",
      "https://i.ibb.co/7t1JZ0cv/12132025-015212-defurnished.jpg"
    ]
  },
  {
    "title": "Casa Fracc. Santa María",
    "location": "Fracc. Santa María, Cd. Guzmán, Jal.",
    "price": "$1,800,000",
    "type": "venta",
    "beds": "2",
    "baths": "1",
    "sqft": "",
    "landSqft": "90",
    "parking": "2",
    "image": "https://i.ibb.co/bjMZQgx7/12022025-1937001.jpg",
    "matterportId": "zLZPTdpz6m3",
    "description": "🏠 ¡TU NUEVO HOGAR TE ESPERA! 🏠\n\n📍 Excelente ubicación atrás de Walmart\n💰 Gran plusvalía garantizada\n🔑 Lista para escriturar\n\nDetalles:\n🛏️ 2 Habitaciones cómodas\n🚿 1 Baño completo\n🚗 Espacio para 2 autos\n📐 90m² de terreno ideal\n\n¡Deja de pagar renta e invierte en tu patrimonio!",
    "id": 1765603133821,
    "gallery": [
      "https://i.ibb.co/bjMZQgx7/12022025-1937001.jpg",
      "https://i.ibb.co/0ypf73TC/12022025-192721.jpg"
    ]
  }
];

// --- ESTILOS CSS ---
const GlobalStyles = () => (
  <style>{`
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
    .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
    .animate-slide-up { animation: slideUp 0.8s ease-out forwards; }
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-scale-in { animation: scaleIn 0.5s ease-out forwards; }
    html { scroll-behavior: smooth; }
  `}</style>
);

const openWhatsApp = (customMessage) => {
  const phone = "523411479074";
  const text = customMessage || "Hola, me gustaría recibir asesoría sobre las propiedades y servicios de Vistura 360.";
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// --- COMPONENTE REUTILIZABLE DE CONTACTO ---
const ContactSection = () => (
  <div className="max-w-7xl mx-auto px-4 py-16 animate-slide-up">
    <div className="bg-slate-900 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-slate-800 to-transparent opacity-30 pointer-events-none"></div>
      <div className="relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Tienes dudas o quieres agendar una cita?</h2>
        <p className="text-gray-400 mb-12 text-lg max-w-2xl mx-auto">Estamos listos para atenderte. Elige el medio que prefieras.</p>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
            <a href="https://wa.me/523411479074" target="_blank" rel="noreferrer" className="flex flex-col items-center p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition border border-white/10 group cursor-pointer backdrop-blur-sm">
              <div className="p-4 bg-yellow-400 text-slate-900 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-lg"><Smartphone size={24}/></div>
              <span className="text-sm text-gray-400 mb-2 font-bold uppercase tracking-wider">Llámanos / WhatsApp</span>
              <span className="text-xl md:text-2xl font-bold text-white">+52 (341) 147 9074</span>
            </a>
            <a href="mailto:contacto@vistura360.com" className="flex flex-col items-center p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition border border-white/10 group cursor-pointer backdrop-blur-sm">
              <div className="p-4 bg-yellow-400 text-slate-900 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-lg"><Mail size={24}/></div>
              <span className="text-sm text-gray-400 mb-2 font-bold uppercase tracking-wider">Correo Electrónico</span>
              <span className="text-xl md:text-2xl font-bold text-white break-all">contacto@vistura360.com</span>
            </a>
            <div className="flex flex-col items-center p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="p-4 bg-yellow-400 text-slate-900 rounded-full mb-4 shadow-lg"><MapPin size={24}/></div>
              <span className="text-sm text-gray-400 mb-2 font-bold uppercase tracking-wider">Ubicación</span>
              <span className="text-xl md:text-2xl font-bold text-white">Cd. Guzmán, Jalisco</span>
            </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-4 items-center">
          <span className="text-gray-400 font-medium mr-2">Síguenos en:</span>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/Vistura360" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white px-6 py-3 rounded-xl font-bold transition shadow-lg hover:-translate-y-1"><Facebook size={20}/> Facebook</a>
            <a href="https://www.instagram.com/vistura360/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg hover:-translate-y-1"><Instagram size={20}/> Instagram</a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- GENERADOR DE IA ---
const AIListingGenerator = ({ onCopy }) => {
  const [features, setFeatures] = useState("");
  const [listingType, setListingType] = useState("venta");
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!features.trim()) return;
    setLoading(true); setGeneratedText("");
    
    const systemInstruction = `
      Eres un experto copywriter inmobiliario. 
      Tu objetivo es escribir una descripción PERSUASIVA para una propiedad en ${listingType.toUpperCase()}.
      
      REGLAS DE FORMATO OBLIGATORIAS:
      1. Usa un Título Gancho con emojis al inicio.
      2. Crea una LISTA VERTICAL para las características usando emojis como viñetas (ej: 🛏️, 🛁, 🚗, 🌳, 📐).
      3. No uses párrafos largos, sé breve y directo.
      4. Termina con un llamado a la acción entusiasta.
      5. El tono debe ser profesional pero emocionante.
    `;
    
    const prompt = `Genera una descripción de venta/renta para una casa con estas características: ${features}. Hazlo en lista vertical con emojis.`;

    const result = await callGemini(prompt, systemInstruction);
    setGeneratedText(result); setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100 shadow-sm mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={80} className="text-indigo-600"/></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-indigo-600 rounded-lg text-white"><Wand2 size={20} /></div>
          <h3 className="text-lg font-bold text-slate-800">Creador de Descripciones IA</h3>
        </div>
        
        <div className="flex gap-4 mb-4">
           <select value={listingType} onChange={(e) => setListingType(e.target.value)} className="p-2 bg-white border border-indigo-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:border-indigo-500">
             <option value="venta">Para Venta</option>
             <option value="renta">Para Renta</option>
           </select>
           <input type="text" value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="Ej: 3 recámaras, jardín..." className="flex-1 p-2 bg-white border border-indigo-200 rounded-lg text-sm outline-none focus:border-indigo-500" />
        </div>

        <button onClick={handleGenerate} disabled={loading || !features} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-indigo-700 transition flex justify-center items-center gap-2 disabled:opacity-50">
          {loading ? "Generando magia..." : "Generar Descripción con IA"}
        </button>

        {generatedText && (
          <div className="mt-4 animate-fade-in">
            <label className="text-xs font-bold text-indigo-900 mb-1 block">Resultado (Listo para copiar):</label>
            <div className="relative">
              <textarea readOnly className="w-full h-40 p-3 bg-white rounded-xl border border-indigo-200 text-sm text-slate-700 focus:outline-none resize-none shadow-inner" value={generatedText} />
              <button onClick={() => onCopy(generatedText)} className="absolute top-2 right-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 p-1.5 rounded-lg transition text-xs font-bold flex items-center gap-1">
                <Copy size={14}/> Usar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- COMPONENTES NAVBAR ---
const Navbar = () => {
  const [imgError, setImgError] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const logoUrl = "/logo.png";

  const handleNavClick = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm px-4 py-3 md:px-6 md:py-4 transition-all duration-300">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => handleNavClick('/')}>
          <div className="w-10 h-10 md:w-12 md:h-12 relative flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
             {!imgError ? (
               <img src={logoUrl} alt="Vistura 360 Logo" className="w-full h-full object-contain drop-shadow-md" onError={() => setImgError(true)} />
             ) : (
               <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg border border-yellow-500/30 overflow-hidden relative">
                 <div className="text-yellow-400 font-bold text-xs md:text-sm">V360</div>
               </div>
             )}
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight leading-none font-sans group-hover:text-slate-900 transition-colors">Vistura<span className="text-yellow-600">360</span></span>
            <span className="text-[9px] md:text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase mt-0.5 group-hover:text-yellow-600 transition-colors">Real Estate</span>
          </div>
        </div>
        
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600 items-center">
          <Link to="/" className="hover:text-yellow-600 transition-colors hover:scale-105 transform duration-200">Propiedades</Link>
          <Link to="/servicios" className="hover:text-yellow-600 transition-colors hover:scale-105 transform duration-200">Servicios 360</Link>
          <Link to="/nosotros" className="hover:text-yellow-600 transition-colors hover:scale-105 transform duration-200">Nosotros</Link>
        </div>

        <div className="flex gap-2 items-center">
          <button onClick={() => openWhatsApp("Hola, me interesa contratar un Tour 360 para mi propiedad.")} className="hidden md:block px-6 py-2.5 text-sm font-bold text-slate-900 bg-yellow-400 rounded-full hover:bg-yellow-300 transition-all shadow-md hover:shadow-yellow-400/50 hover:-translate-y-0.5 active:translate-y-0">
            Contratar Tour 360
          </button>
          <button className="md:hidden p-1.5 text-gray-600 hover:text-slate-900 transition active:scale-90" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-gray-100 flex flex-col gap-3 animate-scale-in pb-2 origin-top">
          <button onClick={() => handleNavClick('/')} className="text-left font-medium text-gray-600 hover:text-yellow-600 px-2 py-1 rounded transition text-sm">Propiedades</button>
          <button onClick={() => handleNavClick('/servicios')} className="text-left font-medium text-gray-600 hover:text-yellow-600 px-2 py-1 rounded transition text-sm">Servicios 360</button>
          <button onClick={() => handleNavClick('/nosotros')} className="text-left font-medium text-gray-600 hover:text-yellow-600 px-2 py-1 rounded transition text-sm">Nosotros</button>
        </div>
      )}
    </nav>
  );
};

// --- PAGINAS ---
const HomePage = ({ properties }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('todos');
  const filteredProperties = filter === 'todos' ? properties : properties.filter(p => p.type === filter);

  // Función simple para copiar al portapapeles en la vista pública
  const handlePublicCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("¡Descripción copiada! Pégala en tu anuncio de Facebook o Marketplace.");
  };

  return (
    <>
      <div className="relative h-[450px] md:h-[600px] flex items-center justify-center bg-slate-900 text-white overflow-hidden group">
        <div className="absolute inset-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80" poster="https://images.unsplash.com/photo-1600596542815-e328d4e381f7?auto=format&fit=crop&q=80&w=1000">
            <source src="/videos/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-slate-900/30"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="animate-slide-up-slow animate-float">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 tracking-tight drop-shadow-2xl">Descubre tu espacio <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-500 text-glow">antes de visitarlo</span></h1>
            <p className="text-sm md:text-xl lg:text-2xl text-gray-100 mb-8 md:mb-10 font-light drop-shadow-md max-w-2xl mx-auto bg-black/20 backdrop-blur-sm p-3 md:p-4 rounded-2xl border border-white/10">La inmobiliaria digital del futuro. Compra, renta o vende con recorridos inmersivos.</p>
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 animate-slide-up-delay-1">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Propiedades Destacadas</h2>
          <div className="bg-gray-100 p-1.5 rounded-xl flex shadow-inner">
            {['todos', 'venta', 'renta'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 md:px-6 md:py-2.5 rounded-lg text-xs md:text-sm font-bold capitalize transition-all duration-300 ${filter === f ? 'bg-white shadow-md text-slate-900 scale-105' : 'text-gray-500 hover:text-gray-700'}`}>{f}</button>
            ))}
          </div>
        </div>
        
        {/* GRID DE PROPIEDADES */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 animate-slide-up-delay-2 mb-20">
          {filteredProperties.map(property => (
            <div key={property.id} onClick={() => navigate(`/propiedad/${property.id}`)} className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 border border-gray-100 hover:-translate-y-2">
              <div className="relative aspect-[4/3] overflow-hidden">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10 duration-500"></div>
                <img src={property.image} alt={property.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" onError={(e) => e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'}/>
                <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-800 shadow-sm">{property.type}</div>
                <div className="absolute bottom-3 right-3 z-20 bg-slate-900/90 hover:bg-slate-800 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <PlayCircle size={14} className="text-yellow-400" /> Tour 360°
                </div>
              </div>
              <div className="p-4 md:p-5">
                <div className="flex justify-between items-start mb-2"><h3 className="font-bold text-slate-800 line-clamp-1 text-sm md:text-lg group-hover:text-yellow-600 transition-colors">{property.title}</h3></div>
                <div className="flex justify-between items-center mb-4"><p className="font-bold text-base md:text-xl text-slate-900">{property.price}</p><p className="text-gray-500 text-[10px] md:text-xs flex items-center gap-1"><MapPin size={12} className="text-yellow-500"/> {property.location}</p></div>
                <div className="flex flex-wrap gap-3 text-gray-500 text-xs md:text-sm border-t border-gray-100 pt-4">
                  {property.beds && <span className="flex items-center gap-1" title="Recámaras"><Bed size={14} className="md:w-4 md:h-4" /> <span className="font-semibold">{property.beds}</span></span>}
                  {property.baths && <span className="flex items-center gap-1" title="Baños"><Bath size={14} className="md:w-4 md:h-4"/> <span className="font-semibold">{property.baths}</span></span>}
                  {property.parking && <span className="flex items-center gap-1" title="Cocheras"><Car size={14} className="md:w-4 md:h-4"/> <span className="font-semibold">{property.parking}</span></span>}
                  {property.sqft && <span className="flex items-center gap-1" title="Construcción"><Home size={14} className="md:w-4 md:h-4"/> <span className="font-semibold">{property.sqft}m²C</span></span>}
                  {property.landSqft && <span className="flex items-center gap-1" title="Terreno"><Trees size={14} className="md:w-4 md:h-4"/> <span className="font-semibold">{property.landSqft}m²T</span></span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SECCIÓN DE IA PARA CLIENTES */}
        <div className="bg-slate-50 border border-indigo-100 rounded-3xl p-8 md:p-12 mb-16 animate-slide-up">
           <div className="max-w-3xl mx-auto text-center mb-8">
             <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">Herramienta Gratuita</span>
             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">¿Vendes tu casa por tu cuenta?</h2>
             <p className="text-gray-600 text-lg">Usa nuestra Inteligencia Artificial para crear una descripción irresistible para Facebook o Marketplace en segundos.</p>
           </div>
           
           <div className="max-w-2xl mx-auto transform hover:scale-[1.01] transition-transform duration-300">
             <AIListingGenerator onCopy={handlePublicCopy} />
             <p className="text-center text-xs text-gray-400 mt-4">Desarrollado por Vistura360 AI. ¿Prefieres que nosotros la vendamos? <button onClick={() => openWhatsApp("Quiero que Vistura venda mi casa")} className="text-indigo-600 font-bold hover:underline">Contáctanos</button></p>
           </div>
        </div>

      </main>
      <ContactSection />
    </>
  );
};

const PropertyDetailPage = ({ properties }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = properties.find(p => p.id.toString() === id);
  const [activeTab, setActiveTab] = useState('photos');
  const [currentMainImage, setCurrentMainImage] = useState('');

  useEffect(() => { 
    if (property) setCurrentMainImage(property.image); 
  }, [property]);

  if (!property) return <div className="min-h-screen flex items-center justify-center flex-col"><h2 className="text-2xl font-bold mb-4">Propiedad no encontrada</h2><button onClick={() => navigate('/')} className="text-yellow-600 underline font-bold">Volver al inicio</button></div>;

  const matterportSrc = property.matterportId ? `https://my.matterport.com/show/?m=${property.matterportId}&play=1` : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-slide-up">
      <button onClick={() => navigate(-1)} className="mb-6 text-gray-500 hover:text-slate-900 flex items-center gap-2 text-sm font-bold group"><span className="p-2 bg-gray-100 rounded-full group-hover:bg-yellow-400 transition-colors"><ChevronRight className="rotate-180" size={16}/></span>Volver atrás</button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col gap-2 mb-2"><div className="flex items-center gap-2 text-yellow-600 font-bold text-sm uppercase tracking-wide"><MapPin size={16}/> {property.location}</div><h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900">{property.title}</h1></div>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
            <button onClick={() => setActiveTab('photos')} className={`py-2 px-4 rounded-lg font-bold text-xs md:text-sm transition-all ${activeTab === 'photos' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Galería de Fotos</button>
            <button onClick={() => setActiveTab('360')} className={`py-2 px-4 rounded-lg font-bold text-xs md:text-sm transition-all flex items-center gap-2 ${activeTab === '360' ? 'bg-slate-900 text-yellow-400 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><PlayCircle size={16}/> Recorrido 360</button>
          </div>
          <div className="aspect-video bg-gray-100 rounded-3xl overflow-hidden shadow-2xl relative border-4 border-white ring-1 ring-gray-200">
            {activeTab === 'photos' ? (
              <img src={currentMainImage} className="w-full h-full object-cover animate-fade-in transition-all duration-300" onError={(e) => e.target.src = 'https://via.placeholder.com/800x600?text=No+Image'} />
            ) : (
              matterportSrc ? (
                <iframe width="100%" height="100%" src={matterportSrc} frameBorder="0" allowFullScreen allow="xr-spatial-tracking"></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400"><Camera size={48} className="mb-2 opacity-50"/><p>Recorrido Virtual no disponible</p></div>
              )
            )}
          </div>
          {activeTab === 'photos' && (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 animate-slide-up-delay-1">
              {property.gallery && property.gallery.map((img, idx) => (
                <div key={idx} onClick={() => setCurrentMainImage(img)} className={`cursor-pointer rounded-lg overflow-hidden h-14 w-full border-2 transition-all duration-200 shadow-sm ${currentMainImage === img ? 'border-yellow-400 scale-95 opacity-100 ring-2' : 'border-transparent opacity-80'}`}>
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-slate-200/50">
             <h3 className="text-xl md:text-2xl font-bold mb-4 text-slate-900">Descripción</h3>
             <p className="text-gray-600 leading-relaxed text-sm md:text-lg whitespace-pre-line">{property.description}</p>
             {/* DATOS COMPLETOS EN DETALLE */}
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mt-8">
               {property.beds && (<div className="text-center p-3 bg-gray-50 rounded-2xl"><Bed className="mx-auto mb-2 text-slate-400" size={24}/><span className="block font-bold text-lg">{property.beds}</span><span className="text-xs text-gray-400 font-bold uppercase">Recámaras</span></div>)}
               {property.baths && (<div className="text-center p-3 bg-gray-50 rounded-2xl"><Bath className="mx-auto mb-2 text-slate-400" size={24}/><span className="block font-bold text-lg">{property.baths}</span><span className="text-xs text-gray-400 font-bold uppercase">Baños</span></div>)}
               {property.parking && (<div className="text-center p-3 bg-gray-50 rounded-2xl"><Car className="mx-auto mb-2 text-slate-400" size={24}/><span className="block font-bold text-lg">{property.parking}</span><span className="text-xs text-gray-400 font-bold uppercase">Cocheras</span></div>)}
               {property.sqft && (<div className="text-center p-3 bg-gray-50 rounded-2xl"><Home className="mx-auto mb-2 text-slate-400" size={24}/><span className="block font-bold text-lg">{property.sqft}</span><span className="text-xs text-gray-400 font-bold uppercase">m² Const.</span></div>)}
               {property.landSqft && (<div className="text-center p-3 bg-gray-50 rounded-2xl"><Trees className="mx-auto mb-2 text-slate-400" size={24}/><span className="block font-bold text-lg">{property.landSqft}</span><span className="text-xs text-gray-400 font-bold uppercase">m² Terreno</span></div>)}
             </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 sticky top-28 animate-slide-up-delay-2">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">{property.price}</h2>
            <button onClick={() => openWhatsApp(`Hola, me interesa: ${property.title}`)} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold mb-3 hover:bg-slate-800 transition flex justify-center items-center gap-2">Agendar Visita</button>
            <button onClick={() => openWhatsApp(`Hola, quiero info sobre: ${property.title}`)} className="w-full bg-white border-2 border-slate-900 text-slate-900 py-4 rounded-xl font-bold hover:bg-gray-50 transition">WhatsApp</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServicesPage = () => (
  <div className="py-20 px-4 bg-slate-50 min-h-screen animate-slide-up">
    <div className="max-w-4xl mx-auto text-center mb-16"><h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Servicios para Propietarios</h2><p className="text-xl text-gray-500 max-w-2xl mx-auto">Tecnología de punta para vender o rentar más rápido.</p></div>
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group"><Camera size={48} className="text-slate-800 mb-6" /><h3 className="text-2xl font-bold mb-3">Tour 360 Basic</h3><p className="text-gray-500 mb-6 text-sm leading-relaxed">Perfecto para iniciar.</p><button onClick={() => openWhatsApp("Cotizar Basic")} className="w-full py-3 border-2 border-slate-900 rounded-xl font-bold">Cotizar</button></div>
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl transform md:-translate-y-6 hover:-translate-y-8 transition-all duration-300 relative overflow-hidden"><Users size={48} className="text-yellow-400 mb-6" /><h3 className="text-2xl font-bold mb-3">Tour Premium</h3><p className="text-gray-400 mb-6 text-sm leading-relaxed">La experiencia completa.</p><button onClick={() => openWhatsApp("Solicitar Premium")} className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 rounded-xl font-bold">Solicitar Ahora</button></div>
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"><Smartphone size={48} className="text-slate-800 mb-6" /><h3 className="text-2xl font-bold mb-3">Digital Twin</h3><p className="text-gray-500 mb-6 text-sm leading-relaxed">Soluciones empresariales.</p><button onClick={() => openWhatsApp("Info Digital Twin")} className="w-full py-3 border-2 border-slate-900 rounded-xl font-bold">Contactar</button></div>
    </div>
    <ContactSection />
  </div>
);

const AboutPage = () => (
  <div className="bg-slate-900 text-white min-h-screen pt-20 pb-20 px-4 relative overflow-hidden animate-slide-up">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-slate-800 to-transparent opacity-50"></div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-24 h-24 bg-yellow-400 rounded-full mx-auto mb-8 flex items-center justify-center text-slate-900"><Star size={40} /></div>
          <h1 className="text-4xl md:text-6xl font-bold mb-8">Sobre Nosotros</h1>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-12">En Vistura 360, creemos que comprar una casa no debería ser una apuesta a ciegas.</p>
          <div className="grid md:grid-cols-2 gap-8 text-left mb-16">
              <div className="bg-slate-800 p-6 rounded-2xl"><h3 className="font-bold text-yellow-400 text-xl mb-2">Misión</h3><p className="text-gray-300">Revolucionar el mercado inmobiliario.</p></div>
              <div className="bg-slate-800 p-6 rounded-2xl"><h3 className="font-bold text-yellow-400 text-xl mb-2">Visión</h3><p className="text-gray-300">Ser la referencia número uno en PropTech.</p></div>
          </div>
          <ContactSection />
      </div>
  </div>
);

// --- PANEL DE ADMINISTRACIÓN (VERSIÓN LOCAL) ---
const AdminPanel = ({ properties, setProperties }) => {
  const [newProp, setNewProp] = useState({
    title: '', location: '', price: '', type: 'venta', beds: '', baths: '', sqft: '', landSqft: '', parking: '', 
    imageFileName: '', // Ahora pedimos nombre de archivo, no URL completa
    matterportId: '', description: ''
  });
  const [additionalPhotos, setAdditionalPhotos] = useState([]);
  const [showCode, setShowCode] = useState(false);
  const [notification, setNotification] = useState(null);

  // Muestra notificaciones temporales
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const addPhotoInput = () => {
    if (additionalPhotos.length < 9) setAdditionalPhotos([...additionalPhotos, ""]);
    else showNotification("Máximo 10 fotos permitidas en total.");
  };

  const removePhotoInput = (index) => {
    const newPhotos = [...additionalPhotos];
    newPhotos.splice(index, 1);
    setAdditionalPhotos(newPhotos);
  };

  const updatePhotoValue = (index, value) => {
    const newPhotos = [...additionalPhotos];
    newPhotos[index] = value;
    setAdditionalPhotos(newPhotos);
  };

  // Genera el código JSON final para pegar en el archivo
  const generateCode = () => {
    // Convertimos el estado actual a la estructura final
    const mainImgPath = newProp.imageFileName ? `/propiedades/${newProp.imageFileName}` : '';
    const otherImgs = additionalPhotos.map(name => name ? `/propiedades/${name}` : '').filter(Boolean);
    const fullGallery = mainImgPath ? [mainImgPath, ...otherImgs] : [];

    const propertyToAdd = {
      ...newProp,
      id: Date.now(), // ID único basado en la fecha
      image: mainImgPath, // Ruta local automática
      gallery: fullGallery // La galería incluye la principal primero
    };
    
    // Creamos una lista nueva simulada para generar el código completo
    const updatedList = [...properties, propertyToAdd];
    return `const INITIAL_PROPERTIES = ${JSON.stringify(updatedList, null, 2)};`;
  };

  // Previsualización de la ruta local
  const previewPath = newProp.imageFileName ? `/propiedades/${newProp.imageFileName}` : '';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-slide-up">
      {notification && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-fade-in font-bold">
          {notification}
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="flex items-center gap-3 mb-8 border-b pb-4">
          <div className="p-3 bg-slate-900 rounded-xl text-yellow-400"><Lock size={24}/></div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Panel Admin (Modo Local)</h2>
            <p className="text-sm text-gray-500">Agrega propiedades con fotos guardadas en tu PC.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-bold text-gray-700 mb-2">Título</label><input type="text" className="w-full p-3 bg-gray-50 rounded-xl border outline-none" placeholder="Ej: Casa en el Bosque" value={newProp.title} onChange={e => setNewProp({...newProp, title: e.target.value})} /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-2">Precio</label><input type="text" className="w-full p-3 bg-gray-50 rounded-xl border outline-none" placeholder="Ej: $4,500,000" value={newProp.price} onChange={e => setNewProp({...newProp, price: e.target.value})} /></div>
            <div className="md:col-span-2"><label className="block text-sm font-bold text-gray-700 mb-2">Ubicación</label><input type="text" className="w-full p-3 bg-gray-50 rounded-xl border outline-none" placeholder="Ej: Centro, Cd. Guzmán" value={newProp.location} onChange={e => setNewProp({...newProp, location: e.target.value})} /></div>
          </div>

          {/* SECCIÓN DE FOTOS ACTUALIZADA */}
          <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><ImageIcon size={20}/> Gestión de Fotos Locales</h3>
            <p className="text-sm text-gray-600 mb-4">
              Guarda tus fotos en la carpeta: <code className="bg-white px-2 py-1 rounded border font-mono text-red-500">public/propiedades</code>
            </p>
            
            {/* Foto Principal */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Foto Principal (Portada)</label>
              <div className="flex gap-4 items-start">
                 <div className="flex-1">
                   <input type="text" className="w-full p-3 bg-white rounded-xl border outline-none font-mono text-sm border-yellow-400 ring-1 ring-yellow-400" placeholder="nombre-archivo-principal.jpg" value={newProp.imageFileName} onChange={e => setNewProp({...newProp, imageFileName: e.target.value})} />
                 </div>
                 <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden border-2 border-yellow-400 shadow-md shrink-0 relative group">
                    {newProp.imageFileName ? (
                      <img src={previewPath} alt="Principal" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                    ) : <div className="flex items-center justify-center h-full text-xs text-gray-400 text-center p-1">Sin foto</div>}
                    <div className="absolute bottom-0 left-0 right-0 bg-yellow-400 text-slate-900 text-[10px] font-bold text-center">PRINCIPAL</div>
                 </div>
              </div>
            </div>

            {/* Galería Adicional */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Galería Adicional</label>
                <button onClick={addPhotoInput} className="text-xs bg-slate-900 text-white px-3 py-1 rounded hover:bg-slate-700 font-bold transition">Ag + Foto</button>
              </div>
              <div className="space-y-3">
                {additionalPhotos.map((photoName, idx) => (
                  <div key={idx} className="flex gap-4 items-start animate-fade-in">
                    <span className="text-slate-400 font-mono text-xs pt-3">#{idx + 1}</span>
                    <div className="flex-1">
                      <input type="text" className="w-full p-2 bg-white rounded-lg border outline-none font-mono text-xs" placeholder="otra-foto.jpg" value={photoName} onChange={(e) => updatePhotoValue(idx, e.target.value)} />
                    </div>
                    <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden border shrink-0">
                       {photoName && <img src={`/propiedades/${photoName}`} className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />}
                    </div>
                    <button onClick={() => removePhotoInput(idx)} className="text-red-500 hover:text-red-700 p-2"><X size={16}/></button>
                  </div>
                ))}
                {additionalPhotos.length === 0 && <p className="text-xs text-gray-400 italic">No has agregado fotos extra.</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div><label className="block text-xs font-bold text-gray-700 mb-1">Recámaras</label><input type="text" className="w-full p-2 bg-gray-50 rounded-xl border" value={newProp.beds} onChange={e => setNewProp({...newProp, beds: e.target.value})} /></div>
            <div><label className="block text-xs font-bold text-gray-700 mb-1">Baños</label><input type="text" className="w-full p-2 bg-gray-50 rounded-xl border" value={newProp.baths} onChange={e => setNewProp({...newProp, baths: e.target.value})} /></div>
            <div><label className="block text-xs font-bold text-gray-700 mb-1">Cocheras</label><input type="text" className="w-full p-2 bg-gray-50 rounded-xl border" value={newProp.parking} onChange={e => setNewProp({...newProp, parking: e.target.value})} /></div>
            <div><label className="block text-xs font-bold text-gray-700 mb-1">M² Const.</label><input type="text" className="w-full p-2 bg-gray-50 rounded-xl border" value={newProp.sqft} onChange={e => setNewProp({...newProp, sqft: e.target.value})} /></div>
            <div><label className="block text-xs font-bold text-gray-700 mb-1">M² Terreno</label><input type="text" className="w-full p-2 bg-gray-50 rounded-xl border" value={newProp.landSqft} onChange={e => setNewProp({...newProp, landSqft: e.target.value})} /></div>
          </div>
          
          <div><label className="block text-sm font-bold text-gray-700 mb-2">Matterport ID</label><input type="text" className="w-full p-3 bg-gray-50 rounded-xl border outline-none" placeholder="Ej: SxQL3iGns8X" value={newProp.matterportId} onChange={e => setNewProp({...newProp, matterportId: e.target.value})} /></div>

          <div><label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label><textarea className="w-full p-3 bg-gray-50 rounded-xl border outline-none h-48" value={newProp.description} onChange={e => setNewProp({...newProp, description: e.target.value})}></textarea></div>

          <button onClick={() => setShowCode(true)} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition flex justify-center items-center gap-2">
            <Code size={20}/> Generar Código de Propiedad
          </button>
        </div>

        {showCode && (
          <div className="mt-8 p-6 bg-slate-900 rounded-2xl border border-slate-800 animate-fade-in relative">
             <div className="flex justify-between items-center mb-4 text-white">
                <h3 className="font-bold flex items-center gap-2"><Copy size={18} className="text-green-400"/> Código Generado</h3>
                <span className="text-xs text-gray-400">Copia esto y reemplaza INITIAL_PROPERTIES en tu código</span>
             </div>
             <textarea readOnly className="w-full h-64 bg-slate-950 p-4 rounded-xl text-xs font-mono text-green-400 border border-slate-800 focus:outline-none resize-none" value={generateCode()} />
             <button onClick={() => { navigator.clipboard.writeText(generateCode()); showNotification("¡Código Copiado!"); }} className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition">
               Copiar Código al Portapapeles
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminLogin = ({ onLogin }) => {
  const [pass, setPass] = useState("");
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <Lock className="mx-auto mb-4 text-slate-900" size={32}/>
        <h2 className="text-2xl font-bold mb-6">Acceso Propietario</h2>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Contraseña Maestra" className="w-full p-4 border rounded-xl mb-4 bg-gray-50 text-center text-lg" />
        <button onClick={()=>{ if(pass==="X9#mK2$vLp@5Rz!8") onLogin(true); }} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold">Entrar</button>
      </div>
    </div>
  );
};

const FloatingWhatsApp = () => (
  <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
    <button onClick={() => openWhatsApp()} className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center justify-center border-4 border-white active:scale-95 group"><svg viewBox="0 0 24 24" className="w-8 h-8 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></button>
  </div>
);

export default function App() {
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('visturaProperties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // BLOQUEO AUTOMÁTICO: Si la ruta cambia y no es '/admin', cierra sesión
  useEffect(() => {
    if (location.pathname !== '/admin') {
      setIsAuthenticated(false);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
      <GlobalStyles />
      <ScrollToTop />
      <Navbar />
      
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage properties={properties} />} />
          <Route path="/propiedad/:id" element={<PropertyDetailPage properties={properties} />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/nosotros" element={<AboutPage />} />
          <Route path="/admin" element={!isAuthenticated ? <AdminLogin onLogin={setIsAuthenticated} /> : <AdminPanel properties={properties} setProperties={setProperties} />} />
        </Routes>
      </div>

      <FloatingWhatsApp />
      
      {/* PIE DE PÁGINA ACTUALIZADO (Sin columnas extra) */}
      <footer className="bg-slate-900 text-gray-400 py-12 md:py-16 mt-auto border-t border-slate-800 animate-slide-up">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Columna 1: Marca y Redes */}
          <div className="flex flex-col items-start">
             <div className="flex items-center gap-2 mb-4 md:mb-6 text-white"><span className="text-xl md:text-2xl font-bold tracking-tight">Vistura<span className="text-yellow-500">360</span></span></div>
             <p className="text-xs md:text-sm leading-relaxed mb-6 max-w-sm">Revolucionando el mercado inmobiliario con tecnología inmersiva. Visitamos el futuro, hoy.</p>
             <div className="flex gap-4">
               <a href="https://www.facebook.com/Vistura360" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-slate-900 transition-colors cursor-pointer"><Facebook size={18}/></a>
               <a href="https://www.instagram.com/vistura360/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-slate-900 transition-colors cursor-pointer"><Instagram size={18}/></a>
             </div>
          </div>
          
          {/* Columna 2: Contacto (Alineado a la derecha en desktop) */}
          <div className="md:text-right flex flex-col md:items-end">
            <h4 className="text-white font-bold mb-4 md:mb-6 text-base md:text-lg">Contacto</h4>
            <ul className="space-y-3 md:space-y-4 text-xs md:text-sm">
              <li className="flex items-center gap-3 md:flex-row-reverse"><span className="p-2 bg-slate-800 rounded-full text-yellow-400"><MessageSquare size={14}/></span> contacto@vistura360.com</li>
              <li className="flex items-center gap-3 md:flex-row-reverse"><span className="p-2 bg-slate-800 rounded-full text-yellow-400"><Smartphone size={14}/></span> +52 (341) 147 9074</li>
              <li className="flex items-center gap-3 md:flex-row-reverse"><span className="p-2 bg-slate-800 rounded-full text-yellow-400"><MapPin size={14}/></span> Cd. Guzmán, Jalisco</li>
            </ul>
          </div>
        </div>
        
        {/* COPYRIGHT CON ACCESO SECRETO */}
        <div className="max-w-7xl mx-auto px-4 mt-12 md:mt-16 pt-8 border-t border-slate-800 text-center text-[10px] md:text-xs text-gray-600">
           <p>
             <span 
               onClick={() => navigate('/admin')} 
               className="cursor-default select-none hover:text-slate-500 transition-colors"
               title=""
             >
               ©
             </span> 
             2024 Vistura 360. Todos los derechos reservados.
           </p>
        </div>
      </footer>
    </div>
  );
}