'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MessageCircle,
  Send,
  Phone,
  Mail,
  User,
  Search,
  MoreVertical,
  Check,
  CheckCheck,
  Star,
  Eye,
  Reply,
  Shield,
  Smartphone,
  TrendingUp,
  Edit,
  MessageSquare
} from "lucide-react";
import { PermissionProtectedRoute, PermissionProtectedSection } from "@/components/PermissionProtected";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useChatStore, type Message, type Conversation } from "@/stores/chat.store";
import { CurrencySwitcher } from "@/components/ui/currency-switcher";
import { formatDistanceToNow } from "date-fns";
import { useMessageNotifications } from "@/hooks/useMessageNotifications";

export default function AdminMessages() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    conversations,
    messages,
    activeConversation,
    isLoading,
    setActiveConversation,
    addMessage,
    markConversationAsRead,
    getConversationMessages,
    getBranchConversations,
    getUnreadCount
  } = useChatStore();

  const { playNotificationSound } = useMessageNotifications();

  // Feedback management state
  const [feedbackResponse, setFeedbackResponse] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);

  // Mock feedback data
  const [feedbackData, setFeedbackData] = useState([
    {
      id: 'F001',
      customerId: 'cust1',
      customerName: 'John Doe',
      bookingId: 'B001',
      rating: 5,
      message: 'Excellent service! Mike did a great job with my haircut.',
      response: 'Thank you for your kind words, John! We\'re glad you enjoyed your experience.',
      responseDate: new Date('2025-12-01T15:00:00'),
      date: new Date('2025-12-01T14:00:00'),
      status: 'responded'
    },
    {
      id: 'F002',
      customerId: 'cust2',
      customerName: 'Jane Smith',
      bookingId: 'B002',
      rating: 4,
      message: 'Good service overall, but the wait time was a bit long.',
      response: 'We apologize for the wait time, Jane. We\'re working on improving our scheduling system.',
      responseDate: new Date('2025-11-30T16:00:00'),
      date: new Date('2025-11-30T14:00:00'),
      status: 'responded'
    },
    {
      id: 'F003',
      customerId: 'cust1',
      customerName: 'John Doe',
      bookingId: 'B003',
      rating: 3,
      message: 'Service was okay, but I expected better styling.',
      date: new Date('2025-11-25T12:00:00'),
      status: 'pending'
    }
  ]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Mock data for demonstration
  useEffect(() => {
    const store = useChatStore.getState();

    // Check if we already have mock data by looking for specific message IDs
    const hasMockData = store.messages.some(msg =>
      msg.id === 'msg-1' || msg.id === 'msg-2' || msg.id === 'msg-3'
    );

    if (!hasMockData) {
      // Clear any existing mock conversations and messages first
      store.setConversations([]);
      store.setMessages([]);

      const mockConversations: Conversation[] = [
        {
          id: '1',
          customerId: 'cust1',
          customerName: 'John Doe',
          customerPhone: '+1234567890',
          customerEmail: 'john@example.com',
          branchId: 'branch1',
          unreadCount: 2,
          createdAt: new Date('2025-12-01T10:00:00'),
          updatedAt: new Date('2025-12-01T14:30:00')
        },
        {
          id: '2',
          customerId: 'cust2',
          customerName: 'Jane Smith',
          customerPhone: '+1234567891',
          customerEmail: 'jane@example.com',
          branchId: 'branch1',
          unreadCount: 0,
          createdAt: new Date('2025-11-30T09:00:00'),
          updatedAt: new Date('2025-12-01T12:00:00')
        }
      ];

      const mockMessages: Message[] = [
        {
          id: 'msg-1',
          content: 'Hi, I would like to book an appointment for tomorrow',
          senderId: 'cust1',
          senderName: 'John Doe',
          senderType: 'customer',
          branchId: 'branch1',
          timestamp: new Date('2025-12-01T14:00:00'),
          read: false,
          conversationId: '1'
        },
        {
          id: 'msg-2',
          content: 'Hello John! I can help you with that. What time works best for you?',
          senderId: 'admin1',
          senderName: 'Admin',
          senderType: 'admin',
          branchId: 'branch1',
          timestamp: new Date('2025-12-01T14:15:00'),
          read: true,
          conversationId: '1'
        },
        {
          id: 'msg-3',
          content: 'Around 2 PM would be great',
          senderId: 'cust1',
          senderName: 'John Doe',
          senderType: 'customer',
          branchId: 'branch1',
          timestamp: new Date('2025-12-01T14:30:00'),
          read: false,
          conversationId: '1'
        }
      ];

      // Set mock data
      store.setConversations(mockConversations);
      mockMessages.forEach(msg => store.addMessage(msg));
    }
  }, []);

  // Play notification sound for new messages
  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      // Only play sound for messages from customers (not from admin)
      if (message.senderType === 'customer' && message.branchId === 'branch1') {
        playNotificationSound();
      }
    };

    // Listen for new messages (in a real app, this would be from WebSocket or similar)
    // For now, we'll check for unread messages periodically
    const checkForNewMessages = () => {
      const currentUnreadCount = getUnreadCount();
      if (currentUnreadCount > 0) {
        // This is a simplified approach - in real implementation,
        // you'd track which messages are new vs already notified
        playNotificationSound();
      }
    };

    // Check every 5 seconds for new messages (simplified polling)
    const interval = setInterval(checkForNewMessages, 5000);

    return () => clearInterval(interval);
  }, [playNotificationSound, getUnreadCount]);

  const branchConversations = getBranchConversations('branch1'); // In real app, get from user context
  const activeMessages = activeConversation ? getConversationMessages(activeConversation) : [];
  const unreadCount = getUnreadCount();

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: user?.id || 'admin',
      senderName: user?.email?.split('@')[0] || 'Admin',
      senderType: 'admin',
      branchId: 'branch1',
      timestamp: new Date(),
      read: true,
      conversationId: activeConversation
    };

    addMessage(message);
    setNewMessage('');

    // Scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleConversationClick = (conversationId: string) => {
    setActiveConversation(conversationId);
    markConversationAsRead(conversationId);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Feedback handlers
  const handleRespondToFeedback = (feedbackId: string) => {
    if (!feedbackResponse.trim()) return;

    setFeedbackData(prev => prev.map(feedback =>
      feedback.id === feedbackId
        ? {
            ...feedback,
            response: feedbackResponse,
            responseDate: new Date(),
            status: 'responded'
          }
        : feedback
    ));

    setFeedbackResponse('');
    setSelectedFeedback(null);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "w-4 h-4",
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        )}
      />
    ));
  };

  return (
    <PermissionProtectedRoute requiredPermissions={['messages.view']}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar role="branch_admin" onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content */}
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          sidebarOpen ? "lg:ml-0" : "lg:ml-0"
        )}>
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              <div className="flex items-center gap-4">
                <AdminMobileSidebar role="branch_admin" onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)} />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Messages & Feedback</h1>
                  <p className="text-sm text-gray-600">Chat with customers and manage feedback responses</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <CurrencySwitcher />
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="px-2 py-1">
                    {unreadCount} new
                  </Badge>
                )}
                <span className="text-sm text-gray-600 hidden sm:block">Welcome, {user?.email}</span>
                <Button variant="outline" onClick={handleLogout} className="hidden sm:flex">
                  Logout
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="chat" className="h-full flex flex-col">
              <div className="bg-white border-b px-4 py-2">
                <TabsList className="grid w-full grid-cols-4 max-w-2xl">
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </TabsTrigger>
                  <PermissionProtectedSection requiredPermissions={['feedback.respond']}>
                    <TabsTrigger value="feedback" className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Feedback
                    </TabsTrigger>
                  </PermissionProtectedSection>
                  <PermissionProtectedSection requiredPermissions={['messages.view']}>
                    <TabsTrigger value="sms" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      SMS
                    </TabsTrigger>
                  </PermissionProtectedSection>
                  <PermissionProtectedSection requiredPermissions={['messages.view']}>
                    <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      WhatsApp
                    </TabsTrigger>
                  </PermissionProtectedSection>
                </TabsList>
              </div>

              {/* Chat Tab */}
              <TabsContent value="chat" className="flex-1 m-0 overflow-hidden">
                <div className="h-full flex">
                  {/* Conversations List */}
                  <div className="w-80 border-r bg-white">
                    <div className="p-4 border-b">
                      <div className="flex items-center gap-2 mb-4">
                        <MessageCircle className="w-5 h-5 text-blue-600" />
                        <h2 className="font-semibold">Conversations</h2>
                      </div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Search conversations..."
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <ScrollArea className="flex-1">
                      <div className="p-2">
                        {branchConversations.map((conversation) => (
                          <div
                            key={conversation.id}
                            onClick={() => handleConversationClick(conversation.id)}
                            className={cn(
                              "p-3 rounded-lg cursor-pointer mb-2 transition-colors",
                              activeConversation === conversation.id
                                ? "bg-blue-50 border border-blue-200"
                                : "hover:bg-gray-50"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {getInitials(conversation.customerName)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-sm truncate">
                                    {conversation.customerName}
                                  </p>
                                  <span className="text-xs text-gray-500">
                                    {conversation.lastMessage
                                      ? formatDistanceToNow(conversation.lastMessage.timestamp, { addSuffix: true })
                                      : formatDistanceToNow(conversation.createdAt, { addSuffix: true })
                                    }
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 truncate mt-1">
                                  {conversation.lastMessage?.content || 'No messages yet'}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  {conversation.customerPhone && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <Phone className="w-3 h-3" />
                                      <span>{conversation.customerPhone}</span>
                                    </div>
                                  )}
                                  {conversation.unreadCount > 0 && (
                                    <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                                      {conversation.unreadCount}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Chat Area */}
                  <div className="flex-1 flex flex-col">
                    {activeConversation ? (
                      <>
                        {/* Chat Header */}
                        <div className="p-4 border-b bg-white">
                          {(() => {
                            const conversation = branchConversations.find(c => c.id === activeConversation);
                            return conversation ? (
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src="" />
                                  <AvatarFallback className="bg-blue-100 text-blue-600">
                                    {getInitials(conversation.customerName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-medium">{conversation.customerName}</h3>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    {conversation.customerPhone && (
                                      <span className="flex items-center gap-1">
                                        <Phone className="w-3 h-3" />
                                        {conversation.customerPhone}
                                      </span>
                                    )}
                                    {conversation.customerEmail && (
                                      <span className="flex items-center gap-1">
                                        <Mail className="w-3 h-3" />
                                        {conversation.customerEmail}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : null;
                          })()}
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4">
                          <div className="space-y-4">
                            {activeMessages.map((message) => (
                              <div
                                key={message.id}
                                className={cn(
                                  "flex gap-3",
                                  message.senderType === 'admin' ? "justify-end" : "justify-start"
                                )}
                              >
                                {message.senderType === 'customer' && (
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                      {getInitials(message.senderName)}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <div
                                  className={cn(
                                    "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                                    message.senderType === 'admin'
                                      ? "bg-blue-600 text-white"
                                      : "bg-gray-100 text-gray-900"
                                  )}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  <div className="flex items-center gap-1 mt-1">
                                    <span className="text-xs opacity-70">
                                      {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                                    </span>
                                    {message.senderType === 'admin' && (
                                      <CheckCheck className="w-3 h-3 opacity-70" />
                                    )}
                                  </div>
                                </div>
                                {message.senderType === 'admin' && (
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                                      A
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                              </div>
                            ))}
                            <div ref={messagesEndRef} />
                          </div>
                        </ScrollArea>

                        {/* Message Input */}
                        <div className="p-4 border-t bg-white">
                          <div className="flex gap-2">
                            <Input
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              placeholder="Type your message..."
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                              className="flex-1"
                            />
                            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                          <p className="text-gray-600">Choose a customer conversation to start chatting</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Feedback Tab (Secret Section) */}
              <PermissionProtectedSection requiredPermissions={['feedback.respond']}>
                <TabsContent value="feedback" className="flex-1 m-0 overflow-hidden">
                <div className="h-full overflow-auto">
                  <div className="p-6 space-y-6">
                    <div className="text-center mb-6">
                      <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Secret Feedback Management</h2>
                      <p className="text-gray-600">Manage customer feedback responses privately</p>
                    </div>

                    {/* Feedback Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">{feedbackData.length}</div>
                          <div className="text-sm text-gray-600">Total Feedback</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {feedbackData.filter(f => f.status === 'responded').length}
                          </div>
                          <div className="text-sm text-gray-600">Responded</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {feedbackData.filter(f => f.status === 'pending').length}
                          </div>
                          <div className="text-sm text-gray-600">Pending Response</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {(feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length).toFixed(1)}
                          </div>
                          <div className="text-sm text-gray-600">Average Rating</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Feedback List */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Customer Feedback</h3>
                      {feedbackData.map((feedback) => (
                        <Card key={feedback.id}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <Avatar>
                                  <AvatarImage src="" />
                                  <AvatarFallback>{feedback.customerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-semibold">{feedback.customerName}</h4>
                                  <p className="text-sm text-gray-600">Booking #{feedback.bookingId}</p>
                                  <p className="text-sm text-gray-500">{feedback.date.toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 mb-2">
                                  {renderStars(feedback.rating)}
                                </div>
                                <Badge className={cn(
                                  "text-xs",
                                  feedback.status === 'responded' ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                )}>
                                  {feedback.status}
                                </Badge>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Customer Feedback:</Label>
                                <p className="text-gray-700 mt-1 p-3 bg-gray-50 rounded-lg">{feedback.message}</p>
                              </div>

                              {feedback.response ? (
                                <div>
                                  <Label className="text-sm font-medium text-gray-700">Your Response:</Label>
                                  <div className="mt-1 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
                                    <p className="text-blue-800">{feedback.response}</p>
                                    {feedback.responseDate && (
                                      <p className="text-xs text-blue-600 mt-1">
                                        Responded on {feedback.responseDate.toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  <Label className="text-sm font-medium text-gray-700">Response:</Label>
                                  {selectedFeedback === feedback.id ? (
                                    <div className="space-y-3">
                                      <Textarea
                                        value={feedbackResponse}
                                        onChange={(e) => setFeedbackResponse(e.target.value)}
                                        placeholder="Type your response to this feedback..."
                                        rows={4}
                                      />
                                      <div className="flex gap-2">
                                        <Button
                                          onClick={() => handleRespondToFeedback(feedback.id)}
                                          disabled={!feedbackResponse.trim()}
                                          className="flex items-center gap-2"
                                        >
                                          <Reply className="w-4 h-4" />
                                          Send Response
                                        </Button>
                                        <Button
                                          variant="outline"
                                          onClick={() => {
                                            setSelectedFeedback(null);
                                            setFeedbackResponse('');
                                          }}
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      onClick={() => setSelectedFeedback(feedback.id)}
                                      className="flex items-center gap-2"
                                    >
                                      <Reply className="w-4 h-4" />
                                      Respond to Feedback
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              </PermissionProtectedSection>

              {/* SMS Integration Tab */}
              <PermissionProtectedSection requiredPermissions={['messages.view']}>
                <TabsContent value="sms" className="flex-1 m-0 overflow-hidden">
                  <div className="h-full overflow-auto p-6">
                    <div className="grid gap-6">
                      {/* SMS Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                              <Phone className="w-8 h-8 text-blue-600" />
                              <div>
                                <p className="text-2xl font-bold">1,247</p>
                                <p className="text-sm text-gray-600">SMS Sent Today</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                              <Check className="w-8 h-8 text-green-600" />
                              <div>
                                <p className="text-2xl font-bold">98.5%</p>
                                <p className="text-sm text-gray-600">Delivery Rate</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                              <MessageCircle className="w-8 h-8 text-purple-600" />
                              <div>
                                <p className="text-2xl font-bold">156</p>
                                <p className="text-sm text-gray-600">Responses</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-8 h-8 text-orange-600" />
                              <div>
                                <p className="text-2xl font-bold">$0.035</p>
                                <p className="text-sm text-gray-600">Cost per SMS</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* SMS Settings */}
                      <Card>
                        <CardHeader>
                          <CardTitle>SMS Integration Settings</CardTitle>
                          <CardDescription>Configure your SMS service provider and messaging preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="sms-provider">SMS Provider</Label>
                              <Select defaultValue="twilio">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="twilio">Twilio</SelectItem>
                                  <SelectItem value="aws-sns">AWS SNS</SelectItem>
                                  <SelectItem value="messagebird">MessageBird</SelectItem>
                                  <SelectItem value="nexmo">Nexmo</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="sms-sender">Sender ID</Label>
                              <Input id="sms-sender" defaultValue="YourSalon" placeholder="Your sender name" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>API Configuration</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Input placeholder="API Key" type="password" />
                              <Input placeholder="API Secret" type="password" />
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="sms-enabled">Enable SMS Integration</Label>
                              <p className="text-sm text-gray-600">Allow sending SMS messages to customers</p>
                            </div>
                            <Checkbox id="sms-enabled" defaultChecked />
                          </div>

                          <Button className="w-full">
                            <Check className="w-4 h-4 mr-2" />
                            Test SMS Connection
                          </Button>
                        </CardContent>
                      </Card>

                      {/* SMS Templates */}
                      <Card>
                        <CardHeader>
                          <CardTitle>SMS Templates</CardTitle>
                          <CardDescription>Manage your SMS message templates</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {[
                              { name: 'Appointment Reminder', template: 'Hi {name}, reminder: You have an appointment tomorrow at {time}. See you soon!' },
                              { name: 'Booking Confirmation', template: 'Hi {name}, your booking for {service} on {date} at {time} is confirmed. Thank you!' },
                              { name: 'Follow-up', template: 'Hi {name}, we hope you enjoyed your visit! Come back soon for 15% off your next service.' },
                              { name: 'Birthday Offer', template: 'Happy Birthday {name}! Enjoy 25% off any service as our gift to you today.' }
                            ].map((template, index) => (
                              <div key={index} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium">{template.name}</h4>
                                  <Button variant="outline" size="sm">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </Button>
                                </div>
                                <p className="text-sm text-gray-600">{template.template}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Recent SMS Activity */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Recent SMS Activity</CardTitle>
                          <CardDescription>View your latest SMS communications</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {[
                              { to: '+1234567890', message: 'Appointment reminder sent', status: 'delivered', time: '2 mins ago' },
                              { to: '+1234567891', message: 'Booking confirmation sent', status: 'delivered', time: '15 mins ago' },
                              { to: '+1234567892', message: 'Follow-up message sent', status: 'delivered', time: '1 hour ago' },
                              { to: '+1234567893', message: 'Birthday offer sent', status: 'delivered', time: '2 hours ago' }
                            ].map((sms, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <p className="font-medium">{sms.to}</p>
                                  <p className="text-sm text-gray-600">{sms.message}</p>
                                </div>
                                <div className="text-right">
                                  <Badge variant={sms.status === 'delivered' ? 'default' : 'secondary'}>
                                    {sms.status}
                                  </Badge>
                                  <p className="text-xs text-gray-500 mt-1">{sms.time}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </PermissionProtectedSection>

              {/* WhatsApp Integration Tab */}
              <PermissionProtectedSection requiredPermissions={['messages.view']}>
                <TabsContent value="whatsapp" className="flex-1 m-0 overflow-hidden">
                  <div className="h-full overflow-auto p-6">
                    <div className="grid gap-6">
                      {/* WhatsApp Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-8 h-8 text-green-600" />
                              <div>
                                <p className="text-2xl font-bold">892</p>
                                <p className="text-sm text-gray-600">Messages Sent Today</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                              <CheckCheck className="w-8 h-8 text-blue-600" />
                              <div>
                                <p className="text-2xl font-bold">97.2%</p>
                                <p className="text-sm text-gray-600">Read Rate</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                              <MessageCircle className="w-8 h-8 text-purple-600" />
                              <div>
                                <p className="text-2xl font-bold">234</p>
                                <p className="text-sm text-gray-600">Responses</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                              <Smartphone className="w-8 h-8 text-orange-600" />
                              <div>
                                <p className="text-2xl font-bold">1,456</p>
                                <p className="text-sm text-gray-600">Active Chats</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* WhatsApp Business API Settings */}
                      <Card>
                        <CardHeader>
                          <CardTitle>WhatsApp Business API</CardTitle>
                          <CardDescription>Configure your WhatsApp Business integration</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="wa-phone">Business Phone Number</Label>
                              <Input id="wa-phone" defaultValue="+1234567890" placeholder="Your WhatsApp business number" />
                            </div>
                            <div>
                              <Label htmlFor="wa-display">Display Name</Label>
                              <Input id="wa-display" defaultValue="Your Salon" placeholder="Your business display name" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>API Configuration</Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Input placeholder="Access Token" type="password" />
                              <Input placeholder="App Secret" type="password" />
                              <Input placeholder="Phone Number ID" />
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="wa-enabled">Enable WhatsApp Integration</Label>
                              <p className="text-sm text-gray-600">Allow WhatsApp messaging to customers</p>
                            </div>
                            <Checkbox id="wa-enabled" defaultChecked />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="wa-templates">Message Templates</Label>
                              <p className="text-sm text-gray-600">Use approved WhatsApp templates for marketing</p>
                            </div>
                            <Checkbox id="wa-templates" defaultChecked />
                          </div>

                          <Button className="w-full">
                            <Check className="w-4 h-4 mr-2" />
                            Test WhatsApp Connection
                          </Button>
                        </CardContent>
                      </Card>

                      {/* WhatsApp Templates */}
                      <Card>
                        <CardHeader>
                          <CardTitle>WhatsApp Templates</CardTitle>
                          <CardDescription>Manage your approved WhatsApp message templates</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {[
                              { name: 'Appointment Reminder', template: 'Hi {name}! 📅 Reminder: You have an appointment tomorrow at {time}. We\'re excited to see you!', status: 'approved' },
                              { name: 'Booking Confirmation', template: 'Hi {name}! ✅ Your booking for {service} on {date} at {time} is confirmed. Thank you!', status: 'approved' },
                              { name: 'Special Offer', template: 'Hi {name}! 🎉 Special offer: Get 20% off your next visit! Book now and save.', status: 'pending' },
                              { name: 'Happy Birthday', template: 'Happy Birthday {name}! 🎂 Enjoy 25% off any service today as our birthday gift to you!', status: 'approved' }
                            ].map((template, index) => (
                              <div key={index} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium">{template.name}</h4>
                                    <Badge variant={template.status === 'approved' ? 'default' : 'secondary'}>
                                      {template.status}
                                    </Badge>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </Button>
                                </div>
                                <p className="text-sm text-gray-600">{template.template}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* WhatsApp Chat Preview */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Active WhatsApp Chats</CardTitle>
                          <CardDescription>Monitor your WhatsApp conversations</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {[
                              { contact: '+1234567890', name: 'John Doe', lastMessage: 'Thank you for the great service!', time: '5 mins ago', unread: 1 },
                              { contact: '+1234567891', name: 'Jane Smith', lastMessage: 'When is my next appointment?', time: '12 mins ago', unread: 0 },
                              { contact: '+1234567892', name: 'Mike Johnson', lastMessage: 'See you tomorrow!', time: '1 hour ago', unread: 0 },
                              { contact: '+1234567893', name: 'Sarah Wilson', lastMessage: 'Thanks for the birthday discount!', time: '2 hours ago', unread: 0 }
                            ].map((chat, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-10 h-10">
                                    <AvatarFallback>{chat.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{chat.name}</p>
                                    <p className="text-sm text-gray-600 truncate max-w-xs">{chat.lastMessage}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-500">{chat.time}</p>
                                  {chat.unread > 0 && (
                                    <Badge variant="destructive" className="mt-1">
                                      {chat.unread}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </PermissionProtectedSection>
            </Tabs>
          </div>
        </div>
      </div>
    </PermissionProtectedRoute>
  );
}