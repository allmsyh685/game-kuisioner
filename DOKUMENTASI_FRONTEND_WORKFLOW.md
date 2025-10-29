# Dokumentasi Frontend Workflow - QuizzyPlay

## Pendahuluan

QuizzyPlay adalah aplikasi web frontend yang saya kembangkan untuk penelitian gamifikasi kuesioner dengan integrasi permainan tower defense. Aplikasi ini dibangun menggunakan **Next.js 15** dengan **TypeScript**, **Tailwind CSS**, dan **Zustand** untuk state management. Aplikasi ini menggabungkan elemen survei tradisional dengan permainan interaktif untuk meningkatkan engagement pengguna dalam mengisi kuesioner penelitian.

## Arsitektur Aplikasi

### Tech Stack
- **Framework**: Next.js 15 dengan App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand dengan persistence
- **Form Handling**: React Hook Form dengan Zod validation
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Struktur Folder
```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard dan management
│   ├── game/              # Game scenes dan dialog
│   ├── questionnaire/     # Traditional questionnaire
│   └── towergames/        # Tower defense game
├── components/            # Reusable UI components
├── lib/                   # Utilities dan API layer
└── types/                 # TypeScript type definitions
```

## State Management dengan Zustand

Saya menggunakan **Zustand** sebagai state management utama karena kesederhanaannya dan performa yang baik. Store utama terletak di `src/lib/store.ts` dan mengelola seluruh state aplikasi dengan persistence ke localStorage.

### GameState Interface
```typescript
export interface GameState {
  userName: string;
  userLocation: string;
  userAge: string;
  userInfoSubmitted: boolean;
  answersByScene: AnswersByScene;
  pointsByScene: PointsByScene;
  
  // Actions
  setUserInfo: (name: string, age: string, location: string) => void;
  setUserInfoSubmitted: (submitted: boolean) => void;
  saveAnswer: (scene: SceneSlug, questionId: number, optionId: number) => void;
  setPoints: (scene: SceneSlug, points: number) => void;
  addPoints: (scene: SceneSlug, delta: number) => void;
  getTotalPoints: () => number;
  clearAll: () => void;
}
```

### Persistence Strategy
```typescript
export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // State implementation
    }),
    {
      name: 'gamefix2025-store',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        userName: state.userName,
        userLocation: state.userLocation,
        userAge: state.userAge,
        userInfoSubmitted: state.userInfoSubmitted,
        answersByScene: state.answersByScene,
        pointsByScene: state.pointsByScene,
      }),
      version: 1,
    },
  ),
);
```

**Mengapa saya memilih pendekatan ini:**
- **Persistence**: Data pengguna tersimpan di localStorage sehingga tidak hilang saat refresh
- **Type Safety**: Full TypeScript support dengan interface yang jelas
- **Performance**: Zustand lebih ringan dibanding Redux
- **Simplicity**: API yang sederhana dan mudah dipahami

## Halaman Utama (Home Page)

### File: `src/app/page.tsx`

Halaman utama adalah **landing page** yang saya desain dengan carousel interaktif untuk memperkenalkan fitur-fitur aplikasi. Halaman ini menggunakan **client-side rendering** dengan state management untuk navigasi carousel.

### Fungsionalitas Utama

#### 1. Carousel System
```typescript
const [carouselIndex, setCarouselIndex] = useState(0);
const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
const [cardShift, setCardShift] = useState(0);

const carouselSlides = [
  {
    bgImg: '/assets/background_1.avif',
    title: 'Survei Penelitian',
    desc: 'Selamat datang di survei inovasi kuesioner...',
    button: {
      text: '🎯 Mulai Survei Penelitian',
      href: '/game/scene/scene1',
      style: 'bg-gradient-to-r from-blue-600 to-purple-600...'
    }
  },
  // ... slides lainnya
];
```

**Cara Kerja:**
- **State Management**: Menggunakan `useState` untuk mengontrol index carousel dan animasi
- **Touch Support**: Implementasi swipe gesture untuk mobile dengan `onTouchStart`, `onTouchMove`, `onTouchEnd`
- **Animation**: CSS transitions dengan `transform: translateX()` untuk smooth sliding
- **Responsive**: Adaptive layout dengan Tailwind CSS breakpoints

