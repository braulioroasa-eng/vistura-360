import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { 
  Search, MapPin, Bed, Bath, Home, Camera, 
  MessageSquare, X, Send, Menu, ChevronRight, 
  PlayCircle, Users, CheckCircle, Smartphone,
  Star, Lock, Car, Trees, Code, Copy, Eye, EyeOff,
  ImageIcon, Facebook, Instagram, Mail, Sparkles, Wand2, 
  Link as LinkIcon, Edit2, Trash2, Save, ArrowRight, Video, Globe,
  Ruler 
} from 'lucide-react';

// --- CONFIGURACIÓN DE GEMINI API ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const callGemini = async (prompt, systemInstruction = "") => {
  if (!apiKey) return "Error: Falta API Key en Vercel.";
  try {
    // CAMBIO CRÍTICO: Usamos el modelo ESTÁNDAR ACTUAL (Diciembre 2025)
    // 'gemini-2.5-flash' reemplaza a los modelos 1.5 y Pro que dan error 404.
    const model = "gemini-2.5-flash"; 
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
    
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contents: [{ 
            parts: [{ text: `${systemInstruction}\n\nTarea: ${prompt}` }] 
          }] 
        }),
    });
    
    const data = await response.json();
    
    if (data.error) {
        console.error("Error API:", data.error);
        if (data.error.code === 404) return "Error: Modelo no encontrado. Verifica la versión de la API.";
        if (data.error.code === 429) return "La IA está saturada. Intenta en un minuto.";
        return `Error: ${data.error.message}`;
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta.";
  } catch (error) { return "Error de conexión."; }
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
    "image": "/Propiedades/Coto N.jpg",
    "matterportId": "P32n2mSGnrQ",
    "description": "✨ ¡Oportunidad Única en Coto Privado! ✨\n\n🏡 Casa moderna lista para habitar\n📍 Ubicación privilegiada en Los Camichines\n🛡️ Seguridad y tranquilidad garantizada",
    "id": 1,
    "gallery": [
      "/Propiedades/Coto N.jpg",
      "/Propiedades/Coto N1.jpg",
      "/Propiedades/Coto N3.jpg",
      "/Propiedades/Coto N4.jpg",
      "/Propiedades/Coto N5.jpg",
      "/Propiedades/Coto N6.jpg",
      "/Propiedades/Coto N7.jpg",
      "/Propiedades/Coto N8.jpg"
    ],
    "imageFileName": "Coto N.jpg"
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
    "image": "/Propiedades/Santa M.jpg",
    "matterportId": "zLZPTdpz6m3",
    "description": "🏠 ¡TU NUEVO HOGAR TE ESPERA! 🏠\n\n📍 Excelente ubicación atrás de Walmart\n💰 Gran plusvalía garantizada\n🔑 Lista para escriturar",
    "id": 1765603133821,
    "gallery": [
      "/Propiedades/Santa M.jpg",
      "/Propiedades/Santa M1.jpg",
      "/Propiedades/Santa M2.jpg",
      "/Propiedades/Santa M4.jpg",
      "/Propiedades/Santa M5.jpg",
      "/Propiedades/Santa M6.jpg",
      "/Propiedades/Santa M7.jpg"
    ],
    "imageFileName": "Santa M.jpg"
  },
  {
    "title": "Residencial Camichines",
    "location": "Apolo #11, Los Camichines, C.P.49032, Cd. Guzmán, Jal.",
    "price": "$1,700,000",
    "type": "venta",
    "beds": "2",
    "baths": "1",
    "sqft": "68.3",
    "landSqft": "",
    "parking": "1",
    "image": "/Propiedades/Coto C.jpg",
    "matterportId": "13SKdXtUb3x",
    "description": "🏡✨ **¡Descubre Tu Paraíso Exclusivo en Residencial Camichines!** ✨🔑\n\nBienvenido al hogar donde el lujo, la privacidad y el confort se encuentran.",
    "id": 1766157031105,
    "gallery": [
      "/Propiedades/Coto C.jpg",
      "/Propiedades/Coto C1.jpg",
      "/Propiedades/Coto C2.jpg",
      "/Propiedades/Coto C3.jpg",
      "/Propiedades/Coto C4.jpg",
      "/Propiedades/Coto C5.jpg"
    ]
  },
  {
    "title": "Casa Darío Vargas",
    "location": "Darío Vargas #77, Col. Centro, Cd. Guzmán, Jal.",
    "price": "$14,000,000",
    "type": "venta",
    "beds": "9",
    "baths": "4",
    "sqft": "",
    "landSqft": "800",
    "parking": "3",
    "imageFileName": "DV.jpg",
    "matterportId": "dbSMMFEMo9o",
    "description": "",
    "id": 1767391030517,
    "image": "/Propiedades/DV.jpg",
    "gallery": [
      "/Propiedades/DV.jpg",
      "/Propiedades/DV1.jpg",
      "/Propiedades/DV2.jpg",
      "/Propiedades/DV3.jpg",
      "/Propiedades/DV4.jpg",
      "/Propiedades/DV5.jpg",
      "/Propiedades/DV6.jpg",
      "/Propiedades/DV7.jpg",
      "/Propiedades/DV8.jpg",
      "/Propiedades/DV9.jpg",
      "/Propiedades/DV10.jpg",
      "/Propiedades/DV11.jpg",
      "/Propiedades/DV12.jpg",
      "/Propiedades/DV13.jpg",
      "/Propiedades/DV14.jpg",
      "/Propiedades/DV15.jpg",
      "/Propiedades/DV16.jpg",
      "/Propiedades/DV17.jpg",
      "/Propiedades/DV18.jpg",
      "/Propiedades/DV19.jpg",
      "/Propiedades/DV20.jpg",
      "/Propiedades/DV21.jpg",
      "/Propiedades/DV22.jpg",
      "/Propiedades/DV23.jpg",
      "/Propiedades/DV24.jpg",
      "/Propiedades/DV25.jpg"
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
    html { scroll-behavior: smooth; }
  `}</style>
);

const openWhatsApp = (msg) => window.open(`https://wa.me/523411479074?text=${encodeURIComponent(msg || "Hola, info Vistura360")}`, '_blank');
const ScrollToTop = () => { const { pathname } = useLocation(); useEffect(() => { window.scrollTo(0, 0); }, [pathname]); return null; };

// --- COMPONENTES ---
const ContactSection = () => (
  <div className="max-w-7xl mx-auto px-4 py-16 animate-slide-up">
    <div className="bg-slate-900 rounded-3xl p-8 md:p-16 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-slate-800 to-transparent opacity-30 pointer-events-none"></div>
      <div className="relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">¿Tienes dudas o quieres agendar una cita?</h2>
        <p className="text-gray-400 mb-10 text-lg">Estamos listos para ayudarte a encontrar tu lugar ideal.</p>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <button onClick={() => openWhatsApp("Hola, quiero agendar una cita")} className="bg-yellow-400 text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition shadow-lg hover:scale-105 flex items-center gap-3 w-full md:w-auto justify-center">
              <Smartphone size={24}/> Contactar por WhatsApp
            </button>
            
            <div className="flex gap-4">
              <a href="https://www.facebook.com/Vistura360" target="_blank" rel="noopener noreferrer" className="bg-[#1877F2] hover:bg-[#166fe5] text-white px-6 py-4 rounded-full font-bold text-lg transition shadow-lg hover:scale-105 flex items-center gap-2">
                <Facebook size={24}/> Facebook
              </a>
              <a href="https://www.instagram.com/vistura360/" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 text-white px-6 py-4 rounded-full font-bold text-lg transition shadow-lg hover:scale-105 flex items-center gap-2">
                <Instagram size={24}/> Instagram
              </a>
            </div>
        </div>
      </div>
    </div>
  </div>
);

const AIListingGenerator = ({ onCopy }) => {
  const [features, setFeatures] = useState("");
  const [listingType, setListingType] = useState("venta");
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!features.trim()) return;
    setLoading(true); setGeneratedText("");
    
    // Prompt optimizado
    const systemInstruction = `Eres un copywriter inmobiliario experto. Escribe una descripción PERSUASIVA para una propiedad en ${listingType.toUpperCase()}. Usa Emojis y formato de Lista.`;
    const prompt = `Genera descripción para: ${features}`;

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
        <div className="flex gap-4 mb-4 flex-col md:flex-row">
           <select value={listingType} onChange={(e) => setListingType(e.target.value)} className="p-3 bg-white border border-indigo-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:border-indigo-500">
             <option value="venta">Para Venta</option>
             <option value="renta">Para Renta</option>
           </select>
           <input type="text" value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="Ej: 3 recámaras, jardín..." className="flex-1 p-3 bg-white border border-indigo-200 rounded-lg text-sm outline-none focus:border-indigo-500" />
        </div>
        <button onClick={handleGenerate} disabled={loading || !features} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-indigo-700 transition flex justify-center items-center gap-2 disabled:opacity-50">
          {loading ? "Generando magia..." : "Generar Descripción con IA"}
        </button>
        {generatedText && (
          <div className="mt-4 animate-fade-in">
            <div className="relative">
              <textarea readOnly className="w-full h-40 p-3 bg-white rounded-xl border border-indigo-200 text-sm text-slate-700 focus:outline-none resize-none shadow-inner" value={generatedText} />
              <button onClick={() => {navigator.clipboard.writeText(generatedText); alert("Copiado!")}} className="absolute top-2 right-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 p-1.5 rounded-lg transition text-xs font-bold flex items-center gap-1">
                <Copy size={14}/> Copiar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm px-4 py-3">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" onError={(e) => e.target.style.display='none'}/>
          <div className="flex flex-col"><span className="text-xl font-bold text-slate-800">Vistura<span className="text-yellow-600">360</span></span></div>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600 items-center">
          <Link to="/" className="hover:text-yellow-600 transition">Propiedades</Link>
          <Link to="/servicios" className="hover:text-yellow-600 transition">Servicios 360</Link>
          <Link to="/nosotros" className="hover:text-yellow-600 transition">Nosotros</Link>
        </div>
        <div className="hidden md:flex items-center gap-4">
           <button onClick={() => openWhatsApp("Hola, me interesa contratar un Tour 360")} className="bg-yellow-400 text-slate-900 px-5 py-2.5 rounded-full font-bold hover:bg-yellow-300 transition shadow-md text-sm flex items-center gap-2">
             <Camera size={18}/> Contratar Tour 360
           </button>
        </div>
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? <X/> : <Menu/>}</button>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t flex flex-col gap-3 pb-4">
          <button onClick={() => navigate('/')} className="text-left font-medium">Propiedades</button>
          <button onClick={() => navigate('/servicios')} className="text-left font-medium">Servicios 360</button>
          <button onClick={() => navigate('/nosotros')} className="text-left font-medium">Nosotros</button>
          <button onClick={() => openWhatsApp("Contratar Tour 360")} className="bg-yellow-400 text-slate-900 py-2 rounded-lg font-bold mt-2">Contratar Tour 360</button>
        </div>
      )}
    </nav>
  );
};

