import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUpCircle, Network, Brain, Lightbulb } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ChatMessage, sendChatMessage } from '@/api/chat';

interface Message extends ChatMessage {}

export function ChatWindow() {
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedSchema, setSelectedSchema] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || isProcessing) return;

    try {
      setIsProcessing(true);
      const userMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'user',
        content: message.trim(),
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMessage]);
      setMessage('');

      const { message: response } = await sendChatMessage({
        message: message.trim(),
        context: {
          selectedNodes: [],
          path: []
        }
      });

      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAction = async (action: 'connect' | 'collect' | 'critique') => {
    try {
      setIsProcessing(true);
      const actionMessages = {
        connect: 'Analyzing graph for potential connections...',
        collect: 'Gathering related concepts and information...',
        critique: 'Evaluating graph structure and relationships...'
      };

      const response: Message = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'assistant',
        content: actionMessages[action],
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error(`Failed to execute ${action} action:`, error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col h-full bg-background/95 backdrop-blur-sm border-t">
      <div className="flex gap-2 p-4">
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="claude-2">Claude 2</SelectItem>
            <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSchema} onValueChange={setSelectedSchema}>
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Schema" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="medical">Medical Knowledge Base</SelectItem>
            <SelectItem value="research">Research Papers</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedTopic} onValueChange={setSelectedTopic}>
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="medicine">Medicine</SelectItem>
            <SelectItem value="biology">Biology</SelectItem>
            <SelectItem value="chemistry">Chemistry</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 pb-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={cn(
                  'p-4',
                  msg.type === 'user' ? 'bg-primary/10' : 'bg-secondary/10'
                )}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <span className="text-xs text-muted-foreground mt-2 block">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>

      <div className="p-4 bg-background/80 backdrop-blur-sm border-t space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isProcessing}
          />
          <Button type="submit" size="icon" variant="secondary" disabled={isProcessing}>
            <ArrowUpCircle className="h-5 w-5" />
          </Button>
        </form>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleAction('connect')}
            disabled={isProcessing}
          >
            <Network className="h-4 w-4 mr-2" />
            Connect
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleAction('collect')}
            disabled={isProcessing}
          >
            <Brain className="h-4 w-4 mr-2" />
            Collect
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleAction('critique')}
            disabled={isProcessing}
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Critique
          </Button>
        </div>
      </div>
    </div>
  );
}