#### 2. Background Image System
```typescript
<div
  className="flex h-full w-full"
  style={{
    width: `${carouselSlides.length * 100}%`,
    transform: `translateX(-${carouselIndex * (100 / carouselSlides.length)}%)`,
    transition: 'transform 600ms ease',
  }}
>
  {carouselSlides.map((slide, idx) => (
    <div key={idx} className="relative h-full" style={{ width: `${100 / carouselSlides.length}%` }}>
      <Image
        src={slide.bgImg}
        alt={`Hero background ${idx + 1}`}
        fill
        sizes="100vw"
        priority={idx === 0}
        placeholder="blur"
        quality={60}
        style={{ objectFit: 'cover' }}
      />
    </div>
  ))}
</div>
```

**Optimasi yang saya terapkan:**
- **Next.js Image**: Optimasi otomatis dengan lazy loading
- **Priority Loading**: Background pertama dimuat dengan prioritas tinggi
- **Blur Placeholder**: UX yang lebih baik saat loading
- **Responsive Images**: `sizes="100vw"` untuk optimal loading

#### 3. Navigation Controls
```typescript
const prevSlide = () => {
  setSlideDirection('prev');
  setCarouselIndex((carouselIndex + carouselSlides.length - 1) % carouselSlides.length);
};

const nextSlide = () => {
  setSlideDirection('next');
  setCarouselIndex((carouselIndex + 1) % carouselSlides.length);
};
```

**Fitur Navigasi:**
- **Circular Navigation**: Loop infinite dengan modulo operator
- **Direction Tracking**: Untuk animasi yang konsisten
- **Keyboard Support**: Bisa ditambahkan event listener untuk arrow keys
- **Accessibility**: ARIA labels untuk screen readers

## Halaman Game Scene (Interactive Survey)

### File: `src/app/game/scene/[slug]/page.tsx`

Ini adalah **halaman inti** dari aplikasi saya, di mana pengguna mengalami survei interaktif dengan karakter E.V.I (Electronic Virtual Interviewer). Halaman ini menggunakan **dynamic routing** dengan `[slug]` untuk mendukung multiple scenes.

### Fungsionalitas Utama

#### 1. Dynamic Scene Loading
```typescript
const dialogMap: Record<string, Scene1Frame[]> = {
  scene1: require('../../scene1Dialog').scene1Dialog as Scene1Frame[],
  scene2: require('../../scene2Dialog').scene2Dialog as Scene1Frame[],
  scene3: require('../../scene3Dialog').scene3Dialog as Scene1Frame[]
};

const params = useParams();
const slug = params?.slug as string || 'scene1';
const dialog: Scene1Frame[] = dialogMap[slug] || dialogMap['scene1'];
```

**Mengapa saya menggunakan pendekatan ini:**
- **Modularity**: Setiap scene memiliki dialog file terpisah
- **Type Safety**: Interface `Scene1Frame` memastikan struktur data konsisten
- **Fallback**: Default ke scene1 jika slug tidak ditemukan
- **Performance**: Dynamic import untuk code splitting

#### 2. User Information Collection
```typescript
{slug === 'scene1' && !userInfoSubmitted && (
  <form
    onSubmit={e => {
      e.preventDefault();
      setUserInfoSubmitted(true);
    }}
    className="flex flex-col items-center justify-center h-full w-full absolute z-50 backdrop-blur-sm"
  >
    <div className="relative max-w-lg w-full mx-4">
      <div className="relative bg-black/60 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden">
        {/* Form fields */}
        <input
          type="text"
          className="w-full p-4 rounded-2xl bg-black/60 text-white text-lg border border-white/30 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 focus:outline-none transition-all duration-300 placeholder-white/80 caret-white"
          placeholder="Masukkan nama lengkap Anda"
          value={userName}
          onChange={e => setUserInfo(e.target.value, userAge, userLocation)}
          required
        />
      </div>
    </div>
  </form>
)}
```

**Design Decisions:**
- **Conditional Rendering**: Form hanya muncul di scene1 dan jika user belum submit info
- **State Integration**: Langsung terintegrasi dengan Zustand store
- **Visual Design**: Glassmorphism effect dengan backdrop-blur
- **Validation**: Required fields dengan visual feedback

#### 3. Audio System
```typescript
useEffect(() => {
  if (frame && frame.audio && userInfoSubmitted) {
    if (currentAudioFile !== frame.audio) {
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Create new audio element
      const audio = new Audio(frame.audio);
      audioRef.current = audio;
      
      // Set up event listeners
      audio.addEventListener('canplaythrough', () => {
        setAudioLoaded(true);
        if (!audioPaused) {
          audio.play().catch(error => {
            console.log('Audio autoplay failed:', error);
          });
          setAudioPlaying(true);
        }
      });
      
      audio.load();
    }
  }
}, [frameIdx, frame, userInfoSubmitted, audioPaused, currentAudioFile]);
```

