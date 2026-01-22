
import React from 'react';
import { Mail, HelpCircle, ShieldCheck, FileText, Send } from 'lucide-react';

const PageHeader: React.FC<{ title: string; icon: any; color: string }> = ({ title, icon: Icon, color }) => (
  <div className="flex items-center gap-4 mb-12">
    <div className={`p-4 rounded-2xl ${color} text-white shadow-lg`}>
      <Icon size={32} />
    </div>
    <h1 className="text-4xl font-black">{title}</h1>
  </div>
);

export const FAQ = () => (
  <div className="max-w-4xl mx-auto py-12">
    <PageHeader title="Perguntas Frequentes" icon={HelpCircle} color="bg-blue-600" />
    <div className="space-y-6">
      {[
        { q: "O Giga Wall JFL é gratuito?", a: "Sim, a navegação e o consumo de conteúdo básico são totalmente gratuitos." },
        { q: "Como me torno um criador?", a: "Você deve ter mais de 18 anos e solicitar a verificação através do painel de usuário." },
        { q: "Onde ficam armazenados os arquivos?", a: "Todos os arquivos são hospedados em nossos servidores independentes para garantir autonomia." }
      ].map((item, i) => (
        <div key={i} className="bg-[#111] border border-gray-800 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-2 text-blue-400">{item.q}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
        </div>
      ))}
    </div>
  </div>
);

export const PrivacyPolicy = () => (
  <div className="max-w-4xl mx-auto py-12 leading-relaxed text-gray-300">
    <PageHeader title="Política de Privacidade" icon={ShieldCheck} color="bg-emerald-600" />
    <div className="bg-[#111] border border-gray-800 rounded-3xl p-10 space-y-6">
      <p>Sua privacidade é fundamental. No Giga Wall JFL, coletamos apenas os dados necessários para o seu login e personalização de experiência.</p>
      <h3 className="text-xl font-bold text-white">Dados Coletados</h3>
      <p>Email, Nome de Usuário, Nacionalidade e Histórico de atividade local.</p>
      <h3 className="text-xl font-bold text-white">Uso de Dados</h3>
      <p>Não compartilhamos seus dados com terceiros para fins publicitários externos.</p>
    </div>
  </div>
);

export const TermsOfUse = () => (
  <div className="max-w-4xl mx-auto py-12 leading-relaxed text-gray-300">
    <PageHeader title="Termos de Uso" icon={FileText} color="bg-purple-600" />
    <div className="bg-[#111] border border-gray-800 rounded-3xl p-10 space-y-6">
      <p>Ao utilizar nossa plataforma, você concorda com as seguintes regras:</p>
      <ul className="list-disc ml-6 space-y-2">
        <li>Proibido o upload de conteúdo ilegal ou que infrinja direitos autorais.</li>
        <li>O respeito mútuo no sistema de comentários é obrigatório.</li>
        <li>Conteúdos sensíveis devem ser devidamente marcados com restrição de idade.</li>
      </ul>
    </div>
  </div>
);

export const Contact = () => (
  <div className="max-w-4xl mx-auto py-12">
    <PageHeader title="Contacto Direto" icon={Mail} color="bg-red-600" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-6">
        <p className="text-gray-400">Precisa de ajuda ou quer reportar um erro? Nossa equipe está pronta para responder.</p>
        <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 flex items-center gap-4">
          <Mail className="text-red-500" />
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Email Oficial</p>
            <p className="font-bold">gigawalljfl@gmail.com</p>
          </div>
        </div>
      </div>
      <form className="bg-[#111] border border-gray-800 rounded-3xl p-8 space-y-4">
        <input type="text" placeholder="Seu Nome" className="w-full bg-black border border-gray-800 rounded-xl p-3 text-sm focus:border-red-500 outline-none" />
        <input type="email" placeholder="Seu Email" className="w-full bg-black border border-gray-800 rounded-xl p-3 text-sm focus:border-red-500 outline-none" />
        <textarea placeholder="Mensagem" className="w-full bg-black border border-gray-800 rounded-xl p-3 text-sm focus:border-red-500 outline-none min-h-[150px]" />
        <button className="w-full py-3 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2">
          <Send size={18} /> Enviar Mensagem
        </button>
      </form>
    </div>
  </div>
);
