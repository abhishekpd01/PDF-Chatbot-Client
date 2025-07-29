'use client'

import { Input } from "@/app/components/ui/input"
import * as React from 'react';
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { useUser } from "@clerk/nextjs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import freeUpResources from "../utils/freeup-resource";

const ChatComponent = () => {

    // Check if the user has signed out.
    const { user, isLoaded } = useUser();
    
    // Store the previous email in a ref
    const prevEmailRef = React.useRef();

    React.useEffect(() => {
        if (user) {
            prevEmailRef.current = user.emailAddresses[0]?.emailAddress;
        }
    }, [user]);

    React.useEffect(() => {
        if (isLoaded && !user && prevEmailRef.current) {
            // User just signed out
            freeUpResources(prevEmailRef.current);
            prevEmailRef.current = undefined;
        }
    }, [user, isLoaded]);

    // User Avatar for Chat Interface
    const imageUrl = user?.imageUrl ?? "https://fallback.url";

    
    // Managing the states of chat converstation
    const [message, setMessage] = React.useState('');
    const [messages, setMessages] = React.useState([]);

    const handleSendChatMessage = async () => {
        setMessage('');
        setMessages( (prev) => [...prev, { role: 'user', content: message }] );

        const res = await fetch(`https://pdf-chatbot-server.onrender.com/chat?message=${message}`);
        const data = await res.json();
        setMessages( (prev) => [
            ...prev, 
            { role: 'assistant', content: data?.message, documents: data?.docs }
        ] )
        
    }

    return (
        <div className="p-4">
            <div className="max-h-[85vh] overflow-y-auto flex flex-col gap-2">
                {messages.map((msg, index) => 
                    <ScrollArea key={index}>
                        <div className="flex gap-2 w-[70vw]">
                            <div>
                                <Avatar>
                                    <AvatarImage src={msg.role === 'assistant' ? 'https://github.com/shadcn.png' : imageUrl} alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="w-[60vw] px-3 py-2 rounded-tr-xl rounded-bl-xl rounded-br-xl border">
                                <p>{msg.content}</p>
                                {msg.role === 'assistant' && msg.documents && msg.documents.length > 0 && (
                                    <Accordion type="single" collapsible className="w-full mt-2">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>Refrence</AccordionTrigger>
                                        <AccordionContent className="flex flex-col gap-2">
                                            <a
                                            //  href={`{msg.documents[0]?.metadata?.source?`}
                                            //  download
                                             className="block"
                                            >
                                                <div className="p-2 flex rounded-xs border gap-2 max-w-[200px] items-center">
                                                    <p
                                                        className="truncate"
                                                        title={msg.documents[0]?.metadata?.source}
                                                    >
                                                        {
                                                        msg.documents[0]?.metadata?.source
                                                            ?.split("\\")   // escape backslash properly
                                                            .pop()
                                                            ?.split("-")
                                                            .pop()
                                                        }
                                                    </p>
                                                    <img
                                                        src="https://cdn-icons-png.flaticon.com/512/4726/4726010.png"
                                                        height={20}
                                                        width={20}
                                                        alt="icon"
                                                    />
                                                </div>
                                            </a>
                                            <p>Page Number: {msg.documents[0].metadata.loc.pageNumber}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                                )}
                            </div>
                        </div>
                    </ScrollArea>
                )}
            </div>
            <div className="fixed bottom-4 w-100 flex gap-3">
                <Input 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your query..." />
                <Button onClick={handleSendChatMessage} disabled={!message.trim()}> Send </Button>
            </div>
        </div>
    )
}

export default ChatComponent;