**Audio Management Strategy:**
- **Single Audio Instance**: Satu audio element per frame untuk menghindari konflik
- **State Tracking**: `audioPlaying`, `audioLoaded`, `audioPaused` untuk UI feedback
- **Error Handling**: Graceful handling untuk autoplay restrictions
- **Memory Management**: Cleanup saat component unmount

#### 4. Question Integration
```typescript
useEffect(() => {
  if (frame && frame.questionId) {
    setLoading(true);
    axios.get(`${API_BASE}/questions`, { 
      headers: { ...(API_TOKEN ? { 'Authorization': `Bearer ${API_TOKEN}` } : {}) } 
    })
      .then(res => {
        let q = res.data.data.find((q: unknown) => 
          Number((q as { id: number }).id) === Number(frame.questionId)
        );
        if (q) {
          q = {
            ...q,
            text: (q as any).question_text,
            type: 'select',
            options: Array.isArray((q as any).options) ? (q as any).options : [],
          };
        }
        setQuestion(q || null);
      })
      .catch(() => setQuestion(null))
      .finally(() => setLoading(false));
  } else {
    setQuestion(null);
  }
  setAnswer(null);
}, [frameIdx]);
```

**Question Loading Logic:**
- **API Integration**: Fetch questions dari backend dengan authentication
- **Data Transformation**: Mapping dari backend format ke frontend format
- **Error Handling**: Fallback ke null jika API gagal
- **State Reset**: Clear answer saat pindah frame

#### 5. Answer Submission
```typescript
const handleNext = async (selectedAnswer?: number) => {
  if (frame.questionId && question) {
    const answerToSave = selectedAnswer !== undefined ? selectedAnswer : answer;
    // Save answer to store (persisted)
    useGameStore.getState().saveAnswer(slug as string, Number(question.id), Number(answerToSave));
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFrameIdx(idx => Math.min(idx + 1, dialog.length - 1));
    }, 800);
  } else {
    // Handle frame transitions
    if (frame?.isSubmit) {
      const res = await handleSubmitAll();
      const query = res ? `?user=${encodeURIComponent(res.userName)}&points=${encodeURIComponent(String(res.totalPoints))}` : '';
      window.location.href = `/towergames/leaderboard${query}`;
      return;
    }

    if (frame?.redirectToTowerGames) {
      const waves = frame.waves ?? (slug === 'scene1' ? 1 : slug === 'scene2' ? 2 : 3);
      window.location.href = `/towergames?waves=${waves}`;
      return;
    }
  }
};
```

**Submission Flow:**
- **Immediate Persistence**: Jawaban langsung disimpan ke Zustand store
- **Visual Feedback**: Loading state dan success message
- **Conditional Navigation**: Berbeda berdasarkan frame type (question, submit, redirect)
- **URL Parameters**: Pass data ke halaman berikutnya via query string

#### 6. Final Submission
```typescript
const handleSubmitAll = async (): Promise<{ userName: string; totalPoints: number } | null> => {
  const { answersByScene, pointsByScene } = useGameStore.getState();
  const allAnswers = (Object.values(answersByScene as Record<string, Record<number, number>>) as Record<number, number>[]) 
    .reduce((acc: Record<number, number>, obj: Record<number, number>) => ({ ...acc, ...obj }), {} as Record<number, number>);

  const answersArray = Object.entries(allAnswers).map(([qid, optId]) => ({
    question_id: Number(qid),
    option_id: Number(optId as any),
  }));

  const payload = {
    name: userName,
    age: Number(userAge),
    location: userLocation,
    answers: answersArray,
  };

  try {
    // Post survey responses
    const response = await axios.post(`${API_BASE}/responses`, payload, { 
      headers: { ...(API_TOKEN ? { 'Authorization': `Bearer ${API_TOKEN}` } : {}) } 
    });
    
    // Calculate total points
    const storePoints = (Object.values(pointsByScene as Record<string, number>) as number[])
      .reduce((sum: number, p: number) => sum + (p || 0), 0);
    const ls1 = parseInt(localStorage.getItem('scene1Points') || '0', 10);
    const ls2 = parseInt(localStorage.getItem('scene2Points') || '0', 10);
    const ls3 = parseInt(localStorage.getItem('scene3Points') || '0', 10);
    const ls4 = parseInt(localStorage.getItem('scene4Points') || '0', 10);
    const localPoints = ls1 + ls2 + ls3 + ls4;
    const totalPoints = Math.max(storePoints, localPoints);
    
    // Post score to leaderboard
    if (totalPoints > 0 && userName) {
      const scorePayload = {
        name: userName,
        points: totalPoints,
        survey_id: response.data.data.id
      };
      await axios.post(`${API_BASE}/scores`, scorePayload, { 
        headers: { ...(API_TOKEN ? { 'Authorization': `Bearer ${API_TOKEN}` } : {}) } 
      });
    }
    
    // Clear all data
    useGameStore.getState().clearAll();
    // Clear legacy localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userName');
      localStorage.removeItem('userLocation');
      localStorage.removeItem('userAge');
      // ... clear other localStorage items
    }
    
    return { userName, totalPoints };
  } catch (e) {
    alert('Gagal mengirim jawaban!');
    return null;
  }
};
```

