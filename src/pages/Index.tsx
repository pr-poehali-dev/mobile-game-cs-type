import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Weapon {
  id: string;
  name: string;
  type: string;
  damage: number;
  fireRate: number;
  accuracy: number;
  level: number;
  maxLevel: number;
  icon: string;
}

interface Player {
  x: number;
  y: number;
  health: number;
  angle: number;
}

interface Enemy {
  id: string;
  x: number;
  y: number;
  health: number;
  team: 'red' | 'blue';
}

interface CapturePoint {
  id: string;
  x: number;
  y: number;
  progress: number;
  team: 'neutral' | 'red' | 'blue';
}

interface Bullet {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const Index = () => {
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<'menu' | 'loadout' | 'upgrade' | 'game'>('menu');
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<Player>({ x: 100, y: 300, health: 100, angle: 0 });
  const [enemies, setEnemies] = useState<Enemy[]>([
    { id: '1', x: 700, y: 200, health: 100, team: 'red' },
    { id: '2', x: 650, y: 400, health: 100, team: 'red' },
    { id: '3', x: 750, y: 300, health: 100, team: 'red' },
  ]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [capturePoints, setCapturePoints] = useState<CapturePoint[]>([
    { id: 'A', x: 300, y: 300, progress: 0, team: 'neutral' },
    { id: 'B', x: 500, y: 300, progress: 0, team: 'neutral' },
    { id: 'C', x: 700, y: 300, progress: 0, team: 'neutral' },
  ]);
  const [score, setScore] = useState({ blue: 0, red: 0 });
  const [kills, setKills] = useState(0);
  const keysPressed = useRef<Set<string>>(new Set());
  const mousePos = useRef({ x: 0, y: 0 });

  const [weapons, setWeapons] = useState<Weapon[]>([
    {
      id: '1',
      name: 'PLASMA RIFLE',
      type: 'Assault',
      damage: 85,
      fireRate: 75,
      accuracy: 80,
      level: 3,
      maxLevel: 10,
      icon: 'Zap',
    },
    {
      id: '2',
      name: 'NEON SNIPER',
      type: 'Sniper',
      damage: 95,
      fireRate: 45,
      accuracy: 98,
      level: 5,
      maxLevel: 10,
      icon: 'Crosshair',
    },
    {
      id: '3',
      name: 'CYBER SMG',
      type: 'SMG',
      damage: 65,
      fireRate: 95,
      accuracy: 70,
      level: 2,
      maxLevel: 10,
      icon: 'Radar',
    },
    {
      id: '4',
      name: 'ION SHOTGUN',
      type: 'Shotgun',
      damage: 100,
      fireRate: 30,
      accuracy: 60,
      level: 4,
      maxLevel: 10,
      icon: 'Flame',
    },
  ]);

  const upgradeWeapon = (weaponId: string) => {
    setWeapons(weapons.map(w => {
      if (w.id === weaponId && w.level < w.maxLevel) {
        return {
          ...w,
          level: w.level + 1,
          damage: w.damage + 5,
          accuracy: Math.min(w.accuracy + 2, 100),
        };
      }
      return w;
    }));
  };

  useEffect(() => {
    if (gameMode !== 'game') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        mousePos.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    };

    const handleClick = () => {
      const angle = Math.atan2(
        mousePos.current.y - player.y,
        mousePos.current.x - player.x
      );
      
      const newBullet: Bullet = {
        id: Date.now().toString(),
        x: player.x,
        y: player.y,
        vx: Math.cos(angle) * 10,
        vy: Math.sin(angle) * 10,
      };
      
      setBullets(prev => [...prev, newBullet]);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    const gameLoop = setInterval(() => {
      setPlayer(prev => {
        let newX = prev.x;
        let newY = prev.y;
        const speed = 3;

        if (keysPressed.current.has('w')) newY -= speed;
        if (keysPressed.current.has('s')) newY += speed;
        if (keysPressed.current.has('a')) newX -= speed;
        if (keysPressed.current.has('d')) newX += speed;

        newX = Math.max(20, Math.min(780, newX));
        newY = Math.max(20, Math.min(580, newY));

        const angle = Math.atan2(
          mousePos.current.y - newY,
          mousePos.current.x - newX
        );

        return { ...prev, x: newX, y: newY, angle };
      });

      setBullets(prev => {
        return prev
          .map(bullet => ({
            ...bullet,
            x: bullet.x + bullet.vx,
            y: bullet.y + bullet.vy,
          }))
          .filter(bullet => 
            bullet.x > 0 && bullet.x < 800 && 
            bullet.y > 0 && bullet.y < 600
          );
      });

      setEnemies(prev => {
        return prev.map(enemy => {
          const toPlayerX = player.x - enemy.x;
          const toPlayerY = player.y - enemy.y;
          const dist = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY);
          
          if (dist > 50) {
            const speed = 1;
            return {
              ...enemy,
              x: enemy.x + (toPlayerX / dist) * speed,
              y: enemy.y + (toPlayerY / dist) * speed,
            };
          }
          return enemy;
        });
      });

      setBullets(prevBullets => {
        const remainingBullets = [...prevBullets];
        
        setEnemies(prevEnemies => {
          return prevEnemies.map(enemy => {
            for (let i = remainingBullets.length - 1; i >= 0; i--) {
              const bullet = remainingBullets[i];
              const dx = bullet.x - enemy.x;
              const dy = bullet.y - enemy.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              
              if (dist < 20) {
                remainingBullets.splice(i, 1);
                const newHealth = enemy.health - 25;
                
                if (newHealth <= 0) {
                  setKills(k => k + 1);
                  setScore(s => ({ ...s, blue: s.blue + 10 }));
                  return { ...enemy, health: 0 };
                }
                
                return { ...enemy, health: newHealth };
              }
            }
            return enemy;
          }).filter(e => e.health > 0);
        });

        return remainingBullets;
      });

      setCapturePoints(prev => {
        return prev.map(point => {
          const dx = player.x - point.x;
          const dy = player.y - point.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 50) {
            const newProgress = Math.min(point.progress + 2, 100);
            if (newProgress === 100 && point.team !== 'blue') {
              setScore(s => ({ ...s, blue: s.blue + 50 }));
              return { ...point, progress: 100, team: 'blue' };
            }
            return { ...point, progress: newProgress };
          }
          
          return point;
        });
      });
    }, 1000 / 60);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      clearInterval(gameLoop);
    };
  }, [gameMode, player.x, player.y]);

  const startGame = () => {
    if (!selectedWeapon) return;
    setGameMode('game');
    setPlayer({ x: 100, y: 300, health: 100, angle: 0 });
    setEnemies([
      { id: '1', x: 700, y: 200, health: 100, team: 'red' },
      { id: '2', x: 650, y: 400, health: 100, team: 'red' },
      { id: '3', x: 750, y: 300, health: 100, team: 'red' },
    ]);
    setBullets([]);
    setScore({ blue: 0, red: 0 });
    setKills(0);
  };

  if (gameMode === 'game') {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4">
              <div className="bg-neon-cyan/20 border-2 border-neon-cyan px-6 py-2 rounded">
                <p className="text-neon-cyan font-black text-xl">BLUE: {score.blue}</p>
              </div>
              <div className="bg-neon-magenta/20 border-2 border-neon-magenta px-6 py-2 rounded">
                <p className="text-neon-magenta font-black text-xl">RED: {score.red}</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="bg-neon-yellow/20 border-2 border-neon-yellow px-6 py-2 rounded">
                <p className="text-neon-yellow font-black text-xl">KILLS: {kills}</p>
              </div>
              <Button
                onClick={() => setGameMode('menu')}
                variant="outline"
                className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/20"
              >
                EXIT
              </Button>
            </div>
          </div>

          <div className="bg-neon-cyan/20 border-2 border-neon-cyan px-4 py-2 rounded mb-4">
            <p className="text-white font-bold text-center">
              WASD - движение | Мышь - прицел | Клик - выстрел | Захватывай точки A, B, C
            </p>
          </div>

          <div 
            ref={canvasRef}
            className="relative bg-gradient-to-br from-purple-950 via-dark-bg to-purple-900 border-4 border-neon-cyan rounded-lg overflow-hidden"
            style={{ width: '800px', height: '600px', margin: '0 auto', cursor: 'crosshair' }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00FFFF08_1px,transparent_1px),linear-gradient(to_bottom,#00FFFF08_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>

            {capturePoints.map(point => (
              <div
                key={point.id}
                className="absolute"
                style={{
                  left: point.x - 40,
                  top: point.y - 40,
                  width: '80px',
                  height: '80px',
                }}
              >
                <div className={`w-full h-full rounded-full border-4 ${
                  point.team === 'blue' ? 'border-neon-cyan bg-neon-cyan/30' :
                  point.team === 'red' ? 'border-neon-magenta bg-neon-magenta/30' :
                  'border-white/50 bg-white/10'
                } flex items-center justify-center`}>
                  <p className="text-2xl font-black text-white">{point.id}</p>
                </div>
                {point.progress > 0 && point.progress < 100 && (
                  <div className="absolute -bottom-4 left-0 right-0">
                    <Progress value={point.progress} className="h-2" />
                  </div>
                )}
              </div>
            ))}

            <div
              className="absolute w-8 h-8 bg-neon-cyan rounded-full border-4 border-white transition-all"
              style={{
                left: player.x - 16,
                top: player.y - 16,
                transform: `rotate(${player.angle}rad)`,
              }}
            >
              <div className="absolute w-6 h-2 bg-white" style={{ left: '20px', top: '12px' }}></div>
            </div>

            <div className="absolute top-2 left-2 bg-dark-bg/80 border-2 border-neon-cyan px-3 py-1 rounded">
              <Progress value={player.health} className="w-32 h-2 mb-1" />
              <p className="text-xs text-neon-cyan font-bold text-center">HP: {player.health}</p>
            </div>

            {enemies.map(enemy => (
              <div
                key={enemy.id}
                className="absolute w-8 h-8 bg-neon-magenta rounded-full border-4 border-red-500"
                style={{
                  left: enemy.x - 16,
                  top: enemy.y - 16,
                }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16">
                  <Progress value={enemy.health} className="h-1" />
                </div>
              </div>
            ))}

            {bullets.map(bullet => (
              <div
                key={bullet.id}
                className="absolute w-2 h-2 bg-neon-yellow rounded-full"
                style={{
                  left: bullet.x - 1,
                  top: bullet.y - 1,
                  boxShadow: '0 0 10px #E7B000',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-purple-950 to-dark-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00FFFF10_1px,transparent_1px),linear-gradient(to_bottom,#00FFFF10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-7xl md:text-9xl font-black mb-4">
              <span className="text-neon-cyan neon-glow animate-pulse-glow">CYBER</span>{' '}
              <span className="text-neon-magenta neon-glow animate-pulse-glow">STRIKE</span>
            </h1>
            <p className="text-3xl md:text-4xl text-white font-bold tracking-wider">
              5v5 COMPETITIVE SHOOTER
            </p>
            <p className="text-lg text-neon-cyan mt-4 font-medium">
              CAPTURE THE POINTS • DOMINATE THE FUTURE
            </p>
          </div>

          <div className="grid gap-6 w-full max-w-md">
            <Button
              onClick={() => setGameMode('loadout')}
              className="h-20 text-2xl font-black bg-gradient-to-r from-neon-cyan to-cyan-400 hover:from-cyan-400 hover:to-neon-cyan text-dark-bg neon-border border-2 border-neon-cyan transition-all duration-300 hover:scale-105"
            >
              <Icon name="Target" className="mr-3" size={32} />
              ENTER BATTLE
            </Button>

            <Button
              onClick={() => setGameMode('upgrade')}
              className="h-16 text-xl font-bold bg-transparent hover:bg-neon-magenta/20 text-neon-magenta border-2 border-neon-magenta neon-border transition-all duration-300 hover:scale-105"
            >
              <Icon name="Settings" className="mr-3" size={28} />
              WEAPON ARSENAL
            </Button>

            <Button
              variant="outline"
              className="h-14 text-lg font-bold bg-transparent hover:bg-neon-yellow/20 text-neon-yellow border-2 border-neon-yellow/50 hover:border-neon-yellow transition-all duration-300"
            >
              <Icon name="Users" className="mr-2" size={24} />
              24.5K PLAYERS ONLINE
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <Icon name="Target" className="mx-auto mb-2 text-neon-cyan" size={40} />
              <p className="text-neon-cyan font-bold text-sm">5V5 CAPTURE</p>
            </div>
            <div className="p-4">
              <Icon name="Shield" className="mx-auto mb-2 text-neon-magenta" size={40} />
              <p className="text-neon-magenta font-bold text-sm">TACTICAL MAPS</p>
            </div>
            <div className="p-4">
              <Icon name="Zap" className="mx-auto mb-2 text-neon-yellow" size={40} />
              <p className="text-neon-yellow font-bold text-sm">CYBER WEAPONS</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === 'upgrade') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-purple-950 to-dark-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00FFFF10_1px,transparent_1px),linear-gradient(to_bottom,#00FFFF10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="relative z-10 min-h-screen p-8">
          <Button
            onClick={() => setGameMode('menu')}
            variant="outline"
            className="mb-8 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/20"
          >
            <Icon name="ArrowLeft" className="mr-2" size={20} />
            BACK TO MENU
          </Button>

          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl font-black text-center mb-12">
              <span className="text-neon-magenta neon-glow">WEAPON</span>{' '}
              <span className="text-neon-cyan neon-glow">ARSENAL</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {weapons.map((weapon) => (
                <Card
                  key={weapon.id}
                  className="bg-dark-bg/80 border-2 border-neon-cyan/50 hover:border-neon-cyan p-6 transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => setSelectedWeapon(weapon.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-black text-neon-cyan neon-glow mb-1">
                        {weapon.name}
                      </h3>
                      <p className="text-neon-magenta font-bold">{weapon.type}</p>
                    </div>
                    <div className="bg-neon-cyan/20 p-4 rounded-lg border-2 border-neon-cyan">
                      <Icon name={weapon.icon as any} className="text-neon-cyan" size={32} />
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white font-bold">DAMAGE</span>
                        <span className="text-neon-cyan font-bold">{weapon.damage}%</span>
                      </div>
                      <Progress value={weapon.damage} className="h-2 bg-dark-bg border border-neon-cyan/30" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white font-bold">FIRE RATE</span>
                        <span className="text-neon-magenta font-bold">{weapon.fireRate}%</span>
                      </div>
                      <Progress value={weapon.fireRate} className="h-2 bg-dark-bg border border-neon-magenta/30" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white font-bold">ACCURACY</span>
                        <span className="text-neon-yellow font-bold">{weapon.accuracy}%</span>
                      </div>
                      <Progress value={weapon.accuracy} className="h-2 bg-dark-bg border border-neon-yellow/30" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t-2 border-neon-cyan/30">
                    <div>
                      <p className="text-xs text-gray-400 font-bold">LEVEL</p>
                      <p className="text-xl font-black text-white">
                        {weapon.level} / {weapon.maxLevel}
                      </p>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        upgradeWeapon(weapon.id);
                      }}
                      disabled={weapon.level >= weapon.maxLevel}
                      className="bg-gradient-to-r from-neon-magenta to-pink-500 hover:from-pink-500 hover:to-neon-magenta text-white font-black border-2 border-neon-magenta disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Icon name="TrendingUp" className="mr-2" size={18} />
                      UPGRADE
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-purple-950 to-dark-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00FFFF10_1px,transparent_1px),linear-gradient(to_bottom,#00FFFF10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      <div className="relative z-10 min-h-screen p-8">
        <Button
          onClick={() => setGameMode('menu')}
          variant="outline"
          className="mb-8 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/20"
        >
          <Icon name="ArrowLeft" className="mr-2" size={20} />
          BACK TO MENU
        </Button>

        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-8">
            <span className="text-neon-cyan neon-glow">SELECT YOUR</span>{' '}
            <span className="text-neon-magenta neon-glow">LOADOUT</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {weapons.map((weapon) => (
              <Card
                key={weapon.id}
                className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedWeapon === weapon.id
                    ? 'bg-neon-cyan/20 border-4 border-neon-cyan'
                    : 'bg-dark-bg/60 border-2 border-neon-cyan/30 hover:border-neon-cyan'
                }`}
                onClick={() => setSelectedWeapon(weapon.id)}
              >
                <div className="bg-neon-cyan/10 p-6 rounded-lg mb-4 border border-neon-cyan">
                  <Icon name={weapon.icon as any} className="text-neon-cyan mx-auto" size={48} />
                </div>
                <h3 className="text-lg font-black text-neon-cyan mb-1">{weapon.name}</h3>
                <p className="text-sm text-neon-magenta font-bold">{weapon.type}</p>
                <p className="text-xs text-gray-400 mt-2">LVL {weapon.level}</p>
              </Card>
            ))}
          </div>

          <Button
            onClick={startGame}
            disabled={!selectedWeapon}
            className="h-16 px-12 text-2xl font-black bg-gradient-to-r from-neon-magenta to-pink-500 hover:from-pink-500 hover:to-neon-magenta text-white neon-border border-2 border-neon-magenta disabled:opacity-50"
          >
            <Icon name="Play" className="mr-3" size={28} />
            READY FOR BATTLE
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
