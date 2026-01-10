"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { chatConversations, ChatConversation, ChatMessage } from '@/data/chatData';
import { Drawer, DrawerSection } from '../Drawer';
import { MessageConversation } from '@/components/messages/MessageConversation';
import { ConversationItem } from '@/components/messages/ConversationItem';
import { SearchBar } from '@/components/messages/SearchBar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
    const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [conversations, setConversations] = useState(chatConversations);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when drawer opens
    useEffect(() => {
        if (drawerOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [drawerOpen]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedChat) return;

        const message: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderId: 'customer-1',
            senderType: 'customer',
            message: newMessage.trim(),
            timestamp: new Date(),
            read: true
        };

        // Update the conversation with the new message
        const updatedConversations = conversations.map(conv => {
            if (conv.id === selectedChat.id) {
                return {
                    ...conv,
                    messages: [...conv.messages, message],
                    lastMessage: message.message,
                    lastMessageTime: message.timestamp
                };
            }
            return conv;
        });

        setConversations(updatedConversations);
        const updatedChat = updatedConversations.find(c => c.id === selectedChat.id);
        if (updatedChat) {
            setSelectedChat(updatedChat);
        }
        setNewMessage('');
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
                {filteredConversations.length === 0 ? (
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
                                disabled={!newMessage.trim()}
                                size="icon"
                                className={cn(
                                    "h-12 w-12 rounded-xl flex-shrink-0",
                                    newMessage.trim()
                                        ? "bg-primary-100 text-white hover:bg-primary-100/90"
                                        : "bg-accent-20 text-accent-80 cursor-not-allowed"
                                )}
                            >
                                <Send className="h-5 w-5" />
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