**Submission Strategy:**
- **Data Aggregation**: Menggabungkan semua jawaban dari berbagai scenes
- **Dual Storage**: Support untuk Zustand store dan legacy localStorage
- **API Integration**: Submit ke backend dengan proper error handling
- **Score Calculation**: Menghitung total points dari game
- **Cleanup**: Clear semua data setelah submission berhasil

## Halaman Tower Defense Game

### File: `src/app/towergames/page.tsx`

Halaman ini mengintegrasikan **game tower defense** yang saya buat menggunakan **Phaser.js**. Game ini berjalan di canvas HTML5 dan terintegrasi dengan sistem survei.

### Fungsionalitas Utama

#### 1. Script Loading System
```typescript
const loadScriptSequentially = (src: string, id: string) => {
  return new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      console.log(`Already present: ${src}`);
      return resolve();
    }
    const script = document.createElement('script');
    script.src = src;
    script.id = id;
    script.async = false;
    script.onload = () => {
      console.log(`Loaded: ${src}`);
      resolve();
    };
    script.onerror = () => {
      console.error(`Failed to load: ${src}`);
      reject();
    };
    document.head.appendChild(script);
  });
};
```

**Loading Strategy:**
- **Sequential Loading**: Scripts dimuat berurutan untuk menghindari dependency issues
- **Duplicate Prevention**: Check existing scripts sebelum load
- **Error Handling**: Proper error handling untuk failed loads
- **Global Scope**: Scripts dimuat ke window object untuk Phaser

#### 2. Game Initialization
```typescript
useEffect(() => {
  const loadAllScripts = async () => {
    try {
      if ((window as any).__tower_game_scripts_loaded__) {
        console.log('Tower game scripts were already loaded, skipping re-load.');
        return;
      }
      
      // 1. Load Phaser first
      await loadScriptSequentially('/towergames/js/lib/phaser.min.js', 'phaser-script');
      
      // 2. Load dependencies
      await loadScriptSequentially('https://cdn.jsdelivr.net/npm/nipplejs@0.9.0/dist/nipplejs.min.js', 'nipplejs-script');
      
      // 3. Load game states
      await loadScriptSequentially('/towergames/js/states/bootstate.js', 'bootstate-script');
      await loadScriptSequentially('/towergames/js/states/loaderstate.js', 'loaderstate-script');
      await loadScriptSequentially('/towergames/js/states/mainmenustate.js', 'mainmenustate-script');
      await loadScriptSequentially('/towergames/js/states/gamestate.js', 'gamestate-script');
      await loadScriptSequentially('/towergames/js/states/gameoverstate.js', 'gameoverstate-script');
      
      // 4. Load managers and entities
      // ... more scripts
      
      console.log('All scripts loaded successfully!');
      (window as any).__tower_game_scripts_loaded__ = true;
    } catch (error) {
      console.error('Terjadi kesalahan saat memuat skrip:', error);
    }
  };

  loadAllScripts();
}, []);
```

**Initialization Flow:**
- **Dependency Management**: Load Phaser terlebih dahulu, kemudian dependencies
- **State Loading**: Load game states (boot, loader, main menu, game, game over)
- **Entity Loading**: Load game entities (player, enemies, turrets, etc.)
- **Manager Loading**: Load game managers (collision, input, inventory, etc.)
- **Global Flag**: Prevent multiple initializations

