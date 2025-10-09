import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export default function PopulateBooks() {
  const [status, setStatus] = useState('Iniciando...');
  const navigate = useNavigate();

  useEffect(() => {
    const populate = async () => {
      try {
        setStatus('Buscando e cadastrando livros de desenvolvimento pessoal...');
        
        const { data, error } = await supabase.functions.invoke('populate-personal-development');
        
        if (error) {
          setStatus(`Erro: ${error.message}`);
          console.error('Error:', error);
        } else {
          setStatus(`Sucesso! ${data.totalInserted} livros cadastrados. ${data.totalSkipped} duplicados ignorados.`);
          console.log('Success:', data);
          
          // Redirect after 3 seconds
          setTimeout(() => {
            navigate('/explore');
          }, 3000);
        }
      } catch (err) {
        setStatus(`Erro: ${err instanceof Error ? err.message : 'Unknown error'}`);
        console.error(err);
      }
    };

    populate();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Cadastrando Livros</h1>
        <p className="text-lg">{status}</p>
      </div>
    </div>
  );
}
