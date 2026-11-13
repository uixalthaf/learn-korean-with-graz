"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  MoreVertical,
  Search,
  Send,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  getConversationMessages,
  getConversations,
  sendConversationMessage,
  updateTypingStatus,
  updatePresence,
} from "../api/messages.api";
import type {
  ConversationMessage,
  ConversationSummary,
  MessagingRole,
} from "../types";
import { getRealtimeClient } from "@/lib/realtime/supabase-client";

type Filter = "All" | "Unread";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [peerIsTyping, setPeerIsTyping] = useState(false);
  const [viewerId, setViewerId] = useState("");
  const [role, setRole] = useState<MessagingRole | null>(null);
  const [activeId, setActiveId] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadedConversationId, setLoadedConversationId] = useState("");
  const [sending, setSending] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [pageError, setPageError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundEnabledRef = useRef(true);
  const seenMessageIdsRef = useRef(new Set<string>());
  const conversationListLoadedRef = useRef(false);
  const typingTimerRef = useRef<number | null>(null);
  const lastTypingSentRef = useRef(0);
  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);
  const realtimeActiveRef = useRef(false);
  const peerTypingTimerRef = useRef<number | null>(null);

  const activeConversation = conversations.find(({ id }) => id === activeId) ?? null;
  const loadingMessages = Boolean(activeId) && loadedConversationId !== activeId;
  const unreadMessages = conversations.reduce((total, conversation) => total + conversation.unreadCount, 0);
  const filteredConversations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return conversations.filter((conversation) => {
      const matchesSearch = conversation.peer.name.toLowerCase().includes(normalizedSearch);
      const matchesFilter = filter === "All" || conversation.unreadCount > 0;
      return matchesSearch && matchesFilter;
    });
  }, [conversations, filter, search]);

  useLayoutEffect(() => {
    const messageList = messageListRef.current;
    if (!messageList) return;

    messageList.scrollTo({
      top: messageList.scrollHeight,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [activeId, messages.length, peerIsTyping]);

  useEffect(() => {
    let mounted = true;

    async function refreshConversations() {
      try {
        const result = await getConversations();
        if (!mounted) return;
        for (const conversation of result.conversations) {
          const lastMessage = conversation.lastMessage;
          if (!lastMessage) continue;

          if (conversationListLoadedRef.current && lastMessage.senderId !== result.viewerId && !seenMessageIdsRef.current.has(lastMessage.id)) {
            playNotificationSound(audioContextRef.current, soundEnabledRef.current);
          }
          seenMessageIdsRef.current.add(lastMessage.id);
        }
        conversationListLoadedRef.current = true;
        setConversations(result.conversations);
        setRole(result.role);
        setViewerId(result.viewerId);
        setActiveId((currentId) =>
          result.conversations.some(({ id }) => id === currentId)
            ? currentId
            : (result.conversations[0]?.id ?? ""),
        );
        setPageError(false);
      } catch {
        if (mounted) setPageError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void refreshConversations();
    const intervalId = window.setInterval(() => void refreshConversations(), 10_000);
    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const prepareAudio = () => {
      try {
        audioContextRef.current ??= new window.AudioContext();
        if (audioContextRef.current.state === "suspended") {
          void audioContextRef.current.resume().catch(() => undefined);
        }
      } catch {
        // Audio can be unavailable in restricted browser contexts.
      }
    };

    window.addEventListener("pointerdown", prepareAudio, { once: true });
    window.addEventListener("keydown", prepareAudio, { once: true });
    return () => {
      window.removeEventListener("pointerdown", prepareAudio);
      window.removeEventListener("keydown", prepareAudio);
    };
  }, []);

  useEffect(() => {
    void updatePresence().catch(() => undefined);
    const intervalId = window.setInterval(() => void updatePresence().catch(() => undefined), 30_000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!activeId) {
      return;
    }

    let mounted = true;
    let initialLoad = true;
    async function refreshMessages() {
      try {
        const result = await getConversationMessages(activeId);
        if (!mounted) return;
        for (const message of result.messages) {
          if (!initialLoad && message.senderId === activeConversation?.peer.id && !seenMessageIdsRef.current.has(message.id)) {
            playNotificationSound(audioContextRef.current, soundEnabledRef.current);
          }
          seenMessageIdsRef.current.add(message.id);
        }
        initialLoad = false;
        setMessages(result.messages);
        if (!realtimeActiveRef.current) setPeerIsTyping(result.peerIsTyping);
        setMessageError(false);
      } catch {
        if (mounted) setMessageError(true);
      } finally {
        if (mounted) setLoadedConversationId(activeId);
      }
    }

    void refreshMessages();
    const realtime = getRealtimeClient();
    let channel: RealtimeChannel | null = null;

    if (realtime && viewerId) {
      channel = realtime
        .channel(`conversation:${activeId}`, {
          config: { private: true, broadcast: { self: false } },
        })
        .on("broadcast", { event: "INSERT" }, ({ payload }) => {
          const message = parseRealtimeMessage(payload.new);
          if (!message || message.conversationId !== activeId) return;

          if (seenMessageIdsRef.current.has(message.id)) return;
          seenMessageIdsRef.current.add(message.id);
          if (!initialLoad && message.senderId === activeConversation?.peer.id) {
            playNotificationSound(audioContextRef.current, soundEnabledRef.current);
          }
          setMessages((current) => current.some(({ id }) => id === message.id) ? current : [...current, message]);
          setConversations((current) => current.map((conversation) =>
            conversation.id === activeId
              ? {
                  ...conversation,
                  lastMessage: message,
                  unreadCount: message.senderId === viewerId ? conversation.unreadCount : 0,
                  updatedAt: message.createdAt,
                }
              : conversation,
          ));
          setPeerIsTyping(false);
          if (peerTypingTimerRef.current !== null) window.clearTimeout(peerTypingTimerRef.current);
          void refreshMessages();
        })
        .on("broadcast", { event: "typing" }, ({ payload }) => {
          if (payload.senderId !== activeConversation?.peer.id) return;
          const isTyping = payload.isTyping === true;
          setPeerIsTyping(isTyping);
          if (peerTypingTimerRef.current !== null) window.clearTimeout(peerTypingTimerRef.current);
          if (isTyping) {
            peerTypingTimerRef.current = window.setTimeout(() => {
              setPeerIsTyping(false);
              peerTypingTimerRef.current = null;
            }, 3_000);
          }
        })
        .subscribe((status) => {
          if (!mounted) return;
          if (status === "SUBSCRIBED") {
            realtimeChannelRef.current = channel;
            realtimeActiveRef.current = true;
            void refreshMessages();
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
            if (realtimeChannelRef.current === channel) realtimeChannelRef.current = null;
            realtimeActiveRef.current = false;
          }
        });
    }

    const intervalId = window.setInterval(() => {
      if (!realtimeActiveRef.current) void refreshMessages();
    }, 3_000);
    return () => {
      mounted = false;
      window.clearInterval(intervalId);
      realtimeActiveRef.current = false;
      if (realtimeChannelRef.current === channel) realtimeChannelRef.current = null;
      if (peerTypingTimerRef.current !== null) window.clearTimeout(peerTypingTimerRef.current);
      if (channel && realtime) void realtime.removeChannel(channel);
    };
  }, [activeConversation?.peer.id, activeId, viewerId]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current !== null) window.clearTimeout(typingTimerRef.current);
      if (activeId) void updateTypingStatus(activeId, false).catch(() => undefined);
    };
  }, [activeId]);

  function handleDraftChange(value: string) {
    setDraft(value);
    if (!activeId) return;

    if (typingTimerRef.current !== null) window.clearTimeout(typingTimerRef.current);
    if (!value.trim()) {
      sendTypingUpdate(realtimeChannelRef.current, realtimeActiveRef.current, viewerId, activeId, false);
      lastTypingSentRef.current = 0;
      return;
    }

    if (!lastTypingSentRef.current) {
      lastTypingSentRef.current = Date.now();
      sendTypingUpdate(realtimeChannelRef.current, realtimeActiveRef.current, viewerId, activeId, true);
    }
    typingTimerRef.current = window.setTimeout(() => {
      sendTypingUpdate(realtimeChannelRef.current, realtimeActiveRef.current, viewerId, activeId, false);
      lastTypingSentRef.current = 0;
      typingTimerRef.current = null;
    }, 2_500);
  }

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !activeConversation || sending) return;

    setSending(true);
    setSendError(false);
    if (typingTimerRef.current !== null) window.clearTimeout(typingTimerRef.current);
    typingTimerRef.current = null;
    sendTypingUpdate(realtimeChannelRef.current, realtimeActiveRef.current, viewerId, activeConversation.id, false);
    lastTypingSentRef.current = 0;
    try {
      const message = await sendConversationMessage(activeConversation.id, body);
      seenMessageIdsRef.current.add(message.id);
      setMessages((current) => current.some(({ id }) => id === message.id) ? current : [...current, message]);
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === activeConversation.id
            ? { ...conversation, lastMessage: message, updatedAt: message.createdAt }
            : conversation,
        ),
      );
      setDraft("");
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  }

  function retryLoading() {
    setLoading(true);
    setPageError(false);
    window.location.reload();
  }

  return (
    <div className="h-full min-h-0 text-foreground">
      <section
        className="grid h-full min-h-[560px] overflow-hidden bg-background md:grid-cols-[minmax(220px,0.72fr)_minmax(0,1.6fr)] 2xl:grid-cols-[minmax(250px,0.72fr)_minmax(0,1.65fr)_minmax(320px,0.95fr)]"
        aria-label="Messages workspace"
      >
        <aside className={`min-h-0 flex-col border-r border-border ${activeId ? "hidden md:flex" : "flex"}`}>
          <div className="border-b border-border p-4 sm:p-5">
            <label className="flex h-11 items-center gap-3 rounded-xl border border-border bg-background px-3 text-muted">
              <Search size={18} aria-hidden="true" />
              <span className="sr-only">Search conversations</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search conversations"
                className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
              />
            </label>
            <div className="mt-4 flex gap-2" aria-label="Filter conversations">
              {(["All", "Unread"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  aria-pressed={filter === item}
                  className={`cursor-pointer rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${filter === item ? "bg-primary text-white" : "bg-surface text-foreground hover:bg-accent-background"}`}
                >
                  {item}{item === "Unread" && unreadMessages > 0 ? ` · ${unreadMessages}` : ""}
                </button>
              ))}
            </div>
          </div>

          <ul className="min-h-0 flex-1 divide-y divide-border overflow-y-auto">
            {loading && conversations.length === 0 && <li className="p-5 text-sm text-muted">Loading conversations…</li>}
            {filteredConversations.map((conversation) => (
              <li key={conversation.id}>
                <button
                  type="button"
                  onClick={() => { setMessages([]); setPeerIsTyping(false); setActiveId(conversation.id); }}
                  aria-current={conversation.id === activeId ? "true" : undefined}
                  className={`flex w-full cursor-pointer items-center gap-3 px-4 py-4 text-left transition-colors sm:px-5 ${conversation.id === activeId ? "bg-accent-background" : "hover:bg-background"}`}
                >
                  <Avatar name={conversation.peer.name} tone={avatarTone(conversation.peer.name)} isOnline={conversation.peer.isOnline} size="small" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-heading">{conversation.peer.name}</span>
                      <span className="shrink-0 text-xs text-muted">{conversation.lastMessage ? formatTime(conversation.lastMessage.createdAt) : ""}</span>
                    </span>
                    <span className="mt-1 flex items-center gap-2">
                      <span className={`truncate text-sm ${conversation.unreadCount ? "font-semibold text-heading" : "text-muted"}`}>
                        {conversation.lastMessage?.body ?? "Start a conversation"}
                      </span>
                      {conversation.unreadCount > 0 && (
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              </li>
            ))}
            {!loading && !pageError && filteredConversations.length === 0 && (
              <li className="p-6 text-sm text-muted">
                {conversations.length === 0
                  ? role === "TUTOR"
                    ? "No student messages yet. New student conversations will appear here."
                    : "No tutor is available for messaging yet."
                  : "No conversations found."}
              </li>
            )}
            {pageError && <li className="p-5 text-sm text-muted">Unable to load conversations. <button type="button" onClick={retryLoading} className="cursor-pointer font-semibold text-primary">Retry</button></li>}
          </ul>
        </aside>

        <div className={`min-h-0 min-w-0 flex-col ${activeId ? "flex" : "hidden md:flex"}`}>
          {activeConversation ? (
            <>
              <header className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-2.5 sm:px-6 xl:px-8">
                <button type="button" onClick={() => { setMessages([]); setPeerIsTyping(false); setActiveId(""); }} aria-label="Back to conversations" className="cursor-pointer rounded-lg p-2 text-muted hover:bg-surface md:hidden"><ArrowLeft size={18} /></button>
                <Avatar name={activeConversation.peer.name} tone={avatarTone(activeConversation.peer.name)} isOnline={activeConversation.peer.isOnline} />
                <div className="min-w-0 flex-1">
                  <h5 className="w-fit max-w-full truncate rounded-lg bg-accent-background/60 px-2.5 py-0.5 text-sm font-medium text-heading">{activeConversation.peer.name}</h5>
                </div>
                <button
                  type="button"
                  onClick={() => { const next = !soundEnabled; soundEnabledRef.current = next; setSoundEnabled(next); }}
                  aria-label={soundEnabled ? "Mute message notifications" : "Enable message notifications"}
                  aria-pressed={soundEnabled}
                  title={soundEnabled ? "Mute message sound" : "Enable message sound"}
                  className="cursor-pointer rounded-full p-2.5 text-primary transition-colors hover:bg-surface"
                >
                  {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
                <button type="button" onClick={() => setShowDetails((shown) => !shown)} aria-label="Toggle contact details" className="cursor-pointer rounded-full p-2.5 text-primary transition-colors hover:bg-surface"><MoreVertical size={19} /></button>
              </header>

              <div ref={messageListRef} className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto bg-[#f8f6f1] px-4 py-6 sm:px-6 xl:px-10 xl:py-8">
                <div className="mx-auto rounded-full bg-white/80 px-4 py-1.5 text-sm text-muted shadow-sm">Today</div>
                {loadingMessages && messages.length === 0 && <p className="m-auto text-sm text-muted">Loading messages…</p>}
                {!loadingMessages && messages.length === 0 && !messageError && <p className="m-auto text-sm text-muted">Send a message to start the conversation.</p>}
                {messages.map((message) => {
                  const mine = message.senderId !== activeConversation.peer.id;
                  return (
                    <div key={message.id} className={`flex max-w-[88%] flex-col ${mine ? "ml-auto items-end" : "mr-auto items-start"}`}>
                      <p className={`rounded-2xl px-3 py-2.5 text-sm leading-5 shadow-sm ${mine ? "rounded-br-md bg-[#d9f2d0] text-[#203b2b]" : "rounded-bl-md border border-border bg-white text-foreground"}`}>{message.body}</p>
                      <time className="mt-1.5 flex items-center gap-1 text-xs text-muted">
                        {formatTime(message.createdAt)}
                        {mine && (message.readAt ? <CheckCheck size={14} aria-label="Read" className="text-sky-600" /> : <Check size={14} aria-label="Sent" />)}
                      </time>
                    </div>
                  );
                })}
                {peerIsTyping && (
                  <p aria-live="polite" className="mr-auto flex items-center gap-2 rounded-2xl rounded-bl-md border border-border bg-white px-3 py-2 text-xs text-muted shadow-sm">
                    <span aria-hidden="true" className="flex items-center gap-1">
                      <span className="size-1.5 animate-pulse rounded-full bg-primary motion-reduce:animate-none" />
                      <span className="size-1.5 animate-pulse rounded-full bg-primary [animation-delay:150ms] motion-reduce:animate-none" />
                      <span className="size-1.5 animate-pulse rounded-full bg-primary [animation-delay:300ms] motion-reduce:animate-none" />
                    </span>
                    {activeConversation.peer.name} is typing…
                  </p>
                )}
                {messageError && <p role="alert" className="mx-auto rounded-lg bg-white px-3 py-2 text-sm text-red-700">Could not refresh messages. Your messages will retry automatically.</p>}
              </div>

              <form onSubmit={handleSend} className="flex shrink-0 items-center gap-3 border-t border-border bg-background p-4 sm:px-6 xl:px-8">
                <label className="sr-only" htmlFor="message-draft">Write a message</label>
                <input
                  id="message-draft"
                  value={draft}
                  maxLength={5000}
                  onChange={(event) => handleDraftChange(event.target.value)}
                  placeholder="Type a message..."
                  className="h-12 min-w-0 flex-1 rounded-full border border-border bg-background px-5 text-foreground outline-none placeholder:text-muted focus:border-primary"
                />
                <button type="submit" aria-label="Send message" disabled={!draft.trim() || sending} className="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">
                  <Send size={19} />
                </button>
              </form>
              {sendError && <p role="alert" className="border-t border-border bg-background px-5 pb-3 text-sm text-red-700">Message could not be sent. Please try again.</p>}
            </>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col justify-center gap-3 p-6 text-center">
              <p className="text-sm text-muted">
                {loading ? "Loading your inbox…" : "Choose a conversation to view messages."}
              </p>
            </div>
          )}
        </div>

        {showDetails && activeConversation && (
          <aside className="hidden min-h-0 flex-col items-center border-l border-border bg-card px-8 py-10 text-center 2xl:flex 2xl:px-10">
            <Avatar name={activeConversation.peer.name} tone={avatarTone(activeConversation.peer.name)} isOnline={activeConversation.peer.isOnline} size="large" />
            <h5 className="mt-4 rounded-lg bg-accent-background/60 px-3 py-1 text-sm font-medium text-heading">{activeConversation.peer.name}</h5>
            <p className="mt-1 text-sm text-muted">{activeConversation.peer.role === "STUDENT" ? "Student" : "Tutor"}</p>
            <dl className="mt-12 w-full space-y-7 text-left">
              <Info label="Email" value={activeConversation.peer.email} />
              <Info label="Conversation" value="Private chat" />
              <Info label="Unread messages" value={String(activeConversation.unreadCount)} />
            </dl>
          </aside>
        )}
      </section>
    </div>
  );
}

function Avatar({ name, tone, isOnline, size = "regular" }: { name: string; tone: string; isOnline: boolean; size?: "small" | "regular" | "large" }) {
  const sizeClass = size === "large" ? "size-20 text-3xl" : size === "small" ? "size-12 text-base" : "size-14 text-xl";
  return (
    <span aria-hidden="true" className={`relative flex shrink-0 items-center justify-center rounded-full font-semibold text-primary ${tone} ${sizeClass}`}>
      {initials(name)}
      {isOnline && <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-emerald-500" />}
    </span>
  );
}

function parseRealtimeMessage(value: unknown): ConversationMessage | null {
  if (typeof value !== "object" || value === null) return null;
  const message = value as Record<string, unknown>;
  if (
    typeof message.id !== "string" ||
    typeof message.conversationId !== "string" ||
    typeof message.senderId !== "string" ||
    typeof message.body !== "string" ||
    typeof message.createdAt !== "string"
  ) {
    return null;
  }

  return {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    body: message.body,
    createdAt: message.createdAt,
    readAt: typeof message.readAt === "string" ? message.readAt : null,
  };
}

function sendTypingUpdate(
  channel: RealtimeChannel | null,
  realtimeActive: boolean,
  viewerId: string,
  conversationId: string,
  isTyping: boolean,
) {
  if (channel && realtimeActive && viewerId) {
    void channel.send({
      type: "broadcast",
      event: "typing",
      payload: { senderId: viewerId, isTyping },
    }).then((status) => {
      if (status !== "ok") void updateTypingStatus(conversationId, isTyping).catch(() => undefined);
    });
    return;
  }

  void updateTypingStatus(conversationId, isTyping).catch(() => undefined);
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt><dd className="mt-1 break-all text-sm font-medium text-heading">{value}</dd></div>;
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

function avatarTone(name: string) {
  const tones = ["bg-[#dcebdd]", "bg-[#f4e4d5]", "bg-[#e4e6f5]", "bg-[#f5dfe5]", "bg-[#e7efd4]"];
  const key = [...name].reduce((total, letter) => total + letter.charCodeAt(0), 0);
  return tones[key % tones.length];
}

function formatTime(value: string) {
  const date = new Date(value);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  return isToday
    ? date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function playNotificationSound(context: AudioContext | null, enabled: boolean) {
  if (!context || !enabled || context.state === "closed") return;

  const play = () => {
    const now = context.currentTime;
    const tone = context.createOscillator();
    const volume = context.createGain();

    tone.type = "sine";
    tone.frequency.setValueAtTime(740, now);
    tone.frequency.setValueAtTime(880, now + 0.09);
    volume.gain.setValueAtTime(0.0001, now);
    volume.gain.exponentialRampToValueAtTime(0.035, now + 0.02);
    volume.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    tone.connect(volume);
    volume.connect(context.destination);
    tone.start(now);
    tone.stop(now + 0.21);
  };

  if (context.state === "suspended") {
    void context.resume().then(play).catch(() => undefined);
  } else {
    play();
  }
}