#### 3. Mobile Controls Integration
```typescript
<button
  id="show-mobile-controls"
  style={{
    position: 'fixed',
    top: 10,
    right: 10,
    zIndex: 2000,
    padding: '10px 18px',
    fontSize: 16,
    background: '#ffb300',
    color: '#222',
    border: 'none',
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    cursor: 'pointer'
  }}
  onClick={() => {
    const mobileControls = document.getElementById('mobile-controls');
    if (mobileControls) {
      mobileControls.style.display = 'block';
      if (typeof (window as any).setupMobileControls === 'function') {
        (window as any).setupMobileControls();
      }
    }
  }}
>
  Tampilkan Kontrol Mobile
</button>
```

**Mobile Support:**
- **Touch Controls**: Joystick untuk movement, touch area untuk shooting
- **Responsive Design**: Controls adapt untuk mobile devices
- **Game Integration**: Controls terintegrasi dengan Phaser game

#### 4. URL Parameter Handling
```typescript
useEffect(() => {
  const waves = searchParams.get('waves');
  console.log('TowerGames page loaded with waves parameter:', waves);
  if (waves) {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('waves', waves);
    window.history.replaceState({}, '', currentUrl.toString());
    console.log('Updated URL with waves parameter:', currentUrl.toString());
  }
}, [searchParams]);
```

**Parameter Integration:**
- **Wave Configuration**: Game difficulty berdasarkan parameter URL
- **State Persistence**: URL parameters dipertahankan untuk game state
- **Navigation**: Seamless transition dari survey ke game

## Halaman Leaderboard

### File: `src/app/towergames/leaderboard/page.tsx`

Halaman leaderboard menampilkan **ranking pemain** berdasarkan skor yang diperoleh dari game tower defense.

### Fungsionalitas Utama

#### 1. Score Fetching
```typescript
useEffect(() => {
  const u = searchParams.get('user');
  const p = searchParams.get('points');
  setUserName(u);
  setUserPoints(p ? Number(p) : null);

  fetch(`${API_BASE}/scores/leaderboard`, { 
    headers: { ...(API_TOKEN ? { 'Authorization': `Bearer ${API_TOKEN}` } : {}) } 
  })
    .then(res => res.json())
    .then(async data => {
      if (data.success) {
        const top = Array.isArray(data.data) ? data.data.slice(0, 3) : [];
        setScores(top);

        // If user just arrived with points, fetch rank announcement
        if (p) {
          try {
            const rankRes = await fetch(`${API_BASE}/scores/rank?points=${encodeURIComponent(p)}`, { 
              headers: { ...(API_TOKEN ? { 'Authorization': `Bearer ${API_TOKEN}` } : {}) } 
            });
            const rankJson = await rankRes.json();
            if (rankJson && rankJson.success) {
              setUserRank(rankJson.data.rank ?? null);
              if (Array.isArray(rankJson.data.top)) {
                setScores(rankJson.data.top);
              }
            }
          } catch {
            // Ignore rank error silently
          }
        }
      } else {
        setError('Failed to fetch leaderboard');
      }
    })
    .catch(() => setError('Failed to fetch leaderboard'))
    .finally(() => setLoading(false));
}, [searchParams]);
```

**Data Fetching Strategy:**
- **URL Parameters**: Ambil user info dari query string
- **API Integration**: Fetch leaderboard data dari backend
- **Rank Calculation**: Hitung ranking user berdasarkan points
- **Error Handling**: Graceful error handling dengan fallback

#### 2. Visual Ranking System
```typescript
const getMedalIcon = (position: number) => {
  switch (position) {
    case 0: return '🥇';
    case 1: return '🥈';
    case 2: return '🥉';
    default: return `${position + 1}.`;
  }
};

const getPositionStyle = (position: number) => {
  switch (position) {
    case 0:
      return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-xl shadow-lg border-2 border-yellow-300';
    case 1:
      return 'bg-gradient-to-r from-gray-300 to-gray-400 text-black font-semibold text-lg shadow-md border-2 border-gray-200';
    case 2:
      return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold text-lg shadow-md border-2 border-amber-500';
    default:
      return 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 text-white border border-blue-700/30';
  }
};
```

**Visual Design:**
- **Medal System**: Emoji medals untuk top 3
- **Gradient Styling**: Different gradients untuk setiap ranking
- **Responsive Design**: Adaptive styling untuk mobile dan desktop
- **Accessibility**: Clear visual hierarchy

