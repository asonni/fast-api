'use client';

import { useEffect, useState } from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [defaultApi, setDefaultApi] = useState<string>('cloudflare');
  const [searchResults, setSearchResults] = useState<{
    results: string[];
    duration: number;
  }>();

  useEffect(() => {
    (async () => {
      if (!input) return setSearchResults(undefined);
      // once deployed, prefix this with your cloudflare worker url
      // i.e.: https://<name>.<account-name>.workers.dev/api/search?q=${input}

      let url = `/api/search?q=${input}`;

      if (defaultApi === 'cloudflare') {
        url = `https://fast-api.asonni.workers.dev/api/search?q=${input}`;
      }

      const res = await fetch(url);
      const data = (await res.json()) as {
        results: string[];
        duration: number;
      };
      setSearchResults(data);
    })();
  }, [input, defaultApi]);

  return (
    <main className="h-screen w-screen grainy">
      <div className="flex flex-col gap-6 items-center pt-32 duration-500 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
        <h1 className="text-5xl tracking-tight font-bold">SpeedSearch ⚡</h1>
        <p className="text-zinc-600 text-lg max-w-prose text-center">
          A high-performance API built with Hono, Next.js and Cloudflare. <br />{' '}
          Type a query below and get your results in milliseconds.
        </p>

        <div className="max-w-md w-full">
          <Command>
            <CommandInput
              value={input}
              onValueChange={setInput}
              placeholder="Search countries..."
              className="placeholder:text-zinc-500"
            />
            <CommandList>
              {searchResults?.results.length === 0 && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}

              {searchResults?.results && (
                <CommandGroup heading="Results">
                  {searchResults?.results.map(result => (
                    <CommandItem
                      key={result}
                      value={result}
                      onSelect={setInput}
                    >
                      {result}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {searchResults?.results && (
                <>
                  <div className="h-px w-full bg-zinc-200" />
                  <p className="p-2 text-xs text-zinc-500">
                    Found {searchResults.results.length} results in{' '}
                    {searchResults?.duration.toFixed(0)}ms
                  </p>
                </>
              )}
            </CommandList>
          </Command>
        </div>
        <Tabs
          defaultValue={defaultApi}
          className="w-[400px] text-center"
          onValueChange={setDefaultApi}
        >
          <TabsList>
            <TabsTrigger value="cloudflare">Use Cloudflare</TabsTrigger>
            <TabsTrigger value="vercel">Use Vercel</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </main>
  );
}
