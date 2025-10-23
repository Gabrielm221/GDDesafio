import { useState } from "react";
import { LogoSecondary } from "../components/logoo";
import InputField from "../components/InputField";
import { Mail } from "react-feather";
import { ButtonPrimary } from "../components/Button";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/recuperar-senha`, {
        email,
      });

      setSuccessMessage("Link de redefinição enviado para o e-mail!");
      setError("");
    } catch (err: any) {
      setError("Erro ao enviar o e-mail. Tente novamente.");
      setSuccessMessage("");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <div className="flex justify-center mb-6">
          <LogoSecondary size={140} />
        </div>

        <h2 className="text-xl font-semibold text-center mb-4">Esqueceu sua senha?</h2>
        <p className="text-sm text-center mb-6 text-gray-500">
          Insira seu e-mail e enviaremos um link para redefinir sua senha.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<Mail size={20} />}
          />

          <ButtonPrimary type="submit">Enviar</ButtonPrimary>

          {successMessage && <p className="text-green-600 text-sm text-center">{successMessage}</p>}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