#### 3. User Achievement Display
```typescript
{userName && userPoints !== null && (
  <div className="w-full max-w-2xl mb-8">
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-xl shadow-lg border border-emerald-400/40">
      <div className="text-center">
        <div className="text-2xl font-bold mb-1">🎉 Bagus sekali, {userName}!</div>
        <div className="text-lg">
          Kamu mendapat <span className="font-semibold">{userPoints.toLocaleString()}</span> poin
          {userRank ? <> dan peringkat kamu saat ini adalah <span className="font-semibold">#{userRank}</span></> : null}.
        </div>
      </div>
    </div>
  </div>
)}
```

**Achievement System:**
- **Personalized Message**: Congratulatory message dengan nama user
- **Score Display**: Formatted score dengan thousand separators
- **Rank Display**: Current ranking jika tersedia
- **Visual Feedback**: Celebratory design dengan emoji dan colors

## Halaman Admin Dashboard

### File: `src/app/admin/page.tsx`

Dashboard admin untuk **mengelola survei** dan melihat **statistik respons**. Halaman ini menggunakan authentication system dan data visualization.

### Fungsionalitas Utama

#### 1. Authentication System
```typescript
useEffect(() => {
  const checkAuth = () => {
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  };

  checkAuth();

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'adminAuthenticated' && e.newValue === 'true') {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  };

  window.addEventListener('storage', handleStorageChange);
  const interval = setInterval(checkAuth, 100);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
    clearInterval(interval);
  };
}, []);
```

**Authentication Strategy:**
- **Session Storage**: Authentication state disimpan di sessionStorage
- **Real-time Check**: Periodic check untuk authentication status
- **Storage Events**: Listen untuk changes dari komponen lain
- **Auto-logout**: Clear data saat logout

#### 2. Statistics Dashboard
```typescript
useEffect(() => {
  if (!isAuthenticated) return;

  const fetchStatistics = async () => {
    try {
      const data = await getStatistics();
      setStatistics(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchStatistics();
}, [isAuthenticated]);
```

**Data Visualization:**
- **Pie Charts**: Education level distribution
- **Bar Charts**: AI usage frequency dan tool usage
- **Real-time Data**: Fetch dari backend API
- **Error Handling**: Graceful error handling

#### 3. Chart Components
```typescript
<ResponsiveContainer width="100%" height={340}>
  <PieChart margin={{ bottom: 24 }}>
    <Pie
      data={statistics?.education_statistics || []}
      cx="50%"
      cy="50%"
      labelLine={false}
      label={(props: any) => `${props?.payload?.education_level || ''} ${props?.percent ? (props.percent * 100).toFixed(0) : 0}%`}
      outerRadius={80}
      fill="#8884d8"
      dataKey="count"
      nameKey="education_level"
    >
      {statistics?.education_statistics.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend verticalAlign="bottom" align="center" iconType="circle" content={<PieLegend />} />
  </PieChart>
</ResponsiveContainer>
```

**Chart Implementation:**
- **Recharts Library**: Professional charting library
- **Responsive Design**: Charts adapt ke container size
- **Custom Legends**: Custom legend components
- **Color Scheme**: Consistent color palette

## Halaman Traditional Questionnaire

### File: `src/app/questionnaire/page.tsx`

Halaman kuesioner tradisional untuk pengguna yang **tidak ingin bermain game**. Menggunakan React Hook Form dengan Zod validation.

### Fungsionalitas Utama

#### 1. Form Management
```typescript
const responseSchema = z.object({
  name: z.string().min(1, 'Nama harus diisi'),
  age: z.number().min(1, 'Usia harus diisi').max(120, 'Usia tidak valid'),
  location: z.string().min(1, 'Lokasi harus diisi'),
  answers: z.record(z.string(), z.coerce.number().int()).refine((val) => Object.keys(val).length > 0, {
    message: 'Jawaban harus diisi',
  }),
});

const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<ResponseFormData>({
  resolver: zodResolver(responseSchema),
  defaultValues: { answers: {} as Record<string, number> },
});
```

**Form Strategy:**
- **Zod Validation**: Schema-based validation dengan TypeScript
- **React Hook Form**: Performant form handling
- **Real-time Validation**: Immediate feedback untuk user
- **Type Safety**: Full TypeScript support

#### 2. Question Loading
```typescript
useEffect(() => {
  const fetchQuestions = async () => {
    try {
      const data = await getQuestions();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchQuestions();
}, []);
```

