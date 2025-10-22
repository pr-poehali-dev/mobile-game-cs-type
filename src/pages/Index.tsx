import { useState } from 'react';
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

const Index = () => {
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<'menu' | 'loadout' | 'upgrade'>('menu');

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
              WEAPON LOADOUT
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

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-12 bg-dark-bg/50 border-2 border-neon-cyan/30">
                <TabsTrigger value="all" className="data-[state=active]:bg-neon-cyan data-[state=active]:text-dark-bg font-bold">
                  ALL
                </TabsTrigger>
                <TabsTrigger value="assault" className="data-[state=active]:bg-neon-cyan data-[state=active]:text-dark-bg font-bold">
                  ASSAULT
                </TabsTrigger>
                <TabsTrigger value="sniper" className="data-[state=active]:bg-neon-magenta data-[state=active]:text-white font-bold">
                  SNIPER
                </TabsTrigger>
                <TabsTrigger value="smg" className="data-[state=active]:bg-neon-yellow data-[state=active]:text-dark-bg font-bold">
                  SMG
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
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
              </TabsContent>

              <TabsContent value="assault">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {weapons.filter(w => w.type === 'Assault').map((weapon) => (
                    <Card
                      key={weapon.id}
                      className="bg-dark-bg/80 border-2 border-neon-cyan/50 hover:border-neon-cyan p-6 transition-all duration-300 hover:scale-105"
                    >
                      <h3 className="text-2xl font-black text-neon-cyan">{weapon.name}</h3>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
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
            onClick={() => setGameMode('menu')}
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
