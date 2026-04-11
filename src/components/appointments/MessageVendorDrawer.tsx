import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Send, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MessageVendorDrawerProps } from "@/types/appointments";

export function MessageVendorDrawer({
  appointment,
  isOpen,
  onClose,
}: MessageVendorDrawerProps) {
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock initial interaction
  const [chatHistory, setChatHistory] = useState([
    {
      id: '1',
      sender: 'vendor',
      text: `Hello! Thanks for booking ${appointment?.services[0]?.serviceName ?? 'your service'} with us.`,
      time: 'Just now'
    }
  ]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Reset chat history when opening new appointment chat
    if (appointment) {
        setChatHistory([
            {
              id: '1',
              sender: 'vendor',
              text: `Hello! Thanks for booking ${appointment.services[0]?.serviceName ?? 'your service'} with us.`,
              time: 'Just now'
            }
        ]);
        setMessage("");
    }
  }, [appointment, isOpen]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message to state
    const newMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: message,
        time: 'Now'
    };

    setChatHistory(prev => [...prev, newMessage]);
    setMessage("");
    
    // Simulate generic response after a delay
    setTimeout(() => {
       /* In a real app, this would be handled by a backend subscription */
       toast.success("Message sent");
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!appointment) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side={isMobile ? "bottom" : "right"}
        className={`w-full sm:max-w-md flex flex-col border-0 p-0 overflow-hidden bg-[#F8F5F2] ${
          isMobile ? 'rounded-t-3xl max-h-[85vh]' : 'rounded-l-3xl rounded-tr-none h-full'
        }`}
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b flex flex-row items-center gap-3 bg-white shrink-0 shadow-sm relative z-10">
          <Avatar className="h-10 w-10 border border-border/50">
            <AvatarImage src={appointment.vendor.profilePhoto ?? ''} className="object-cover" />
            <AvatarFallback>{appointment.vendor.firstName[0]}{appointment.vendor.lastName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-0.5 text-left overflow-hidden">
            <SheetTitle className="text-base font-bold font-unbounded text-secondary-000 truncate">{appointment.vendor.firstName} {appointment.vendor.lastName}</SheetTitle>
            <p className="text-xs text-secondary-300 font-medium truncate">{appointment.services[0]?.serviceName}</p>
          </div>
          <SheetClose className="rounded-full bg-secondary-300/10 p-2 hover:bg-secondary-300/20 transition-colors -mr-2">
             <X className="h-4 w-4 text-secondary-000" />
             <span className="sr-only">Close</span>
           </SheetClose>
        </SheetHeader>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F5F2]">
            <div className="flex justify-center my-4">
                <span className="text-xs text-secondary-300/60 bg-white/50 px-3 py-1 rounded-full">Today</span>
            </div>

            {chatHistory.map((msg) => (
                <div 
                    key={msg.id} 
                    className={cn(
                        "flex w-full",
                        msg.sender === 'user' ? "justify-end" : "justify-start"
                    )}
                >
                    <div className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                        msg.sender === 'user' 
                            ? "bg-secondary-000 text-white rounded-br-none" 
                            : "bg-white text-secondary-000 border border-border/50 rounded-bl-none shadow-sm"
                    )}>
                        <p>{msg.text}</p>
                        <span className={cn(
                            "text-[10px] mt-1 block opacity-70",
                            msg.sender === 'user' ? "text-white/70 text-right" : "text-secondary-300 text-left"
                        )}>
                            {msg.time}
                        </span>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <SheetFooter className="p-4 bg-white border-t shrink-0 sm:flex-col">
          <div className="flex w-full items-end gap-2 bg-[#F8F5F2] p-2 rounded-3xl border border-transparent focus-within:border-primary-100/30 focus-within:bg-white focus-within:shadow-md transition-all duration-200">
             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-secondary-300 hover:text-secondary-000 hover:bg-white/50 mb-0.5 shrink-0">
                <Paperclip className="h-4 w-4" />
             </Button>

             <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 min-h-[40px] max-h-[120px] bg-transparent border-0 focus-visible:ring-0 px-2 py-2.5 text-sm resize-none placeholder:text-secondary-300/60"
                rows={1}
             />

             <Button 
                onClick={handleSendMessage}
                disabled={!message.trim()}
                size="icon"
                className={cn(
                    "h-8 w-8 rounded-full mb-0.5 shrink-0 transition-all duration-200",
                    message.trim() 
                        ? "bg-primary-100 hover:bg-[#a65620] text-white shadow-md" 
                        : "bg-secondary-300/20 text-secondary-300 cursor-not-allowed"
                )}
             >
                <Send className="h-3.5 w-3.5 ml-0.5" />
             </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