**Data Loading:**
- **API Integration**: Fetch questions dari backend
- **Loading States**: Proper loading indicators
- **Error Handling**: Graceful error handling
- **State Management**: Local state untuk questions

#### 3. Submission Handling
```typescript
const onSubmit = async (data: ResponseFormData) => {
  setSubmitting(true);
  try {
    const payload: SubmitResponsePayload = {
      name: data.name,
      age: data.age,
      location: data.location,
      answers: Object.entries(data.answers).map(([questionId, optionId]) => ({
        question_id: Number(questionId),
        option_id: Number(optionId),
      })),
    };
    await submitResponse(payload);
    setSubmitted(true);
    reset({ name: '', age: 0, location: '', answers: {} });
  } catch (error) {
    console.error('Error submitting response:', error);
    alert('Terjadi kesalahan saat mengirim jawaban. Silakan coba lagi.');
  } finally {
    setSubmitting(false);
  }
};
```

**Submission Flow:**
- **Data Transformation**: Convert form data ke API format
- **API Call**: Submit ke backend dengan error handling
- **Success State**: Show success message
- **Form Reset**: Clear form setelah submission

## Komponen UI Reusable

### Navbar Component
### File: `src/components/layout/Navbar.tsx`

```typescript
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Left */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <Image
              src="/assets/logo_unair.png"
              alt="Universitas Airlangga Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-white font-bold text-xl">QuizzyPlay</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Beranda
              </Link>
              <Link href="/questionnaire" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Kuesioner
              </Link>
              <Link href="/towergames" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Permainan Pertahanan Menara
              </Link>
              <Link href="/admin" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
```

**Navbar Features:**
- **Responsive Design**: Mobile menu dengan hamburger button
- **Brand Integration**: Logo universitas dan himatika
- **Navigation Links**: Clear navigation ke semua halaman
- **Accessibility**: Proper ARIA labels dan keyboard navigation

### PasskeyAuth Component
### File: `src/components/ui/PasskeyAuth.tsx`

```typescript
export default function PasskeyAuth({ onAuthSuccess }: PasskeyAuthProps) {
  const [passkey, setPasskey] = useState('');
  const [showPasskey, setShowPasskey] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const CORRECT_PASSKEY = '1234';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 500));

    if (passkey === CORRECT_PASSKEY) {
      sessionStorage.setItem('adminAuthenticated', 'true');
      onAuthSuccess();
      window.location.reload();
    } else {
      setError('Passkey salah. Silakan coba lagi.');
      setPasskey('');
    }
    
    setIsLoading(false);
  };
```

**Authentication Features:**
- **Simple Passkey**: Hardcoded passkey untuk demo
- **Session Storage**: Authentication state persistence
- **Visual Feedback**: Loading states dan error messages
- **Security**: Password visibility toggle

## API Layer

### File: `src/lib/api.ts`

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kuisioner-api-production.up.railway.app/api';
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(API_TOKEN ? { 'Authorization': `Bearer ${API_TOKEN}` } : {}),
  },
});

// Public API calls
export const getQuestions = async (): Promise<Question[]> => {
  const response = await api.get<ApiResponse<Question[]>>('/questions');
  return response.data.data;
};

export const submitResponse = async (data: SubmitResponsePayload): Promise<ResponseMaster> => {
  const response = await api.post<ApiResponse<ResponseMaster>>('/responses', data);
  return response.data.data;
};

