import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AppNav() {
  return (
    <nav className="border-b">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3">
        <Button variant="ghost" asChild>
          <Link href="/">List</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/compare">Compare</Link>
        </Button>
      </div>
    </nav>
  );
}
