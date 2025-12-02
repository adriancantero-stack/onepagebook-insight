export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML or Markdown content
  coverImage?: string;
  author: string;
  date: string;
  language: 'pt' | 'en' | 'es';
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'habitos-atomicos',
    title: 'Hábitos Atômicos: Pequenas Mudanças, Resultados Impressionantes (Resumo 2025)',
    excerpt: 'Descubra o resumo completo de Hábitos Atômicos, de James Clear. Entenda como pequenas mudanças diárias podem transformar sua vida e criar hábitos duradouros.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100">
          O livro <strong>Hábitos Atômicos</strong>, de James Clear, se tornou um dos maiores guias do mundo sobre mudança de comportamento. A ideia central é simples: mudanças pequenas, feitas de forma consistente, criam resultados extraordinários.
        </p>
        
        <p>
          Em vez de focar em força de vontade, Clear explica como estruturar seu ambiente, suas rotinas e sua identidade para que os bons hábitos aconteçam naturalmente — e os ruins desapareçam.
        </p>

        <p>
          Este resumo traz as principais lições do livro e como aplicá-las imediatamente na sua vida.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">O Conceito de “1% Melhor Todos os Dias”</h2>
        
        <p>
          James Clear mostra que melhorar 1% diariamente gera um impacto gigantesco no longo prazo.
          <br/>
          <span class="text-red-500 font-medium">→ 1% pior também gera um desastre silencioso.</span>
        </p>

        <blockquote class="border-l-4 border-primary pl-6 py-2 my-8 bg-slate-50 dark:bg-slate-800/50 rounded-r-lg italic text-slate-800 dark:text-slate-200">
          A pergunta não é: “Quero mudar minha vida?”.<br/>
          Mas sim: <strong>Quero mudar minhas pequenas ações diárias?</strong>
        </blockquote>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Os 4 Pilares dos Hábitos</h2>
        
        <p>Todo hábito segue o mesmo ciclo:</p>

        <div class="grid gap-6 md:grid-cols-2 my-8">
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 class="font-bold text-primary text-xl mb-2">1 — Deixar óbvio</h3>
            <p class="text-sm">Facilite a percepção do hábito.<br/><span class="text-slate-500">Ex.: deixar a roupa de treino pronta na frente da cama.</span></p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 class="font-bold text-primary text-xl mb-2">2 — Deixar atraente</h3>
            <p class="text-sm">Associe o hábito a algo que você goste.<br/><span class="text-slate-500">Ex.: só assistir seu podcast favorito enquanto caminha.</span></p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 class="font-bold text-primary text-xl mb-2">3 — Deixar fácil</h3>
            <p class="text-sm">Reduza a fricção.<br/><span class="text-slate-500">Ex.: treinos de 5 minutos para criar o ritmo inicial.</span></p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 class="font-bold text-primary text-xl mb-2">4 — Deixar satisfatório</h3>
            <p class="text-sm">Recompense o comportamento.<br/><span class="text-slate-500">Ex.: marcar o X no calendário após a tarefa.</span></p>
          </div>
        </div>

        <p>Esse ciclo transforma um hábito difícil em automático.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Identidade: o Verdadeiro Motor da Mudança</h2>
        
        <p>Um dos pontos mais poderosos do livro:</p>

        <div class="bg-primary/5 p-8 rounded-2xl text-center my-8">
          <p class="text-xl font-serif text-primary font-medium">
            “A forma mais eficaz de mudar seu comportamento é mudar sua identidade.”
          </p>
        </div>

        <ul class="list-none space-y-4 pl-0">
          <li class="flex items-center gap-3">
            <span class="text-red-500 text-xl">✕</span>
            <span>Não diga: “Quero ler mais.”</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="text-green-500 text-xl">✓</span>
            <span class="font-bold">Diga: “Sou uma pessoa que lê todos os dias.”</span>
          </li>
        </ul>

        <p class="mt-4">Você se torna aquilo que repete.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Sistemas vs. Metas</h2>
        
        <p><strong>Metas</strong> = resultados.<br/><strong>Sistemas</strong> = processos que levam ao resultado.</p>

        <p>James Clear mostra que:</p>
        <ul class="list-disc pl-6 space-y-2 marker:text-primary">
          <li>Querer perder peso não faz perder peso.</li>
          <li>Querer ganhar dinheiro não faz ganhar dinheiro.</li>
        </ul>

        <p class="font-medium text-slate-900 dark:text-slate-100 mt-4">
          É o sistema diário que determina o futuro. Construa sistemas, e as metas virão como consequência.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Quebrando Maus Hábitos</h2>
        
        <p>O processo inverso também funciona:</p>

        <ul class="space-y-3">
          <li class="flex items-start gap-3">
            <span class="bg-red-100 text-red-600 rounded px-2 py-0.5 text-sm font-bold mt-1">1</span>
            <span><strong>Torne invisível</strong> (evite gatilhos)</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="bg-red-100 text-red-600 rounded px-2 py-0.5 text-sm font-bold mt-1">2</span>
            <span><strong>Torne pouco atraente</strong></span>
          </li>
          <li class="flex items-start gap-3">
            <span class="bg-red-100 text-red-600 rounded px-2 py-0.5 text-sm font-bold mt-1">3</span>
            <span><strong>Torne difícil</strong> (aumente a fricção)</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="bg-red-100 text-red-600 rounded px-2 py-0.5 text-sm font-bold mt-1">4</span>
            <span><strong>Torne insatisfatório</strong></span>
          </li>
        </ul>

        <p class="mt-4 text-sm bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
          <strong>Exemplo:</strong> Para reduzir redes sociais, tire notificações, esconda o app e instale bloqueadores de tempo.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Lições Práticas para Começar Hoje</h2>
        
        <div class="space-y-6">
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
            <div>
              <h4 class="font-bold text-lg">Regra dos 2 Minutos</h4>
              <p>Todo novo hábito deve ser reduzido a uma versão de 2 minutos.<br/>Ex.: “Ler 2 páginas” → cria consistência.</p>
            </div>
          </div>
          
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
            <div>
              <h4 class="font-bold text-lg">Empilhamento de hábitos</h4>
              <p>Associe o hábito novo a algo que já faz.<br/>Ex.: “Depois de escovar os dentes, faço 10 respirações profundas.”</p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
            <div>
              <h4 class="font-bold text-lg">Calendário de vitórias</h4>
              <p>Marcar cada dia concluído cria dopamina e mantém consistência.</p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">4</div>
            <div>
              <h4 class="font-bold text-lg">Otimize o ambiente</h4>
              <p>O ambiente molda o comportamento mais do que a motivação.</p>
            </div>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusão: Mudanças Pequenas Criam Vidas Gigantes</h2>
        
        <p>
          <strong>Hábitos Atômicos</strong> não é um livro sobre mudanças rápidas, mas sobre crescimento real e sustentável.
          Se você dominar pequenas ações diárias, dominará sua vida inteira.
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-20',
    language: 'pt',
    tags: ['Produtividade', 'Hábitos', 'Desenvolvimento Pessoal']
  },
  {
    id: '2',
    slug: 'atomic-habits',
    title: 'Atomic Habits: Tiny Changes, Remarkable Results (2025 Summary)',
    excerpt: 'Discover the full summary of Atomic Habits by James Clear. Understand how tiny daily changes can transform your life and create lasting habits.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100">
          <strong>Atomic Habits</strong> by James Clear has become one of the world\'s leading guides on behavioral change. The core idea is simple: small changes, made consistently, create extraordinary results.
        </p>
        
        <p>
          Instead of focusing on willpower, Clear explains how to structure your environment, routines, and identity so that good habits happen naturally—and bad ones disappear.
        </p>

        <p>
          This summary brings you the key lessons from the book and how to apply them immediately to your life.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">The Concept of "1% Better Every Day"</h2>
        
        <p>
          James Clear shows that improving 1% daily generates a massive impact in the long run.
          <br/>
          <span class="text-red-500 font-medium">→ 1% worse also generates a silent disaster.</span>
        </p>

        <blockquote class="border-l-4 border-primary pl-6 py-2 my-8 bg-slate-50 dark:bg-slate-800/50 rounded-r-lg italic text-slate-800 dark:text-slate-200">
          The question is not: "Do I want to change my life?".<br/>
          But rather: <strong>Do I want to change my small daily actions?</strong>
        </blockquote>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">The 4 Pillars of Habits</h2>
        
        <p>Every habit follows the same cycle:</p>

        <div class="grid gap-6 md:grid-cols-2 my-8">
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 class="font-bold text-primary text-xl mb-2">1 — Make it Obvious</h3>
            <p class="text-sm">Make the habit easy to spot.<br/><span class="text-slate-500">Ex.: leave your workout clothes ready in front of your bed.</span></p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 class="font-bold text-primary text-xl mb-2">2 — Make it Attractive</h3>
            <p class="text-sm">Associate the habit with something you like.<br/><span class="text-slate-500">Ex.: only watch your favorite show while walking.</span></p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 class="font-bold text-primary text-xl mb-2">3 — Make it Easy</h3>
            <p class="text-sm">Reduce friction.<br/><span class="text-slate-500">Ex.: 5-minute workouts to create the initial rhythm.</span></p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 class="font-bold text-primary text-xl mb-2">4 — Make it Satisfying</h3>
            <p class="text-sm">Reward the behavior.<br/><span class="text-slate-500">Ex.: mark an X on the calendar after the task.</span></p>
          </div>
        </div>

        <p>This cycle transforms a difficult habit into an automatic one.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Identity: The True Engine of Change</h2>
        
        <p>One of the most powerful points of the book:</p>

        <div class="bg-primary/5 p-8 rounded-2xl text-center my-8">
          <p class="text-xl font-serif text-primary font-medium">
            "The most effective way to change your behavior is to change your identity."
          </p>
        </div>

        <ul class="list-none space-y-4 pl-0">
          <li class="flex items-center gap-3">
            <span class="text-red-500 text-xl">✕</span>
            <span>Don't say: "I want to read more."</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="text-green-500 text-xl">✓</span>
            <span class="font-bold">Say: "I am a person who reads every day."</span>
          </li>
        </ul>

        <p class="mt-4">You become what you repeat.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Systems vs. Goals</h2>
        
        <p><strong>Goals</strong> = results.<br/><strong>Systems</strong> = processes that lead to the result.</p>

        <p>James Clear shows that:</p>
        <ul class="list-disc pl-6 space-y-2 marker:text-primary">
          <li>Wanting to lose weight doesn't make you lose weight.</li>
          <li>Wanting to earn money doesn't make you earn money.</li>
        </ul>

        <p class="font-medium text-slate-900 dark:text-slate-100 mt-4">
          It is the daily system that determines the future. Build systems, and the goals will follow.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Breaking Bad Habits</h2>
        
        <p>The reverse process also works:</p>

        <ul class="space-y-3">
          <li class="flex items-start gap-3">
            <span class="bg-red-100 text-red-600 rounded px-2 py-0.5 text-sm font-bold mt-1">1</span>
            <span><strong>Make it Invisible</strong> (avoid triggers)</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="bg-red-100 text-red-600 rounded px-2 py-0.5 text-sm font-bold mt-1">2</span>
            <span><strong>Make it Unattractive</strong></span>
          </li>
          <li class="flex items-start gap-3">
            <span class="bg-red-100 text-red-600 rounded px-2 py-0.5 text-sm font-bold mt-1">3</span>
            <span><strong>Make it Difficult</strong> (increase friction)</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="bg-red-100 text-red-600 rounded px-2 py-0.5 text-sm font-bold mt-1">4</span>
            <span><strong>Make it Unsatisfying</strong></span>
          </li>
        </ul>

        <p class="mt-4 text-sm bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
          <strong>Example:</strong> To reduce social media, turn off notifications, hide the app, and install time blockers.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Practical Lessons to Start Today</h2>
        
        <div class="space-y-6">
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
            <div>
              <h4 class="font-bold text-lg">The 2-Minute Rule</h4>
              <p>Every new habit should be scaled down to a 2-minute version.<br/>Ex.: "Read 2 pages" → creates consistency.</p>
            </div>
          </div>
          
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
            <div>
              <h4 class="font-bold text-lg">Habit Stacking</h4>
              <p>Associate the new habit with something you already do.<br/>Ex.: "After brushing my teeth, I will take 10 deep breaths."</p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
            <div>
              <h4 class="font-bold text-lg">Calendar of Wins</h4>
              <p>Marking each completed day creates dopamine and maintains consistency.</p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">4</div>
            <div>
              <h4 class="font-bold text-lg">Optimize the Environment</h4>
              <p>Environment shapes behavior more than motivation.</p>
            </div>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusion: Small Changes Create Giant Lives</h2>
        
        <p>
          <strong>Atomic Habits</strong> is not a book about quick fixes, but about real and sustainable growth.
          If you master small daily actions, you will master your entire life.
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-20',
    language: 'en',
    tags: ['Productivity', 'Hábitos', 'Personal Development']
  },
  {
    id: '3',
    slug: 'habitos-atomicos',
    title: 'Hábitos Atómicos: Pequeños Cambios, Resultados Impresionantes (Resumen 2025)',
    excerpt: 'Descubre el resumen completo de Hábitos Atómicos, de James Clear. Entiende cómo pequeños cambios diarios pueden transformar tu vida y crear hábitos duraderos.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100">
          El libro <strong>Hábitos Atómicos</strong>, de James Clear, se ha convertido en una de las mayores guías del mundo sobre cambio de comportamiento. La idea central es simple: cambios pequeños, hechos de forma consistente, crean resultados extraordinarios.
        </p>
        
        <p>
          En lugar de enfocarse en la fuerza de voluntad, Clear explica cómo estructurar tu entorno, tus rutinas y tu identidad para que los buenos hábitos ocurran naturalmente — y los malos desaparezcan.
        </p>

        <p>
          Este resumen trae las principales lecciones del libro y cómo aplicarlas inmediatamente en tu vida.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">El Concepto de "1% Mejor Todos los Días"</h2>
        
        <p>
          James Clear muestra que mejorar 1% diariamente genera un impacto gigantesco a largo plazo.
          <br/>
          <span class="text-red-500 font-medium">→ 1% peor también genera un desastre silencioso.</span>
        </p>

        <blockquote class="border-l-4 border-primary pl-6 py-2 my-8 bg-slate-50 dark:bg-slate-800/50 rounded-r-lg italic text-slate-800 dark:text-slate-200">
          La pregunta no es: "¿Quiero cambiar mi vida?".<br/>
          Sino: <strong>¿Quiero cambiar mis pequeñas acciones diarias?</strong>
        </blockquote>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Los 4 Pilares de los Hábitos</h2>
        
        <p>Todo hábito sigue el mismo ciclo:</p>

        <div class="grid gap-6 md:grid-cols-2 my-8">
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 class="font-bold text-primary text-xl mb-2">1 — Hacerlo Obvio</h3>
            <p class="text-sm">Facilita la percepción del hábito.<br/><span class="text-slate-500">Ej.: dejar la ropa de entrenamiento lista frente a la cama.</span></p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 class="font-bold text-primary text-xl mb-2">2 — Hacerlo Atractivo</h3>
            <p class="text-sm">Asocia el hábito a algo que te guste.<br/><span class="text-slate-500">Ej.: solo escuchar tu podcast favorito mientras caminas.</span></p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 class="font-bold text-primary text-xl mb-2">3 — Hacerlo Fácil</h3>
            <p class="text-sm">Reduce la fricción.<br/><span class="text-slate-500">Ej.: entrenamientos de 5 minutos para crear el ritmo inicial.</span></p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 class="font-bold text-primary text-xl mb-2">4 — Hacerlo Satisfactorio</h3>
            <p class="text-sm">Recompensa el comportamiento.<br/><span class="text-slate-500">Ej.: marcar una X en el calendario después de la tarea.</span></p>
          </div>
        </div>

        <p>Este ciclo transforma un hábito difícil en automático.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Identidad: El Verdadero Motor del Cambio</h2>
        
        <p>Uno de los puntos más poderosos del libro:</p>

        <div class="bg-primary/5 p-8 rounded-2xl text-center my-8">
          <p class="text-xl font-serif text-primary font-medium">
            "La forma más eficaz de cambiar tu comportamiento es cambiar tu identidad."
          </p>
        </div>

        <ul class="list-none space-y-4 pl-0">
          <li class="flex items-center gap-3">
            <span class="text-red-500 text-xl">✕</span>
            <span>No digas: "Quiero leer más."</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="text-green-500 text-xl">✓</span>
            <span class="font-bold">Di: "Soy una persona que lee todos los días."</span>
          </li>
        </ul>

        <p class="mt-4">Te conviertes en lo que repites.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Sistemas vs. Metas</h2>
        
        <p><strong>Metas</strong> = resultados.<br/><strong>Sistemas</strong> = procesos que llevan al resultado.</p>

        <p>James Clear muestra que:</p>
        <ul class="list-disc pl-6 space-y-2 marker:text-primary">
          <li>Querer perder peso no hace perder peso.</li>
          <li>Querer ganar dinero no hace ganar dinero.</li>
        </ul>

        <p class="font-medium text-slate-900 dark:text-slate-100 mt-4">
          Es el sistema diario el que determina el futuro. Construye sistemas, y las metas vendrán como consecuencia.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Rompiendo Malos Hábitos</h2>
        
        <p>El proceso inverso también funciona:</p>

        <ul class="space-y-3">
          <li class="flex items-start gap-3">
            <span class="bg-red-100 text-red-600 rounded px-2 py-0.5 text-sm font-bold mt-1">1</span>
            <span><strong>Hazlo Invisible</strong> (evita disparadores)</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="bg-red-100 text-red-600 rounded px-2 py-0.5 text-sm font-bold mt-1">2</span>
            <span><strong>Hazlo Poco Atractivo</strong></span>
          </li>
          <li class="flex items-start gap-3">
            <span class="bg-red-100 text-red-600 rounded px-2 py-0.5 text-sm font-bold mt-1">3</span>
            <span><strong>Hazlo Difícil</strong> (aumenta la fricción)</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="bg-red-100 text-red-600 rounded px-2 py-0.5 text-sm font-bold mt-1">4</span>
            <span><strong>Hazlo Insatisfactorio</strong></span>
          </li>
        </ul>

        <p class="mt-4 text-sm bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
          <strong>Ejemplo:</strong> Para reducir redes sociales, quita notificaciones, esconde la app e instala bloqueadores de tiempo.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Lecciones Prácticas para Empezar Hoy</h2>
        
        <div class="space-y-6">
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
            <div>
              <h4 class="font-bold text-lg">Regla de los 2 Minutos</h4>
              <p>Todo nuevo hábito debe reducirse a una versión de 2 minutos.<br/>Ej.: "Leer 2 páginas" → crea consistencia.</p>
            </div>
          </div>
          
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
            <div>
              <h4 class="font-bold text-lg">Apilamiento de hábitos</h4>
              <p>Asocia el nuevo hábito a algo que ya haces.<br/>Ej.: "Después de cepillarme los dientes, haré 10 respiraciones profundas."</p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
            <div>
              <h4 class="font-bold text-lg">Calendario de victorias</h4>
              <p>Marcar cada día completado crea dopamina y mantiene la consistencia.</p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">4</div>
            <div>
              <h4 class="font-bold text-lg">Optimiza el entorno</h4>
              <p>El entorno moldea el comportamiento más que la motivación.</p>
            </div>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusión: Pequeños Cambios Crean Vidas Gigantes</h2>
        
        <p>
          <strong>Hábitos Atómicos</strong> no es un libro sobre cambios rápidos, sino sobre crecimiento real y sostenible.
          Si dominas las pequeñas acciones diarias, dominarás tu vida entera.
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-20',
    language: 'es',
    tags: ['Productividad', 'Hábitos', 'Desarrollo Personal']
  },
  {
    id: '4',
    slug: 'mindset-a-nova-psicologia-do-sucesso',
    title: 'Mindset: Como Uma Mudança Interna Pode Transformar Seus Resultados (Resumo Completo 2025)',
    excerpt: 'Descubra como o livro Mindset, de Carol S. Dweck, revela a diferença entre o mindset fixo e o de crescimento, e como isso define seu sucesso.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100">
          Por que algumas pessoas evoluem continuamente enquanto outras ficam paradas? A resposta pode estar no seu modelo mental.
        </p>
        
        <p>
          O livro <strong>Mindset</strong>, de Carol S. Dweck, é uma das obras mais importantes da psicologia moderna.
          Ele explica por que algumas pessoas crescem, se reinventam e vencem desafios — enquanto outras travam, desistem ou se sabotam.
        </p>

        <div class="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 my-8">
          <p class="mb-4">Segundo a autora, existem dois tipos principais de mentalidade:</p>
          <ul class="space-y-3">
            <li class="flex items-start gap-3">
              <span class="text-red-500 font-bold text-xl">🔒</span>
              <span><strong>Mindset Fixo:</strong> “Sou assim e pronto.”</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-green-500 font-bold text-xl">🚀</span>
              <span><strong>Mindset de Crescimento:</strong> “Posso aprender qualquer coisa com esforço e estratégia.”</span>
            </li>
          </ul>
        </div>

        <p>
          Entender essa diferença muda não apenas sua vida — mas sua carreira, seus relacionamentos, sua forma de encarar o mundo.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🌱 O que é Mindset?</h2>
        
        <p>
          “Mindset” significa modelo mental, ou a forma como você interpreta desafios, erros e aprendizado.
        </p>

        <p>Carol Dweck mostra que:</p>
        <ul class="list-disc pl-6 space-y-2 marker:text-primary">
          <li>Seu mindset define como você age sob pressão</li>
          <li>Molda sua relação com o fracasso</li>
          <li>Determina o quanto você acredita no seu próprio potencial</li>
        </ul>

        <p class="font-medium text-slate-900 dark:text-slate-100 mt-4">
          O mais importante: mindsets não são permanentes. Eles podem ser treinados.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧩 Mindset Fixo x Mindset de Crescimento</h2>
        
        <p>A autora descreve duas maneiras completamente diferentes de ver o mundo:</p>

        <div class="grid md:grid-cols-2 gap-6 my-8">
          <div class="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-100 dark:border-red-900/20">
            <h3 class="font-bold text-red-700 dark:text-red-400 text-xl mb-4 flex items-center gap-2">
              🔒 Mindset Fixo
            </h3>
            <p class="text-sm mb-4">Pessoas com esse modelo mental acreditam que:</p>
            <ul class="space-y-2 text-sm">
              <li>• Sua inteligência é fixa</li>
              <li>• Seus talentos são limitados</li>
              <li>• O fracasso é uma prova de incapacidade</li>
              <li>• Evitam desafios para não parecer “ruins”</li>
              <li>• Desistem com facilidade</li>
              <li>• Tomam críticas como ataques pessoais</li>
            </ul>
            <p class="mt-4 font-bold text-red-700 dark:text-red-400 text-sm">Resultado? Vivem dentro de um teto invisível.</p>
          </div>

          <div class="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border border-green-100 dark:border-green-900/20">
            <h3 class="font-bold text-green-700 dark:text-green-400 text-xl mb-4 flex items-center gap-2">
              🚀 Mindset de Crescimento
            </h3>
            <p class="text-sm mb-4">Pessoas com esse modelo mental entendem que:</p>
            <ul class="space-y-2 text-sm">
              <li>• Inteligência pode ser treinada</li>
              <li>• Habilidades podem ser desenvolvidas</li>
              <li>• Erros são oportunidades</li>
              <li>• Desafios fazem você evoluir</li>
              <li>• Críticas são ferramentas de melhoria</li>
              <li>• Persistência vence talento</li>
            </ul>
            <p class="mt-4 font-bold text-green-700 dark:text-green-400 text-sm">Esse mindset cria uma espiral positiva.</p>
          </div>
        </div>

        <div class="bg-primary/5 p-6 rounded-lg text-center font-medium text-primary">
          Aprende → Melhora → Se motiva → Evolui → Aprende mais.
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧠 Como o Mindset Impacta Cada Área da Sua Vida</h2>
        
        <div class="space-y-8">
          <div>
            <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">🎓 Carreira e Estudos</h3>
            <p>Pessoas com mindset de crescimento:</p>
            <ul class="list-disc pl-6 space-y-1 marker:text-green-500">
              <li>Buscam aprender constantemente</li>
              <li>Lidam melhor com pressão</li>
              <li>Não travam diante de problemas</li>
              <li>Crescem mais rápido profissionalmente</li>
            </ul>
            <p class="text-sm text-slate-500 mt-2">Enquanto o mindset fixo limita promoções, salários e oportunidades.</p>
          </div>

          <div>
            <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">❤️ Relacionamentos</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <strong class="block mb-2 text-red-600">No mindset fixo:</strong>
                <ul class="text-sm space-y-1">
                  <li>• Qualquer conflito é uma “ameaça”</li>
                  <li>• Diferenças viram brigas</li>
                  <li>• Autocrítica é excessiva</li>
                </ul>
              </div>
              <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <strong class="block mb-2 text-green-600">No mindset de crescimento:</strong>
                <ul class="text-sm space-y-1">
                  <li>• Conversas são pontes, não muros</li>
                  <li>• O casal cresce junto</li>
                  <li>• Falhas são tratadas com maturidade</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">💼 Negócios e Empreendedorismo</h3>
            <p class="mb-2"><strong>Mindset fixo</strong> = medo de arriscar<br/><strong>Mindset crescimento</strong> = visão de longo prazo</p>
            <p>Empreendedores com growth mindset:</p>
            <ul class="list-disc pl-6 space-y-1 marker:text-primary">
              <li>Experimentam mais</li>
              <li>Inovam mais</li>
              <li>Mantêm consistência</li>
              <li>Superam crises com mais rapidez</li>
            </ul>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧩 Como Desenvolver o Mindset de Crescimento</h2>
        
        <p>Carol Dweck propõe estratégias práticas:</p>

        <div class="space-y-4">
          <div class="flex gap-4 items-start">
            <div class="bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg">1</div>
            <div>
              <strong class="block text-lg">Adote o “Ainda”</strong>
              <p class="text-slate-600 dark:text-slate-400">Troque: “Não sei fazer isso.”<br/>Por: “Ainda não sei fazer isso.”</p>
            </div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg">2</div>
            <div>
              <strong class="block text-lg">Veja erros como dados, não como falhas</strong>
              <p class="text-slate-600 dark:text-slate-400">Erro = informação para ajustar o caminho.</p>
            </div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg">3</div>
            <div>
              <strong class="block text-lg">Procure desafios pequenos e constantes</strong>
              <p class="text-slate-600 dark:text-slate-400">Micro-vitórias treinam coragem.</p>
            </div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg">4</div>
            <div>
              <strong class="block text-lg">Aprenda a ouvir críticas sem se defender</strong>
              <p class="text-slate-600 dark:text-slate-400">Crítica útil impulsiona, não derruba.</p>
            </div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg">5</div>
            <div>
              <strong class="block text-lg">Acredite que seu cérebro é maleável</strong>
              <p class="text-slate-600 dark:text-slate-400">A neuroplasticidade é real — e poderosa.</p>
            </div>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">⭐ Principais Lições do Livro</h2>
        
        <ul class="grid gap-3 md:grid-cols-2">
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2">
            <span class="text-yellow-500">★</span> Crescimento é uma escolha diária
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2">
            <span class="text-yellow-500">★</span> Esforço bem direcionado vence talento
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2">
            <span class="text-yellow-500">★</span> Sucesso depende da interpretação
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2">
            <span class="text-yellow-500">★</span> Mindset pode ser treinado
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2">
            <span class="text-yellow-500">★</span> Críticas são combustíveis
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2">
            <span class="text-yellow-500">★</span> Crenças definem resultados
          </li>
        </ul>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusão</h2>
        
        <p>
          O livro <strong>Mindset</strong> mostra que ninguém nasce pronto — todos nascem possíveis.
          Quando você muda sua visão sobre aprendizado, dedicação e erros, você abre portas que antes pareciam trancadas.
        </p>

        <p class="font-medium text-xl text-center my-8 text-primary">
          O crescimento começa pela forma como você pensa.<br/>
          E começa hoje.
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-21',
    language: 'pt',
    tags: ['Psicologia', 'Sucesso', 'Mindset', 'Desenvolvimento Pessoal']
  },
  {
    id: '5',
    slug: 'mindset-the-new-psychology-of-success',
    title: 'Mindset: The New Psychology of Success (2025 Complete Summary)',
    excerpt: 'Discover how the book Mindset by Carol S. Dweck reveals the difference between fixed and growth mindsets, and how it defines your success.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100">
          Why do some people evolve continuously while others stay stuck? The answer might lie in your mental model.
        </p>
        
        <p>
          The book <strong>Mindset</strong> by Carol S. Dweck is one of the most important works of modern psychology.
          It explains why some people grow, reinvent themselves, and overcome challenges—while others freeze, give up, or sabotage themselves.
        </p>

        <div class="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 my-8">
          <p class="mb-4">According to the author, there are two main types of mindsets:</p>
          <ul class="space-y-3">
            <li class="flex items-start gap-3">
              <span class="text-red-500 font-bold text-xl">🔒</span>
              <span><strong>Fixed Mindset:</strong> "I am like this and that's it."</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-green-500 font-bold text-xl">🚀</span>
              <span><strong>Growth Mindset:</strong> "I can learn anything with effort and strategy."</span>
            </li>
          </ul>
        </div>

        <p>
          Understanding this difference changes not only your life—but your career, your relationships, and how you face the world.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🌱 What is Mindset?</h2>
        
        <p>
          "Mindset" means mental model, or the way you interpret challenges, mistakes, and learning.
        </p>

        <p>Carol Dweck shows that:</p>
        <ul class="list-disc pl-6 space-y-2 marker:text-primary">
          <li>Your mindset defines how you act under pressure</li>
          <li>Shapes your relationship with failure</li>
          <li>Determines how much you believe in your own potential</li>
        </ul>

        <p class="font-medium text-slate-900 dark:text-slate-100 mt-4">
          Most importantly: mindsets are not permanent. They can be trained.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧩 Fixed Mindset vs. Growth Mindset</h2>
        
        <p>The author describes two completely different ways of seeing the world:</p>

        <div class="grid md:grid-cols-2 gap-6 my-8">
          <div class="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-100 dark:border-red-900/20">
            <h3 class="font-bold text-red-700 dark:text-red-400 text-xl mb-4 flex items-center gap-2">
              🔒 Fixed Mindset
            </h3>
            <p class="text-sm mb-4">People with this mental model believe that:</p>
            <ul class="space-y-2 text-sm">
              <li>• Their intelligence is fixed</li>
              <li>• Their talents are limited</li>
              <li>• Failure is proof of incapacity</li>
              <li>• Avoid challenges to not look "bad"</li>
              <li>• Give up easily</li>
              <li>• Take criticism as personal attacks</li>
            </ul>
            <p class="mt-4 font-bold text-red-700 dark:text-red-400 text-sm">Result? They live within an invisible ceiling.</p>
          </div>

          <div class="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border border-green-100 dark:border-green-900/20">
            <h3 class="font-bold text-green-700 dark:text-green-400 text-xl mb-4 flex items-center gap-2">
              🚀 Growth Mindset
            </h3>
            <p class="text-sm mb-4">People with this mental model understand that:</p>
            <ul class="space-y-2 text-sm">
              <li>• Intelligence can be trained</li>
              <li>• Skills can be developed</li>
              <li>• Mistakes are opportunities</li>
              <li>• Challenges make you evolve</li>
              <li>• Criticism is a tool for improvement</li>
              <li>• Persistence beats talent</li>
            </ul>
            <p class="mt-4 font-bold text-green-700 dark:text-green-400 text-sm">This mindset creates a positive spiral.</p>
          </div>
        </div>

        <div class="bg-primary/5 p-6 rounded-lg text-center font-medium text-primary">
          Learn → Improve → Get motivated → Evolve → Learn more.
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧠 How Mindset Impacts Every Area of Your Life</h2>
        
        <div class="space-y-8">
          <div>
            <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">🎓 Career and Studies</h3>
            <p>People with a growth mindset:</p>
            <ul class="list-disc pl-6 space-y-1 marker:text-green-500">
              <li>Seek to learn constantly</li>
              <li>Handle pressure better</li>
              <li>Do not freeze in front of problems</li>
              <li>Grow faster professionally</li>
            </ul>
            <p class="text-sm text-slate-500 mt-2">While the fixed mindset limits promotions, salaries, and opportunities.</p>
          </div>

          <div>
            <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">❤️ Relationships</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <strong class="block mb-2 text-red-600">In fixed mindset:</strong>
                <ul class="text-sm space-y-1">
                  <li>• Any conflict is a "threat"</li>
                  <li>• Differences become fights</li>
                  <li>• Self-criticism is excessive</li>
                </ul>
              </div>
              <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <strong class="block mb-2 text-green-600">In growth mindset:</strong>
                <ul class="text-sm space-y-1">
                  <li>• Conversations are bridges, not walls</li>
                  <li>• The couple grows together</li>
                  <li>• Failures are treated with maturity</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">💼 Business and Entrepreneurship</h3>
            <p class="mb-2"><strong>Fixed mindset</strong> = fear of risking<br/><strong>Growth mindset</strong> = long-term vision</p>
            <p>Entrepreneurs with growth mindset:</p>
            <ul class="list-disc pl-6 space-y-1 marker:text-primary">
              <li>Experiment more</li>
              <li>Innovate more</li>
              <li>Maintain consistency</li>
              <li>Overcome crises faster</li>
            </ul>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧩 How to Develop a Growth Mindset</h2>
        
        <p>Carol Dweck proposes practical strategies:</p>

        <div class="space-y-4">
          <div class="flex gap-4 items-start">
            <div class="bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg">1</div>
            <div>
              <strong class="block text-lg">Adopt the "Yet"</strong>
              <p class="text-slate-600 dark:text-slate-400">Swap: "I don't know how to do this."<br/>For: "I don't know how to do this <strong>yet</strong>."</p>
            </div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg">2</div>
            <div>
              <strong class="block text-lg">See mistakes as data, not failures</strong>
              <p class="text-slate-600 dark:text-slate-400">Mistake = information to adjust the path.</p>
            </div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg">3</div>
            <div>
              <strong class="block text-lg">Seek small and constant challenges</strong>
              <p class="text-slate-600 dark:text-slate-400">Micro-wins train courage.</p>
            </div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg">4</div>
            <div>
              <strong class="block text-lg">Learn to listen to criticism without defending yourself</strong>
              <p class="text-slate-600 dark:text-slate-400">Useful criticism propels, it doesn't knock down.</p>
            </div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg">5</div>
            <div>
              <strong class="block text-lg">Believe your brain is malleable</strong>
              <p class="text-slate-600 dark:text-slate-400">Neuroplasticity is real—and powerful.</p>
            </div>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">⭐ Key Lessons from the Book</h2>
        
        <ul class="grid gap-3 md:grid-cols-2">
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2">
            <span class="text-yellow-500">★</span> Growth is a daily choice
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2">
            <span class="text-yellow-500">★</span> Well-directed effort beats talent
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2">
            <span class="text-yellow-500">★</span> Success depends on interpretation
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2">
            <span class="text-yellow-500">★</span> Mindset can be trained
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2">
            <span class="text-yellow-500">★</span> Criticism is fuel
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2">
            <span class="text-yellow-500">★</span> Beliefs define results
          </li>
        </ul>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusion</h2>
        
        <p>
          The book <strong>Mindset</strong> shows that no one is born ready—everyone is born possible.
          When you change your view on learning, dedication, and mistakes, you open doors that previously seemed locked.
        </p>

        <p class="font-medium text-xl text-center my-8 text-primary">
          Growth starts with how you think.<br/>
          And it starts today.
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-21',
    language: 'en',
    tags: ['Psychology', 'Success', 'Mindset', 'Personal Development']
  },
  {
    id: '6',
    slug: 'mindset-la-nueva-psicologia-del-exito',
    title: 'Mindset: La Nueva Psicología del Éxito (Resumen Completo 2025)',
    excerpt: 'Descubre cómo el libro Mindset, de Carol S. Dweck, revela la diferencia entre el mindset fijo y el de crecimiento, y cómo eso define tu éxito.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100">
          ¿Por qué algunas personas evolucionan continuamente mientras otras se quedan estancadas? La respuesta puede estar en tu modelo mental.
        </p>
        
        <p>
          El libro <strong>Mindset</strong>, de Carol S. Dweck, es una de las obras más importantes de la psicología moderna.
          Explica por qué algunas personas crecen, se reinventan y vencen desafíos — mientras otras se bloquean, se rinden o se sabotean.
        </p>

        <div class="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 my-8">
          <p class="mb-4">Según la autora, existen dos tipos principales de mentalidad:</p>
          <ul class="space-y-3">
            <li class="flex items-start gap-3">
              <span class="text-red-500 font-bold text-xl">🔒</span>
              <span><strong>Mindset Fijo:</strong> "Soy así y punto."</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-green-500 font-bold text-xl">🚀</span>
              <span><strong>Mindset de Crecimiento:</strong> "Puedo aprender cualquier cosa con esfuerzo y estrategia."</span>
            </li>
          </ul>
        </div>

        <p>
          Entender esta diferencia cambia no solo tu vida — sino tu carrera, tus relaciones, tu forma de ver el mundo.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🌱 ¿Qué es Mindset?</h2>
        
        <p>
          "Mindset" significa modelo mental, o la forma en que interpretas desafíos, errores y aprendizaje.
        </p>

        <p>Carol Dweck muestra que:</p>
        <ul class="list-disc pl-6 space-y-2 marker:text-primary">
          <li>Tu mindset define cómo actúas bajo presión</li>
          <li>Moldea tu relación con el fracaso</li>
          <li>Determina cuánto crees en tu propio potencial</li>
        </ul>

        <p class="font-medium text-slate-900 dark:text-slate-100 mt-4">
          Lo más importante: los mindsets no son permanentes. Pueden ser entrenados.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧩 Mindset Fijo vs. Mindset de Crecimiento</h2>
        
        <p>La autora describe dos maneras completamente diferentes de ver el mundo:</p>

        <div class="grid md:grid-cols-2 gap-6 my-8">
          <div class="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-100 dark:border-red-900/20">
            <h3 class="font-bold text-red-700 dark:text-red-400 text-xl mb-4 flex items-center gap-2">
              🔒 Mindset Fijo
            </h3>
            <p class="text-sm mb-4">Personas con este modelo mental creen que:</p>
            <ul class="space-y-2 text-sm">
              <li>• Su inteligencia es fija</li>
              <li>• Sus talentos son limitados</li>
              <li>• El fracasso es una prueba de incapacidad</li>
              <li>• Evitan desafíos para no parecer "malos"</li>
              <li>• Se rinden con facilidad</li>
              <li>• Toman críticas como ataques personales</li>
            </ul>
            <p class="mt-4 font-bold text-red-700 dark:text-red-400 text-sm">¿Resultado? Viven dentro de un techo invisible.</p>
          </div>

          <div class="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border border-green-100 dark:border-green-900/20">
            <h3 class="font-bold text-green-700 dark:text-green-400 text-xl mb-4 flex items-center gap-2">
              🚀 Mindset de Crecimiento
            </h3>
            <p class="text-sm mb-4">Personas con este modelo mental entienden que:</p>
            <ul class="space-y-2 text-sm">
              <li>• La inteligencia puede ser entrenada</li>
              <li>• Las habilidades pueden desarrollarse</li>
              <li>• Los errores son oportunidades</li>
              <li>• Los desafíos te hacen evolucionar</li>
              <li>• Las críticas son herramientas de mejora</li>
              <li>• La persistencia vence al talento</li>
            </ul>
            <p class="mt-4 font-bold text-green-700 dark:text-green-400 text-sm">Este mindset crea una espiral positiva.</p>
          </div>
        </div>

        <div class="bg-primary/5 p-6 rounded-lg text-center font-medium text-primary">
          Aprende → Mejora → Se motiva → Evoluciona → Aprende más.
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧠 Cómo el Mindset Impacta Cada Área de Tu Vida</h2>
        
        <div class="space-y-8">
          <div>
            <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">🎓 Carrera y Estudios</h3>
            <p>Personas con mindset de crecimiento:</p>
            <ul class="list-disc pl-6 space-y-1 marker:text-green-500">
              <li>Buscan aprender constantemente</li>
              <li>Lidian mejor con la presión</li>
              <li>No se bloquean ante problemas</li>
              <li>Crecen más rápido profesionalmente</li>
            </ul>
            <p class="text-sm text-slate-500 mt-2">Mientras que el mindset fijo limita promociones, salarios y oportunidades.</p>
          </div>

          <div>
            <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">❤️ Relaciones</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <strong class="block mb-2 text-red-600">En el mindset fijo:</strong>
                <ul class="text-sm space-y-1">
                  <li>• Cualquier conflicto es una "amenaza"</li>
                  <li>• Las diferencias se vuelven peleas</li>
                  <li>• La autocrítica es excesiva</li>
                </ul>
              </div>
              <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <strong class="block mb-2 text-green-600">En el mindset de crecimiento:</strong>
                <ul class="text-sm space-y-1">
                  <li>• Las conversaciones son puentes, no muros</li>
                  <li>• La pareja crece junta</li>
                  <li>• Las fallas se tratan con madurez</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">💼 Negocios y Emprendimiento</h3>
            <p class="mb-2"><strong>Mindset fijo</strong> = miedo a arriesgar<br/><strong>Mindset crecimiento</strong> = visión a largo plazo</p>
            <p>Emprendedores con growth mindset:</p>
            <ul class="list-disc pl-6 space-y-1 marker:text-primary">
              <li>Experimentan más</li>
              <li>Innovan más</li>
              <li>Mantienen consistencia</li>
              <li>Superan crisis con más rapidez</li>
            </ul>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧩 Cómo Desarrollar el Mindset de Crecimiento</h2>
        
        <p>Carol Dweck propone estrategias prácticas:</p>

        <div class="space-y-4">
          <div class="flex gap-4 items-start">
            <div class="bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg">1</div>
            <div>
              <strong class="block text-lg">Adopta el "Todavía"</strong>
              <p class="text-slate-600 dark:text-slate-400">Cambia: "No sé hacer esto."<br/>Por: "Todavía no sé hacer esto."</p>
            </div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg">2</div>
            <div>
              <strong class="block text-lg">Ve los errores como datos, no como fallas</strong>
              <p class="text-slate-600 dark:text-slate-400">Error = información para ajustar el camino.</p>
            </div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg">3</div>
            <div>
              <strong class="block text-lg">Busca desafíos pequeños y constantes</strong>
              <p class="text-slate-600 dark:text-slate-400">Micro-victorias entrenan el coraje.</p>
            </div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg">4</div>
            <div>
              <strong class="block text-lg">Aprende a escuchar críticas sin defenderte</strong>
              <p class="text-slate-600 dark:text-slate-400">La crítica útil impulsa, no derriba.</p>
            </div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg">5</div>
            <div>
              <strong class="block text-lg">Cree que tu cerebro es maleable</strong>
              <p class="text-slate-600 dark:text-slate-400">La neuroplasticidad es real — y poderosa.</p>
            </div>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">⭐ Lecciones Principales del Libro</h2>
        
        <ul class="grid gap-3 md:grid-cols-2">
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2">
            <span class="text-yellow-500">★</span> El crecimiento es una elección diaria
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2">
            <span class="text-yellow-500">★</span> El esfuerzo bien dirigido vence al talento
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2">
            <span class="text-yellow-500">★</span> El éxito depende de la interpretación
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2">
            <span class="text-yellow-500">★</span> El mindset puede ser entrenado
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2">
            <span class="text-yellow-500">★</span> Las críticas son combustible
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2">
            <span class="text-yellow-500">★</span> Las creencias definen los resultados
          </li>
        </ul>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusión</h2>
        
        <p>
          El libro <strong>Mindset</strong> muestra que nadie nace listo — todos nacen posibles.
          Cuando cambias tu visión sobre el aprendizaje, la dedicación y los errores, abres puertas que antes parecían cerradas.
        </p>

        <p class="font-medium text-xl text-center my-8 text-primary">
          El crecimiento comienza por la forma en que piensas.<br/>
          Y comienza hoy.
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-21',
    language: 'es',
    tags: ['Psicología', 'Éxito', 'Mindset', 'Desarrollo Personal']
  },
  {
    id: '7',
    slug: 'o-poder-do-habito',
    title: 'O Poder do Hábito – Como os Hábitos Funcionam e Como Transformam a Nossa Vida (Resumo Completo 2025)',
    excerpt: 'Resumo completo de O Poder do Hábito. Entenda o Loop do Hábito, gatilho, rotina e recompensa, e como reprogramar hábitos pessoais e profissionais.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100">
          Em <strong>O Poder do Hábito</strong>, o jornalista Charles Duhigg apresenta uma das ideias mais transformadoras da psicologia moderna: os hábitos são fórmulas automáticas que governam grande parte da nossa vida.
        </p>
        
        <p>O livro explica:</p>
        <ul class="list-disc pl-6 space-y-2 marker:text-primary">
          <li>Por que hábitos se formam</li>
          <li>Como eles influenciam decisões</li>
          <li>Como transformá-los</li>
          <li>Como empresas, sociedades e pessoas usam hábitos para crescer</li>
        </ul>

        <p>É um guia profundo, prático e fascinante sobre comportamento humano.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">📘 O Loop do Hábito: O Círculo Que Controla Tudo</h2>
        
        <p>Segundo Duhigg, todo hábito segue um ciclo em 3 etapas:</p>

        <div class="grid md:grid-cols-3 gap-6 my-8">
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <div class="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold text-xl">1</div>
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-lg mb-2">Gatilho (cue)</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">É o estímulo que inicia o hábito.<br/>Ex.: sensação de tédio → pegar o celular.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <div class="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold text-xl">2</div>
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-lg mb-2">Rotina (routine)</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">É o comportamento automático.<br/>Ex.: abrir o Instagram.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <div class="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold text-xl">3</div>
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-lg mb-2">Recompensa (reward)</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">É o benefício que mantém o comportamento.<br/>Ex.: dopamina, distração, conforto.</p>
          </div>
        </div>

        <div class="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center font-bold text-slate-700 dark:text-slate-300">
          Gatilho → Rotina → Recompensa<br/>
          <span class="font-normal text-sm">Esse ciclo roda automaticamente e molda sua vida.</span>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧠 Por que é tão difícil mudar hábitos?</h2>
        
        <p>
          Porque o cérebro adora economia de energia.
          Quando um hábito se consolida, o cérebro para de trabalhar — e a ação vira piloto automático.
        </p>

        <p class="font-medium text-green-600 dark:text-green-400">
          A boa notícia? É possível reprogramar o ciclo.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🔄 Como Transformar um Hábito (Método Duhigg)</h2>
        
        <p>
          Você <strong>NÃO</strong> precisa apagar um hábito — apenas trocar a rotina, mantendo gatilho e recompensa iguais.
        </p>

        <div class="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border-l-4 border-primary my-8">
          <h4 class="font-bold text-lg mb-4">Exemplo real:</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Gatilho:</strong> estresse</p>
              <p class="text-red-500 line-through"><strong>Rotina antiga:</strong> comer doces</p>
              <p><strong>Recompensa:</strong> relaxamento</p>
            </div>
            <div>
              <p><strong>Nova rotina:</strong> caminhar 5 minutos / beber água / conversar com alguém</p>
              <p class="text-green-600 font-bold mt-2">Mesma recompensa — sem autossabotagem.</p>
            </div>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🏢 Hábitos em Empresas: O Caso da Starbucks, Target e Google</h2>
        
        <p>O livro mostra como grandes empresas usam hábitos para:</p>
        <ul class="list-disc pl-6 space-y-1 marker:text-primary">
          <li>treinar funcionários</li>
          <li>prever comportamento de clientes</li>
          <li>criar rotinas produtivas</li>
          <li>desenvolver liderança</li>
        </ul>

        <p class="mt-4">
          A Starbucks, por exemplo, treina hábitos de resiliência emocional nos atendentes:
          eles praticam respostas automáticas para situações difíceis.
        </p>

        <div class="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg mt-4 border border-green-100 dark:border-green-900/20">
          <strong class="block text-green-800 dark:text-green-300 mb-2">Resultado?</strong>
          <ul class="list-check pl-0 space-y-1 text-sm text-green-700 dark:text-green-400">
            <li>✓ Clientes mais satisfeitos.</li>
            <li>✓ Funcionários mais confiantes.</li>
            <li>✓ Operação mais eficiente.</li>
          </ul>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🏟️ Hábitos Sociais: Como Movimentos Mudam o Mundo</h2>
        
        <p>Duhigg explica como movimentos sociais surgem através de 3 fases:</p>
        <ol class="list-decimal pl-6 space-y-2 marker:font-bold marker:text-primary">
          <li>network de amizade</li>
          <li>hábitos de comunidade</li>
          <li>pressão social e identidade</li>
        </ol>

        <p class="text-sm text-slate-500 mt-4 italic">
          Exemplo: o boicote aos ônibus em Montgomery, que impulsionou o movimento de direitos civis nos EUA, começou como um hábito social.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🌱 Hábitos-Chave: Pequenas Ações que Mudam Tudo</h2>
        
        <p>Os “hábitos-chave” (keystone habits) são comportamentos que criam melhorias em cadeia.</p>

        <div class="flex flex-wrap gap-2 my-4">
          <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">fazer exercícios</span>
          <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">ler diariamente</span>
          <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">planejar o dia</span>
          <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">manter rotina de sono</span>
          <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">registrar gastos</span>
        </div>

        <p>Quando você desenvolve um hábito-chave, outras áreas da vida melhoram automaticamente.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🔧 Ferramentas práticas para mudar hábitos hoje</h2>
        
        <div class="space-y-6">
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">1</div>
            <div>
              <h4 class="font-bold text-lg">Identifique seu gatilho</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Local? Horário? Estado emocional? Pessoa? Ação anterior?</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">2</div>
            <div>
              <h4 class="font-bold text-lg">Mapeie a recompensa</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Pergunte: “O que estou buscando?” (alívio, conforto, estímulo, distração?)</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">3</div>
            <div>
              <h4 class="font-bold text-lg">Troque a rotina</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Substitua o hábito — não lute contra ele.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">4</div>
            <div>
              <h4 class="font-bold text-lg">Programe lembretes visuais</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Post-its, alarmes, objetos no lugar certo.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">5</div>
            <div>
              <h4 class="font-bold text-lg">Use o poder do grupo</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Ambientes moldam comportamentos mais que motivação.</p>
            </div>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">⭐ Principais lições de “O Poder do Hábito”</h2>
        
        <ul class="grid gap-3 md:grid-cols-2">
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Hábitos são sistemas automáticos
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Você não muda o hábito; muda a rotina
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Gatilho e recompensa importam mais
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Pequenas mudanças têm impacto enorme
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Hábitos-chaves aceleram transformações
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Sucesso depende de sistemas consistentes
          </li>
        </ul>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusão</h2>
        
        <p>
          <strong>O Poder do Hábito</strong> mostra que disciplina não é sorte nem talento — é engenharia comportamental.
          Quando entendemos o ciclo que move nossos hábitos, ganhamos acesso ao painel de controle da nossa própria vida.
        </p>

        <p class="font-medium text-xl text-center my-8 text-primary">
          Mudar não é mágica. É método.<br/>
          E você pode começar hoje.
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-22',
    language: 'pt',
    tags: ['Hábitos', 'Produtividade', 'Psicologia', 'Desenvolvimento Pessoal']
  },
  {
    id: '8',
    slug: 'the-power-of-habit',
    title: 'The Power of Habit – How Habits Work and How They Transform Our Lives (2025 Summary)',
    excerpt: 'Complete summary of The Power of Habit. Understand the Habit Loop, cue, routine, and reward, and how to reprogram personal and professional habits.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100">
          In <strong>The Power of Habit</strong>, journalist Charles Duhigg presents one of the most transformative ideas in modern psychology: habits are automatic formulas that govern much of our lives.
        </p>
        
        <p>The book explains:</p>
        <ul class="list-disc pl-6 space-y-2 marker:text-primary">
          <li>Why habits form</li>
          <li>How they influence decisions</li>
          <li>How to transform them</li>
          <li>How companies, societies, and people use habits to grow</li>
        </ul>

        <p>It is a deep, practical, and fascinating guide to human behavior.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">📘 The Habit Loop: The Circle That Controls Everything</h2>
        
        <p>According to Duhigg, every habit follows a 3-step cycle:</p>

        <div class="grid md:grid-cols-3 gap-6 my-8">
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <div class="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold text-xl">1</div>
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-lg mb-2">Cue</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">The stimulus that starts the habit.<br/>Ex.: feeling bored → picking up the phone.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <div class="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold text-xl">2</div>
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-lg mb-2">Routine</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">The automatic behavior.<br/>Ex.: opening Instagram.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <div class="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold text-xl">3</div>
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-lg mb-2">Reward</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">The benefit that maintains the behavior.<br/>Ex.: dopamine, distraction, comfort.</p>
          </div>
        </div>

        <div class="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center font-bold text-slate-700 dark:text-slate-300">
          Cue → Routine → Reward<br/>
          <span class="font-normal text-sm">This cycle runs automatically and shapes your life.</span>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧠 Why is it so hard to change habits?</h2>
        
        <p>
          Because the brain loves saving energy.
          When a habit is consolidated, the brain stops working—and the action becomes autopilot.
        </p>

        <p class="font-medium text-green-600 dark:text-green-400">
          The good news? It is possible to reprogram the cycle.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🔄 How to Transform a Habit (Duhigg Method)</h2>
        
        <p>
          You do <strong>NOT</strong> need to erase a habit—just change the routine, keeping the cue and reward the same.
        </p>

        <div class="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border-l-4 border-primary my-8">
          <h4 class="font-bold text-lg mb-4">Real example:</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Cue:</strong> stress</p>
              <p class="text-red-500 line-through"><strong>Old routine:</strong> eating sweets</p>
              <p><strong>Reward:</strong> relaxation</p>
            </div>
            <div>
              <p><strong>New routine:</strong> walk 5 minutes / drink water / talk to someone</p>
              <p class="text-green-600 font-bold mt-2">Same reward—no self-sabotage.</p>
            </div>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🏢 Habits in Companies: The Case of Starbucks, Target, and Google</h2>
        
        <p>The book shows how large companies use habits to:</p>
        <ul class="list-disc pl-6 space-y-1 marker:text-primary">
          <li>train employees</li>
          <li>predict customer behavior</li>
          <li>create productive routines</li>
          <li>develop leadership</li>
        </ul>

        <p class="mt-4">
          Starbucks, for example, trains emotional resilience habits in attendants:
          they practice automatic responses for difficult situations.
        </p>

        <div class="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg mt-4 border border-green-100 dark:border-green-900/20">
          <strong class="block text-green-800 dark:text-green-300 mb-2">Result?</strong>
          <ul class="list-check pl-0 space-y-1 text-sm text-green-700 dark:text-green-400">
            <li>✓ More satisfied customers.</li>
            <li>✓ More confident employees.</li>
            <li>✓ More efficient operation.</li>
          </ul>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🏟️ Social Habits: How Movements Change the World</h2>
        
        <p>Duhigg explains how social movements arise through 3 phases:</p>
        <ol class="list-decimal pl-6 space-y-2 marker:font-bold marker:text-primary">
          <li>friendship network</li>
          <li>community habits</li>
          <li>social pressure and identity</li>
        </ol>

        <p class="text-sm text-slate-500 mt-4 italic">
          Example: the Montgomery bus boycott, which boosted the civil rights movement in the US, started as a social habit.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🌱 Keystone Habits: Small Actions That Change Everything</h2>
        
        <p>The "keystone habits" are behaviors that create chain improvements.</p>

        <div class="flex flex-wrap gap-2 my-4">
          <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">exercising</span>
          <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">reading daily</span>
          <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">planning the day</span>
          <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">maintaining sleep routine</span>
          <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">tracking expenses</span>
        </div>

        <p>When you develop a keystone habit, other areas of life improve automatically.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🔧 Practical tools to change habits today</h2>
        
        <div class="space-y-6">
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">1</div>
            <div>
              <h4 class="font-bold text-lg">Identify your cue</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Location? Time? Emotional state? Person? Previous action?</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">2</div>
            <div>
              <h4 class="font-bold text-lg">Map the reward</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Ask: "What am I looking for?" (relief, comfort, stimulus, distraction?)</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">3</div>
            <div>
              <h4 class="font-bold text-lg">Change the routine</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Replace the habit—don't fight it.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">4</div>
            <div>
              <h4 class="font-bold text-lg">Schedule visual reminders</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Post-its, alarms, objects in the right place.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">5</div>
            <div>
              <h4 class="font-bold text-lg">Use the power of the group</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Environments shape behaviors more than motivation.</p>
            </div>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">⭐ Key lessons from "The Power of Habit"</h2>
        
        <ul class="grid gap-3 md:grid-cols-2">
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Habits are automatic systems
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> You don't change the habit; you change the routine
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Cue and reward matter more
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Small changes have huge impact
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Keystone habits accelerate transformations
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Success depends on consistent systems
          </li>
        </ul>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusion</h2>
        
        <p>
          <strong>The Power of Habit</strong> shows that discipline is not luck or talent—it is behavioral engineering.
          When we understand the cycle that moves our habits, we gain access to the control panel of our own lives.
        </p>

        <p class="font-medium text-xl text-center my-8 text-primary">
          Change is not magic. It is method.<br/>
          And you can start today.
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-22',
    language: 'en',
    tags: ['Habits', 'Productivity', 'Psychology', 'Personal Development']
  },
  {
    id: '9',
    slug: 'el-poder-del-habito',
    title: 'El Poder del Hábito – Cómo Funcionan los Hábitos y Cómo Transforman Nuestra Vida (Resumen 2025)',
    excerpt: 'Resumen completo de El Poder del Hábito. Entiende el Bucle del Hábito, señal, rutina y recompensa, y cómo reprogramar hábitos personales y profesionales.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100">
          En <strong>El Poder del Hábito</strong>, el periodista Charles Duhigg presenta una de las ideas más transformadoras de la psicología moderna: los hábitos son fórmulas automáticas que gobiernan gran parte de nuestra vida.
        </p>
        
        <p>El libro explica:</p>
        <ul class="list-disc pl-6 space-y-2 marker:text-primary">
          <li>Por qué se forman los hábitos</li>
          <li>Cómo influyen en las decisiones</li>
          <li>Cómo transformarlos</li>
          <li>Cómo empresas, sociedades y personas usan hábitos para crecer</li>
        </ul>

        <p>Es una guía profunda, práctica y fascinante sobre el comportamiento humano.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">📘 El Bucle del Hábito: El Círculo Que Controla Todo</h2>
        
        <p>Según Duhigg, todo hábito sigue un ciclo en 3 etapas:</p>

        <div class="grid md:grid-cols-3 gap-6 my-8">
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <div class="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold text-xl">1</div>
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-lg mb-2">Señal (cue)</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">Es el estímulo que inicia el hábito.<br/>Ej.: sensación de aburrimiento → tomar el celular.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <div class="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold text-xl">2</div>
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-lg mb-2">Rutina (routine)</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">Es el comportamiento automático.<br/>Ej.: abrir Instagram.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <div class="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold text-xl">3</div>
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-lg mb-2">Recompensa (reward)</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">Es el beneficio que mantiene el comportamiento.<br/>Ej.: dopamina, distracción, confort.</p>
          </div>
        </div>

        <div class="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center font-bold text-slate-700 dark:text-slate-300">
          Señal → Rutina → Recompensa<br/>
          <span class="font-normal text-sm">Este ciclo rueda automáticamente y moldea tu vida.</span>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧠 ¿Por qué es tan difícil cambiar hábitos?</h2>
        
        <p>
          Porque al cerebro le encanta ahorrar energía.
          Cuando un hábito se consolida, el cerebro deja de trabajar — y la acción se vuelve piloto automático.
        </p>

        <p class="font-medium text-green-600 dark:text-green-400">
          ¿La buena noticia? Es posible reprogramar el ciclo.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🔄 Cómo Transformar un Hábito (Método Duhigg)</h2>
        
        <p>
          <strong>NO</strong> necesitas borrar un hábito — solo cambiar la rutina, manteniendo señal y recompensa iguales.
        </p>

        <div class="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border-l-4 border-primary my-8">
          <h4 class="font-bold text-lg mb-4">Ejemplo real:</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Señal:</strong> estrés</p>
              <p class="text-red-500 line-through"><strong>Rutina antigua:</strong> comer dulces</p>
              <p><strong>Recompensa:</strong> relajación</p>
            </div>
            <div>
              <p><strong>Nueva rutina:</strong> caminar 5 minutos / beber agua / hablar con alguien</p>
              <p class="text-green-600 font-bold mt-2">Misma recompensa — sin autosabotaje.</p>
            </div>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🏢 Hábitos en Empresas: El Caso de Starbucks, Target y Google</h2>
        
        <p>El libro muestra cómo grandes empresas usan hábitos para:</p>
        <ul class="list-disc pl-6 space-y-1 marker:text-primary">
          <li>entrenar empleados</li>
          <li>predecir comportamiento de clientes</li>
          <li>crear rutinas productivas</li>
          <li>desarrollar liderazgo</li>
        </ul>

        <p class="mt-4">
          Starbucks, por ejemplo, entrena hábitos de resiliencia emocional en los asistentes:
          practican respuestas automáticas para situaciones difíciles.
        </p>

        <div class="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg mt-4 border border-green-100 dark:border-green-900/20">
          <strong class="block text-green-800 dark:text-green-300 mb-2">¿Resultado?</strong>
          <ul class="list-check pl-0 space-y-1 text-sm text-green-700 dark:text-green-400">
            <li>✓ Clientes más satisfechos.</li>
            <li>✓ Empleados más confiados.</li>
            <li>✓ Operación más eficiente.</li>
          </ul>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🏟️ Hábitos Sociales: Cómo los Movimientos Cambian el Mundo</h2>
        
        <p>Duhigg explica cómo surgen los movimientos sociales a través de 3 fases:</p>
        <ol class="list-decimal pl-6 space-y-2 marker:font-bold marker:text-primary">
          <li>red de amistad</li>
          <li>hábitos de comunidad</li>
          <li>presión social e identidad</li>
        </ol>

        <p class="text-sm text-slate-500 mt-4 italic">
          Ejemplo: el boicot a los autobuses en Montgomery, que impulsó el movimiento de derechos civiles en EE. UU., comenzó como un hábito social.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🌱 Hábitos Clave: Pequeñas Acciones que Cambian Todo</h2>
        
        <p>Los "hábitos clave" (keystone habits) son comportamientos que crean mejoras en cadena.</p>

        <div class="flex flex-wrap gap-2 my-4">
          <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">hacer ejercicio</span>
          <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">leer diariamente</span>
          <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">planificar el día</span>
          <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">mantener rutina de sueño</span>
          <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">registrar gastos</span>
        </div>

        <p>Cuando desarrollas un hábito clave, otras áreas de la vida mejoran automáticamente.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🔧 Herramientas prácticas para cambiar hábitos hoy</h2>
        
        <div class="space-y-6">
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">1</div>
            <div>
              <h4 class="font-bold text-lg">Identifica tu señal</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">¿Lugar? ¿Hora? ¿Estado emocional? ¿Persona? ¿Acción anterior?</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">2</div>
            <div>
              <h4 class="font-bold text-lg">Mapea la recompensa</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Pregunta: "¿Qué estoy buscando?" (¿alivio, confort, estímulo, distracción?)</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">3</div>
            <div>
              <h4 class="font-bold text-lg">Cambia la rutina</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Sustituye el hábito — no luches contra él.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">4</div>
            <div>
              <h4 class="font-bold text-lg">Programa recordatorios visuales</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Post-its, alarmas, objetos en el lugar correcto.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">5</div>
            <div>
              <h4 class="font-bold text-lg">Usa el poder del grupo</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Los entornos moldean comportamientos más que la motivación.</p>
            </div>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">⭐ Lecciones principales de "El Poder del Hábito"</h2>
        
        <ul class="grid gap-3 md:grid-cols-2">
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Los hábitos son sistemas automáticos
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> No cambias el hábito; cambias la rutina
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Señal y recompensa importan más
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Pequeños cambios tienen un impacto enorme
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Los hábitos clave aceleran transformaciones
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> El éxito depende de sistemas consistentes
          </li>
        </ul>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusión</h2>
        
        <p>
          <strong>El Poder del Hábito</strong> muestra que la disciplina no es suerte ni talento — es ingeniería conductual.
          Cuando entendemos el ciclo que mueve nuestros hábitos, ganamos acceso al panel de control de nuestra propia vida.
        </p>

        <p class="font-medium text-xl text-center my-8 text-primary">
          Cambiar no es magia. Es método.<br/>
          Y puedes empezar hoy.
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-22',
    language: 'es',
    tags: ['Hábitos', 'Productividad', 'Psicología', 'Desarrollo Personal']
  },
  {
    id: '10',
    slug: 'a-sutil-arte-de-ligar-o-foda-se',
    title: 'A Sutil Arte de Ligar o F*da-se – Como Parar de Se Importar com o Que Não Importa (Resumo Completo 2025)',
    excerpt: 'Resumo completo de A Sutil Arte de Ligar o F*da-se. Aprenda como escolher suas batalhas, definir seus valores e viver uma vida mais leve e autêntica.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100 italic">
          “Pare de tentar ser incrível o tempo todo.”
        </p>
        
        <p>
          Esse é o golpe frontal que Mark Manson dá logo no início do livro.
          Em um mundo obcecado por positividade, conquistas e aparência perfeita, ele mostra que:
        </p>
        
        <ul class="list-disc pl-6 space-y-2 marker:text-primary">
          <li>a vida é limitada</li>
          <li>nossa energia é limitada</li>
          <li>nosso tempo é limitado</li>
          <li>e por isso devemos escolher onde investir nosso f*da-se</li>
        </ul>

        <div class="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl border-l-4 border-primary my-8">
          <p class="font-bold text-lg text-slate-900 dark:text-slate-100">A tese central é simples e poderosa:</p>
          <p class="mt-2 text-slate-700 dark:text-slate-300">Quem tenta se importar com tudo acaba não se importando com nada.</p>
        </div>

        <p>Este resumo traz as principais ideias do livro e como aplicá-las na vida real.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">💥 A Ilusão da Positividade Tóxica</h2>
        
        <p>Manson critica a “ditadura da felicidade” — aquela pressão para ser feliz, produtivo e confiante o tempo todo.</p>
        
        <p>Isso gera:</p>
        <div class="flex flex-wrap gap-2 my-4">
          <span class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium">ansiedade</span>
          <span class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium">comparação</span>
          <span class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium">sensação de fracasso</span>
          <span class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium">culpa</span>
          <span class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium">autossabotagem</span>
        </div>

        <p class="font-medium text-green-600 dark:text-green-400">
          A cura? Aceitar que a vida é feita de problemas — e que nosso crescimento depende de quais problemas escolhemos enfrentar.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🎯 Você Precisa Escolher Seus Problemas (não fugir deles)</h2>
        
        <p>Ao contrário do que muita gente pensa:</p>
        <ul class="list-disc pl-6 space-y-2 marker:text-primary">
          <li>pessoas felizes não têm menos problemas</li>
          <li>elas têm problemas melhores</li>
          <li>problemas que fazem sentido</li>
          <li>problemas que estão alinhados com seus valores</li>
        </ul>

        <div class="bg-primary/10 p-4 rounded-lg text-center font-bold text-primary mt-4">
          Felicidade = enfrentar desafios significativos.
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧠 O Poder dos Valores (e como eles te destroem ou te salvam)</h2>
        
        <p>Manson explica que grande parte do sofrimento vem de valores ruins.</p>

        <div class="grid md:grid-cols-2 gap-6 my-8">
          <div class="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-100 dark:border-red-900/20">
            <h3 class="font-bold text-red-800 dark:text-red-300 text-lg mb-4">Valores Ruins 👎</h3>
            <ul class="space-y-2 text-sm text-red-700 dark:text-red-400">
              <li>• Querer parecer perfeito</li>
              <li>• Querer ser amado por todos</li>
              <li>• Querer ter razão sempre</li>
              <li>• Buscar controle total</li>
              <li>• Depender da validação externa</li>
            </ul>
            <p class="mt-4 font-bold text-red-800 dark:text-red-300 text-center">Valores ruins → vida ruim.</p>
          </div>
          
          <div class="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border border-green-100 dark:border-green-900/20">
            <h3 class="font-bold text-green-800 dark:text-green-300 text-lg mb-4">Valores Bons 👍</h3>
            <ul class="space-y-2 text-sm text-green-700 dark:text-green-400">
              <li>• Responsabilidade</li>
              <li>• Honestidade</li>
              <li>• Coragem</li>
              <li>• Disciplina</li>
              <li>• Contribuir com algo maior</li>
            </ul>
            <p class="mt-4 font-bold text-green-800 dark:text-green-300 text-center">Valores bons → vida melhor.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">❌ “Você não é especial” — A lição mais libertadora do livro</h2>
        
        <p>
          Pode parecer rude, mas é profundo: Manson explica que acreditar que somos “especiais demais” nos leva a expectativas irreais, perfeccionismo e frustração crônica.
        </p>

        <p class="font-medium text-slate-900 dark:text-slate-100">
          Aceitar nossa condição humana traz… alívio.
        </p>
        
        <p>
          Você não precisa ser extraordinário.
          Você só precisa ser consistente com seus valores.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">⚔️ Assuma Responsabilidade Radical</h2>
        
        <blockquote class="border-l-4 border-primary pl-4 italic text-slate-600 dark:text-slate-400 my-6">
          “Você não é culpado por tudo que acontece com você.
          Mas você é responsável por como reage ao que acontece.”
        </blockquote>

        <p>Essa mudança de postura transforma relacionamentos, finanças, carreira e autoestima.</p>
        <p class="font-bold text-primary">Responsabilidade = liberdade.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧘 O Ciclo de Feedback “Do F*da-se”</h2>
        
        <p>Ele explica que buscamos coisas que nos fazem sentir bem — mas que, na verdade, nos deixam vazios.</p>
        
        <ul class="list-disc pl-6 space-y-2 marker:text-primary">
          <li>querer ser admirado → vira insegurança</li>
          <li>querer ser feliz a todo custo → vira ansiedade</li>
          <li>querer ser poderoso → vira medo de fracassar</li>
        </ul>

        <p>Ao soltar esses ciclos, você volta ao controle.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🌱 Sofrimento é Inevitável — e Isso é Bom</h2>
        
        <p>Manson diz que a vida é feita de perdas, fracassos, rejeições e limitações.</p>

        <div class="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl text-center">
          <p class="text-sm text-slate-500 mb-2">A pergunta certa não é: “Como evitar sofrimento?”</p>
          <p class="font-bold text-xl text-slate-900 dark:text-slate-100">Mas: “Pelo que vale a pena sofrer?”</p>
        </div>

        <p class="mt-4 text-center font-medium text-primary">Essa pergunta muda tudo.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🔧 Ferramentas Práticas para Aplicar Hoje</h2>
        
        <div class="space-y-6">
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">1</div>
            <div>
              <h4 class="font-bold text-lg">Defina seus valores bons</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Responsabilidade, honestidade, coragem, propósito.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">2</div>
            <div>
              <h4 class="font-bold text-lg">Diga não com mais frequência</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Proteja seu tempo.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">3</div>
            <div>
              <h4 class="font-bold text-lg">Pare de fugir de problemas</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Escolha problemas alinhados aos seus valores.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">4</div>
            <div>
              <h4 class="font-bold text-lg">Aceite que você é falível</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Errar faz parte — isso reduz ansiedade.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">5</div>
            <div>
              <h4 class="font-bold text-lg">Questione seus desejos</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Nem tudo que você quer realmente importa.</p>
            </div>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">⭐ Principais Lições do Livro</h2>
        
        <ul class="grid gap-3 md:grid-cols-2">
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Tentar ser positivo demais te faz infeliz
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Você precisa escolher problemas significativos
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Valores ruins criam vidas ruins
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Você não controla tudo — mas controla sua resposta
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Não dá para se importar com tudo
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Sofrimento inevitável → crescimento inevitável
          </li>
        </ul>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusão</h2>
        
        <p>
          <strong>A Sutil Arte de Ligar o F*da-se</strong> é um manifesto de liberdade emocional.
          Ele mostra que a vida melhora quando você:
        </p>
        
        <ul class="list-disc pl-6 space-y-2 marker:text-primary mb-6">
          <li>para de tentar agradar a todos</li>
          <li>escolhe seus valores</li>
          <li>abraça seus limites</li>
          <li>e foca apenas no que realmente importa</li>
        </ul>

        <p class="font-medium text-xl text-center my-8 text-primary">
          Viver bem não é se importar mais.<br/>
          É se importar melhor.
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-20',
    language: 'pt',
    tags: ['Mindset', 'Estoicismo', 'Desenvolvimento Pessoal', 'Psicologia']
  },
  {
    id: '11',
    slug: 'the-subtle-art-of-not-giving-a-fuck',
    title: 'The Subtle Art of Not Giving a F*ck – How to Stop Caring About What Doesn\'t Matter (2025 Summary)',
    excerpt: 'Complete summary of The Subtle Art of Not Giving a F*ck. Learn how to choose your battles, define your values, and live a lighter, more authentic life.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100 italic">
          “Stop trying to be amazing all the time.”
        </p>
        
        <p>
          This is the frontal blow that Mark Manson delivers right at the beginning of the book.
          In a world obsessed with positivity, achievements, and perfect appearances, he shows that:
        </p>
        
        <ul class="list-disc pl-6 space-y-2 marker:text-primary">
          <li>life is limited</li>
          <li>our energy is limited</li>
          <li>our time is limited</li>
          <li>and that's why we must choose where to invest our f*cks</li>
        </ul>

        <div class="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl border-l-4 border-primary my-8">
          <p class="font-bold text-lg text-slate-900 dark:text-slate-100">The central thesis is simple and powerful:</p>
          <p class="mt-2 text-slate-700 dark:text-slate-300">Those who try to care about everything end up caring about nothing.</p>
        </div>

        <p>This summary brings the main ideas of the book and how to apply them in real life.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">💥 The Illusion of Toxic Positivity</h2>
        
        <p>Manson criticizes the "dictatorship of happiness"—that pressure to be happy, productive, and confident all the time.</p>
        
        <p>This generates:</p>
        <div class="flex flex-wrap gap-2 my-4">
          <span class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium">anxiety</span>
          <span class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium">comparison</span>
          <span class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium">feeling of failure</span>
          <span class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium">guilt</span>
          <span class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium">self-sabotage</span>
        </div>

        <p class="font-medium text-green-600 dark:text-green-400">
          The cure? Accepting that life is made of problems—and that our growth depends on which problems we choose to face.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🎯 You Need to Choose Your Problems (not run from them)</h2>
        
        <p>Contrary to what many people think:</p>
        <ul class="list-disc pl-6 space-y-2 marker:text-primary">
          <li>happy people don't have fewer problems</li>
          <li>they have better problems</li>
          <li>problems that make sense</li>
          <li>problems that are aligned with their values</li>
        </ul>

        <div class="bg-primary/10 p-4 rounded-lg text-center font-bold text-primary mt-4">
          Happiness = facing meaningful challenges.
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧠 The Power of Values (and how they destroy or save you)</h2>
        
        <p>Manson explains that much of suffering comes from bad values.</p>

        <div class="grid md:grid-cols-2 gap-6 my-8">
          <div class="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-100 dark:border-red-900/20">
            <h3 class="font-bold text-red-800 dark:text-red-300 text-lg mb-4">Bad Values 👎</h3>
            <ul class="space-y-2 text-sm text-red-700 dark:text-red-400">
              <li>• Wanting to look perfect</li>
              <li>• Wanting to be loved by everyone</li>
              <li>• Wanting to be right always</li>
              <li>• Seeking total control</li>
              <li>• Depending on external validation</li>
            </ul>
            <p class="mt-4 font-bold text-red-800 dark:text-red-300 text-center">Bad values → bad life.</p>
          </div>
          
          <div class="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border border-green-100 dark:border-green-900/20">
            <h3 class="font-bold text-green-800 dark:text-green-300 text-lg mb-4">Good Values 👍</h3>
            <ul class="space-y-2 text-sm text-green-700 dark:text-green-400">
              <li>• Responsibility</li>
              <li>• Honesty</li>
              <li>• Courage</li>
              <li>• Discipline</li>
              <li>• Contributing to something greater</li>
            </ul>
            <p class="mt-4 font-bold text-green-800 dark:text-green-300 text-center">Good values → better life.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">❌ “You are not special” — The most liberating lesson of the book</h2>
        
        <p>
          It may seem rude, but it is profound: Manson explains that believing we are "too special" leads us to unrealistic expectations, perfectionism, and chronic frustration.
        </p>

        <p class="font-medium text-slate-900 dark:text-slate-100">
          Accepting our human condition brings... relief.
        </p>
        
        <p>
          You don't need to be extraordinary.
          You just need to be consistent with your values.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">⚔️ Assume Radical Responsibility</h2>
        
        <blockquote class="border-l-4 border-primary pl-4 italic text-slate-600 dark:text-slate-400 my-6">
          “You are not to blame for everything that happens to you.
          But you are responsible for how you react to what happens.”
        </blockquote>

        <p>This shift in attitude transforms relationships, finances, career, and self-esteem.</p>
        <p class="font-bold text-primary">Responsibility = freedom.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧘 The “F*ck It” Feedback Loop</h2>
        
        <p>He explains that we seek things that make us feel good—but that actually leave us empty.</p>
        
        <ul class="list-disc pl-6 space-y-2 marker:text-primary">
          <li>wanting to be admired → turns into insecurity</li>
          <li>wanting to be happy at all costs → turns into anxiety</li>
          <li>wanting to be powerful → turns into fear of failure</li>
        </ul>

        <p>By letting go of these cycles, you regain control.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🌱 Suffering is Inevitable — and That is Good</h2>
        
        <p>Manson says that life is made of losses, failures, rejections, and limitations.</p>

        <div class="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl text-center">
          <p class="text-sm text-slate-500 mb-2">The right question is not: "How to avoid suffering?"</p>
          <p class="font-bold text-xl text-slate-900 dark:text-slate-100">But: "What is worth suffering for?"</p>
        </div>

        <p class="mt-4 text-center font-medium text-primary">This question changes everything.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🔧 Practical Tools to Apply Today</h2>
        
        <div class="space-y-6">
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">1</div>
            <div>
              <h4 class="font-bold text-lg">Define your good values</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Responsibility, honesty, courage, purpose.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">2</div>
            <div>
              <h4 class="font-bold text-lg">Say no more often</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Protect your time.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">3</div>
            <div>
              <h4 class="font-bold text-lg">Stop running from problems</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Choose problems aligned with your values.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">4</div>
            <div>
              <h4 class="font-bold text-lg">Accept that you are fallible</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Making mistakes is part of it—this reduces anxiety.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">5</div>
            <div>
              <h4 class="font-bold text-lg">Question your desires</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Not everything you want really matters.</p>
            </div>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">⭐ Main Lessons from the Book</h2>
        
        <ul class="grid gap-3 md:grid-cols-2">
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Trying to be too positive makes you unhappy
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> You need to choose meaningful problems
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Bad values create bad lives
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> You don't control everything—but you control your response
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> You can't care about everything
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Inevitable suffering → inevitable growth
          </li>
        </ul>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusion</h2>
        
        <p>
          <strong>The Subtle Art of Not Giving a F*ck</strong> is a manifesto of emotional freedom.
          It shows that life improves when you:
        </p>
        
        <ul class="list-disc pl-6 space-y-2 marker:text-primary mb-6">
          <li>stop trying to please everyone</li>
          <li>choose your values</li>
          <li>embrace your limits</li>
          <li>and focus only on what really matters</li>
        </ul>

        <p class="font-medium text-xl text-center my-8 text-primary">
          Living well is not caring more.<br/>
          It is caring better.
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-20',
    language: 'en',
    tags: ['Mindset', 'Stoicism', 'Personal Development', 'Psychology']
  },
  {
    id: '12',
    slug: 'el-sutil-arte-de-que-te-importe-un-carajo',
    title: 'El Sutil Arte de Que Te Importe Un Caraj* – Cómo Dejar de Preocuparse por Lo Que No Importa (Resumen 2025)',
    excerpt: 'Resumen completo de El Sutil Arte de Que Te Importe Un Caraj*. Aprende a elegir tus batallas, definir tus valores y vivir una vida más ligera y auténtica.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100 italic">
          “Deja de intentar ser increíble todo el tiempo.”
        </p>
        
        <p>
          Este es el golpe frontal que Mark Manson da justo al comienzo del libro.
          En un mundo obsesionado con la positividad, los logros y la apariencia perfecta, él muestra que:
        </p>
        
        <ul class="list-disc pl-6 space-y-2 marker:text-primary">
          <li>la vida es limitada</li>
          <li>nuestra energía es limitada</li>
          <li>nuestro tiempo es limitado</li>
          <li>y por eso debemos elegir dónde invertir nuestro caraj*</li>
        </ul>

        <div class="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl border-l-4 border-primary my-8">
          <p class="font-bold text-lg text-slate-900 dark:text-slate-100">La tesis central es simple y poderosa:</p>
          <p class="mt-2 text-slate-700 dark:text-slate-300">Quien intenta preocuparse por todo termina no preocupándose por nada.</p>
        </div>

        <p>Este resumen trae las ideas principales del libro y cómo aplicarlas en la vida real.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">💥 La Ilusión de la Positividad Tóxica</h2>
        
        <p>Manson critica la “dictadura de la felicidad” — esa presión para ser feliz, productivo y confiado todo el tiempo.</p>
        
        <p>Esto genera:</p>
        <div class="flex flex-wrap gap-2 my-4">
          <span class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium">ansiedad</span>
          <span class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium">comparación</span>
          <span class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium">sensación de fracaso</span>
          <span class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium">culpa</span>
          <span class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium">autosabotaje</span>
        </div>

        <p class="font-medium text-green-600 dark:text-green-400">
          ¿La cura? Aceptar que la vida está hecha de problemas — y que nuestro crecimiento depende de qué problemas elegimos enfrentar.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🎯 Necesitas Elegir Tus Problemas (no huir de ellos)</h2>
        
        <p>Al contrario de lo que mucha gente piensa:</p>
        <ul class="list-disc pl-6 space-y-2 marker:text-primary">
          <li>las personas felices no tienen menos problemas</li>
          <li>tienen mejores problemas</li>
          <li>problemas que tienen sentido</li>
          <li>problemas que están alineados con sus valores</li>
        </ul>

        <div class="bg-primary/10 p-4 rounded-lg text-center font-bold text-primary mt-4">
          Felicidad = enfrentar desafíos significativos.
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧠 El Poder de los Valores (y cómo te destruyen o te salvan)</h2>
        
        <p>Manson explica que gran parte del sufrimiento proviene de valores malos.</p>

        <div class="grid md:grid-cols-2 gap-6 my-8">
          <div class="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-100 dark:border-red-900/20">
            <h3 class="font-bold text-red-800 dark:text-red-300 text-lg mb-4">Valores Malos 👎</h3>
            <ul class="space-y-2 text-sm text-red-700 dark:text-red-400">
              <li>• Querer parecer perfecto</li>
              <li>• Querer ser amado por todos</li>
              <li>• Querer tener razón siempre</li>
              <li>• Buscar control total</li>
              <li>• Depender de la validación externa</li>
            </ul>
            <p class="mt-4 font-bold text-red-800 dark:text-red-300 text-center">Valores malos → vida mala.</p>
          </div>
          
          <div class="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border border-green-100 dark:border-green-900/20">
            <h3 class="font-bold text-green-800 dark:text-green-300 text-lg mb-4">Valores Buenos 👍</h3>
            <ul class="space-y-2 text-sm text-green-700 dark:text-green-400">
              <li>• Responsabilidad</li>
              <li>• Honestidad</li>
              <li>• Coraje</li>
              <li>• Disciplina</li>
              <li>• Contribuir con algo mayor</li>
            </ul>
            <p class="mt-4 font-bold text-green-800 dark:text-green-300 text-center">Valores buenos → vida mejor.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">❌ “No eres especial” — La lección más liberadora del libro</h2>
        
        <p>
          Puede parecer rudo, pero es profundo: Manson explica que creer que somos “demasiado especiales” nos lleva a expectativas irreales, perfeccionismo y frustración crónica.
        </p>

        <p class="font-medium text-slate-900 dark:text-slate-100">
          Aceptar nuestra condición humana trae… alivio.
        </p>
        
        <p>
          No necesitas ser extraordinario.
          Solo necesitas ser consistente con tus valores.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">⚔️ Asume Responsabilidad Radical</h2>
        
        <blockquote class="border-l-4 border-primary pl-4 italic text-slate-600 dark:text-slate-400 my-6">
          “No eres culpable de todo lo que te sucede.
          Pero eres responsable de cómo reaccionas a lo que sucede.”
        </blockquote>

        <p>Este cambio de actitud transforma relaciones, finanzas, carrera y autoestima.</p>
        <p class="font-bold text-primary">Responsabilidad = libertad.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧘 El Ciclo de Retroalimentación “Del Caraj*”</h2>
        
        <p>Él explica que buscamos cosas que nos hacen sentir bien — pero que, en realidad, nos dejan vacíos.</p>
        
        <ul class="list-disc pl-6 space-y-2 marker:text-primary">
          <li>querer ser admirado → se convierte en inseguridad</li>
          <li>querer ser feliz a toda costa → se convierte en ansiedad</li>
          <li>querer ser poderoso → se convierte en miedo a fracasar</li>
        </ul>

        <p>Al soltar estos ciclos, recuperas el control.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🌱 El Sufrimiento es Inevitable — y Eso es Bueno</h2>
        
        <p>Manson dice que la vida está hecha de pérdidas, fracasos, rechazos y limitaciones.</p>

        <div class="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl text-center">
          <p class="text-sm text-slate-500 mb-2">La pregunta correcta no es: “¿Cómo evitar el sufrimiento?”</p>
          <p class="font-bold text-xl text-slate-900 dark:text-slate-100">Sino: “¿Por qué vale la pena sufrir?”</p>
        </div>

        <p class="mt-4 text-center font-medium text-primary">Esta pregunta cambia todo.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🔧 Herramientas Prácticas para Aplicar Hoy</h2>
        
        <div class="space-y-6">
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">1</div>
            <div>
              <h4 class="font-bold text-lg">Define tus valores buenos</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Responsabilidad, honestidad, coraje, propósito.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">2</div>
            <div>
              <h4 class="font-bold text-lg">Di no con más frecuencia</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Protege tu tiempo.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">3</div>
            <div>
              <h4 class="font-bold text-lg">Deja de huir de los problemas</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Elige problemas alineados con tus valores.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">4</div>
            <div>
              <h4 class="font-bold text-lg">Acepta que eres falible</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Equivocarse es parte de ello — esto reduce la ansiedad.</p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex-none w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">5</div>
            <div>
              <h4 class="font-bold text-lg">Cuestiona tus deseos</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">No todo lo que quieres realmente importa.</p>
            </div>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">⭐ Lecciones Principales del Libro</h2>
        
        <ul class="grid gap-3 md:grid-cols-2">
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Intentar ser demasiado positivo te hace infeliz
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Necesitas elegir problemas significativos
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Los valores malos crean vidas malas
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> No controlas todo — pero controlas tu respuesta
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> No puedes preocuparte por todo
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Sufrimiento inevitable → crecimiento inevitable
          </li>
        </ul>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusión</h2>
        
        <p>
          <strong>El Sutil Arte de Que Te Importe Un Caraj*</strong> es un manifiesto de libertad emocional.
          Muestra que la vida mejora cuando:
        </p>
        
        <ul class="list-disc pl-6 space-y-2 marker:text-primary mb-6">
          <li>dejas de intentar complacer a todos</li>
          <li>eliges tus valores</li>
          <li>abrazas tus límites</li>
          <li>y te enfocas solo en lo que realmente importa</li>
        </ul>

        <p class="font-medium text-xl text-center my-8 text-primary">
          Vivir bien no es preocuparse más.<br/>
          Es preocuparse mejor.
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-20',
    language: 'es',
    tags: ['Mindset', 'Estoicismo', 'Desarrollo Personal', 'Psicología']
  },
  {
    id: '11',
    slug: 'pai-rico-pai-pobre',
    title: 'Pai Rico, Pai Pobre — As Lições Que Transformam Sua Mente Financeira (Resumo Completo 2025)',
    excerpt: 'Resumo de Pai Rico Pai Pobre: entenda ativos, passivos, mentalidade rica, liberdade financeira e as principais lições de Robert Kiyosaki.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100">
          <strong>Pai Rico, Pai Pobre</strong> é um dos livros mais influentes do mundo sobre educação financeira.
          Robert Kiyosaki conta a história dos dois “pais” que moldaram sua visão:
        </p>
        
        <div class="grid md:grid-cols-2 gap-6 my-8">
          <div class="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-lg mb-2">👨‍💼 Pai Pobre</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">Mentalidade tradicional, focado em estabilidade.</p>
          </div>
          <div class="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border border-green-100 dark:border-green-900/20">
            <h3 class="font-bold text-green-800 dark:text-green-300 text-lg mb-2">🤵 Pai Rico</h3>
            <p class="text-sm text-green-700 dark:text-green-400">Mentalidade de liberdade, focado em ativos e riqueza.</p>
          </div>
        </div>

        <p>O livro mostra por que a escola não ensina sobre dinheiro e como criar uma mentalidade que atrai prosperidade de forma prática.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧠 Pai Rico vs. Pai Pobre: A Diferença Começa na Mente</h2>
        
        <div class="grid md:grid-cols-2 gap-8 my-8">
          <div class="space-y-4">
            <h4 class="font-bold text-red-600 dark:text-red-400 border-b border-red-200 dark:border-red-800 pb-2">Pai Pobre dizia:</h4>
            <ul class="space-y-3 italic text-slate-600 dark:text-slate-400">
              <li>“Estude para conseguir um bom emprego.”</li>
              <li>“Evite riscos.”</li>
              <li>“Ter casa própria é o maior investimento.”</li>
              <li>“Dinheiro não é tudo.”</li>
            </ul>
          </div>
          <div class="space-y-4">
            <h4 class="font-bold text-green-600 dark:text-green-400 border-b border-green-200 dark:border-green-800 pb-2">Pai Rico dizia:</h4>
            <ul class="space-y-3 font-medium text-slate-800 dark:text-slate-200">
              <li>“Estude para aprender a criar dinheiro.”</li>
              <li>“Assuma riscos calculados.”</li>
              <li>“Sua casa é um passivo.”</li>
              <li>“Dinheiro é uma ferramenta poderosa.”</li>
            </ul>
          </div>
        </div>

        <div class="bg-primary/10 p-6 rounded-xl text-center">
          <p class="font-bold text-primary text-lg">A primeira e maior lição do livro é:</p>
          <p class="mt-2 text-slate-700 dark:text-slate-300">Os ricos pensam diferente. Por isso agem diferente e por isso têm resultados diferentes.</p>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">💰 A Lição Central: Ativos vs. Passivos</h2>
        
        <p>Este é o coração do livro.</p>

        <div class="grid md:grid-cols-2 gap-6 my-8">
          <div class="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border-l-4 border-green-500">
            <h3 class="font-bold text-green-800 dark:text-green-300 text-xl mb-4">Ativo 📈</h3>
            <p class="font-medium mb-4">Coloca dinheiro no seu bolso</p>
            <ul class="text-sm space-y-1 text-green-700 dark:text-green-400">
              <li>• Negócios</li>
              <li>• Imóveis de renda</li>
              <li>• Dividendos</li>
              <li>• Royalties</li>
              <li>• Criação de conteúdos</li>
              <li>• Ações</li>
              <li>• Propriedade intelectual</li>
            </ul>
          </div>
          
          <div class="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border-l-4 border-red-500">
            <h3 class="font-bold text-red-800 dark:text-red-300 text-xl mb-4">Passivo 📉</h3>
            <p class="font-medium mb-4">Tira dinheiro do seu bolso</p>
            <ul class="text-sm space-y-1 text-red-700 dark:text-red-400">
              <li>• Carro</li>
              <li>• Parcelamentos</li>
              <li>• Dívidas</li>
              <li>• Financiamentos</li>
              <li>• Casa própria sem renda</li>
            </ul>
          </div>
        </div>

        <p class="text-center italic text-slate-600 dark:text-slate-400">
          O erro comum da classe média: confundir passivo com ativo.<br/>
          A pessoa acha que está investindo — mas está só aumentando despesas.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">📉 A Corrida dos Ratos: O Ciclo que Prende 90% das Pessoas</h2>
        
        <div class="flex items-center justify-center my-8 text-center font-bold text-slate-700 dark:text-slate-300">
          Trabalhar → Ganhar Salário → Pagar Contas → Esperar Próximo Salário
        </div>

        <p>
          Quanto mais a pessoa ganha, mais aumenta suas despesas.
          Resultado? Vida inteira presa no mesmo ciclo.
        </p>

        <blockquote class="border-l-4 border-primary pl-4 italic text-slate-600 dark:text-slate-400 my-6">
          “O salário te mantém vivo. Seus ativos te tornam livre.”
        </blockquote>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🚀 A Riqueza Começa com Educação Financeira</h2>
        
        <p>O autor afirma que a verdadeira liberdade vem de:</p>
        <ul class="list-check pl-0 space-y-2 text-slate-700 dark:text-slate-300">
          <li>✓ Entender como o dinheiro funciona</li>
          <li>✓ Saber criar ativos</li>
          <li>✓ Aprender sobre negócios</li>
          <li>✓ Entender impostos</li>
          <li>✓ Dominar investimentos</li>
          <li>✓ Controlar emoções sobre dinheiro</li>
        </ul>

        <p class="font-bold text-primary mt-4">Educação financeira muda destino.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">📚 As 6 Grandes Lições de Pai Rico Pai Pobre</h2>
        
        <div class="space-y-6">
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <h4 class="font-bold text-lg text-primary">1. Os ricos não trabalham por dinheiro</h4>
            <p class="text-sm mt-1">Eles fazem o dinheiro trabalhar para eles. (Salário = limitado / Ativos = ilimitados)</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <h4 class="font-bold text-lg text-primary">2. Educação financeira é fundamental</h4>
            <p class="text-sm mt-1">Você não pode controlar o que não entende.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <h4 class="font-bold text-lg text-primary">3. Tenha um negócio próprio (mesmo que paralelo)</h4>
            <p class="text-sm mt-1">Pode começar pequeno, mas precisa começar.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <h4 class="font-bold text-lg text-primary">4. Invista em ativos primeiro, conforto depois</h4>
            <p class="text-sm mt-1">A mentalidade comum é o inverso: conforto agora, dívida para pagar por décadas.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <h4 class="font-bold text-lg text-primary">5. O medo e as crenças limitantes empobrecem</h4>
            <p class="text-sm mt-1">Medo de perder impede de ganhar.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <h4 class="font-bold text-lg text-primary">6. Faça o dinheiro se multiplicar</h4>
            <p class="text-sm mt-1">Use: juros compostos, renda passiva, negócios escaláveis, ativos reais.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧩 Como aplicar Pai Rico Pai Pobre hoje</h2>
        
        <ul class="space-y-4">
          <li class="flex items-start gap-3">
            <div class="bg-green-100 text-green-700 rounded-full p-1 mt-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>
            <div>
              <strong class="block text-slate-900 dark:text-slate-100">1. Liste seus ativos e passivos</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Isso abre seus olhos imediatamente.</span>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <div class="bg-green-100 text-green-700 rounded-full p-1 mt-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>
            <div>
              <strong class="block text-slate-900 dark:text-slate-100">2. Corte passivos desnecessários</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Libere fluxo de caixa.</span>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <div class="bg-green-100 text-green-700 rounded-full p-1 mt-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>
            <div>
              <strong class="block text-slate-900 dark:text-slate-100">3. Comece um ativo pequeno</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Blog, app, canal, infoproduto, investimento — qualquer um.</span>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <div class="bg-green-100 text-green-700 rounded-full p-1 mt-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>
            <div>
              <strong class="block text-slate-900 dark:text-slate-100">4. Aumente sua inteligência financeira diariamente</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Ler, estudar, entender.</span>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <div class="bg-green-100 text-green-700 rounded-full p-1 mt-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>
            <div>
              <strong class="block text-slate-900 dark:text-slate-100">5. Crie múltiplas fontes de renda</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Não dependa de uma única fonte jamais.</span>
            </div>
          </li>
        </ul>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🌟 O que você aprende de verdade com o livro?</h2>
        
        <ul class="grid gap-3 md:grid-cols-2">
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Liberdade custa disciplina
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Ganhar mais não significa enriquecer
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Escola não prepara ninguém para a vida financeira
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Os ricos investem antes de gastar
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Renda passiva é a chave
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Riqueza é tempo + escolhas inteligentes
          </li>
        </ul>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusão</h2>
        
        <p>
          <strong>Pai Rico, Pai Pobre</strong> não é um livro sobre atalhos.
          É um livro sobre mentalidade, liberdade e movimento.
        </p>

        <p class="text-center my-6">
          A mensagem final de Kiyosaki é simples:<br/>
          <strong>Você se torna rico pelo que aprende — não pelo que ganha.</strong>
        </p>

        <p class="font-medium text-xl text-center my-8 text-primary">
          A riqueza começa dentro da mente.<br/>
          E continua nas ações diárias.
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-19',
    language: 'pt',
    tags: ['Finanças', 'Investimentos', 'Mentalidade', 'Riqueza']
  },
  {
    id: '12',
    slug: 'rich-dad-poor-dad',
    title: 'Rich Dad Poor Dad — The Lessons That Transform Your Financial Mind (2025 Complete Summary)',
    excerpt: 'Summary of Rich Dad Poor Dad: understand assets, liabilities, rich mindset, financial freedom, and Robert Kiyosaki\'s key lessons.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100">
          <strong>Rich Dad Poor Dad</strong> is one of the most influential books in the world on financial education.
          Robert Kiyosaki tells the story of the two "dads" who shaped his vision:
        </p>
        
        <div class="grid md:grid-cols-2 gap-6 my-8">
          <div class="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-lg mb-2">👨‍💼 Poor Dad</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">Traditional mindset, focused on stability.</p>
          </div>
          <div class="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border border-green-100 dark:border-green-900/20">
            <h3 class="font-bold text-green-800 dark:text-green-300 text-lg mb-2">🤵 Rich Dad</h3>
            <p class="text-sm text-green-700 dark:text-green-400">Freedom mindset, focused on assets and wealth.</p>
          </div>
        </div>

        <p>The book shows why school doesn't teach about money and how to create a mindset that attracts prosperity in a practical way.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧠 Rich Dad vs. Poor Dad: The Difference Starts in the Mind</h2>
        
        <div class="grid md:grid-cols-2 gap-8 my-8">
          <div class="space-y-4">
            <h4 class="font-bold text-red-600 dark:text-red-400 border-b border-red-200 dark:border-red-800 pb-2">Poor Dad said:</h4>
            <ul class="space-y-3 italic text-slate-600 dark:text-slate-400">
              <li>“Study to get a good job.”</li>
              <li>“Avoid risks.”</li>
              <li>“Owning a home is the biggest investment.”</li>
              <li>“Money isn't everything.”</li>
            </ul>
          </div>
          <div class="space-y-4">
            <h4 class="font-bold text-green-600 dark:text-green-400 border-b border-green-200 dark:border-green-800 pb-2">Rich Dad said:</h4>
            <ul class="space-y-3 font-medium text-slate-800 dark:text-slate-200">
              <li>“Study to learn how to create money.”</li>
              <li>“Take calculated risks.”</li>
              <li>“Your house is a liability.”</li>
              <li>“Money is a powerful tool.”</li>
            </ul>
          </div>
        </div>

        <div class="bg-primary/10 p-6 rounded-xl text-center">
          <p class="font-bold text-primary text-lg">The first and biggest lesson of the book is:</p>
          <p class="mt-2 text-slate-700 dark:text-slate-300">The rich think differently. That's why they act differently and that's why they have different results.</p>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">💰 The Core Lesson: Assets vs. Liabilities</h2>
        
        <p>This is the heart of the book.</p>

        <div class="grid md:grid-cols-2 gap-6 my-8">
          <div class="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border-l-4 border-green-500">
            <h3 class="font-bold text-green-800 dark:text-green-300 text-xl mb-4">Asset 📈</h3>
            <p class="font-medium mb-4">Puts money in your pocket</p>
            <ul class="text-sm space-y-1 text-green-700 dark:text-green-400">
              <li>• Businesses</li>
              <li>• Rental properties</li>
              <li>• Dividends</li>
              <li>• Royalties</li>
              <li>• Content creation</li>
              <li>• Stocks</li>
              <li>• Intellectual property</li>
            </ul>
          </div>
          
          <div class="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border-l-4 border-red-500">
            <h3 class="font-bold text-red-800 dark:text-red-300 text-xl mb-4">Liability 📉</h3>
            <p class="font-medium mb-4">Takes money out of your pocket</p>
            <ul class="text-sm space-y-1 text-red-700 dark:text-red-400">
              <li>• Car</li>
              <li>• Installments</li>
              <li>• Debts</li>
              <li>• Loans</li>
              <li>• Home ownership without income</li>
            </ul>
          </div>
        </div>

        <p class="text-center italic text-slate-600 dark:text-slate-400">
          The common mistake of the middle class: confusing liabilities with assets.<br/>
          The person thinks they are investing—but they are just increasing expenses.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">📉 The Rat Race: The Cycle That Traps 90% of People</h2>
        
        <div class="flex items-center justify-center my-8 text-center font-bold text-slate-700 dark:text-slate-300">
          Work → Earn Salary → Pay Bills → Wait for Next Salary
        </div>

        <p>
          The more a person earns, the more they increase their expenses.
          Result? A lifetime trapped in the same cycle.
        </p>

        <blockquote class="border-l-4 border-primary pl-4 italic text-slate-600 dark:text-slate-400 my-6">
          “The salary keeps you alive. Your assets make you free.”
        </blockquote>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🚀 Wealth Starts with Financial Education</h2>
        
        <p>The author states that true freedom comes from:</p>
        <ul class="list-check pl-0 space-y-2 text-slate-700 dark:text-slate-300">
          <li>✓ Understanding how money works</li>
          <li>✓ Knowing how to create assets</li>
          <li>✓ Learning about business</li>
          <li>✓ Understanding taxes</li>
          <li>✓ Mastering investments</li>
          <li>✓ Controlling emotions about money</li>
        </ul>

        <p class="font-bold text-primary mt-4">Financial education changes destiny.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">📚 The 6 Big Lessons of Rich Dad Poor Dad</h2>
        
        <div class="space-y-6">
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <h4 class="font-bold text-lg text-primary">1. The rich don't work for money</h4>
            <p class="text-sm mt-1">They make money work for them. (Salary = limited / Assets = unlimited)</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <h4 class="font-bold text-lg text-primary">2. Financial education is fundamental</h4>
            <p class="text-sm mt-1">You cannot control what you don't understand.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <h4 class="font-bold text-lg text-primary">3. Have your own business (even if on the side)</h4>
            <p class="text-sm mt-1">You can start small, but you need to start.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <h4 class="font-bold text-lg text-primary">4. Invest in assets first, comfort later</h4>
            <p class="text-sm mt-1">The common mindset is the reverse: comfort now, debt to pay for decades.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <h4 class="font-bold text-lg text-primary">5. Fear and limiting beliefs impoverish</h4>
            <p class="text-sm mt-1">Fear of losing prevents winning.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <h4 class="font-bold text-lg text-primary">6. Make money multiply</h4>
            <p class="text-sm mt-1">Use: compound interest, passive income, scalable businesses, real assets.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧩 How to apply Rich Dad Poor Dad today</h2>
        
        <ul class="space-y-4">
          <li class="flex items-start gap-3">
            <div class="bg-green-100 text-green-700 rounded-full p-1 mt-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>
            <div>
              <strong class="block text-slate-900 dark:text-slate-100">1. List your assets and liabilities</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">This opens your eyes immediately.</span>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <div class="bg-green-100 text-green-700 rounded-full p-1 mt-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>
            <div>
              <strong class="block text-slate-900 dark:text-slate-100">2. Cut unnecessary liabilities</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Free up cash flow.</span>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <div class="bg-green-100 text-green-700 rounded-full p-1 mt-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>
            <div>
              <strong class="block text-slate-900 dark:text-slate-100">3. Start a small asset</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Blog, app, channel, info product, investment—anything.</span>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <div class="bg-green-100 text-green-700 rounded-full p-1 mt-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>
            <div>
              <strong class="block text-slate-900 dark:text-slate-100">4. Increase your financial intelligence daily</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Read, study, understand.</span>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <div class="bg-green-100 text-green-700 rounded-full p-1 mt-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>
            <div>
              <strong class="block text-slate-900 dark:text-slate-100">5. Create multiple sources of income</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Never depend on a single source.</span>
            </div>
          </li>
        </ul>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🌟 What do you really learn from the book?</h2>
        
        <ul class="grid gap-3 md:grid-cols-2">
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Freedom costs discipline
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Earning more doesn't mean getting rich
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> School prepares no one for financial life
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> The rich invest before spending
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Passive income is the key
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Wealth is time + smart choices
          </li>
        </ul>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusion</h2>
        
        <p>
          <strong>Rich Dad Poor Dad</strong> is not a book about shortcuts.
          It is a book about mindset, freedom, and movement.
        </p>

        <p class="text-center my-6">
          Kiyosaki's final message is simple:<br/>
          <strong>You become rich by what you learn—not by what you earn.</strong>
        </p>

        <p class="font-medium text-xl text-center my-8 text-primary">
          Wealth starts inside the mind.<br/>
          And continues in daily actions.
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-19',
    language: 'en',
    tags: ['Finance', 'Investments', 'Mindset', 'Wealth']
  },
  {
    id: '13',
    slug: 'padre-rico-padre-pobre',
    title: 'Padre Rico, Padre Pobre — Las Lecciones Que Transforman Tu Mente Financiera (Resumen Completo 2025)',
    excerpt: 'Resumen de Padre Rico Padre Pobre: entiende activos, pasivos, mentalidad rica, libertad financiera y las principales lecciones de Robert Kiyosaki.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100">
          <strong>Padre Rico, Padre Pobre</strong> es uno de los libros más influyentes del mundo sobre educación financiera.
          Robert Kiyosaki cuenta la historia de los dos “padres” que moldearon su visión:
        </p>
        
        <div class="grid md:grid-cols-2 gap-6 my-8">
          <div class="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-lg mb-2">👨‍💼 Padre Pobre</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">Mentalidad tradicional, enfocado en la estabilidad.</p>
          </div>
          <div class="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border border-green-100 dark:border-green-900/20">
            <h3 class="font-bold text-green-800 dark:text-green-300 text-lg mb-2">🤵 Padre Rico</h3>
            <p class="text-sm text-green-700 dark:text-green-400">Mentalidad de libertad, enfocado en activos y riqueza.</p>
          </div>
        </div>

        <p>El libro muestra por qué la escuela no enseña sobre dinero y cómo crear una mentalidad que atrae prosperidad de forma práctica.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧠 Padre Rico vs. Padre Pobre: La Diferencia Comienza en la Mente</h2>
        
        <div class="grid md:grid-cols-2 gap-8 my-8">
          <div class="space-y-4">
            <h4 class="font-bold text-red-600 dark:text-red-400 border-b border-red-200 dark:border-red-800 pb-2">Padre Pobre decía:</h4>
            <ul class="space-y-3 italic text-slate-600 dark:text-slate-400">
              <li>“Estudia para conseguir un buen empleo.”</li>
              <li>“Evita riesgos.”</li>
              <li>“Tener casa propia es la mayor inversión.”</li>
              <li>“El dinero no lo es todo.”</li>
            </ul>
          </div>
          <div class="space-y-4">
            <h4 class="font-bold text-green-600 dark:text-green-400 border-b border-green-200 dark:border-green-800 pb-2">Padre Rico decía:</h4>
            <ul class="space-y-3 font-medium text-slate-800 dark:text-slate-200">
              <li>“Estudia para aprender a crear dinero.”</li>
              <li>“Asume riesgos calculados.”</li>
              <li>“Tu casa es un pasivo.”</li>
              <li>“El dinero es una herramienta poderosa.”</li>
            </ul>
          </div>
        </div>

        <div class="bg-primary/10 p-6 rounded-xl text-center">
          <p class="font-bold text-primary text-lg">La primera y mayor lección del libro es:</p>
          <p class="mt-2 text-slate-700 dark:text-slate-300">Los ricos piensan diferente. Por eso actúan diferente y por eso tienen resultados diferentes.</p>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">💰 La Lección Central: Activos vs. Pasivos</h2>
        
        <p>Este es el corazón del libro.</p>

        <div class="grid md:grid-cols-2 gap-6 my-8">
          <div class="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border-l-4 border-green-500">
            <h3 class="font-bold text-green-800 dark:text-green-300 text-xl mb-4">Activo 📈</h3>
            <p class="font-medium mb-4">Pone dinero en tu bolsillo</p>
            <ul class="text-sm space-y-1 text-green-700 dark:text-green-400">
              <li>• Negocios</li>
              <li>• Inmuebles de renta</li>
              <li>• Dividendos</li>
              <li>• Regalías</li>
              <li>• Creación de contenidos</li>
              <li>• Acciones</li>
              <li>• Propiedad intelectual</li>
            </ul>
          </div>
          
          <div class="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border-l-4 border-red-500">
            <h3 class="font-bold text-red-800 dark:text-red-300 text-xl mb-4">Pasivo 📉</h3>
            <p class="font-medium mb-4">Saca dinero de tu bolsillo</p>
            <ul class="text-sm space-y-1 text-red-700 dark:text-red-400">
              <li>• Coche</li>
              <li>• Cuotas</li>
              <li>• Deudas</li>
              <li>• Préstamos</li>
              <li>• Casa propia sin ingresos</li>
            </ul>
          </div>
        </div>

        <p class="text-center italic text-slate-600 dark:text-slate-400">
          El error común de la clase media: confundir pasivo con activo.<br/>
          La persona cree que está invirtiendo — pero solo está aumentando gastos.
        </p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">📉 La Carrera de la Rata: El Ciclo que Atrapa al 90% de las Personas</h2>
        
        <div class="flex items-center justify-center my-8 text-center font-bold text-slate-700 dark:text-slate-300">
          Trabajar → Ganar Salario → Pagar Cuentas → Esperar Próximo Salario
        </div>

        <p>
          Cuanto más gana la persona, más aumenta sus gastos.
          ¿Resultado? Vida entera atrapada en el mismo ciclo.
        </p>

        <blockquote class="border-l-4 border-primary pl-4 italic text-slate-600 dark:text-slate-400 my-6">
          “El salario te mantiene vivo. Tus activos te hacen libre.”
        </blockquote>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🚀 La Riqueza Comienza con Educación Financiera</h2>
        
        <p>El autor afirma que la verdadera libertad viene de:</p>
        <ul class="list-check pl-0 space-y-2 text-slate-700 dark:text-slate-300">
          <li>✓ Entender cómo funciona el dinero</li>
          <li>✓ Saber crear activos</li>
          <li>✓ Aprender sobre negocios</li>
          <li>✓ Entender impuestos</li>
          <li>✓ Dominar inversiones</li>
          <li>✓ Controlar emociones sobre el dinero</li>
        </ul>

        <p class="font-bold text-primary mt-4">La educación financiera cambia el destino.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">📚 Las 6 Grandes Lecciones de Padre Rico Padre Pobre</h2>
        
        <div class="space-y-6">
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <h4 class="font-bold text-lg text-primary">1. Los ricos no trabajan por dinero</h4>
            <p class="text-sm mt-1">Hacen que el dinero trabaje para ellos. (Salario = limitado / Activos = ilimitados)</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <h4 class="font-bold text-lg text-primary">2. La educación financiera es fundamental</h4>
            <p class="text-sm mt-1">No puedes controlar lo que no entiendes.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <h4 class="font-bold text-lg text-primary">3. Ten un negocio propio (aunque sea paralelo)</h4>
            <p class="text-sm mt-1">Puedes empezar pequeño, pero necesitas empezar.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <h4 class="font-bold text-lg text-primary">4. Invierte en activos primero, comodidad después</h4>
            <p class="text-sm mt-1">La mentalidad común es al revés: comodidad ahora, deuda para pagar por décadas.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <h4 class="font-bold text-lg text-primary">5. El miedo y las creencias limitantes empobrecen</h4>
            <p class="text-sm mt-1">El miedo a perder impide ganar.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
            <h4 class="font-bold text-lg text-primary">6. Haz que el dinero se multiplique</h4>
            <p class="text-sm mt-1">Usa: interés compuesto, ingresos pasivos, negocios escalables, activos reales.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧩 Cómo aplicar Padre Rico Padre Pobre hoy</h2>
        
        <ul class="space-y-4">
          <li class="flex items-start gap-3">
            <div class="bg-green-100 text-green-700 rounded-full p-1 mt-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>
            <div>
              <strong class="block text-slate-900 dark:text-slate-100">1. Lista tus activos y pasivos</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Esto abre tus ojos inmediatamente.</span>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <div class="bg-green-100 text-green-700 rounded-full p-1 mt-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>
            <div>
              <strong class="block text-slate-900 dark:text-slate-100">2. Corta pasivos innecesarios</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Libera flujo de caja.</span>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <div class="bg-green-100 text-green-700 rounded-full p-1 mt-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>
            <div>
              <strong class="block text-slate-900 dark:text-slate-100">3. Comienza un activo pequeño</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Blog, app, canal, infoproducto, inversión — cualquiera.</span>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <div class="bg-green-100 text-green-700 rounded-full p-1 mt-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>
            <div>
              <strong class="block text-slate-900 dark:text-slate-100">4. Aumenta tu inteligencia financiera diariamente</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Leer, estudiar, entender.</span>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <div class="bg-green-100 text-green-700 rounded-full p-1 mt-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>
            <div>
              <strong class="block text-slate-900 dark:text-slate-100">5. Crea múltiples fuentes de ingresos</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">No dependas de una única fuente jamás.</span>
            </div>
          </li>
        </ul>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🌟 ¿Qué aprendes de verdad con el libro?</h2>
        
        <ul class="grid gap-3 md:grid-cols-2">
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> La libertad cuesta disciplina
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Ganar más no significa enriquecerse
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> La escuela no prepara a nadie para la vida financiera
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Los ricos invierten antes de gastar
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Los ingresos pasivos son la clave
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> La riqueza es tiempo + elecciones inteligentes
          </li>
        </ul>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusión</h2>
        
        <p>
          <strong>Padre Rico, Padre Pobre</strong> no es un libro sobre atajos.
          Es un libro sobre mentalidad, libertad y movimiento.
        </p>

        <p class="text-center my-6">
          El mensaje final de Kiyosaki es simple:<br/>
          <strong>Te vuelves rico por lo que aprendes — no por lo que ganas.</strong>
        </p>

        <p class="font-medium text-xl text-center my-8 text-primary">
          La riqueza comienza dentro de la mente.<br/>
          Y continúa en las acciones diarias.
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-19',
    language: 'es',
    tags: ['Finanzas', 'Inversiones', 'Mentalidad', 'Riqueza']
  },
  {
    id: '14',
    slug: 'o-homem-mais-rico-da-babilonia',
    title: 'O Homem Mais Rico da Babilônia – Lições Eternas Sobre Riqueza e Prosperidade (Resumo Completo 2025)',
    excerpt: 'Resumo completo de O Homem Mais Rico da Babilônia. Aprenda as regras eternas da riqueza: poupar, investir, controlar gastos e fazer o dinheiro trabalhar por você.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100">
          Publicado em 1926, <strong>O Homem Mais Rico da Babilônia</strong> tornou-se um dos maiores clássicos de finanças pessoais da história.
          Com parábolas ambientadas na antiga Babilônia, o autor George S. Clason mostra que a prosperidade não depende de sorte, e sim de princípios financeiros atemporais.
        </p>
        
        <p>O livro explica como qualquer pessoa — independente de origem — pode construir riqueza através de:</p>
        <ul class="grid md:grid-cols-2 gap-3 my-6">
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Disciplina</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Organização</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Investimentos</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Controle emocional</li>
        </ul>

        <p class="italic text-center">E tudo isso contado através de histórias simples, mas poderosas.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🪙 As 7 Regras de Ouro da Riqueza</h2>
        
        <p>O coração do livro está nas famosas <strong>"7 Curas para uma Bolsa Vazia"</strong> — princípios eternos que continuam funcionando em 2025.</p>

        <div class="space-y-8 my-8">
          <div class="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 p-6 rounded-xl border-l-4 border-yellow-500">
            <h3 class="text-xl font-bold text-yellow-800 dark:text-yellow-300 mb-3">1️⃣ Comece pagando a si mesmo (poupe 10% de tudo que ganha)</h3>
            <blockquote class="italic text-yellow-700 dark:text-yellow-400 mb-3">
              "Parte de tudo que você ganha é sua e deve ficar com você."
            </blockquote>
            <p class="text-sm">Antes de pagar boletos, contas ou qualquer pessoa: → <strong>pague a si mesmo</strong>.</p>
            <p class="text-sm mt-2 font-medium">Poupar 10% não é sobre valor — é sobre hábito de riqueza.</p>
          </div>

          <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 p-6 rounded-xl border-l-4 border-blue-500">
            <h3 class="text-xl font-bold text-blue-800 dark:text-blue-300 mb-3">2️⃣ Controle seus gastos (não viva no limite)</h3>
            <p class="text-sm">Clason alerta que, sem controle, o padrão de vida cresce junto com a renda — e a pessoa continua pobre mesmo ganhando mais.</p>
            <p class="text-sm mt-2 font-bold text-blue-700 dark:text-blue-400">Regra de ouro: Diferencie desejos de necessidades.</p>
          </div>

          <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-6 rounded-xl border-l-4 border-green-500">
            <h3 class="text-xl font-bold text-green-800 dark:text-green-300 mb-3">3️⃣ Faça o dinheiro trabalhar por você (invista com sabedoria)</h3>
            <p class="text-sm">Aqui nasce o conceito moderno de <strong>"renda passiva"</strong>.</p>
            <p class="text-sm mt-2">O livro ensina: → O dinheiro poupado deve ser colocado para gerar mais dinheiro.</p>
            <p class="text-sm mt-2 font-medium text-green-700 dark:text-green-400">Investir é multiplicar o esforço do passado.</p>
          </div>

          <div class="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 p-6 rounded-xl border-l-4 border-purple-500">
            <h3 class="text-xl font-bold text-purple-800 dark:text-purple-300 mb-3">4️⃣ Proteja seu patrimônio (invista com segurança)</h3>
            <blockquote class="italic text-purple-700 dark:text-purple-400 mb-3">
              "O risco acompanha a pressa."
            </blockquote>
            <p class="text-sm">Não entre em aventuras financeiras. Invista apenas naquilo que você entende ou com pessoas expertas e confiáveis.</p>
            <p class="text-sm mt-2 font-bold text-purple-700 dark:text-purple-400">Segurança primeiro, retorno depois.</p>
          </div>

          <div class="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 p-6 rounded-xl border-l-4 border-orange-500">
            <h3 class="text-xl font-bold text-orange-800 dark:text-orange-300 mb-3">5️⃣ Transforme sua casa em um investimento</h3>
            <p class="text-sm">Na antiga Babilônia, ter casa própria trazia estabilidade e menor custo de vida. No mundo moderno, isso pode significar:</p>
            <ul class="text-sm mt-2 space-y-1 text-orange-700 dark:text-orange-400">
              <li>• Comprar imóvel próprio quando fizer sentido</li>
              <li>• Ou transformar sua moradia em ativo (aluguel, Airbnb, equity)</li>
            </ul>
            <p class="text-sm mt-2 font-medium">A ideia principal: pare de desperdiçar dinheiro com o supérfluo.</p>
          </div>

          <div class="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 p-6 rounded-xl border-l-4 border-indigo-500">
            <h3 class="text-xl font-bold text-indigo-800 dark:text-indigo-300 mb-3">6️⃣ Garanta renda para o futuro</h3>
            <p class="text-sm">O livro fala sobre:</p>
            <ul class="text-sm mt-2 space-y-1 text-indigo-700 dark:text-indigo-400">
              <li>• Aposentadoria</li>
              <li>• Renda vitalícia</li>
              <li>• Proteção para a velhice</li>
              <li>• Cuidar da família</li>
            </ul>
            <p class="text-sm mt-2 font-medium">Hoje isso significa construir um portfólio sólido que gere fluxo de caixa no longo prazo.</p>
          </div>

          <div class="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 p-6 rounded-xl border-l-4 border-pink-500">
            <h3 class="text-xl font-bold text-pink-800 dark:text-pink-300 mb-3">7️⃣ Aumente sua capacidade de ganhar mais</h3>
            <blockquote class="italic text-pink-700 dark:text-pink-400 mb-3">
              "A mente treinada e disciplinada atrai riqueza."
            </blockquote>
            <p class="text-sm">Você ganha mais quando:</p>
            <ul class="text-sm mt-2 space-y-1 text-pink-700 dark:text-pink-400">
              <li>✓ Aprende mais</li>
              <li>✓ Melhora suas habilidades</li>
              <li>✓ Se torna mais valioso</li>
              <li>✓ Aumenta sua produtividade</li>
              <li>✓ Entende de negócios</li>
            </ul>
            <p class="text-sm mt-2 font-bold">Crescer financeiramente começa com crescer como pessoa.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧱 As Parábolas Mais Poderosas da Babilônia</h2>
        
        <div class="space-y-6">
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 class="text-xl font-bold text-primary mb-3">📜 Arkad – O Homem Mais Rico da Cidade</h3>
            <p>Arkad era um simples escriba que se tornou o homem mais rico da Babilônia aplicando os princípios acima.</p>
            <p class="mt-2 font-medium text-slate-800 dark:text-slate-200">Sua história mostra que qualquer pessoa, de qualquer origem, pode prosperar com disciplina e sabedoria.</p>
          </div>

          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 class="text-xl font-bold text-primary mb-3">📜 O Credor e o Alicerce da Confiança</h3>
            <p>O livro mostra por que honrar compromissos é fundamental para prosperidade.</p>
            <p class="mt-2 font-medium text-slate-800 dark:text-slate-200">A reputação é um dos maiores ativos de um ser humano.</p>
          </div>

          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 class="text-xl font-bold text-primary mb-3">📜 A Lenda da Boa Sorte</h3>
            <p>Clason ensina que:</p>
            <ul class="mt-2 space-y-1 text-slate-700 dark:text-slate-300">
              <li>• Sorte = preparação + oportunidade</li>
              <li>• Pessoas disciplinadas parecem "sortudas"</li>
              <li>• Preguiça gera azar</li>
            </ul>
            <p class="mt-3 font-bold text-primary">A sorte favorece quem está pronto.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🟢 Lições práticas aplicáveis hoje</h2>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <span class="text-2xl">⭐</span>
            <div>
              <strong class="block">Pague-se primeiro</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Guarde 10% automaticamente.</span>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <span class="text-2xl">⭐</span>
            <div>
              <strong class="block">Controle gastos invisíveis</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Assinaturas, impulsos, desperdícios.</span>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <span class="text-2xl">⭐</span>
            <div>
              <strong class="block">Tenha uma reserva de emergência</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Proteção = liberdade.</span>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <span class="text-2xl">⭐</span>
            <div>
              <strong class="block">Invista com regularidade</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Pequenos aportes → grandes resultados.</span>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <span class="text-2xl">⭐</span>
            <div>
              <strong class="block">Nunca arrisque o que não pode perder</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Preservar patrimônio é mais importante que multiplicar.</span>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <span class="text-2xl">⭐</span>
            <div>
              <strong class="block">Aprenda continuamente</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Sua renda nunca vai superar o seu conhecimento.</span>
            </div>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">💎 As 5 Frases Mais Fortes do Livro</h2>
        
        <div class="space-y-4">
          <blockquote class="border-l-4 border-primary pl-4 italic text-lg text-slate-600 dark:text-slate-400">
            "A bolsa vazia nunca enriquece."
          </blockquote>
          <blockquote class="border-l-4 border-primary pl-4 italic text-lg text-slate-600 dark:text-slate-400">
            "Quem poupa, prospera."
          </blockquote>
          <blockquote class="border-l-4 border-primary pl-4 italic text-lg text-slate-600 dark:text-slate-400">
            "O trabalho bem-feito gera oportunidades."
          </blockquote>
          <blockquote class="border-l-4 border-primary pl-4 italic text-lg text-slate-600 dark:text-slate-400">
            "Proteja seu ouro dos tolos."
          </blockquote>
          <blockquote class="border-l-4 border-primary pl-4 italic text-lg text-slate-600 dark:text-slate-400">
            "A ação traz retorno; a indecisão traz perda."
          </blockquote>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusão</h2>
        
        <p>
          <strong>O Homem Mais Rico da Babilônia</strong> é simples, mas profundo.
          É atemporal porque ensina algo que nunca muda:
        </p>

        <p class="text-center my-6 text-xl font-bold text-primary">
          Riqueza é consequência de hábitos.
        </p>

        <p class="text-center italic">
          Não importa o país, o ano ou a tecnologia — quem poupa, investe, aprende e se controla prospera.
        </p>

        <p class="font-medium text-center my-8 text-slate-600 dark:text-slate-400">
          A Babilônia caiu.<br/>
          Mas as leis da riqueza continuam vivas.
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-18',
    language: 'pt',
    tags: ['Finanças', 'Investimentos', 'Clássicos', 'Riqueza']
  },
  {
    id: '15',
    slug: 'the-richest-man-in-babylon',
    title: 'The Richest Man in Babylon – Timeless Lessons on Wealth and Prosperity (2025 Complete Summary)',
    excerpt: 'Complete summary of The Richest Man in Babylon. Learn the eternal rules of wealth: save, invest, control spending, and make money work for you.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100">
          Published in 1926, <strong>The Richest Man in Babylon</strong> became one of the greatest classics of personal finance in history.
          With parables set in ancient Babylon, author George S. Clason shows that prosperity doesn't depend on luck, but on timeless financial principles.
        </p>
        
        <p>The book explains how anyone — regardless of origin — can build wealth through:</p>
        <ul class="grid md:grid-cols-2 gap-3 my-6">
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Discipline</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Organization</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Investments</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Emotional control</li>
        </ul>

        <p class="italic text-center">And all of this told through simple, yet powerful stories.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🪙 The 7 Golden Rules of Wealth</h2>
        
        <p>The heart of the book lies in the famous <strong>"7 Cures for a Lean Purse"</strong> — eternal principles that continue to work in 2025.</p>

        <div class="space-y-8 my-8">
          <div class="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 p-6 rounded-xl border-l-4 border-yellow-500">
            <h3 class="text-xl font-bold text-yellow-800 dark:text-yellow-300 mb-3">1️⃣ Start by paying yourself (save 10% of everything you earn)</h3>
            <blockquote class="italic text-yellow-700 dark:text-yellow-400 mb-3">
              "A part of all you earn is yours to keep."
            </blockquote>
            <p class="text-sm">Before paying bills, expenses, or anyone else: → <strong>pay yourself</strong>.</p>
            <p class="text-sm mt-2 font-medium">Saving 10% isn't about the amount — it's about the habit of wealth.</p>
          </div>

          <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 p-6 rounded-xl border-l-4 border-blue-500">
            <h3 class="text-xl font-bold text-blue-800 dark:text-blue-300 mb-3">2️⃣ Control your expenses (don't live at the limit)</h3>
            <p class="text-sm">Clason warns that without control, your standard of living grows with your income — and you remain poor even while earning more.</p>
            <p class="text-sm mt-2 font-bold text-blue-700 dark:text-blue-400">Golden rule: Differentiate wants from needs.</p>
          </div>

          <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-6 rounded-xl border-l-4 border-green-500">
            <h3 class="text-xl font-bold text-green-800 dark:text-green-300 mb-3">3️⃣ Make your money work for you (invest wisely)</h3>
            <p class="text-sm">Here the modern concept of <strong>"passive income"</strong> is born.</p>
            <p class="text-sm mt-2">The book teaches: → Saved money should be put to work generating more money.</p>
            <p class="text-sm mt-2 font-medium text-green-700 dark:text-green-400">Investing is multiplying past effort.</p>
          </div>

          <div class="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 p-6 rounded-xl border-l-4 border-purple-500">
            <h3 class="text-xl font-bold text-purple-800 dark:text-purple-300 mb-3">4️⃣ Protect your wealth (invest safely)</h3>
            <blockquote class="italic text-purple-700 dark:text-purple-400 mb-3">
              "Risk accompanies haste."
            </blockquote>
            <p class="text-sm">Don't enter financial adventures. Only invest in what you understand or with experienced and trustworthy people.</p>
            <p class="text-sm mt-2 font-bold text-purple-700 dark:text-purple-400">Safety first, returns second.</p>
          </div>

          <div class="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 p-6 rounded-xl border-l-4 border-orange-500">
            <h3 class="text-xl font-bold text-orange-800 dark:text-orange-300 mb-3">5️⃣ Turn your home into an investment</h3>
            <p class="text-sm">In ancient Babylon, owning a home brought stability and lower cost of living. In the modern world, this can mean:</p>
            <ul class="text-sm mt-2 space-y-1 text-orange-700 dark:text-orange-400">
              <li>• Buying property when it makes sense</li>
              <li>• Or turning your dwelling into an asset (rental, Airbnb, equity)</li>
            </ul>
            <p class="text-sm mt-2 font-medium">The main idea: stop wasting money on the superfluous.</p>
          </div>

          <div class="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 p-6 rounded-xl border-l-4 border-indigo-500">
            <h3 class="text-xl font-bold text-indigo-800 dark:text-indigo-300 mb-3">6️⃣ Ensure income for the future</h3>
            <p class="text-sm">The book talks about:</p>
            <ul class="text-sm mt-2 space-y-1 text-indigo-700 dark:text-indigo-400">
              <li>• Retirement</li>
              <li>• Lifetime income</li>
              <li>• Protection for old age</li>
              <li>• Taking care of family</li>
            </ul>
            <p class="text-sm mt-2 font-medium">Today this means building a solid portfolio that generates long-term cash flow.</p>
          </div>

          <div class="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 p-6 rounded-xl border-l-4 border-pink-500">
            <h3 class="text-xl font-bold text-pink-800 dark:text-pink-300 mb-3">7️⃣ Increase your ability to earn more</h3>
            <blockquote class="italic text-pink-700 dark:text-pink-400 mb-3">
              "The trained and disciplined mind attracts wealth."
            </blockquote>
            <p class="text-sm">You earn more when you:</p>
            <ul class="text-sm mt-2 space-y-1 text-pink-700 dark:text-pink-400">
              <li>✓ Learn more</li>
              <li>✓ Improve your skills</li>
              <li>✓ Become more valuable</li>
              <li>✓ Increase your productivity</li>
              <li>✓ Understand business</li>
            </ul>
            <p class="text-sm mt-2 font-bold">Growing financially starts with growing as a person.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧱 The Most Powerful Parables of Babylon</h2>
        
        <div class="space-y-6">
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 class="text-xl font-bold text-primary mb-3">📜 Arkad – The Richest Man in the City</h3>
            <p>Arkad was a simple scribe who became the richest man in Babylon by applying the principles above.</p>
            <p class="mt-2 font-medium text-slate-800 dark:text-slate-200">His story shows that anyone, from any background, can prosper with discipline and wisdom.</p>
          </div>

          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 class="text-xl font-bold text-primary mb-3">📜 The Creditor and the Foundation of Trust</h3>
            <p>The book shows why honoring commitments is fundamental to prosperity.</p>
            <p class="mt-2 font-medium text-slate-800 dark:text-slate-200">Reputation is one of a human being's greatest assets.</p>
          </div>

          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 class="text-xl font-bold text-primary mb-3">📜 The Legend of Good Luck</h3>
            <p>Clason teaches that:</p>
            <ul class="mt-2 space-y-1 text-slate-700 dark:text-slate-300">
              <li>• Luck = preparation + opportunity</li>
              <li>• Disciplined people seem "lucky"</li>
              <li>• Laziness generates bad luck</li>
            </ul>
            <p class="mt-3 font-bold text-primary">Luck favors those who are ready.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🟢 Practical lessons applicable today</h2>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <span class="text-2xl">⭐</span>
            <div>
              <strong class="block">Pay yourself first</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Save 10% automatically.</span>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <span class="text-2xl">⭐</span>
            <div>
              <strong class="block">Control invisible expenses</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Subscriptions, impulses, waste.</span>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <span class="text-2xl">⭐</span>
            <div>
              <strong class="block">Have an emergency fund</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Protection = freedom.</span>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <span class="text-2xl">⭐</span>
            <div>
              <strong class="block">Invest regularly</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Small contributions → big results.</span>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <span class="text-2xl">⭐</span>
            <div>
              <strong class="block">Never risk what you can't lose</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Preserving wealth is more important than multiplying it.</span>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <span class="text-2xl">⭐</span>
            <div>
              <strong class="block">Learn continuously</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Your income will never exceed your knowledge.</span>
            </div>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">💎 The 5 Strongest Quotes from the Book</h2>
        
        <div class="space-y-4">
          <blockquote class="border-l-4 border-primary pl-4 italic text-lg text-slate-600 dark:text-slate-400">
            "An empty purse never gets rich."
          </blockquote>
          <blockquote class="border-l-4 border-primary pl-4 italic text-lg text-slate-600 dark:text-slate-400">
            "Those who save, prosper."
          </blockquote>
          <blockquote class="border-l-4 border-primary pl-4 italic text-lg text-slate-600 dark:text-slate-400">
            "Work well done generates opportunities."
          </blockquote>
          <blockquote class="border-l-4 border-primary pl-4 italic text-lg text-slate-600 dark:text-slate-400">
            "Protect your gold from fools."
          </blockquote>
          <blockquote class="border-l-4 border-primary pl-4 italic text-lg text-slate-600 dark:text-slate-400">
            "Action brings returns; indecision brings loss."
          </blockquote>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusion</h2>
        
        <p>
          <strong>The Richest Man in Babylon</strong> is simple, yet profound.
          It's timeless because it teaches something that never changes:
        </p>

        <p class="text-center my-6 text-xl font-bold text-primary">
          Wealth is the consequence of habits.
        </p>

        <p class="text-center italic">
          It doesn't matter the country, the year, or the technology — those who save, invest, learn, and control themselves prosper.
        </p>

        <p class="font-medium text-center my-8 text-slate-600 dark:text-slate-400">
          Babylon fell.<br/>
          But the laws of wealth remain alive.
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-18',
    language: 'en',
    tags: ['Finance', 'Investments', 'Classics', 'Wealth']
  },
  {
    id: '16',
    slug: 'el-hombre-mas-rico-de-babilonia',
    title: 'El Hombre Más Rico de Babilonia – Lecciones Eternas Sobre Riqueza y Prosperidad (Resumen Completo 2025)',
    excerpt: 'Resumen completo de El Hombre Más Rico de Babilonia. Aprende las reglas eternas de la riqueza: ahorrar, invertir, controlar gastos y hacer que el dinero trabaje para ti.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100">
          Publicado en 1926, <strong>El Hombre Más Rico de Babilonia</strong> se convirtió en uno de los mayores clásicos de finanzas personales de la historia.
          Con parábolas ambientadas en la antigua Babilonia, el autor George S. Clason muestra que la prosperidad no depende de la suerte, sino de principios financieros atemporales.
        </p>
        
        <p>El libro explica cómo cualquier persona — independientemente de su origen — puede construir riqueza a través de:</p>
        <ul class="grid md:grid-cols-2 gap-3 my-6">
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Disciplina</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Organización</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Inversiones</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Control emocional</li>
        </ul>

        <p class="italic text-center">Y todo esto contado a través de historias simples, pero poderosas.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🪙 Las 7 Reglas de Oro de la Riqueza</h2>
        
        <p>El corazón del libro está en las famosas <strong>"7 Curas para una Bolsa Vacía"</strong> — principios eternos que continúan funcionando en 2025.</p>

        <div class="space-y-8 my-8">
          <div class="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 p-6 rounded-xl border-l-4 border-yellow-500">
            <h3 class="text-xl font-bold text-yellow-800 dark:text-yellow-300 mb-3">1️⃣ Comienza pagándote a ti mismo (ahorra el 10% de todo lo que ganas)</h3>
            <blockquote class="italic text-yellow-700 dark:text-yellow-400 mb-3">
              "Una parte de todo lo que ganas es tuya y debe quedarse contigo."
            </blockquote>
            <p class="text-sm">Antes de pagar facturas, gastos o a cualquier persona: → <strong>págate a ti mismo</strong>.</p>
            <p class="text-sm mt-2 font-medium">Ahorrar el 10% no es sobre la cantidad — es sobre el hábito de la riqueza.</p>
          </div>

          <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 p-6 rounded-xl border-l-4 border-blue-500">
            <h3 class="text-xl font-bold text-blue-800 dark:text-blue-300 mb-3">2️⃣ Controla tus gastos (no vivas al límite)</h3>
            <p class="text-sm">Clason advierte que sin control, el nivel de vida crece junto con los ingresos — y la persona sigue siendo pobre aunque gane más.</p>
            <p class="text-sm mt-2 font-bold text-blue-700 dark:text-blue-400">Regla de oro: Diferencia deseos de necesidades.</p>
          </div>

          <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-6 rounded-xl border-l-4 border-green-500">
            <h3 class="text-xl font-bold text-green-800 dark:text-green-300 mb-3">3️⃣ Haz que el dinero trabaje para ti (invierte con sabiduría)</h3>
            <p class="text-sm">Aquí nace el concepto moderno de <strong>"ingreso pasivo"</strong>.</p>
            <p class="text-sm mt-2">El libro enseña: → El dinero ahorrado debe ponerse a trabajar generando más dinero.</p>
            <p class="text-sm mt-2 font-medium text-green-700 dark:text-green-400">Invertir es multiplicar el esfuerzo del pasado.</p>
          </div>

          <div class="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 p-6 rounded-xl border-l-4 border-purple-500">
            <h3 class="text-xl font-bold text-purple-800 dark:text-purple-300 mb-3">4️⃣ Protege tu patrimonio (invierte con seguridad)</h3>
            <blockquote class="italic text-purple-700 dark:text-purple-400 mb-3">
              "El riesgo acompaña la prisa."
            </blockquote>
            <p class="text-sm">No entres en aventuras financieras. Solo invierte en lo que entiendes o con personas expertas y confiables.</p>
            <p class="text-sm mt-2 font-bold text-purple-700 dark:text-purple-400">Seguridad primero, retornos después.</p>
          </div>

          <div class="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 p-6 rounded-xl border-l-4 border-orange-500">
            <h3 class="text-xl font-bold text-orange-800 dark:text-orange-300 mb-3">5️⃣ Convierte tu casa en una inversión</h3>
            <p class="text-sm">En la antigua Babilonia, tener casa propia traía estabilidad y menor costo de vida. En el mundo moderno, esto puede significar:</p>
            <ul class="text-sm mt-2 space-y-1 text-orange-700 dark:text-orange-400">
              <li>• Comprar propiedad cuando tenga sentido</li>
              <li>• O convertir tu vivienda en un activo (alquiler, Airbnb, equity)</li>
            </ul>
            <p class="text-sm mt-2 font-medium">La idea principal: deja de desperdiciar dinero en lo superfluo.</p>
          </div>

          <div class="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 p-6 rounded-xl border-l-4 border-indigo-500">
            <h3 class="text-xl font-bold text-indigo-800 dark:text-indigo-300 mb-3">6️⃣ Garantiza ingresos para el futuro</h3>
            <p class="text-sm">El libro habla sobre:</p>
            <ul class="text-sm mt-2 space-y-1 text-indigo-700 dark:text-indigo-400">
              <li>• Jubilación</li>
              <li>• Ingresos vitalicios</li>
              <li>• Protección para la vejez</li>
              <li>• Cuidar de la familia</li>
            </ul>
            <p class="text-sm mt-2 font-medium">Hoy esto significa construir un portafolio sólido que genere flujo de caja a largo plazo.</p>
          </div>

          <div class="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 p-6 rounded-xl border-l-4 border-pink-500">
            <h3 class="text-xl font-bold text-pink-800 dark:text-pink-300 mb-3">7️⃣ Aumenta tu capacidad de ganar más</h3>
            <blockquote class="italic text-pink-700 dark:text-pink-400 mb-3">
              "La mente entrenada y disciplinada atrae riqueza."
            </blockquote>
            <p class="text-sm">Ganas más cuando:</p>
            <ul class="text-sm mt-2 space-y-1 text-pink-700 dark:text-pink-400">
              <li>✓ Aprendes más</li>
              <li>✓ Mejoras tus habilidades</li>
              <li>✓ Te vuelves más valioso</li>
              <li>✓ Aumentas tu productividad</li>
              <li>✓ Entiendes de negocios</li>
            </ul>
            <p class="text-sm mt-2 font-bold">Crecer financieramente comienza con crecer como persona.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧱 Las Parábolas Más Poderosas de Babilonia</h2>
        
        <div class="space-y-6">
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 class="text-xl font-bold text-primary mb-3">📜 Arkad – El Hombre Más Rico de la Ciudad</h3>
            <p>Arkad era un simple escriba que se convirtió en el hombre más rico de Babilonia aplicando los principios anteriores.</p>
            <p class="mt-2 font-medium text-slate-800 dark:text-slate-200">Su historia muestra que cualquier persona, de cualquier origen, puede prosperar con disciplina y sabiduría.</p>
          </div>

          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 class="text-xl font-bold text-primary mb-3">📜 El Acreedor y el Fundamento de la Confianza</h3>
            <p>El libro muestra por qué honrar compromisos es fundamental para la prosperidad.</p>
            <p class="mt-2 font-medium text-slate-800 dark:text-slate-200">La reputación es uno de los mayores activos de un ser humano.</p>
          </div>

          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 class="text-xl font-bold text-primary mb-3">📜 La Leyenda de la Buena Suerte</h3>
            <p>Clason enseña que:</p>
            <ul class="mt-2 space-y-1 text-slate-700 dark:text-slate-300">
              <li>• Suerte = preparación + oportunidad</li>
              <li>• Las personas disciplinadas parecen "afortunadas"</li>
              <li>• La pereza genera mala suerte</li>
            </ul>
            <p class="mt-3 font-bold text-primary">La suerte favorece a quienes están listos.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🟢 Lecciones prácticas aplicables hoy</h2>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <span class="text-2xl">⭐</span>
            <div>
              <strong class="block">Págate primero</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Ahorra el 10% automáticamente.</span>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <span class="text-2xl">⭐</span>
            <div>
              <strong class="block">Controla gastos invisibles</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Suscripciones, impulsos, desperdicios.</span>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <span class="text-2xl">⭐</span>
            <div>
              <strong class="block">Ten un fondo de emergencia</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Protección = libertad.</span>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <span class="text-2xl">⭐</span>
            <div>
              <strong class="block">Invierte con regularidad</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Pequeñas aportaciones → grandes resultados.</span>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <span class="text-2xl">⭐</span>
            <div>
              <strong class="block">Nunca arriesgues lo que no puedes perder</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Preservar el patrimonio es más importante que multiplicarlo.</span>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <span class="text-2xl">⭐</span>
            <div>
              <strong class="block">Aprende continuamente</strong>
              <span class="text-sm text-slate-600 dark:text-slate-400">Tus ingresos nunca superarán tu conocimiento.</span>
            </div>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">💎 Las 5 Frases Más Fuertes del Libro</h2>
        
        <div class="space-y-4">
          <blockquote class="border-l-4 border-primary pl-4 italic text-lg text-slate-600 dark:text-slate-400">
            "La bolsa vacía nunca se enriquece."
          </blockquote>
          <blockquote class="border-l-4 border-primary pl-4 italic text-lg text-slate-600 dark:text-slate-400">
            "Quien ahorra, prospera."
          </blockquote>
          <blockquote class="border-l-4 border-primary pl-4 italic text-lg text-slate-600 dark:text-slate-400">
            "El trabajo bien hecho genera oportunidades."
          </blockquote>
          <blockquote class="border-l-4 border-primary pl-4 italic text-lg text-slate-600 dark:text-slate-400">
            "Protege tu oro de los tontos."
          </blockquote>
          <blockquote class="border-l-4 border-primary pl-4 italic text-lg text-slate-600 dark:text-slate-400">
            "La acción trae retorno; la indecisión trae pérdida."
          </blockquote>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusión</h2>
        
        <p>
          <strong>El Hombre Más Rico de Babilonia</strong> es simple, pero profundo.
          Es atemporal porque enseña algo que nunca cambia:
        </p>

        <p class="text-center my-6 text-xl font-bold text-primary">
          La riqueza es consecuencia de hábitos.
        </p>

        <p class="text-center italic">
          No importa el país, el año o la tecnología — quienes ahorran, invierten, aprenden y se controlan prosperan.
        </p>

        <p class="font-medium text-center my-8 text-slate-600 dark:text-slate-400">
          Babilonia cayó.<br/>
          Pero las leyes de la riqueza siguen vivas.
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-18',
    language: 'es',
    tags: ['Finanzas', 'Inversiones', 'Clásicos', 'Riqueza']
  },
  {
    id: '17',
    slug: 'como-fazer-amigos-e-influenciar-pessoas',
    title: 'Como Fazer Amigos e Influenciar Pessoas – O Guia Definitivo de Dale Carnegie (Resumo Completo 2025)',
    excerpt: 'Resumo completo de Como Fazer Amigos e Influenciar Pessoas. Aprenda técnicas práticas para se comunicar melhor, conquistar confiança e influenciar positivamente.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100">
          Publicado em 1936, <strong>Como Fazer Amigos e Influenciar Pessoas</strong> permanece até hoje como um dos livros mais influentes do mundo sobre relações humanas, persuasão e comunicação.
        </p>
        
        <p>Dale Carnegie mostra que:</p>
        <ul class="grid md:grid-cols-2 gap-3 my-6">
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Pessoas não mudam pela força</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Conexão sincera supera técnica</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Elogios funcionam mais que críticas</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Ouvir vale mais do que falar</li>
        </ul>

        <p class="italic text-center">É um manual sobre como entender pessoas e criar relações verdadeiras, seja na vida pessoal ou profissional.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🌟 Parte 1: Técnicas Fundamentais para Lidar com Pessoas</h2>
        
        <div class="space-y-6">
          <div class="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 p-6 rounded-xl border-l-4 border-red-500">
            <h3 class="text-xl font-bold text-red-800 dark:text-red-300 mb-3">1. Não critique, não condene, não se queixe</h3>
            <p class="text-sm">Críticas ferem o ego e geram defensividade. Empatia abre portas.</p>
          </div>

          <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-6 rounded-xl border-l-4 border-green-500">
            <h3 class="text-xl font-bold text-green-800 dark:text-green-300 mb-3">2. Dê apreciação honesta e sincera</h3>
            <p class="text-sm">Elogio genuíno transforma comportamentos. Falsidade destrói confiança.</p>
          </div>

          <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 p-6 rounded-xl border-l-4 border-blue-500">
            <h3 class="text-xl font-bold text-blue-800 dark:text-blue-300 mb-3">3. Desperte um forte desejo na outra pessoa</h3>
            <p class="text-sm">Mostre o benefício para ela — não para você. É assim que você motiva sem pressionar.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧠 Parte 2: Seis Maneiras de Fazer as Pessoas Gostarem de Você</h2>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h4 class="font-bold text-primary mb-2">1. Torne-se verdadeiramente interessado nos outros</h4>
            <p class="text-sm">Interesse real > charme artificial.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h4 class="font-bold text-primary mb-2">2. Sorria</h4>
            <p class="text-sm">Simples, humano e poderoso.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h4 class="font-bold text-primary mb-2">3. Lembre-se que o nome de uma pessoa é o som mais doce para ela</h4>
            <p class="text-sm">Pequenos detalhes geram grandes conexões.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h4 class="font-bold text-primary mb-2">4. Seja um bom ouvinte</h4>
            <p class="text-sm">Ouvir é respeito em ação.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h4 class="font-bold text-primary mb-2">5. Fale sobre o que importa para a outra pessoa</h4>
            <p class="text-sm">Conexão acontece quando o assunto tem significado.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h4 class="font-bold text-primary mb-2">6. Faça a outra pessoa sentir-se importante</h4>
            <p class="text-sm">Validação cria laços instantâneos.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🎯 Parte 3: Como Conquistar as Pessoas para o Seu Modo de Pensar</h2>
        
        <div class="space-y-3">
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">1.</span>
            <p class="text-sm"><strong>Evite dizer "você está errado"</strong> — Mesmo quando estiver certo.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">2.</span>
            <p class="text-sm"><strong>Respeite opiniões</strong> — Nunca diga "não concordo" de forma brusca.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">3.</span>
            <p class="text-sm"><strong>Se estiver errado, admita rapidamente</strong> — Humildade desarma conflitos.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">4.</span>
            <p class="text-sm"><strong>Comece de forma amigável</strong> — Tom importa mais do que argumentos.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">5.</span>
            <p class="text-sm"><strong>Faça a pessoa dizer "sim" logo no início</strong> — Perguntas simples geram cooperação.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">6.</span>
            <p class="text-sm"><strong>Deixe a outra pessoa falar mais</strong> — Ouvir dá poder.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">7.</span>
            <p class="text-sm"><strong>Deixe a ideia parecer dela</strong> — Autoria gera comprometimento.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">8.</span>
            <p class="text-sm"><strong>Tente ver o mundo pelos olhos do outro</strong> — Entender ≠ concordar. Mas aproxima.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">9.</span>
            <p class="text-sm"><strong>Apele para motivos nobres</strong> — Integridade inspira reações melhores.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">10.</span>
            <p class="text-sm"><strong>Dramatize suas ideias</strong> — Histórias vendem mais que dados.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🏆 Parte 4: Seja um Líder Sem Destruir, Humilhar ou Mandar</h2>
        
        <div class="space-y-4">
          <div class="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 p-4 rounded-lg border-l-4 border-purple-500">
            <h4 class="font-bold text-purple-800 dark:text-purple-300">1. Comece elogiando</h4>
            <p class="text-sm mt-1">Crítica + elogio = aprendizado real. Crítica pura = ressentimento.</p>
          </div>
          <div class="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 p-4 rounded-lg border-l-4 border-indigo-500">
            <h4 class="font-bold text-indigo-800 dark:text-indigo-300">2. Mostre erros de forma indireta</h4>
            <p class="text-sm mt-1">Gentileza multiplica resultados.</p>
          </div>
          <div class="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 p-4 rounded-lg border-l-4 border-pink-500">
            <h4 class="font-bold text-pink-800 dark:text-pink-300">3. Fale sobre os seus erros antes de falar dos erros da outra pessoa</h4>
            <p class="text-sm mt-1">Liderança não é superioridade — é responsabilidade.</p>
          </div>
          <div class="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 p-4 rounded-lg border-l-4 border-amber-500">
            <h4 class="font-bold text-amber-800 dark:text-amber-300">4. Faça perguntas em vez de dar ordens</h4>
            <p class="text-sm mt-1">Perguntas empoderam.</p>
          </div>
          <div class="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/10 dark:to-cyan-900/10 p-4 rounded-lg border-l-4 border-teal-500">
            <h4 class="font-bold text-teal-800 dark:text-teal-300">5. Preserve o orgulho do outro</h4>
            <p class="text-sm mt-1">Humilhação mata relacionamentos.</p>
          </div>
          <div class="bg-gradient-to-r from-lime-50 to-green-50 dark:from-lime-900/10 dark:to-green-900/10 p-4 rounded-lg border-l-4 border-lime-500">
            <h4 class="font-bold text-lime-800 dark:text-lime-300">6. Elogie qualquer melhoria, por menor que seja</h4>
            <p class="text-sm mt-1">Progresso merece reconhecimento.</p>
          </div>
          <div class="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/10 dark:to-blue-900/10 p-4 rounded-lg border-l-4 border-sky-500">
            <h4 class="font-bold text-sky-800 dark:text-sky-300">7. Dê uma reputação para a pessoa defender</h4>
            <p class="text-sm mt-1">"Eu sei que você consegue, porque sempre foi comprometido." Isso muda comportamentos.</p>
          </div>
          <div class="bg-gradient-to-r from-fuchsia-50 to-pink-50 dark:from-fuchsia-900/10 dark:to-pink-900/10 p-4 rounded-lg border-l-4 border-fuchsia-500">
            <h4 class="font-bold text-fuchsia-800 dark:text-fuchsia-300">8. Deixe a outra pessoa feliz em fazer o que você sugere</h4>
            <p class="text-sm mt-1">Influenciar ≠ manipular. É alinhar intenções.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">💡 As Grandes Lições de Dale Carnegie</h2>
        
        <ul class="grid gap-3 md:grid-cols-2">
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Pessoas respondem melhor à bondade do que à força
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Conexão genuína cria oportunidades
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Ouvir é mais poderoso do que argumentar
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Reconhecimento sincero transforma relações
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Liderança começa pelo exemplo
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> O ego é frágil — cuide dele
          </li>
        </ul>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧩 Como aplicar hoje (prática imediata)</h2>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div class="flex items-start gap-3 bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
            <span class="text-2xl">✔</span>
            <div>
              <strong class="block">Pergunte mais, fale menos</strong>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
            <span class="text-2xl">✔</span>
            <div>
              <strong class="block">Elogie algo real em alguém hoje</strong>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
            <span class="text-2xl">✔</span>
            <div>
              <strong class="block">Responda críticas sem brigar</strong>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
            <span class="text-2xl">✔</span>
            <div>
              <strong class="block">Chame pessoas pelo nome</strong>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
            <span class="text-2xl">✔</span>
            <div>
              <strong class="block">Escute sem interromper</strong>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
            <span class="text-2xl">✔</span>
            <div>
              <strong class="block">Faça uma pergunta gentil em vez de dar uma ordem</strong>
            </div>
          </div>
        </div>

        <p class="text-center font-medium text-primary my-6">Pequenas ações mudam tudo.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusão</h2>
        
        <p>
          <strong>Como Fazer Amigos e Influenciar Pessoas</strong> não é um livro sobre manipulação.
          É um livro sobre humanidade.
        </p>

        <p class="text-center my-6">
          Ele ensina a arte que mais abre portas no mundo:<br/>
          <strong>fazer as pessoas se sentirem valorizadas, ouvidas e respeitadas.</strong>
        </p>

        <p class="font-medium text-xl text-center my-8 text-primary">
          Quando você aprende isso, sua vida social, profissional e emocional se transforma.<br/>
          E a mudança começa com uma atitude simples: <strong>escutar com intenção.</strong>
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-17',
    language: 'pt',
    tags: ['Comunicação', 'Liderança', 'Relacionamentos', 'Desenvolvimento Pessoal']
  },
  {
    id: '18',
    slug: 'how-to-win-friends-and-influence-people',
    title: 'How to Win Friends and Influence People – The Definitive Guide by Dale Carnegie (2025 Complete Summary)',
    excerpt: 'Complete summary of How to Win Friends and Influence People. Learn practical techniques to communicate better, build trust, and influence positively.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100">
          Published in 1936, <strong>How to Win Friends and Influence People</strong> remains to this day one of the most influential books in the world on human relations, persuasion, and communication.
        </p>
        
        <p>Dale Carnegie shows that:</p>
        <ul class="grid md:grid-cols-2 gap-3 my-6">
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ People don't change by force</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Sincere connection beats technique</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Praise works better than criticism</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Listening is worth more than talking</li>
        </ul>

        <p class="italic text-center">It's a manual on how to understand people and create genuine relationships, whether in personal or professional life.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🌟 Part 1: Fundamental Techniques in Handling People</h2>
        
        <div class="space-y-6">
          <div class="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 p-6 rounded-xl border-l-4 border-red-500">
            <h3 class="text-xl font-bold text-red-800 dark:text-red-300 mb-3">1. Don't criticize, condemn, or complain</h3>
            <p class="text-sm">Criticism hurts the ego and creates defensiveness. Empathy opens doors.</p>
          </div>

          <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-6 rounded-xl border-l-4 border-green-500">
            <h3 class="text-xl font-bold text-green-800 dark:text-green-300 mb-3">2. Give honest and sincere appreciation</h3>
            <p class="text-sm">Genuine praise transforms behaviors. Fakeness destroys trust.</p>
          </div>

          <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 p-6 rounded-xl border-l-4 border-blue-500">
            <h3 class="text-xl font-bold text-blue-800 dark:text-blue-300 mb-3">3. Arouse in the other person an eager want</h3>
            <p class="text-sm">Show the benefit for them — not for you. That's how you motivate without pressuring.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧠 Part 2: Six Ways to Make People Like You</h2>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h4 class="font-bold text-primary mb-2">1. Become genuinely interested in other people</h4>
            <p class="text-sm">Real interest > artificial charm.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h4 class="font-bold text-primary mb-2">2. Smile</h4>
            <p class="text-sm">Simple, human, and powerful.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h4 class="font-bold text-primary mb-2">3. Remember that a person's name is the sweetest sound to them</h4>
            <p class="text-sm">Small details create big connections.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h4 class="font-bold text-primary mb-2">4. Be a good listener</h4>
            <p class="text-sm">Listening is respect in action.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h4 class="font-bold text-primary mb-2">5. Talk in terms of the other person's interests</h4>
            <p class="text-sm">Connection happens when the subject has meaning.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h4 class="font-bold text-primary mb-2">6. Make the other person feel important</h4>
            <p class="text-sm">Validation creates instant bonds.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🎯 Part 3: How to Win People to Your Way of Thinking</h2>
        
        <div class="space-y-3">
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">1.</span>
            <p class="text-sm"><strong>Avoid saying "you're wrong"</strong> — Even when you're right.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">2.</span>
            <p class="text-sm"><strong>Respect opinions</strong> — Never say "I disagree" harshly.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">3.</span>
            <p class="text-sm"><strong>If you're wrong, admit it quickly</strong> — Humility disarms conflicts.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">4.</span>
            <p class="text-sm"><strong>Begin in a friendly way</strong> — Tone matters more than arguments.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">5.</span>
            <p class="text-sm"><strong>Get the person saying "yes" early</strong> — Simple questions generate cooperation.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">6.</span>
            <p class="text-sm"><strong>Let the other person do most of the talking</strong> — Listening gives power.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">7.</span>
            <p class="text-sm"><strong>Let the idea seem like theirs</strong> — Ownership creates commitment.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">8.</span>
            <p class="text-sm"><strong>Try to see things from their point of view</strong> — Understanding ≠ agreeing. But it brings you closer.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">9.</span>
            <p class="text-sm"><strong>Appeal to noble motives</strong> — Integrity inspires better reactions.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">10.</span>
            <p class="text-sm"><strong>Dramatize your ideas</strong> — Stories sell more than data.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🏆 Part 4: Be a Leader Without Destroying, Humiliating, or Commanding</h2>
        
        <div class="space-y-4">
          <div class="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 p-4 rounded-lg border-l-4 border-purple-500">
            <h4 class="font-bold text-purple-800 dark:text-purple-300">1. Begin with praise</h4>
            <p class="text-sm mt-1">Criticism + praise = real learning. Pure criticism = resentment.</p>
          </div>
          <div class="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 p-4 rounded-lg border-l-4 border-indigo-500">
            <h4 class="font-bold text-indigo-800 dark:text-indigo-300">2. Point out mistakes indirectly</h4>
            <p class="text-sm mt-1">Kindness multiplies results.</p>
          </div>
          <div class="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 p-4 rounded-lg border-l-4 border-pink-500">
            <h4 class="font-bold text-pink-800 dark:text-pink-300">3. Talk about your own mistakes before criticizing</h4>
            <p class="text-sm mt-1">Leadership isn't superiority — it's responsibility.</p>
          </div>
          <div class="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 p-4 rounded-lg border-l-4 border-amber-500">
            <h4 class="font-bold text-amber-800 dark:text-amber-300">4. Ask questions instead of giving orders</h4>
            <p class="text-sm mt-1">Questions empower.</p>
          </div>
          <div class="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/10 dark:to-cyan-900/10 p-4 rounded-lg border-l-4 border-teal-500">
            <h4 class="font-bold text-teal-800 dark:text-teal-300">5. Preserve the other person's pride</h4>
            <p class="text-sm mt-1">Humiliation kills relationships.</p>
          </div>
          <div class="bg-gradient-to-r from-lime-50 to-green-50 dark:from-lime-900/10 dark:to-green-900/10 p-4 rounded-lg border-l-4 border-lime-500">
            <h4 class="font-bold text-lime-800 dark:text-lime-300">6. Praise every improvement, however small</h4>
            <p class="text-sm mt-1">Progress deserves recognition.</p>
          </div>
          <div class="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/10 dark:to-blue-900/10 p-4 rounded-lg border-l-4 border-sky-500">
            <h4 class="font-bold text-sky-800 dark:text-sky-300">7. Give a reputation to live up to</h4>
            <p class="text-sm mt-1">"I know you can do it because you've always been committed." This changes behaviors.</p>
          </div>
          <div class="bg-gradient-to-r from-fuchsia-50 to-pink-50 dark:from-fuchsia-900/10 dark:to-pink-900/10 p-4 rounded-lg border-l-4 border-fuchsia-500">
            <h4 class="font-bold text-fuchsia-800 dark:text-fuchsia-300">8. Make the person happy to do what you suggest</h4>
            <p class="text-sm mt-1">Influencing ≠ manipulating. It's aligning intentions.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">💡 The Great Lessons of Dale Carnegie</h2>
        
        <ul class="grid gap-3 md:grid-cols-2">
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> People respond better to kindness than to force
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Genuine connection creates opportunities
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Listening is more powerful than arguing
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Sincere recognition transforms relationships
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Leadership starts with example
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> The ego is fragile — handle it with care
          </li>
        </ul>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧩 How to apply today (immediate practice)</h2>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div class="flex items-start gap-3 bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
            <span class="text-2xl">✔</span>
            <div>
              <strong class="block">Ask more, talk less</strong>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
            <span class="text-2xl">✔</span>
            <div>
              <strong class="block">Praise something real in someone today</strong>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
            <span class="text-2xl">✔</span>
            <div>
              <strong class="block">Respond to criticism without fighting</strong>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
            <span class="text-2xl">✔</span>
            <div>
              <strong class="block">Call people by their name</strong>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
            <span class="text-2xl">✔</span>
            <div>
              <strong class="block">Listen without interrupting</strong>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
            <span class="text-2xl">✔</span>
            <div>
              <strong class="block">Ask a gentle question instead of giving an order</strong>
            </div>
          </div>
        </div>

        <p class="text-center font-medium text-primary my-6">Small actions change everything.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusion</h2>
        
        <p>
          <strong>How to Win Friends and Influence People</strong> is not a book about manipulation.
          It's a book about humanity.
        </p>

        <p class="text-center my-6">
          It teaches the art that opens the most doors in the world:<br/>
          <strong>making people feel valued, heard, and respected.</strong>
        </p>

        <p class="font-medium text-xl text-center my-8 text-primary">
          When you learn this, your social, professional, and emotional life transforms.<br/>
          And the change begins with a simple attitude: <strong>listening with intention.</strong>
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-17',
    language: 'en',
    tags: ['Communication', 'Leadership', 'Relationships', 'Personal Development']
  },
  {
    id: '19',
    slug: 'como-ganar-amigos-e-influir-sobre-las-personas',
    title: 'Cómo Ganar Amigos e Influir sobre las Personas – La Guía Definitiva de Dale Carnegie (Resumen Completo 2025)',
    excerpt: 'Resumen completo de Cómo Ganar Amigos e Influir sobre las Personas. Aprende técnicas prácticas para comunicarte mejor, ganar confianza e influir positivamente.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100">
          Publicado en 1936, <strong>Cómo Ganar Amigos e Influir sobre las Personas</strong> permanece hasta hoy como uno de los libros más influyentes del mundo sobre relaciones humanas, persuasión y comunicación.
        </p>
        
        <p>Dale Carnegie muestra que:</p>
        <ul class="grid md:grid-cols-2 gap-3 my-6">
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Las personas no cambian por la fuerza</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ La conexión sincera supera la técnica</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Los elogios funcionan más que las críticas</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Escuchar vale más que hablar</li>
        </ul>

        <p class="italic text-center">Es un manual sobre cómo entender a las personas y crear relaciones verdaderas, ya sea en la vida personal o profesional.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🌟 Parte 1: Técnicas Fundamentales para Tratar con las Personas</h2>
        
        <div class="space-y-6">
          <div class="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 p-6 rounded-xl border-l-4 border-red-500">
            <h3 class="text-xl font-bold text-red-800 dark:text-red-300 mb-3">1. No critique, no condene, no se queje</h3>
            <p class="text-sm">Las críticas hieren el ego y generan defensividad. La empatía abre puertas.</p>
          </div>

          <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-6 rounded-xl border-l-4 border-green-500">
            <h3 class="text-xl font-bold text-green-800 dark:text-green-300 mb-3">2. Dé apreciación honesta y sincera</h3>
            <p class="text-sm">El elogio genuino transforma comportamientos. La falsedad destruye la confianza.</p>
          </div>

          <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 p-6 rounded-xl border-l-4 border-blue-500">
            <h3 class="text-xl font-bold text-blue-800 dark:text-blue-300 mb-3">3. Despierte un fuerte deseo en la otra persona</h3>
            <p class="text-sm">Muestre el beneficio para ella — no para usted. Así es como motiva sin presionar.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧠 Parte 2: Seis Maneras de Agradar a los Demás</h2>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h4 class="font-bold text-primary mb-2">1. Interésese genuinamente en los demás</h4>
            <p class="text-sm">Interés real > encanto artificial.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h4 class="font-bold text-primary mb-2">2. Sonría</h4>
            <p class="text-sm">Simple, humano y poderoso.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h4 class="font-bold text-primary mb-2">3. Recuerde que el nombre de una persona es el sonido más dulce para ella</h4>
            <p class="text-sm">Pequeños detalles generan grandes conexiones.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h4 class="font-bold text-primary mb-2">4. Sea un buen oyente</h4>
            <p class="text-sm">Escuchar es respeto en acción.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h4 class="font-bold text-primary mb-2">5. Hable sobre lo que le importa a la otra persona</h4>
            <p class="text-sm">La conexión ocurre cuando el tema tiene significado.</p>
          </div>
          <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h4 class="font-bold text-primary mb-2">6. Haga que la otra persona se sienta importante</h4>
            <p class="text-sm">La validación crea lazos instantáneos.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🎯 Parte 3: Cómo Ganar a las Personas a Su Manera de Pensar</h2>
        
        <div class="space-y-3">
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">1.</span>
            <p class="text-sm"><strong>Evite decir "estás equivocado"</strong> — Incluso cuando tenga razón.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">2.</span>
            <p class="text-sm"><strong>Respete las opiniones</strong> — Nunca diga "no estoy de acuerdo" de forma brusca.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">3.</span>
            <p class="text-sm"><strong>Si está equivocado, admítalo rápidamente</strong> — La humildad desarma conflictos.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">4.</span>
            <p class="text-sm"><strong>Comience de forma amigable</strong> — El tono importa más que los argumentos.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">5.</span>
            <p class="text-sm"><strong>Haga que la persona diga "sí" desde el principio</strong> — Preguntas simples generan cooperación.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">6.</span>
            <p class="text-sm"><strong>Deje que la otra persona hable más</strong> — Escuchar da poder.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">7.</span>
            <p class="text-sm"><strong>Deje que la idea parezca suya</strong> — La autoría genera compromiso.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">8.</span>
            <p class="text-sm"><strong>Intente ver el mundo desde su punto de vista</strong> — Entender ≠ estar de acuerdo. Pero acerca.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">9.</span>
            <p class="text-sm"><strong>Apele a motivos nobles</strong> — La integridad inspira mejores reacciones.</p>
          </div>
          <div class="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <span class="text-primary font-bold">10.</span>
            <p class="text-sm"><strong>Dramatice sus ideas</strong> — Las historias venden más que los datos.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🏆 Parte 4: Sea un Líder Sin Destruir, Humillar o Mandar</h2>
        
        <div class="space-y-4">
          <div class="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 p-4 rounded-lg border-l-4 border-purple-500">
            <h4 class="font-bold text-purple-800 dark:text-purple-300">1. Comience elogiando</h4>
            <p class="text-sm mt-1">Crítica + elogio = aprendizaje real. Crítica pura = resentimiento.</p>
          </div>
          <div class="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 p-4 rounded-lg border-l-4 border-indigo-500">
            <h4 class="font-bold text-indigo-800 dark:text-indigo-300">2. Señale errores de forma indirecta</h4>
            <p class="text-sm mt-1">La amabilidad multiplica resultados.</p>
          </div>
          <div class="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 p-4 rounded-lg border-l-4 border-pink-500">
            <h4 class="font-bold text-pink-800 dark:text-pink-300">3. Hable de sus propios errores antes de criticar</h4>
            <p class="text-sm mt-1">El liderazgo no es superioridad — es responsabilidad.</p>
          </div>
          <div class="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 p-4 rounded-lg border-l-4 border-amber-500">
            <h4 class="font-bold text-amber-800 dark:text-amber-300">4. Haga preguntas en lugar de dar órdenes</h4>
            <p class="text-sm mt-1">Las preguntas empoderan.</p>
          </div>
          <div class="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/10 dark:to-cyan-900/10 p-4 rounded-lg border-l-4 border-teal-500">
            <h4 class="font-bold text-teal-800 dark:text-teal-300">5. Preserve el orgullo del otro</h4>
            <p class="text-sm mt-1">La humillación mata relaciones.</p>
          </div>
          <div class="bg-gradient-to-r from-lime-50 to-green-50 dark:from-lime-900/10 dark:to-green-900/10 p-4 rounded-lg border-l-4 border-lime-500">
            <h4 class="font-bold text-lime-800 dark:text-lime-300">6. Elogie cualquier mejora, por pequeña que sea</h4>
            <p class="text-sm mt-1">El progreso merece reconocimiento.</p>
          </div>
          <div class="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/10 dark:to-blue-900/10 p-4 rounded-lg border-l-4 border-sky-500">
            <h4 class="font-bold text-sky-800 dark:text-sky-300">7. Dé una reputación que defender</h4>
            <p class="text-sm mt-1">"Sé que puedes hacerlo porque siempre has sido comprometido." Esto cambia comportamientos.</p>
          </div>
          <div class="bg-gradient-to-r from-fuchsia-50 to-pink-50 dark:from-fuchsia-900/10 dark:to-pink-900/10 p-4 rounded-lg border-l-4 border-fuchsia-500">
            <h4 class="font-bold text-fuchsia-800 dark:text-fuchsia-300">8. Haga que la otra persona esté feliz de hacer lo que sugiere</h4>
            <p class="text-sm mt-1">Influir ≠ manipular. Es alinear intenciones.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">💡 Las Grandes Lecciones de Dale Carnegie</h2>
        
        <ul class="grid gap-3 md:grid-cols-2">
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Las personas responden mejor a la bondad que a la fuerza
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> La conexión genuina crea oportunidades
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Escuchar es más poderoso que argumentar
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> El reconocimiento sincero transforma relaciones
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> El liderazgo comienza con el ejemplo
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> El ego es frágil — cuídelo
          </li>
        </ul>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">🧩 Cómo aplicar hoy (práctica inmediata)</h2>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div class="flex items-start gap-3 bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
            <span class="text-2xl">✔</span>
            <div>
              <strong class="block">Pregunte más, hable menos</strong>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
            <span class="text-2xl">✔</span>
            <div>
              <strong class="block">Elogie algo real en alguien hoy</strong>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
            <span class="text-2xl">✔</span>
            <div>
              <strong class="block">Responda a las críticas sin pelear</strong>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
            <span class="text-2xl">✔</span>
            <div>
              <strong class="block">Llame a las personas por su nombre</strong>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
            <span class="text-2xl">✔</span>
            <div>
              <strong class="block">Escuche sin interrumpir</strong>
            </div>
          </div>
          <div class="flex items-start gap-3 bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
            <span class="text-2xl">✔</span>
            <div>
              <strong class="block">Haga una pregunta amable en lugar de dar una orden</strong>
            </div>
          </div>
        </div>

        <p class="text-center font-medium text-primary my-6">Pequeñas acciones lo cambian todo.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusión</h2>
        
        <p>
          <strong>Cómo Ganar Amigos e Influir sobre las Personas</strong> no es un libro sobre manipulación.
          Es un libro sobre humanidad.
        </p>

        <p class="text-center my-6">
          Enseña el arte que más puertas abre en el mundo:<br/>
          <strong>hacer que las personas se sientan valoradas, escuchadas y respetadas.</strong>
        </p>

        <p class="font-medium text-xl text-center my-8 text-primary">
          Cuando aprendes esto, tu vida social, profesional y emocional se transforma.<br/>
          Y el cambio comienza con una actitud simple: <strong>escuchar con intención.</strong>
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-17',
    language: 'es',
    tags: ['Comunicación', 'Liderazgo', 'Relaciones', 'Desarrollo Personal']
  },
  {
    id: '20',
    slug: '12-regras-para-a-vida',
    title: '12 Regras Para a Vida – Um Antídoto Para o Caos (Resumo Completo 2025)',
    excerpt: 'Resumo completo de 12 Regras Para a Vida. Entenda as lições de Jordan Peterson sobre responsabilidade, propósito, disciplina e equilíbrio emocional.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100">
          <strong>12 Regras Para a Vida</strong>, de Jordan B. Peterson, se tornou um fenômeno mundial ao propor um guia direto, profundo e até provocador para viver com mais propósito, responsabilidade e equilíbrio.
        </p>
        
        <p>Em uma época de ansiedade, distração e falta de direção, Peterson oferece princípios práticos — alguns simples, outros desafiadores — que ajudam a dar estrutura à vida.</p>

        <p class="italic text-center font-medium">Este resumo traz o essencial de cada regra e o que você pode aplicar na prática a partir de hoje.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">As 12 Regras Para a Vida</h2>
        
        <div class="space-y-6">
          <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 p-6 rounded-xl border-l-4 border-blue-500">
            <h3 class="text-xl font-bold text-blue-800 dark:text-blue-300 mb-3">🧿 Regra 1: Mantenha-se ereto com os ombros para trás</h3>
            <p class="text-sm mb-2">Sua postura física altera sua psicologia.</p>
            <p class="text-sm">Peterson explica que <strong>postura confiante → mente confiante</strong>. Postura derrotada → mente frágil.</p>
            <p class="text-sm mt-2 font-medium text-blue-700 dark:text-blue-400">É um convite para assumir responsabilidade, enfrentar desafios e ocupar seu lugar no mundo.</p>
          </div>

          <div class="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 p-6 rounded-xl border-l-4 border-red-500">
            <h3 class="text-xl font-bold text-red-800 dark:text-red-300 mb-3">❤️ Regra 2: Trate a si mesmo como alguém que você é responsável por ajudar</h3>
            <p class="text-sm mb-2">Você cuida melhor dos outros do que de você mesmo.</p>
            <p class="text-sm font-medium text-red-700 dark:text-red-400">A regra ensina: dê a si o mesmo cuidado, paciência e compaixão que daria para alguém querido.</p>
          </div>

          <div class="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 p-6 rounded-xl border-l-4 border-purple-500">
            <h3 class="text-xl font-bold text-purple-800 dark:text-purple-300 mb-3">👨‍👦 Regra 3: Faça amizade com pessoas que querem o melhor para você</h3>
            <p class="text-sm mb-2">Ambientes moldam destinos.</p>
            <ul class="text-sm space-y-1 text-purple-700 dark:text-purple-400">
              <li>• Afaste-se de quem te prende no passado</li>
              <li>• Aproxime-se de quem te puxa para cima</li>
            </ul>
          </div>

          <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-6 rounded-xl border-l-4 border-green-500">
            <h3 class="text-xl font-bold text-green-800 dark:text-green-300 mb-3">🧼 Regra 4: Compare-se com quem você era ontem, não com quem outra pessoa é hoje</h3>
            <p class="text-sm mb-2">Rede social cria comparação infinita.</p>
            <p class="text-sm">A solução:</p>
            <ul class="text-sm space-y-1 text-green-700 dark:text-green-400 mt-2">
              <li>→ Competir consigo mesmo</li>
              <li>→ Buscar microprogressos</li>
              <li>→ Entender que evolução é pessoal</li>
            </ul>
          </div>

          <div class="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 p-6 rounded-xl border-l-4 border-amber-500">
            <h3 class="text-xl font-bold text-amber-800 dark:text-amber-300 mb-3">🏠 Regra 5: Não deixe seus filhos fazerem coisas que façam você deixar de gostar deles</h3>
            <p class="text-sm mb-2">Peterson fala sobre disciplina, limites e ordem familiar.</p>
            <p class="text-sm font-medium text-amber-700 dark:text-amber-400">Crianças sem limites crescem inseguras. Crianças com estrutura crescem fortes.</p>
          </div>

          <div class="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 p-6 rounded-xl border-l-4 border-indigo-500">
            <h3 class="text-xl font-bold text-indigo-800 dark:text-indigo-300 mb-3">👁️ Regra 6: Arrume a sua própria casa antes de criticar o mundo</h3>
            <p class="text-sm mb-2">Não culpe o governo, o chefe, a economia.</p>
            <p class="text-sm">Olhe para o que VOCÊ pode arrumar:</p>
            <ul class="text-sm space-y-1 text-indigo-700 dark:text-indigo-400 mt-2">
              <li>• Relacionamentos</li>
              <li>• Finanças</li>
              <li>• Hábitos</li>
              <li>• Rotinas</li>
              <li>• Prioridades</li>
            </ul>
            <p class="text-sm mt-2 font-bold">A mudança começa de dentro para fora.</p>
          </div>

          <div class="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 p-6 rounded-xl border-l-4 border-orange-500">
            <h3 class="text-xl font-bold text-orange-800 dark:text-orange-300 mb-3">🎯 Regra 7: Persiga o que é significativo, não o que é conveniente</h3>
            <p class="text-sm mb-2">O que é fácil quase sempre é vazio. O que é difícil geralmente é valioso.</p>
            <blockquote class="italic text-orange-700 dark:text-orange-400 mt-2">
              "A vida melhora quando você decide carregar um fardo que realmente importa."
            </blockquote>
          </div>

          <div class="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/10 dark:to-cyan-900/10 p-6 rounded-xl border-l-4 border-teal-500">
            <h3 class="text-xl font-bold text-teal-800 dark:text-teal-300 mb-3">🚫 Regra 8: Diga a verdade — ou pelo menos, não minta</h3>
            <p class="text-sm mb-2">Mentiras corroem a alma. A verdade liberta, alinha e fortalece.</p>
            <p class="text-sm font-medium text-teal-700 dark:text-teal-400">Essa regra é sobre integridade pessoal.</p>
          </div>

          <div class="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 p-6 rounded-xl border-l-4 border-pink-500">
            <h3 class="text-xl font-bold text-pink-800 dark:text-pink-300 mb-3">💬 Regra 9: Presuma que a pessoa com quem você fala sabe algo que você não sabe</h3>
            <p class="text-sm mb-2">Ouvir é uma superpotência.</p>
            <p class="text-sm font-medium text-pink-700 dark:text-pink-400">Quando você escuta para aprender, não para responder, você cresce mais rápido.</p>
          </div>

          <div class="bg-gradient-to-r from-lime-50 to-green-50 dark:from-lime-900/10 dark:to-green-900/10 p-6 rounded-xl border-l-4 border-lime-500">
            <h3 class="text-xl font-bold text-lime-800 dark:text-lime-300 mb-3">🗣️ Regra 10: Seja preciso em seu discurso</h3>
            <p class="text-sm mb-2">Nomeie o problema.</p>
            <p class="text-sm font-medium text-lime-700 dark:text-lime-400">Quanto mais claro você descreve um problema, mais rápido encontra a solução.</p>
          </div>

          <div class="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/10 dark:to-blue-900/10 p-6 rounded-xl border-l-4 border-sky-500">
            <h3 class="text-xl font-bold text-sky-800 dark:text-sky-300 mb-3">🐕 Regra 11: Não incomode crianças enquanto elas estiverem andando de skate</h3>
            <p class="text-sm mb-2">Essa regra fala sobre risco, coragem e autonomia.</p>
            <p class="text-sm">Crianças (e adultos) precisam se arriscar um pouco para crescer.</p>
            <p class="text-sm mt-2 font-medium text-sky-700 dark:text-sky-400">Superproteção gera fragilidade.</p>
          </div>

          <div class="bg-gradient-to-r from-fuchsia-50 to-purple-50 dark:from-fuchsia-900/10 dark:to-purple-900/10 p-6 rounded-xl border-l-4 border-fuchsia-500">
            <h3 class="text-xl font-bold text-fuchsia-800 dark:text-fuchsia-300 mb-3">🐱 Regra 12: Acaricie um gato quando o encontrar na rua</h3>
            <p class="text-sm mb-2">Essa regra é sobre dor, sofrimento e aceitação.</p>
            <p class="text-sm">A vida é dura — mas ainda assim há beleza nas pequenas coisas.</p>
            <p class="text-sm mt-2 font-medium text-fuchsia-700 dark:text-fuchsia-400">Peterson ensina a encontrar micromomentos de presença, paz e gratidão mesmo em tempos difíceis.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">⭐ Lições Essenciais do Livro</h2>
        
        <ul class="grid gap-3 md:grid-cols-2">
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Responsabilidade traz propósito
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Verdade é mais poderosa que conforto
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Crescimento exige risco
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Autoconhecimento é essencial
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Comparação destrói identidade
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Ordem interna gera ordem externa
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Propósito é melhor que prazer imediato
          </li>
        </ul>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusão</h2>
        
        <p>
          <strong>12 Regras Para a Vida</strong> é um guia para assumir controle, ordenar o caos interno e viver intencionalmente.
        </p>

        <p class="my-4">Peterson combina psicologia, filosofia e experiências humanas para nos lembrar que viver bem exige:</p>

        <ul class="grid md:grid-cols-2 gap-3 my-6">
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Disciplina</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Verdade</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Responsabilidade</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Coragem</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Humildade</li>
        </ul>

        <p class="font-medium text-xl text-center my-8 text-primary">
          A vida melhora quando você melhora.<br/>
          E essa mudança começa hoje.
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-16',
    language: 'pt',
    tags: ['Psicologia', 'Filosofia', 'Desenvolvimento Pessoal', 'Responsabilidade']
  },
  {
    id: '21',
    slug: '12-rules-for-life',
    title: '12 Rules for Life – An Antidote to Chaos (2025 Complete Summary)',
    excerpt: 'Complete summary of 12 Rules for Life. Understand Jordan Peterson\'s lessons on responsibility, purpose, discipline, and emotional balance.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100">
          <strong>12 Rules for Life</strong>, by Jordan B. Peterson, became a worldwide phenomenon by proposing a direct, profound, and even provocative guide to living with more purpose, responsibility, and balance.
        </p>
        
        <p>In an age of anxiety, distraction, and lack of direction, Peterson offers practical principles — some simple, others challenging — that help give structure to life.</p>

        <p class="italic text-center font-medium">This summary brings the essence of each rule and what you can apply in practice starting today.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">The 12 Rules for Life</h2>
        
        <div class="space-y-6">
          <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 p-6 rounded-xl border-l-4 border-blue-500">
            <h3 class="text-xl font-bold text-blue-800 dark:text-blue-300 mb-3">🧿 Rule 1: Stand up straight with your shoulders back</h3>
            <p class="text-sm mb-2">Your physical posture alters your psychology.</p>
            <p class="text-sm">Peterson explains that <strong>confident posture → confident mind</strong>. Defeated posture → fragile mind.</p>
            <p class="text-sm mt-2 font-medium text-blue-700 dark:text-blue-400">It's an invitation to take responsibility, face challenges, and occupy your place in the world.</p>
          </div>

          <div class="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 p-6 rounded-xl border-l-4 border-red-500">
            <h3 class="text-xl font-bold text-red-800 dark:text-red-300 mb-3">❤️ Rule 2: Treat yourself like someone you are responsible for helping</h3>
            <p class="text-sm mb-2">You take better care of others than yourself.</p>
            <p class="text-sm font-medium text-red-700 dark:text-red-400">The rule teaches: give yourself the same care, patience, and compassion you would give to someone dear.</p>
          </div>

          <div class="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 p-6 rounded-xl border-l-4 border-purple-500">
            <h3 class="text-xl font-bold text-purple-800 dark:text-purple-300 mb-3">👨‍👦 Rule 3: Make friends with people who want the best for you</h3>
            <p class="text-sm mb-2">Environments shape destinies.</p>
            <ul class="text-sm space-y-1 text-purple-700 dark:text-purple-400">
              <li>• Distance yourself from those who keep you in the past</li>
              <li>• Get closer to those who pull you up</li>
            </ul>
          </div>

          <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-6 rounded-xl border-l-4 border-green-500">
            <h3 class="text-xl font-bold text-green-800 dark:text-green-300 mb-3">🧼 Rule 4: Compare yourself to who you were yesterday, not to who someone else is today</h3>
            <p class="text-sm mb-2">Social media creates infinite comparison.</p>
            <p class="text-sm">The solution:</p>
            <ul class="text-sm space-y-1 text-green-700 dark:text-green-400 mt-2">
              <li>→ Compete with yourself</li>
              <li>→ Seek micro-progress</li>
              <li>→ Understand that evolution is personal</li>
            </ul>
          </div>

          <div class="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 p-6 rounded-xl border-l-4 border-amber-500">
            <h3 class="text-xl font-bold text-amber-800 dark:text-amber-300 mb-3">🏠 Rule 5: Do not let your children do anything that makes you dislike them</h3>
            <p class="text-sm mb-2">Peterson talks about discipline, limits, and family order.</p>
            <p class="text-sm font-medium text-amber-700 dark:text-amber-400">Children without limits grow insecure. Children with structure grow strong.</p>
          </div>

          <div class="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 p-6 rounded-xl border-l-4 border-indigo-500">
            <h3 class="text-xl font-bold text-indigo-800 dark:text-indigo-300 mb-3">👁️ Rule 6: Set your house in perfect order before you criticize the world</h3>
            <p class="text-sm mb-2">Don't blame the government, the boss, the economy.</p>
            <p class="text-sm">Look at what YOU can fix:</p>
            <ul class="text-sm space-y-1 text-indigo-700 dark:text-indigo-400 mt-2">
              <li>• Relationships</li>
              <li>• Finances</li>
              <li>• Habits</li>
              <li>• Routines</li>
              <li>• Priorities</li>
            </ul>
            <p class="text-sm mt-2 font-bold">Change starts from the inside out.</p>
          </div>

          <div class="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 p-6 rounded-xl border-l-4 border-orange-500">
            <h3 class="text-xl font-bold text-orange-800 dark:text-orange-300 mb-3">🎯 Rule 7: Pursue what is meaningful, not what is expedient</h3>
            <p class="text-sm mb-2">What is easy is almost always empty. What is difficult is usually valuable.</p>
            <blockquote class="italic text-orange-700 dark:text-orange-400 mt-2">
              "Life improves when you decide to carry a burden that truly matters."
            </blockquote>
          </div>

          <div class="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/10 dark:to-cyan-900/10 p-6 rounded-xl border-l-4 border-teal-500">
            <h3 class="text-xl font-bold text-teal-800 dark:text-teal-300 mb-3">🚫 Rule 8: Tell the truth — or, at least, don't lie</h3>
            <p class="text-sm mb-2">Lies corrode the soul. Truth liberates, aligns, and strengthens.</p>
            <p class="text-sm font-medium text-teal-700 dark:text-teal-400">This rule is about personal integrity.</p>
          </div>

          <div class="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 p-6 rounded-xl border-l-4 border-pink-500">
            <h3 class="text-xl font-bold text-pink-800 dark:text-pink-300 mb-3">💬 Rule 9: Assume that the person you are listening to might know something you don't</h3>
            <p class="text-sm mb-2">Listening is a superpower.</p>
            <p class="text-sm font-medium text-pink-700 dark:text-pink-400">When you listen to learn, not to respond, you grow faster.</p>
          </div>

          <div class="bg-gradient-to-r from-lime-50 to-green-50 dark:from-lime-900/10 dark:to-green-900/10 p-6 rounded-xl border-l-4 border-lime-500">
            <h3 class="text-xl font-bold text-lime-800 dark:text-lime-300 mb-3">🗣️ Rule 10: Be precise in your speech</h3>
            <p class="text-sm mb-2">Name the problem.</p>
            <p class="text-sm font-medium text-lime-700 dark:text-lime-400">The clearer you describe a problem, the faster you find the solution.</p>
          </div>

          <div class="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/10 dark:to-blue-900/10 p-6 rounded-xl border-l-4 border-sky-500">
            <h3 class="text-xl font-bold text-sky-800 dark:text-sky-300 mb-3">🐕 Rule 11: Do not bother children when they are skateboarding</h3>
            <p class="text-sm mb-2">This rule is about risk, courage, and autonomy.</p>
            <p class="text-sm">Children (and adults) need to take some risks to grow.</p>
            <p class="text-sm mt-2 font-medium text-sky-700 dark:text-sky-400">Overprotection generates fragility.</p>
          </div>

          <div class="bg-gradient-to-r from-fuchsia-50 to-purple-50 dark:from-fuchsia-900/10 dark:to-purple-900/10 p-6 rounded-xl border-l-4 border-fuchsia-500">
            <h3 class="text-xl font-bold text-fuchsia-800 dark:text-fuchsia-300 mb-3">🐱 Rule 12: Pet a cat when you encounter one on the street</h3>
            <p class="text-sm mb-2">This rule is about pain, suffering, and acceptance.</p>
            <p class="text-sm">Life is hard — but there is still beauty in small things.</p>
            <p class="text-sm mt-2 font-medium text-fuchsia-700 dark:text-fuchsia-400">Peterson teaches finding micro-moments of presence, peace, and gratitude even in difficult times.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">⭐ Essential Lessons from the Book</h2>
        
        <ul class="grid gap-3 md:grid-cols-2">
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Responsibility brings purpose
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Truth is more powerful than comfort
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Growth requires risk
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Self-knowledge is essential
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Comparison destroys identity
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Internal order generates external order
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> Purpose is better than immediate pleasure
          </li>
        </ul>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusion</h2>
        
        <p>
          <strong>12 Rules for Life</strong> is a guide to taking control, ordering internal chaos, and living intentionally.
        </p>

        <p class="my-4">Peterson combines psychology, philosophy, and human experiences to remind us that living well requires:</p>

        <ul class="grid md:grid-cols-2 gap-3 my-6">
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Discipline</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Truth</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Responsibility</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Courage</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Humility</li>
        </ul>

        <p class="font-medium text-xl text-center my-8 text-primary">
          Life improves when you improve.<br/>
          And that change starts today.
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-16',
    language: 'en',
    tags: ['Psychology', 'Philosophy', 'Personal Development', 'Responsibility']
  },
  {
    id: '22',
    slug: '12-reglas-para-la-vida',
    title: '12 Reglas para la Vida – Un Antídoto para el Caos (Resumen Completo 2025)',
    excerpt: 'Resumen completo de 12 Reglas para la Vida. Entiende las lecciones de Jordan Peterson sobre responsabilidad, propósito, disciplina y equilibrio emocional.',
    content: `
      <div class="space-y-8 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p class="font-medium text-xl text-slate-900 dark:text-slate-100">
          <strong>12 Reglas para la Vida</strong>, de Jordan B. Peterson, se convirtió en un fenómeno mundial al proponer una guía directa, profunda e incluso provocadora para vivir con más propósito, responsabilidad y equilibrio.
        </p>
        
        <p>En una época de ansiedad, distracción y falta de dirección, Peterson ofrece principios prácticos — algunos simples, otros desafiantes — que ayudan a dar estructura a la vida.</p>

        <p class="italic text-center font-medium">Este resumen trae lo esencial de cada regla y lo que puedes aplicar en la práctica a partir de hoy.</p>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Las 12 Reglas para la Vida</h2>
        
        <div class="space-y-6">
          <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 p-6 rounded-xl border-l-4 border-blue-500">
            <h3 class="text-xl font-bold text-blue-800 dark:text-blue-300 mb-3">🧿 Regla 1: Mantente erguido con los hombros hacia atrás</h3>
            <p class="text-sm mb-2">Tu postura física altera tu psicología.</p>
            <p class="text-sm">Peterson explica que <strong>postura confiada → mente confiada</strong>. Postura derrotada → mente frágil.</p>
            <p class="text-sm mt-2 font-medium text-blue-700 dark:text-blue-400">Es una invitación a asumir responsabilidad, enfrentar desafíos y ocupar tu lugar en el mundo.</p>
          </div>

          <div class="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 p-6 rounded-xl border-l-4 border-red-500">
            <h3 class="text-xl font-bold text-red-800 dark:text-red-300 mb-3">❤️ Regla 2: Trátate a ti mismo como a alguien a quien eres responsable de ayudar</h3>
            <p class="text-sm mb-2">Cuidas mejor a los demás que a ti mismo.</p>
            <p class="text-sm font-medium text-red-700 dark:text-red-400">La regla enseña: date el mismo cuidado, paciencia y compasión que darías a alguien querido.</p>
          </div>

          <div class="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 p-6 rounded-xl border-l-4 border-purple-500">
            <h3 class="text-xl font-bold text-purple-800 dark:text-purple-300 mb-3">👨‍👦 Regla 3: Hazte amigo de personas que quieren lo mejor para ti</h3>
            <p class="text-sm mb-2">Los ambientes moldean destinos.</p>
            <ul class="text-sm space-y-1 text-purple-700 dark:text-purple-400">
              <li>• Aléjate de quienes te mantienen en el pasado</li>
              <li>• Acércate a quienes te impulsan hacia arriba</li>
            </ul>
          </div>

          <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-6 rounded-xl border-l-4 border-green-500">
            <h3 class="text-xl font-bold text-green-800 dark:text-green-300 mb-3">🧼 Regla 4: Compárate con quien eras ayer, no con quien otra persona es hoy</h3>
            <p class="text-sm mb-2">Las redes sociales crean comparación infinita.</p>
            <p class="text-sm">La solución:</p>
            <ul class="text-sm space-y-1 text-green-700 dark:text-green-400 mt-2">
              <li>→ Competir contigo mismo</li>
              <li>→ Buscar microprogresos</li>
              <li>→ Entender que la evolución es personal</li>
            </ul>
          </div>

          <div class="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 p-6 rounded-xl border-l-4 border-amber-500">
            <h3 class="text-xl font-bold text-amber-800 dark:text-amber-300 mb-3">🏠 Regla 5: No dejes que tus hijos hagan cosas que te hagan dejar de quererlos</h3>
            <p class="text-sm mb-2">Peterson habla sobre disciplina, límites y orden familiar.</p>
            <p class="text-sm font-medium text-amber-700 dark:text-amber-400">Niños sin límites crecen inseguros. Niños con estructura crecen fuertes.</p>
          </div>

          <div class="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 p-6 rounded-xl border-l-4 border-indigo-500">
            <h3 class="text-xl font-bold text-indigo-800 dark:text-indigo-300 mb-3">👁️ Regla 6: Pon tu propia casa en orden antes de criticar el mundo</h3>
            <p class="text-sm mb-2">No culpes al gobierno, al jefe, a la economía.</p>
            <p class="text-sm">Mira lo que TÚ puedes arreglar:</p>
            <ul class="text-sm space-y-1 text-indigo-700 dark:text-indigo-400 mt-2">
              <li>• Relaciones</li>
              <li>• Finanzas</li>
              <li>• Hábitos</li>
              <li>• Rutinas</li>
              <li>• Prioridades</li>
            </ul>
            <p class="text-sm mt-2 font-bold">El cambio comienza de adentro hacia afuera.</p>
          </div>

          <div class="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 p-6 rounded-xl border-l-4 border-orange-500">
            <h3 class="text-xl font-bold text-orange-800 dark:text-orange-300 mb-3">🎯 Regla 7: Persigue lo que es significativo, no lo que es conveniente</h3>
            <p class="text-sm mb-2">Lo que es fácil casi siempre es vacío. Lo que es difícil generalmente es valioso.</p>
            <blockquote class="italic text-orange-700 dark:text-orange-400 mt-2">
              "La vida mejora cuando decides cargar una carga que realmente importa."
            </blockquote>
          </div>

          <div class="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/10 dark:to-cyan-900/10 p-6 rounded-xl border-l-4 border-teal-500">
            <h3 class="text-xl font-bold text-teal-800 dark:text-teal-300 mb-3">🚫 Regla 8: Di la verdad — o, al menos, no mientas</h3>
            <p class="text-sm mb-2">Las mentiras corroen el alma. La verdad libera, alinea y fortalece.</p>
            <p class="text-sm font-medium text-teal-700 dark:text-teal-400">Esta regla es sobre integridad personal.</p>
          </div>

          <div class="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 p-6 rounded-xl border-l-4 border-pink-500">
            <h3 class="text-xl font-bold text-pink-800 dark:text-pink-300 mb-3">💬 Regla 9: Asume que la persona con la que hablas sabe algo que tú no sabes</h3>
            <p class="text-sm mb-2">Escuchar es un superpoder.</p>
            <p class="text-sm font-medium text-pink-700 dark:text-pink-400">Cuando escuchas para aprender, no para responder, creces más rápido.</p>
          </div>

          <div class="bg-gradient-to-r from-lime-50 to-green-50 dark:from-lime-900/10 dark:to-green-900/10 p-6 rounded-xl border-l-4 border-lime-500">
            <h3 class="text-xl font-bold text-lime-800 dark:text-lime-300 mb-3">🗣️ Regla 10: Sé preciso en tu discurso</h3>
            <p class="text-sm mb-2">Nombra el problema.</p>
            <p class="text-sm font-medium text-lime-700 dark:text-lime-400">Cuanto más claro describes un problema, más rápido encuentras la solución.</p>
          </div>

          <div class="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/10 dark:to-blue-900/10 p-6 rounded-xl border-l-4 border-sky-500">
            <h3 class="text-xl font-bold text-sky-800 dark:text-sky-300 mb-3">🐕 Regla 11: No molestes a los niños cuando estén andando en patineta</h3>
            <p class="text-sm mb-2">Esta regla habla sobre riesgo, coraje y autonomía.</p>
            <p class="text-sm">Los niños (y adultos) necesitan arriesgarse un poco para crecer.</p>
            <p class="text-sm mt-2 font-medium text-sky-700 dark:text-sky-400">La sobreprotección genera fragilidad.</p>
          </div>

          <div class="bg-gradient-to-r from-fuchsia-50 to-purple-50 dark:from-fuchsia-900/10 dark:to-purple-900/10 p-6 rounded-xl border-l-4 border-fuchsia-500">
            <h3 class="text-xl font-bold text-fuchsia-800 dark:text-fuchsia-300 mb-3">🐱 Regla 12: Acaricia un gato cuando te encuentres uno en la calle</h3>
            <p class="text-sm mb-2">Esta regla es sobre dolor, sufrimiento y aceptación.</p>
            <p class="text-sm">La vida es dura — pero aún así hay belleza en las pequeñas cosas.</p>
            <p class="text-sm mt-2 font-medium text-fuchsia-700 dark:text-fuchsia-400">Peterson enseña a encontrar micromoment de presencia, paz y gratitud incluso en tiempos difíciles.</p>
          </div>
        </div>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">⭐ Lecciones Esenciales del Libro</h2>
        
        <ul class="grid gap-3 md:grid-cols-2">
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> La responsabilidad trae propósito
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> La verdad es más poderosa que la comodidad
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> El crecimiento requiere riesgo
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> El autoconocimiento es esencial
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> La comparación destruye la identidad
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> El orden interno genera orden externo
          </li>
          <li class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-2 text-sm">
            <span class="text-yellow-500">★</span> El propósito es mejor que el placer inmediato
          </li>
        </ul>

        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-12 mb-6">Conclusión</h2>
        
        <p>
          <strong>12 Reglas para la Vida</strong> es una guía para tomar control, ordenar el caos interno y vivir intencionalmente.
        </p>

        <p class="my-4">Peterson combina psicología, filosofía y experiencias humanas para recordarnos que vivir bien requiere:</p>

        <ul class="grid md:grid-cols-2 gap-3 my-6">
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Disciplina</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Verdad</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Responsabilidad</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Coraje</li>
          <li class="bg-primary/10 p-3 rounded-lg font-medium">✓ Humildad</li>
        </ul>

        <p class="font-medium text-xl text-center my-8 text-primary">
          La vida mejora cuando tú mejoras.<br/>
          Y ese cambio comienza hoy.
        </p>
      </div>
    `,
    author: 'OnePageBook Team',
    date: '2024-03-16',
    language: 'es',
    tags: ['Psicología', 'Filosofía', 'Desarrollo Personal', 'Responsabilidad']
  }
];

export const getPostsByLanguage = (lang: string) => {
  return blogPosts.filter(post => post.language === lang);
};

export const getPostBySlug = (lang: string, slug: string) => {
  return blogPosts.find(post => post.language === lang && post.slug === slug);
};