// --- PÁGINA PRINCIPAL ---
const HomePage = ({ properties }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('todos');
  const filteredProperties = filter === 'todos' ? properties : properties.filter(p => p.type === filter);
  
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
          <div className="animate-slide-up animate-float">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 tracking-tight drop-shadow-2xl">Descubre tu espacio <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-500 text-glow">antes de visitarlo</span></h1>
            <p className="text-sm md:text-xl lg:text-2xl text-gray-100 mb-8 md:mb-10 font-light drop-shadow-md max-w-2xl mx-auto bg-black/20 backdrop-blur-sm p-3 md:p-4 rounded-2xl border border-white/10">La inmobiliaria digital del futuro. Compra, renta o vende con recorridos inmersivos.</p>
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-10"><h2 className="text-2xl font-bold">Propiedades Destacadas</h2><div className="bg-gray-100 p-1 rounded-lg flex">{['todos', 'venta', 'renta'].map(f => <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 capitalize rounded-md text-sm font-bold ${filter===f ? 'bg-white shadow text-slate-900' : 'text-gray-500'}`}>{f}</button>)}</div></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredProperties.map(p => (
            <div key={p.id} onClick={() => navigate(`/propiedad/${p.id}`)} className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition border border-gray-100">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" onError={(e) => e.target.src = 'https://via.placeholder.com/600x400?text=Sin+Imagen'}/>
                <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded text-xs font-bold uppercase">{p.type}</div>
                {p.matterportId && <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><PlayCircle size={12} className="text-yellow-400"/> 360°</div>}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1 truncate">{p.title}</h3>
                <p className="text-xl font-bold text-slate-900 mb-2">{p.price}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-4 truncate"><MapPin size={12}/> {p.location}</p>
                
                <div className="flex gap-3 text-xs text-gray-500 border-t pt-3 flex-wrap">
                  {p.beds && <span className="flex items-center gap-1"><Bed size={14}/>{p.beds}</span>}
                  {p.baths && <span className="flex items-center gap-1"><Bath size={14}/>{p.baths}</span>}
                  {p.parking && <span className="flex items-center gap-1"><Car size={14}/>{p.parking}</span>}
                  {p.sqft && <span className="flex items-center gap-1"><Home size={14}/>{p.sqft}m² C</span>}
                  {p.landSqft && <span className="flex items-center gap-1"><Trees size={14}/>{p.landSqft}m² T</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <div className="max-w-7xl mx-auto px-4 mb-16">
         <div className="bg-slate-50 p-8 rounded-3xl border border-indigo-100">
           <div className="text-center mb-6"><h2 className="text-2xl font-bold">¿Vendes tu casa?</h2><p className="text-gray-500">Usa nuestra IA gratis</p></div>
           <AIListingGenerator onCopy={(t) => {navigator.clipboard.writeText(t); alert("Copiado!")}} />
         </div>
      </div>
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

  useEffect(() => { if (property) setCurrentMainImage(property.image); }, [property]);

  if (!property) return <div className="min-h-screen flex items-center justify-center flex-col"><h2 className="text-2xl font-bold">No encontrada</h2><button onClick={() => navigate('/')} className="underline">Volver</button></div>;

  const cleanMatterportId = property.matterportId?.includes('m=') 
    ? property.matterportId.match(/m=([^&]+)/)[1] 
    : property.matterportId;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-slide-up">
      <button onClick={() => navigate(-1)} className="mb-4 text-sm font-bold flex items-center gap-2"><ChevronRight className="rotate-180" size={16}/> Volver</button>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div><h1 className="text-3xl font-bold">{property.title}</h1><p className="text-gray-500 flex items-center gap-1"><MapPin size={16}/> {property.location}</p></div>
          <div className="flex gap-2 mb-2">
            <button onClick={() => setActiveTab('photos')} className={`px-4 py-2 rounded-lg font-bold text-sm ${activeTab==='photos' ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-500'}`}>Fotos</button>
            {cleanMatterportId && <button onClick={() => setActiveTab('360')} className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 ${activeTab==='360' ? 'bg-slate-900 text-yellow-400' : 'bg-gray-100 text-gray-500'}`}><PlayCircle size={16}/> Tour 360</button>}
          </div>
          <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden relative border shadow-sm">
            {activeTab === 'photos' ? (
              <img src={currentMainImage} className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://via.placeholder.com/800x600?text=Error+Carga'} />
            ) : (
              <iframe width="100%" height="100%" src={`https://my.matterport.com/show/?m=${cleanMatterportId}&play=1`} frameBorder="0" allowFullScreen></iframe>
            )}
          </div>
          {activeTab === 'photos' && (
            <div className="grid grid-cols-5 gap-2">
              {property.gallery && property.gallery.map((img, idx) => (
                <div key={idx} onClick={() => setCurrentMainImage(img)} className={`cursor-pointer rounded-lg overflow-hidden h-16 border-2 ${currentMainImage === img ? 'border-yellow-400' : 'border-transparent'}`}>
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
          <div className="bg-white p-6 rounded-2xl border">
             <h3 className="text-xl font-bold mb-4">Descripción</h3>
             <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
             <div className="grid grid-cols-3 gap-4 mt-6">
               <div className="text-center p-3 bg-gray-50 rounded-xl"><Bed className="mx-auto"/><span className="font-bold">{property.beds} Rec.</span></div>
               <div className="text-center p-3 bg-gray-50 rounded-xl"><Bath className="mx-auto"/><span className="font-bold">{property.baths} Baños</span></div>
               <div className="text-center p-3 bg-gray-50 rounded-xl"><Car className="mx-auto"/><span className="font-bold">{property.parking} Autos</span></div>
               <div className="text-center p-3 bg-gray-50 rounded-xl"><Home className="mx-auto"/><span className="font-bold">{property.sqft}m² Const.</span></div>
               <div className="text-center p-3 bg-gray-50 rounded-xl"><Trees className="mx-auto"/><span className="font-bold">{property.landSqft}m² Terr.</span></div>
             </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-lg border sticky top-24">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">{property.price}</h2>
            <button onClick={() => openWhatsApp(`Me interesa: ${property.title}`)} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold mb-3">Agendar Visita</button>
            <button onClick={() => openWhatsApp(`Info sobre: ${property.title}`)} className="w-full border-2 border-slate-900 text-slate-900 py-4 rounded-xl font-bold">WhatsApp</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PANEL DE ADMIN (CRUD MEJORADO CON ETIQUETAS Y MONEDA) ---
const AdminPanel = ({ properties, setProperties }) => {
  const emptyProp = { title: '', location: '', price: '', type: 'venta', beds: '', baths: '', sqft: '', landSqft: '', parking: '', imageFileName: '', matterportId: '', description: '' };
  const [formData, setFormData] = useState(emptyProp);
  const [additionalPhotos, setAdditionalPhotos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

  const handleEdit = (prop) => {
    setEditingId(prop.id);
    const imgName = prop.image?.replace('/Propiedades/', '').replace('https://', '') || '';
    const extraPhotos = prop.gallery ? prop.gallery.slice(1).map(url => url.replace('/Propiedades/', '')) : [];
    setFormData({ ...prop, imageFileName: imgName.startsWith('i.ibb') ? prop.image : imgName });
    setAdditionalPhotos(extraPhotos);
    window.scrollTo(0, 0);
  };

  const handlePriceChange = (e) => {
    let val = e.target.value.replace(/\D/g, ''); 
    if (!val) { setFormData({...formData, price: ''}); return; }
    const formatted = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(val);
    setFormData({ ...formData, price: formatted });
  };

  const handleSave = () => {
    let cleanMatt = formData.matterportId;
    if (cleanMatt && cleanMatt.includes('m=')) {
        const match = cleanMatt.match(/m=([^&]+)/);
        if (match) cleanMatt = match[1];
    }
    const isExternal = formData.imageFileName.startsWith('http');
    const mainImgPath = isExternal ? formData.imageFileName : `/Propiedades/${formData.imageFileName}`;
    const otherImgs = additionalPhotos.map(name => name.startsWith('http') ? name : `/Propiedades/${name}`).filter(Boolean);
    const fullGallery = mainImgPath ? [mainImgPath, ...otherImgs] : [];

    const finalProp = {
      ...formData,
      id: editingId || Date.now(),
      image: mainImgPath,
      gallery: fullGallery,
      matterportId: cleanMatt
    };

    if (editingId) {
      setProperties(prev => prev.map(p => p.id === editingId ? finalProp : p));
      showNotification("¡Propiedad Actualizada!");
    } else {
      setProperties(prev => [...prev, finalProp]);
      showNotification("¡Propiedad Creada!");
    }
    handleCancel();
  };

  const handleDelete = (id) => { if (window.confirm("¿Borrar?")) { setProperties(prev => prev.filter(p => p.id !== id)); showNotification("Eliminada"); } };
  const handleCancel = () => { setFormData(emptyProp); setAdditionalPhotos([]); setEditingId(null); };
  const generateCode = () => `const INITIAL_PROPERTIES = ${JSON.stringify(properties, null, 2)};`;
  const addPhotoInput = () => setAdditionalPhotos([...additionalPhotos, ""]);
  const updatePhotoValue = (i, val) => { const newP = [...additionalPhotos]; newP[i] = val; setAdditionalPhotos(newP); };
  const removePhotoInput = (i) => { const newP = [...additionalPhotos]; newP.splice(i, 1); setAdditionalPhotos(newP); };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-slide-up">
      {notification && <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50 font-bold">{notification}</div>}
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-slate-900">{editingId ? "✏️ Editando" : "➕ Nueva Propiedad"}</h2>
            {editingId && <button onClick={handleCancel} className="text-red-500 font-bold underline">Cancelar</button>}
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
               <div>
                 <label className="block text-xs font-bold text-gray-700 mb-1">Título de la Propiedad</label>
                 <input type="text" className="p-3 bg-gray-50 rounded-xl border w-full" placeholder="Ej: Casa en el Bosque" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-700 mb-1">Precio (Se formatea automático)</label>
                 <input type="text" className="p-3 bg-gray-50 rounded-xl border w-full" placeholder="$0" value={formData.price} onChange={handlePriceChange} />
               </div>
            </div>
            <div>
               <label className="block text-xs font-bold text-gray-700 mb-1">Ubicación</label>
               <input type="text" className="p-3 bg-gray-50 rounded-xl border w-full" placeholder="Dirección completa" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
               <div className="flex items-center gap-2 mb-2"><ImageIcon size={18}/> <span className="font-bold text-xs uppercase text-slate-700">Fotos (Carpeta: /public/Propiedades/)</span></div>
               <input type="text" className="w-full p-2 bg-white border rounded mb-2 font-mono text-sm" placeholder="Principal: casa.jpg" value={formData.imageFileName} onChange={e => setFormData({...formData, imageFileName: e.target.value})} />
               {additionalPhotos.map((p, i) => (
                 <div key={i} className="flex gap-2 mb-2">
                   <input type="text" className="flex-1 p-2 bg-white border rounded font-mono text-sm" value={p} onChange={(e) => updatePhotoValue(i, e.target.value)} placeholder={`Foto ${i+1}`} />
                   <button onClick={() => removePhotoInput(i)} className="text-red-500"><X size={16}/></button>
                 </div>
               ))}
               <button onClick={addPhotoInput} className="text-xs bg-slate-900 text-white px-3 py-1 rounded font-bold">+ Agregar Foto</button>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
               <div className="flex items-center gap-2 mb-2"><Camera size={18}/> <span className="font-bold text-xs uppercase text-slate-700">Recorrido Virtual</span></div>
               <input type="text" className="w-full p-2 bg-white border rounded text-sm" placeholder="Pega el link de Matterport..." value={formData.matterportId} onChange={e => setFormData({...formData, matterportId: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">RECÁMARAS</label>
                <input type="text" placeholder="#" className="p-2 border rounded w-full" value={formData.beds} onChange={e => setFormData({...formData, beds: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">BAÑOS</label>
                <input type="text" placeholder="#" className="p-2 border rounded w-full" value={formData.baths} onChange={e => setFormData({...formData, baths: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">COCHERAS</label>
                <input type="text" placeholder="#" className="p-2 border rounded w-full" value={formData.parking} onChange={e => setFormData({...formData, parking: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">M² CONSTRUCCIÓN</label>
                <input type="text" placeholder="Ej: 120" className="p-2 border rounded w-full" value={formData.sqft} onChange={e => setFormData({...formData, sqft: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">M² TERRENO</label>
                <input type="text" placeholder="Ej: 160" className="p-2 border rounded w-full" value={formData.landSqft} onChange={e => setFormData({...formData, landSqft: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Descripción Detallada</label>
              <textarea className="w-full p-3 bg-gray-50 rounded-xl border h-32" placeholder="Describe la propiedad..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>

            <button onClick={handleSave} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg hover:-translate-y-1 transition">
              <Save size={20}/> {editingId ? "Guardar Cambios" : "Crear Propiedad"}
            </button>
            <button onClick={() => setShowCode(!showCode)} className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2">
              <Code size={20}/> {showCode ? "Ocultar Código JSON" : "Generar Código JSON"}
            </button>
          </div>
          
          {showCode && (
             <div className="mt-4 p-4 bg-slate-900 rounded-xl relative">
               <div className="absolute top-2 right-2 text-xs text-gray-400">Copia esto en INITIAL_PROPERTIES</div>
               <textarea readOnly className="w-full h-40 bg-slate-950 text-green-400 text-xs font-mono p-2 border border-slate-700 rounded" value={generateCode()} />
               <button onClick={() => {navigator.clipboard.writeText(generateCode()); showNotification("¡Código Copiado!");}} className="mt-2 w-full bg-white/10 text-white py-2 rounded text-xs font-bold hover:bg-white/20">Copiar</button>
             </div>
          )}
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-lg border border-gray-100 h-[800px] overflow-y-auto">
          <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2"><Home size={20}/> Inventario ({properties.length})</h3>
          <div className="space-y-3">
            {properties.map(p => (
              <div key={p.id} className="flex gap-3 items-center p-3 bg-gray-50 rounded-xl border hover:border-yellow-400 transition group relative">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden shrink-0 border">
                  <img src={p.image} className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://via.placeholder.com/100?text=Error'}/>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs truncate uppercase text-slate-700">{p.title}</h4>
                  <p className="text-xs text-green-600 font-bold">{p.price}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(p)} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition" title="Editar"><Edit2 size={16}/></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition" title="Borrar"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutPage = () => (
  <div className="bg-slate-900 text-white min-h-screen animate-slide-up">
      <div className="relative py-24 px-4 text-center overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
         <div className="relative z-10 max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-yellow-400 rounded-2xl mx-auto mb-8 flex items-center justify-center text-slate-900 shadow-xl rotate-3"><Star size={36} /></div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Somos <span className="text-yellow-400">Vistura 360</span></h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Más que una inmobiliaria, somos tu puente hacia el futuro. Transformamos la manera de encontrar hogar con tecnología inmersiva.
            </p>
         </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16">
         <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition group">
               <div className="p-4 bg-blue-500/20 text-blue-400 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform"><Camera size={32}/></div>
               <h3 className="text-2xl font-bold mb-4">Tecnología 360°</h3>
               <p className="text-gray-400 leading-relaxed">Visitamos cada propiedad digitalmente para que tú no pierdas tiempo. Recorridos virtuales de alta definición en cada anuncio.</p>
            </div>
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition group">
               <div className="p-4 bg-green-500/20 text-green-400 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform"><Users size={32}/></div>
               <h3 className="text-2xl font-bold mb-4">Transparencia Total</h3>
               <p className="text-gray-400 leading-relaxed">Sin letras chiquitas. Te mostramos cada rincón, cada detalle y cada documento con total claridad antes de firmar.</p>
            </div>
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition group">
               <div className="p-4 bg-yellow-500/20 text-yellow-400 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform"><Star size={32}/></div>
               <h3 className="text-2xl font-bold mb-4">Trato Humano</h3>
               <p className="text-gray-400 leading-relaxed">Detrás de la tecnología hay expertos apasionados listos para asesorarte en la compra o venta de tu patrimonio.</p>
            </div>
         </div>
         <div className="grid md:grid-cols-2 gap-12 items-center bg-slate-800 rounded-3xl p-8 md:p-12 border border-slate-700">
            <div>
               <h3 className="text-yellow-400 font-bold tracking-widest uppercase text-sm mb-4">Nuestra Esencia</h3>
               <h2 className="text-3xl md:text-4xl font-bold mb-6">Misión & Visión</h2>
               <div className="space-y-6">
                  <div className="flex gap-4">
                     <div className="w-1 bg-yellow-400 rounded-full h-full min-h-[80px]"></div>
                     <div>
                        <h4 className="font-bold text-xl text-white mb-2">Misión</h4>
                        <p className="text-gray-400">Revolucionar el mercado inmobiliario en Cd. Guzmán ofreciendo experiencias de compra seguras, rápidas e inmersivas.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-1 bg-blue-500 rounded-full h-full min-h-[80px]"></div>
                     <div>
                        <h4 className="font-bold text-xl text-white mb-2">Visión</h4>
                        <p className="text-gray-400">Ser la referencia número uno en PropTech (Tecnología Inmobiliaria) en toda la región sur de Jalisco.</p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="relative h-64 md:h-full min-h-[300px] rounded-2xl overflow-hidden shadow-2xl">
               <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Edificio moderno" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition duration-700"/>
            </div>
         </div>
      </div>
      <ContactSection />
  </div>
);

const ServicesPage = () => (
  <div className="bg-slate-50 min-h-screen animate-slide-up">
    <div className="bg-slate-900 text-white py-20 px-4 text-center relative overflow-hidden">
       <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 to-slate-900"></div>
       <div className="relative z-10 max-w-3xl mx-auto">
         <h1 className="text-4xl md:text-5xl font-bold mb-4">Servicios para Propietarios</h1>
         <p className="text-xl text-gray-400">Tecnología de punta para vender o rentar más rápido.</p>
       </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-8">
       <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-2xl transition duration-300 group">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-slate-900 mb-6 group-hover:scale-110 transition"><Camera size={32}/></div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Tour 360 Basic</h3>
          <p className="text-gray-600 mb-6">Perfecto para iniciar. Muestra tu propiedad con recorridos básicos de alta calidad.</p>
          <button onClick={() => openWhatsApp("Cotizar Basic")} className="w-full py-3 border-2 border-slate-900 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition">Cotizar</button>
       </div>
       <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl transform md:-translate-y-4 hover:-translate-y-6 transition duration-300 relative overflow-hidden">
          <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center text-slate-900 mb-6"><Users size={32}/></div>
          <h3 className="text-2xl font-bold mb-3">Tour Premium</h3>
          <p className="text-gray-400 mb-6">La experiencia completa. Incluye mayor detalle, puntos de interés y soporte prioritario.</p>
          <button onClick={() => openWhatsApp("Solicitar Premium")} className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-bold rounded-xl hover:opacity-90 transition">Solicitar Ahora</button>
       </div>
       <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-2xl transition duration-300 group">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-slate-900 mb-6 group-hover:scale-110 transition"><Smartphone size={32}/></div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Digital Twin</h3>
          <p className="text-gray-600 mb-6">Soluciones empresariales. Gemelos digitales exactos para gestión y mantenimiento.</p>
          <button onClick={() => openWhatsApp("Info Digital Twin")} className="w-full py-3 border-2 border-slate-900 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition">Contactar</button>
       </div>
    </div>
    <ContactSection />
  </div>
);

const AdminLogin = ({ onLogin }) => {
  const [pass, setPass] = useState("");
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <Lock className="mx-auto mb-4 text-slate-900" size={32}/>
        <h2 className="text-2xl font-bold mb-6">Acceso Propietario</h2>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Contraseña Maestra" className="w-full p-4 border rounded-xl mb-4 text-center text-lg" />
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

  useEffect(() => { if (location.pathname !== '/admin') setIsAuthenticated(false); }, [location]);
  useEffect(() => { localStorage.setItem('visturaProperties', JSON.stringify(properties)); }, [properties]);

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
      
      {/* FOOTER COMPLETO Y RESTAURADO */}
      <footer className="bg-slate-900 text-gray-400 py-12 md:py-16 mt-auto border-t border-slate-800 animate-slide-up">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Columna Izquierda */}
          <div className="flex flex-col items-start">
             <div className="flex items-center gap-2 mb-4 md:mb-6 text-white"><span className="text-xl md:text-2xl font-bold tracking-tight">Vistura<span className="text-yellow-500">360</span></span></div>
             <p className="text-xs md:text-sm leading-relaxed mb-6 max-w-sm">Revolucionando el mercado inmobiliario con tecnología inmersiva. Visitamos el futuro, hoy.</p>
             <div className="flex gap-4">
               <a href="https://www.facebook.com/Vistura360" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-slate-900 transition-colors cursor-pointer"><Facebook size={18}/></a>
               <a href="https://www.instagram.com/vistura360/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-slate-900 transition-colors cursor-pointer"><Instagram size={18}/></a>
             </div>
          </div>
          
          {/* Columna Derecha (Contacto Detallado) */}
          <div className="md:text-right flex flex-col md:items-end">
            <h4 className="text-white font-bold mb-4 md:mb-6 text-base md:text-lg">Contacto</h4>
            <ul className="space-y-3 md:space-y-4 text-xs md:text-sm">
              <li className="flex items-center gap-3 md:flex-row-reverse"><span className="p-2 bg-slate-800 rounded-full text-yellow-400"><MessageSquare size={14}/></span> contacto@vistura360.com</li>
              <li className="flex items-center gap-3 md:flex-row-reverse"><span className="p-2 bg-slate-800 rounded-full text-yellow-400"><Smartphone size={14}/></span> +52 (341) 147 9074</li>
              <li className="flex items-center gap-3 md:flex-row-reverse"><span className="p-2 bg-slate-800 rounded-full text-yellow-400"><MapPin size={14}/></span> Cd. Guzmán, Jalisco</li>
            </ul>
          </div>
        </div>
        
        {/* Copyright con Admin Secreto */}
        <div className="max-w-7xl mx-auto px-4 mt-12 md:mt-16 pt-8 border-t border-slate-800 text-center text-[10px] md:text-xs text-gray-600">
           <p>
             <span 
               onClick={() => navigate('/admin')} 
               className="cursor-pointer hover:text-slate-500 transition-colors"
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
