"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { Drawer, DrawerSection } from '../Drawer';
import { MessageConversation } from '@/components/messages/MessageConversation';
import { ConversationItem } from '@/components/messages/ConversationItem';
import { SearchBar } from '@/components/messages/SearchBar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ChatConversation, ChatMessage } from '@/types/messages';
import { useAppSelector } from '@/store/hooks';
import { useGenerateChatToken } from '@/services/useChat';
import { StreamChat, type Channel as StreamChatChannel } from 'stream-chat';
import { toast } from 'sonner';

export default function MessagesPage() {
    const user = useAppSelector((state) => state.auth.user);
    const { mutateAsync: generateToken } = useGenerateChatToken();
    const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingConversations, setIsLoadingConversations] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const channelsRef = useRef(new Map<string, StreamChatChannel>());
    const streamClientRef = useRef<StreamChat | null>(null);
    const connectingPromiseRef = useRef<Promise<StreamChat> | null>(null);

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

    const toChatMessage = (message: any, currentUserId: string): ChatMessage | null => {
        if (!message?.id || !message?.text) return null;
        const createdAt = message.created_at ? new Date(message.created_at) : new Date();
        return {
            id: message.id as string,
            senderId: String(message.user?.id ?? ""),
            senderType: String(message.user?.id) === currentUserId ? "customer" : "vendor",
            message: message.text as string,
            timestamp: Number.isNaN(createdAt.getTime()) ? new Date() : createdAt,
            read: true,
        };
    };

    const mapChannelToConversation = (channel: StreamChatChannel, currentUserId: string): ChatConversation => {
        const messages = channel.state.messages
            .map((msg) => toChatMessage(msg, currentUserId))
            .filter((msg): msg is ChatMessage => msg !== null);

        const otherMember = Object.values(channel.state.members).find(
            (member) => String(member.user?.id ?? member.user_id ?? "") !== currentUserId
        );

        const vendorName =
            otherMember?.user?.name ||
            String(otherMember?.user?.id ?? "") ||
            String((channel.data as { name?: string } | undefined)?.name ?? "Vendor");

        const lastMessage = messages[messages.length - 1];
        const fallbackDate = channel.state.last_message_at
            ? new Date(channel.state.last_message_at)
            : new Date();

        return {
            id: channel.id ?? channel.cid,
            vendorName,
            vendorCategory: "Appointment chat",
            lastMessage: lastMessage?.message ?? "No messages yet",
            lastMessageTime: lastMessage?.timestamp ?? fallbackDate,
            unreadCount: channel.countUnread(),
            messages,
        };
    };

    const upsertConversationFromChannel = (channel: StreamChatChannel, currentUserId: string) => {
        if (channel.state.messages.length === 0) {
            setConversations((prev) => prev.filter((item) => item.id !== (channel.id ?? channel.cid)));
            setSelectedChat((prev) => {
                if (prev?.id === (channel.id ?? channel.cid)) return null;
                return prev;
            });
            return;
        }

        const mapped = mapChannelToConversation(channel, currentUserId);
        setConversations((prev) => {
            const next = [...prev];
            const idx = next.findIndex((item) => item.id === mapped.id);
            if (idx === -1) {
                next.unshift(mapped);
            } else {
                next[idx] = mapped;
                next.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
            }
            return next;
        });
        setSelectedChat((prev) => (prev?.id === mapped.id ? mapped : prev));
    };

    const ensureConnectedClient = async () => {
        if (!apiKey) throw new Error("Stream API key is missing.");
        if (!user?.id) throw new Error("Please sign in again to view messages.");

        if (connectingPromiseRef.current) return connectingPromiseRef.current;

        const doConnect = async (): Promise<StreamChat> => {
            const client = StreamChat.getInstance(apiKey);
            const targetUserId = String(user.id);

            if (client.userID && client.userID !== targetUserId) {
                await client.disconnectUser();
            }

            if (client.userID !== targetUserId) {
                const { userChatToken } = await generateToken();
                await client.connectUser(
                    {
                        id: targetUserId,
                        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || targetUserId,
                        image: user.profilePhoto ?? undefined,
                    },
                    userChatToken
                );
            }

            streamClientRef.current = client;
            return client;
        };

        connectingPromiseRef.current = doConnect().finally(() => {
            connectingPromiseRef.current = null;
        });

        return connectingPromiseRef.current;
    };

    // Focus input when drawer opens
    useEffect(() => {
        if (drawerOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [drawerOpen]);

    useEffect(() => {
        if (!user?.id) return;

        let cancelled = false;

        (async () => {
            try {
                setIsLoadingConversations(true);
                const client = await ensureConnectedClient();
                const currentUserId = String(user.id);

                const channels = await client.queryChannels(
                    { type: "messaging", members: { $in: [currentUserId] } },
                    { last_message_at: -1 },
                    { watch: false, state: true, limit: 30 }
                );

                if (cancelled) return;

                channelsRef.current = new Map(
                    channels
                        .filter((channel) => !!channel.id)
                        .map((channel) => [channel.id as string, channel])
                );

                const mapped = channels
                    .filter((channel) => channel.state.messages.length > 0)
                    .map((channel) => mapChannelToConversation(channel, currentUserId));
                setConversations(mapped);
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : "Unable to load messages.";
                toast.error(errorMessage);
            } finally {
                if (!cancelled) setIsLoadingConversations(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [user?.id]);

    useEffect(() => {
        if (!drawerOpen || !selectedChat || !user?.id) return;

        const selectedChannel = channelsRef.current.get(selectedChat.id);
        if (!selectedChannel) return;

        let unsubNew: (() => void) | null = null;
        let unsubUpdated: (() => void) | null = null;

        (async () => {
            await selectedChannel.watch();
            upsertConversationFromChannel(selectedChannel, String(user.id));

            const onNew = selectedChannel.on("message.new", () => {
                upsertConversationFromChannel(selectedChannel, String(user.id));
            });
            const onUpdated = selectedChannel.on("message.updated", () => {
                upsertConversationFromChannel(selectedChannel, String(user.id));
            });

            unsubNew = () => onNew.unsubscribe();
            unsubUpdated = () => onUpdated.unsubscribe();
        })();

        return () => {
            if (unsubNew) unsubNew();
            if (unsubUpdated) unsubUpdated();
        };
    }, [drawerOpen, selectedChat?.id, user?.id]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedChat || !user?.id) return;

        const selectedChannel = channelsRef.current.get(selectedChat.id);
        if (!selectedChannel) {
            toast.error("Unable to locate this conversation.");
            return;
        }

        try {
            setIsSending(true);
            await selectedChannel.sendMessage({ text: newMessage.trim() });
            upsertConversationFromChannel(selectedChannel, String(user.id));
            setNewMessage('');
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Unable to send message.";
            toast.error(errorMessage);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const markAsRead = (chatId: string) => {
        const updatedConversations = conversations.map(conv => {
            if (conv.id === chatId) {
                return {
                    ...conv,
                    unreadCount: 0,
                    messages: conv.messages.map(msg => ({ ...msg, read: true }))
                };
            }
            return conv;
        });
        setConversations(updatedConversations);
    };

    const handleSelectChat = (chat: ChatConversation) => {
        setSelectedChat(chat);
        setDrawerOpen(true);
        markAsRead(chat.id);
    };

    const handleCloseDrawer = (open: boolean) => {
        setDrawerOpen(open);
        if (!open) {
            // Small delay before clearing selected chat for smooth animation
            setTimeout(() => {
                setSelectedChat(null);
                setNewMessage('');
            }, 300);
        }
    };

    const filteredConversations = conversations.filter(conv =>
        conv.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.vendorCategory.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

    return (
        <div className="">
            {/* Header */}
            <div className="mb-6">
                <h1 className="font-unbounded text-[28px] leading-8 font-semibold text-secondary-200 mb-2">
                    Messages
                </h1>
                <p className="text-sm text-accent-80 leading-relaxed">
                    Chat with vendors you've booked services with
                    {totalUnread > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center bg-primary-100 text-white rounded-xl px-2 py-0.5 text-xs font-semibold align-middle">
                            {totalUnread} unread
                        </span>
                    )}
                </p>
            </div>

            {/* Search Bar */}
            <div className="mb-5">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                />
            </div>

            {/* Conversations List */}
            <div className="bg-white rounded-2xl border border-accent-20 overflow-hidden">
                {isLoadingConversations ? (
                    <div className="p-12 text-center">
                        <Loader2 className="h-12 w-12 text-accent-80 mx-auto mb-4 animate-spin" />
                        <p className="text-base font-medium text-secondary-000 mb-2">
                            Loading conversations...
                        </p>
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <div className="p-12 text-center">
                        <MessageCircle className="h-12 w-12 text-accent-80 mx-auto mb-4" />
                        <p className="text-base font-medium text-secondary-000 mb-2">
                            {searchQuery ? 'No conversations found' : 'No messages yet'}
                        </p>
                        <p className="text-sm text-accent-80">
                            {!searchQuery && 'Book a service to start chatting with vendors'}
                        </p>
                    </div>
                ) : (
                    <div>
                        {filteredConversations.map((conversation, index) => (
                            <ConversationItem
                                key={conversation.id}
                                conversation={conversation}
                                isLast={index === filteredConversations.length - 1}
                                onClick={() => handleSelectChat(conversation)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Chat Drawer */}
            {selectedChat && (
                <Drawer
                    open={drawerOpen}
                    onOpenChange={handleCloseDrawer}
                    title={selectedChat.vendorName}
                    description={selectedChat.vendorCategory}
                    size="md"
                    type="message"
                    footer={
                        <div className="flex gap-3 items-end">
                            <Input
                                ref={inputRef}
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className={cn(
                                    "flex-1 min-h-[48px] rounded-xl border-accent-20 bg-accent-10",
                                    "focus-visible:border-primary-100 focus-visible:bg-white focus-visible:ring-primary-100/10"
                                )}
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim() || isSending}
                                size="icon"
                                className={cn(
                                    "h-12 w-12 rounded-xl shrink-0",
                                    newMessage.trim() && !isSending
                                        ? "bg-primary-100 text-white hover:bg-primary-100/90"
                                        : "bg-accent-20 text-accent-80 cursor-not-allowed"
                                )}
                            >
                                {isSending ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Send className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                    }
                >
                    <DrawerSection>
                        <MessageConversation messages={selectedChat.messages} />
                    </DrawerSection>
                </Drawer>
            )}
        </div>
    );
}
