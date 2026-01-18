import { useColorPalette } from '@/hooks/useColorPalette';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Palette, Check } from 'lucide-react';

const palettes = [
  {
    id: 'teal-indigo' as const,
    name: 'Teal & Indigo',
    colors: ['#2DD4BF', '#6366F1'],
  },
  {
    id: 'blue-purple' as const,
    name: 'Blue & Purple',
    colors: ['#3B82F6', '#A855F7'],
  },
  {
    id: 'green-orange' as const,
    name: 'Green & Orange',
    colors: ['#10B981', '#F97316'],
  },
] as const;

const ColorPaletteSwitcher = () => {
  const { palette, setPalette } = useColorPalette();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          title="Change color palette"
        >
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {palettes.map((p) => (
          <DropdownMenuItem
            key={p.id}
            onClick={() => setPalette(p.id)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: p.colors[0] }}
                />
                <div
                  className="w-4 h-4 rounded-full border border-border -ml-2"
                  style={{ backgroundColor: p.colors[1] }}
                />
              </div>
              <span>{p.name}</span>
            </div>
            {palette === p.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColorPaletteSwitcher;
