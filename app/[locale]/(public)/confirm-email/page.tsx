"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, ShieldCheck, ArrowRight } from "lucide-react";

function ConfirmEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("success");
      setMessage("Tu cuenta ya se encuentra activa para operar. Puedes ingresar directamente con las credenciales que recibiste por correo electrónico.");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/confirm-email?token=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setStatus("success");
          setMessage(data.message || "¡Tu casilla de correo ha sido confirmada con éxito!");
          if (data.email) {
            setUserEmail(data.email);
          }
        } else {
          setStatus("error");
          setMessage(data.error || "El enlace de confirmación es inválido o ha expirado.");
        }
      } catch (err: any) {
        setStatus("error");
        setMessage("Ocurrió un error al conectar con el servidor de autenticación.");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#142612]/80 backdrop-blur-xl border border-white/15 rounded-3xl p-8 shadow-2xl shadow-emerald-950/40 text-center relative overflow-hidden transition-all duration-300">
        {/* Glow de fondo */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header con Logo */}
        <div className="flex justify-center items-center gap-2 mb-6 text-emerald-400 font-bold text-xl tracking-wide">
          <ShieldCheck className="w-7 h-7 text-emerald-400" />
          <span>KEY Protocol</span>
        </div>

        {/* Estado: CARGANDO */}
        {status === "loading" && (
          <div className="py-8 space-y-4">
            <Loader2 className="w-14 h-14 text-emerald-400 animate-spin mx-auto stroke-[2.5]" />
            <h2 className="text-xl font-semibold text-white tracking-tight">
              Verificando tu casilla...
            </h2>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              Estamos validando la autenticidad de tu token con el Servidor Central.
            </p>
          </div>
        )}

        {/* Estado: ÉXITO */}
        {status === "success" && (
          <div className="py-6 space-y-5 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 stroke-[2]" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                ¡Correo Confirmado!
              </h2>
              <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                {message}
              </p>
              {userEmail && (
                <div className="mt-3 inline-block px-3 py-1 bg-emerald-950/60 border border-emerald-500/30 rounded-lg text-emerald-300 font-mono text-xs">
                  {userEmail}
                </div>
              )}
            </div>

            <div className="pt-4">
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Iniciar Sesión en el Panel</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Estado: ERROR / EXPIRADO */}
        {status === "error" && (
          <div className="py-6 space-y-5 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-red-500/15 border border-red-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-500/10">
              <XCircle className="w-12 h-12 text-red-400 stroke-[2]" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                No se pudo confirmar
              </h2>
              <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                {message}
              </p>
            </div>

            <div className="pt-4 space-y-2">
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold py-3 px-6 rounded-xl transition-all border border-white/10"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[75vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
        </div>
      }
    >
      <ConfirmEmailContent />
    </Suspense>
  );
}
