 import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore"; // À créer (voir instructions précédentes)

type ShootingStar = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  opacity: number;
  size: number;
};

const Login = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  
  // État pour le formulaire
  const [prefixe, setPrefixe] = useState("032");
  const [numero, setNumero] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [erreur, setErreur] = useState("");
  
  // Récupération de la fonction login depuis le store
  const { login } = useAuthStore();

  /* ===============================
     ⭐ ÉTOILES FILANTES (PARTOUT)
  =============================== */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const stars: ShootingStar[] = [];

    const createStar = () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.8;

      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: Math.random() * 180 + 120,
        opacity: 1,
        size: Math.random() * 1.5 + 0.5,
      });
    };

    for (let i = 0; i < 35; i++) createStar();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star, index) => {
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - star.vx * 6, star.y - star.vy * 6);
        ctx.strokeStyle = `rgba(255,255,255,${star.opacity * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
        ctx.fill();

        star.x += star.vx;
        star.y += star.vy;
        star.life -= 1;
        star.opacity -= 0.005;

        if (
          star.life <= 0 ||
          star.opacity <= 0 ||
          star.x < 0 ||
          star.y < 0 ||
          star.x > canvas.width ||
          star.y > canvas.height
        ) {
          stars.splice(index, 1);
          createStar();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* ===============================
     🔐 LOGIN AVEC REDIRECTION INTELLIGENTE
  =============================== */
  const validerNumero = (num: string): boolean => {
    // Supprime tous les espaces et vérifie que c'est exactement 7 chiffres
    const chiffresSeuls = num.replace(/\s/g, '');
    return /^\d{7}$/.test(chiffresSeuls);
  };

  const formaterNumero = (num: string): string => {
    // Retire les espaces pour l'envoi au backend
    return num.replace(/\s/g, '');
  };

  const handleLogin = async () => {
    setErreur("");
    
    // Validation du numéro
    if (!validerNumero(numero)) {
      setErreur("Veuillez entrer 7 chiffres (ex: 12 345 67)");
      return;
    }

    setIsLoading(true);
    
    try {
      // Construction du numéro complet: préfixe + 7 chiffres (ex: 0321234567)
      const numeroComplet = prefixe + formaterNumero(numero);
      
      // 1. Appel à votre backend
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            telephone: numeroComplet, // 10 chiffres: 0321234567
            prefixe: "+261", // Toujours +261 pour Madagascar
          }),
        }
      );

      const data = await response.json();

      // Vérification de la réponse
      if (!data.success) {
        throw new Error(data.message || "Échec de connexion");
      }

      // 2. Stockage dans Zustand
      if (login) {
        login({
          token: data.token || "temp-token",
          utilisateur: data.utilisateur,
          dernierParcours: data.dernierParcours || null,
          estNouvelUtilisateur: data.estNouvelUtilisateur || false,
        });
      }

      // 3. LOGIQUE DE REDIRECTION INTELLIGENTE
      let redirectPath = "/app";

      if (data.estNouvelUtilisateur) {
        redirectPath = "/app";
      } else if (data.dernierParcours) {
        switch (data.dernierParcours.type_action) {
          case "view_weather":
            redirectPath = "/app/weather";
            break;
          case "view_alerts":
            redirectPath = "/app/alerts";
            break;
          case "add_journal_entry":
            redirectPath = "/app/journal";
            break;
          case "view_advice":
            redirectPath = "/app/advice";
            break;
          default:
            redirectPath = "/app";
        }
      }

      console.log(`Redirection vers: ${redirectPath}`);
      navigate(redirectPath);

    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      setErreur(error.message || "Impossible de se connecter au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  /* ===============================
     🎨 RENDU - FORMULAIRE ADAPTÉ POUR MADAGASCAR
  =============================== */
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
      
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md p-8 shadow-2xl bg-white/85 backdrop-blur-md rounded-xl">
          
          <h1 className="text-3xl font-semibold text-center text-gray-800">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-center text-gray-600">
            Log in to continue
          </p>

          <div className="mt-8 space-y-6">
            {/* Sélecteur de préfixe malgache */}
            <div className="flex space-x-2">
              <div className="w-1/3">
                <label className="block mb-1 text-sm text-gray-600">
                  Préfixe
                </label>
                <select
                  value={prefixe}
                  onChange={(e) => setPrefixe(e.target.value)}
                  className="w-full py-2 text-gray-700 bg-transparent border-b border-gray-300 outline-none focus:border-teal-500"
                >
                  <option value="032">032</option>
                  <option value="033">033</option>
                  <option value="034">034</option>
                  <option value="038">038</option>
                  <option value="037">037</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block mb-1 text-sm text-gray-600">
                  Numéro (7 chiffres)
                </label>
                <input
                  type="tel"
                  value={numero}
                  onChange={(e) => {
                    // Permet seulement chiffres et espaces
                    const val = e.target.value.replace(/[^\d\s]/g, '');
                    // Formate automatiquement: XX XXX XX
                    let formatted = val.replace(/\s/g, '');
                    if (formatted.length > 2) {
                      formatted = formatted.substring(0, 2) + ' ' + formatted.substring(2);
                    }
                    if (formatted.length > 6) {
                      formatted = formatted.substring(0, 6) + ' ' + formatted.substring(6);
                    }
                    setNumero(formatted.substring(0, 9)); // Max: 2 3 2 = 7 chiffres + 2 espaces
                  }}
                  placeholder="12 345 67"
                  className="w-full py-2 text-gray-700 bg-transparent border-b border-gray-300 outline-none focus:border-teal-500"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Format: 7 chiffres (ex: 12 345 67)
                </p>
              </div>
            </div>

            {/* Message d'erreur */}
            {erreur && (
              <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
                {erreur}
              </div>
            )}

            {/* Bouton de connexion */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="flex items-center justify-center w-full py-3 mt-4 font-semibold text-white transition rounded-md shadow-lg bg-gradient-to-r from-teal-500 to-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  Connexion...
                </>
              ) : (
                "SE CONNECTER"
              )}
            </button>

            {/* Info format numéro */}
            <div className="p-3 text-xs text-gray-600 rounded-md bg-gray-50">
              <p className="font-medium">Format attendu :</p>
              <p className="mt-1">• Préfixe : 032, 033, 034, 038 ou 037</p>
              <p className="mt-1">• Numéro : 7 chiffres (exemple : 12 345 67)</p>
              <p className="mt-1">• Numéro complet envoyé : {prefixe}{formaterNumero(numero) || "1234567"}</p>
            </div>
          </div>

          <div className="mt-3 text-sm text-center text-gray-600">
            Pas encore de compte ?{" "}
            <a href="#" className="font-medium text-teal-600">
              S'inscrire
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;