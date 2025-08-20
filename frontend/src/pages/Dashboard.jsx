import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../components/ui/use-toast';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('log');
  const [moodEntries, setMoodEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch mood entries
  useEffect(() => {
    const fetchMoodEntries = async () => {
      if (isAuthenticated) {
        try {
          setIsLoading(true);
          const response = await axios.get('/api/moods');
          setMoodEntries(response.data);
        } catch (error) {
          console.error('Error fetching mood entries:', error);
          addToast({
            title: 'Error',
            description: 'Failed to load mood history',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMoodEntries();
  }, [isAuthenticated, addToast]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMoodSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedMood) {
      addToast({
        title: 'Error',
        description: 'Please select a mood',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      const response = await axios.post('/api/moods', {
        mood_type: selectedMood,
        note: note || null,
      });
      
      // Add new mood entry to the list
      setMoodEntries([response.data, ...moodEntries]);
      
      // Reset form
      setSelectedMood('');
      setNote('');
      
      addToast({
        title: 'Success',
        description: 'Your mood has been logged!',
      });
      
      // Switch to history tab
      setActiveTab('history');
    } catch (error) {
      console.error('Error logging mood:', error);
      addToast({
        title: 'Error',
        description: 'Failed to log mood',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Get mood color based on type
  const getMoodColor = (moodType) => {
    switch (moodType.toLowerCase()) {
      case 'happy':
        return 'bg-yellow-100 text-yellow-800';
      case 'sad':
        return 'bg-blue-100 text-blue-800';
      case 'anxious':
        return 'bg-purple-100 text-purple-800';
      case 'angry':
        return 'bg-red-100 text-red-800';
      case 'neutral':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">VibeLog</h1>
          <div className="flex items-center space-x-4">
            {user && <span className="text-sm">Hello, {user.username}</span>}
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto mt-8 px-4 pb-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="log">Log Mood</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Log Mood Tab */}
          <TabsContent value="log" className="mt-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold">How are you feeling today?</h2>
              
              <form onSubmit={handleMoodSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="mood">Select Mood</Label>
                  <Select value={selectedMood} onValueChange={setSelectedMood}>
                    <SelectTrigger id="mood">
                      <SelectValue placeholder="Select a mood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Happy">Happy 😊</SelectItem>
                      <SelectItem value="Sad">Sad 😢</SelectItem>
                      <SelectItem value="Anxious">Anxious 😰</SelectItem>
                      <SelectItem value="Angry">Angry 😡</SelectItem>
                      <SelectItem value="Neutral">Neutral 😐</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Journal Entry (Optional)</Label>
                  <textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write about your day..."
                    className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Log Mood'}
                </Button>
              </form>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold">Your Mood History</h2>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p>Loading your mood history...</p>
                </div>
              ) : moodEntries.length === 0 ? (
                <div className="rounded-md bg-gray-50 p-8 text-center">
                  <p className="text-gray-500">You haven't logged any moods yet</p>
                  <Button 
                    className="mt-4"
                    onClick={() => setActiveTab('log')}
                  >
                    Log Your First Mood
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {moodEntries.map((entry) => (
                    <div key={entry.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${getMoodColor(entry.mood_type)}`}>
                            {entry.mood_type}
                          </span>
                          <span className="text-sm text-gray-500">
                            {format(new Date(entry.created_at), 'PPP p')}
                          </span>
                        </div>
                      </div>
                      
                      {entry.note && (
                        <div className="mt-3 text-gray-700">
                          {entry.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
