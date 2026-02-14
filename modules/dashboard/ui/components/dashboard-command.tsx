import { useRouter } from "next/navigation";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
} from "@/components/ui/command";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}


 const pages = [
    {
        label: "New Chat",
        href: "/",
    },
    {
        label: "Home",
        href: '/home',
    },
    {
        label: "Categories",
        href: "/category",
    },
    {
        label: "Settings",
        href: "/settings",
    },
]


// const pages = [
//   { label: "Meetings", href: "/meetings" },
//   { label: "Agents", href: "/agents" },
//   { label: "Reports", href: "/reports" },
//   { label: "Settings", href: "/settings" },
// ];

function fuzzyMatch(text: string, query: string) {
  const t = text.toLowerCase();
  const q = query.toLowerCase();

  let ti = 0;
  for (let qi = 0; qi < q.length; qi++) {
    ti = t.indexOf(q[qi], ti);
    if (ti === -1) return false;
    ti++;
  }
  return true;
}

export const DashboardCommand = ({ open, setOpen}: Props) => {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [recentChats, setRecentChats] = useState<
      { id: string; title: string; serviceType: string | null }[]
    >([]);

//     useEffect(() => {
//         const fetchSubs = async () => {
//             const res = await fetch('/api/subscriptions');
//             const data = await res.json();
//             setSubs(data);
//         }
//         fetchSubs();
//     }, []);

const filteredPages = useMemo(() => {
    if (!search.trim()) return pages;
    return pages.filter((page) =>
      fuzzyMatch(page.label, search)
    );
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const q = encodeURIComponent(search.trim());
        const res = await fetch(`/api/search/conversations?q=${q}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          setRecentChats([]);
          return;
        }
        const data = await res.json();
        setRecentChats(Array.isArray(data) ? data : []);
      } catch {
        setRecentChats([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search]);


    return (
        <CommandResponsiveDialog
            open={open} 
            onOpenChange={setOpen} 
            shouldFilter={false}
        >
            <CommandInput
                placeholder="Find a meeting or agent..."
                value={search}
                onValueChange={(value) => setSearch(value)}
            />
            <CommandList >
                 <CommandGroup heading="Pages">
          {filteredPages.length === 0 && (
            <CommandEmpty>
              <span className="text-muted-foreground text-sm">
                No pages found
              </span>
            </CommandEmpty>
          )}

          {filteredPages.map((page) => (
            <CommandItem
              className="h-12"
              key={page.label}
              onSelect={() => {
                if (page.href) router.push(page.href);
                setOpen(false);
              }}
            >
              {page.label}
            </CommandItem>
          ))}
        </CommandGroup>
                <CommandGroup heading="Recent Chats">
                    {loading ? (
                      <CommandItem disabled>Searching...</CommandItem>
                    ) : null}
                    {!loading && recentChats.length === 0 ? (
                      <CommandEmpty>
                        <span className="text-muted-foreground text-sm">
                            No chats found
                        </span>
                      </CommandEmpty>
                    ) : null}
                    {recentChats.map((chat) => (
                      <CommandItem
                        key={chat.id}
                        onSelect={() => {
                          router.push(`/chat/${chat.id}`);
                          setOpen(false);
                        }}
                      >
                        {chat.title}
                        <span className="ml-auto text-xs text-muted-foreground">
                          {chat.serviceType ?? "N/A"}
                        </span>
                      </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandResponsiveDialog>
    )
}