// Admin API calls
export const getAdminQuestions = async (): Promise<AdminQuestionView[]> => {
  const response = await api.get<ApiResponse<Question[]>>('/admin/questions');
  return response.data.data.map((q) => ({
    id: q.id,
    question_text: q.question_text,
    options: q.options.map((o) => o.text),
    order: q.order,
    is_active: q.is_active,
    created_at: q.created_at,
    updated_at: q.updated_at,
  }));
};
```

**API Strategy:**
- **Centralized Configuration**: Single API base URL dan token
- **Type Safety**: Full TypeScript interfaces
- **Error Handling**: Consistent error handling across all calls
- **Authentication**: Bearer token authentication
- **Data Transformation**: Mapping dari backend ke frontend format

## Type Definitions

### File: `src/types/index.ts`

```typescript
export interface Question {
  id: number;
  question_text: string;
  options: QuestionOptionView[];
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubmitResponsePayload {
  name: string;
  age: number;
  location: string;
  answers: Array<{
    question_id: number;
    option_id?: number;
    answer_text?: string;
  }>;
}

export interface Statistics {
  total_responses: number;
  education_statistics: Array<{
    education_level: string;
    count: number;
  }>;
  ai_usage_statistics: Array<{
    ai_usage_frequency: string;
    count: number;
  }>;
  ai_tool_statistics: Array<{
    ai_tool_used: string;
    count: number;
  }>;
}
```

**Type Strategy:**
- **Comprehensive Coverage**: Types untuk semua data structures
- **API Alignment**: Types sesuai dengan backend API
- **Reusability**: Shared types across components
- **Documentation**: Self-documenting code dengan clear interfaces

## Workflow Aplikasi

### 1. User Journey - Gamified Survey
1. **Landing Page**: User melihat carousel dengan 3 opsi utama
2. **User Registration**: User mengisi nama, usia, dan lokasi
3. **Interactive Survey**: User berinteraksi dengan karakter E.V.I
4. **Question Answering**: User menjawab pertanyaan dengan audio dan visual feedback
5. **Game Integration**: User bermain tower defense game
6. **Score Calculation**: Points dari game dihitung dan disimpan
7. **Leaderboard**: User melihat ranking dan achievement

### 2. User Journey - Traditional Survey
1. **Landing Page**: User memilih "ISI SURVEI TANPA PERMAINAN"
2. **Form Filling**: User mengisi form dengan validation
3. **Question Answering**: User menjawab semua pertanyaan
4. **Submission**: Data dikirim ke backend
5. **Confirmation**: User mendapat konfirmasi submission

### 3. Admin Journey
1. **Authentication**: Admin masuk dengan passkey
2. **Dashboard**: Admin melihat statistik dan overview
3. **Question Management**: Admin mengelola pertanyaan
4. **Response Viewing**: Admin melihat semua respons
5. **Data Export**: Admin export data ke CSV

## Optimasi dan Performance

### 1. Image Optimization
- **Next.js Image**: Automatic optimization dan lazy loading
- **WebP/AVIF**: Modern image formats untuk better compression
- **Responsive Images**: Different sizes untuk different devices
- **Blur Placeholders**: Better UX saat loading

### 2. Code Splitting
- **Dynamic Imports**: Scene dialogs dimuat secara dinamis
- **Route-based Splitting**: Each page adalah separate chunk
- **Component Lazy Loading**: Heavy components dimuat on-demand

### 3. State Management
- **Zustand**: Lightweight state management
- **Persistence**: Data tersimpan di localStorage
- **Selective Updates**: Hanya update state yang berubah
- **Memory Management**: Proper cleanup saat component unmount

### 4. API Optimization
- **Axios Instance**: Reusable HTTP client
- **Request Caching**: Cache responses untuk better performance
- **Error Handling**: Consistent error handling
- **Loading States**: Proper loading indicators

## Security Considerations

### 1. Authentication
- **Session Storage**: Admin authentication di sessionStorage
- **API Tokens**: Bearer token authentication
- **Input Validation**: Zod schema validation
- **XSS Protection**: Proper input sanitization

### 2. Data Protection
- **HTTPS**: All API calls menggunakan HTTPS
- **Environment Variables**: Sensitive data di environment variables
- **Input Sanitization**: All user inputs di-validate
- **Error Handling**: Tidak expose sensitive information

## Kesimpulan

Aplikasi QuizzyPlay yang saya kembangkan adalah **inovasi dalam penelitian kuesioner** yang menggabungkan elemen tradisional dengan gamifikasi. Dengan menggunakan **Next.js 15**, **TypeScript**, dan **Zustand**, saya berhasil membuat aplikasi yang:

1. **User-Friendly**: Interface yang intuitif dan responsive
2. **Performant**: Optimasi untuk loading dan rendering
3. **Scalable**: Arsitektur yang mudah dikembangkan
4. **Maintainable**: Code yang clean dan well-documented
5. **Secure**: Proper authentication dan data protection

Aplikasi ini tidak hanya mengumpulkan data penelitian, tetapi juga memberikan **pengalaman yang engaging** kepada pengguna melalui integrasi game tower defense. State management yang robust memastikan data tidak hilang, sementara API layer yang well-designed memungkinkan integrasi yang seamless dengan backend.

Dengan dokumentasi ini, saya berharap dapat memberikan pemahaman yang komprehensif tentang bagaimana aplikasi frontend ini bekerja, dari level arsitektur hingga implementasi detail setiap komponen.

