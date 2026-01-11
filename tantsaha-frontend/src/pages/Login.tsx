 import { useEffect, useRef,useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

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
  const [telephone, setTelephone] = useState("");
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
      const speed = Math.random() * 1.5 + 0.8; // vitesse douce mais visible

      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: Math.random() * 180 + 120, // ⭐ plus long
        opacity: 1,
        size: Math.random() * 1.5 + 0.5, // ⭐ petites étoiles
      });
    };

    // quantité modérée
    for (let i = 0; i < 35; i++) createStar();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star, index) => {
        // Traînée
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - star.vx * 6, star.y - star.vy * 6);
        ctx.strokeStyle = `rgba(255,255,255,${star.opacity * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Étoile (point lumineux)
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
        ctx.fill();

        // Mouvement
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
     🔐 LOGIN
  =============================== */
 const handleLogin = async () => {
  if (!telephone) return alert("Entrez un numéro");

  try {
    const response = await loginUser(telephone);

    // 💡 Attention ici : ton backend renvoie le token dans 'response.data.token'
    if (response.success && response.data.token) {
      localStorage.setItem("token", response.data.token);
      
      // Optionnel : tu peux aussi stocker les infos de l'utilisateur
      localStorage.setItem("user", JSON.stringify(response.data.utilisateur));

      navigate("/app");
    }
  } catch (error) {
    console.error("Erreur détaillée :", error);
    alert("Problème de connexion. Vérifiez votre numéro (10 chiffres).");
  }
};

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
      
      {/* ⭐ Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />

      {/* 🧱 Login */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md p-8 shadow-2xl bg-white/85 backdrop-blur-md rounded-xl">
          
          <h1 className="text-3xl font-semibold text-center text-gray-800">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-center text-gray-600">
            Log in to continue
          </p>

          <div className="mt-8">
            <label className="block mb-1 text-sm text-gray-600">
              Phone number
            </label>
            <input
            type="tel"
            value={telephone} // L'input affiche la valeur de notre variable
            onChange={(e) => setTelephone(e.target.value)} // On met à jour la variable à chaque touche pressée
            placeholder="034 12 345 67"
            className="w-full py-2 text-gray-700 bg-transparent border-b border-gray-300 outline-none focus:border-teal-500"
            />
          </div>
 
          <button
            onClick={handleLogin}
            className="w-full py-3 mt-8 font-semibold text-white transition rounded-md shadow-lg bg-gradient-to-r from-teal-500 to-teal-600 hover:to-teal-700"
          >
            LOG IN
          </button>
 
        </div>
      </div>
    </div>
  );
};

export default Login;
