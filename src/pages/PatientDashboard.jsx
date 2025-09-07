import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Bell, Activity, FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { TherapyScheduler } from "@/components/TherapyScheduler";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/supabase";
import { AuthForm } from "@/components/auth/AuthForm";
import { useToast } from "@/hooks/use-toast";

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && !authLoading) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load appointments
      const { data: appointmentsData, error: appointmentsError } = await db.getAppointments(user.id, 'patient');
      if (appointmentsError) throw appointmentsError;
      setAppointments(appointmentsData || []);

      // Load notifications
      const { data: notificationsData, error: notificationsError } = await db.getNotifications(user.id);
      if (notificationsError) throw notificationsError;
      setNotifications(notificationsData || []);

      // Load progress records
      const { data: progressData, error: progressError } = await db.getProgressRecords(user.id);
      if (progressError) throw progressError;
      setProgressRecords(progressData || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: 'Error loading data',
        description: 'Please try refreshing the page.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-md mx-auto">
            <AuthForm />
          </div>
        </div>
      </div>
    );
  }

  const upcomingSession = appointments.find(apt => apt.status === 'confirmed') || null;

  const therapyProgress = {
    current: 8,
    total: 21,
    percentage: 38
  };

  const recentNotifications = [
    {
      type: "pre-procedure",
      message: "Fast for 2 hours before your Abhyanga session today",
      time: "2 hours ago",
      priority: "high"
    },
    {
      type: "general",
      message: "Complete your daily wellness questionnaire",
      time: "4 hours ago",
      priority: "medium"
    },
    {
      type: "post-procedure",
      message: "Avoid cold water for 24 hours after yesterday's steam therapy",
      time: "1 day ago",
      priority: "low"
    }
  ];

  const vitals = [
    { label: "Energy Level", value: 7.2, max: 10, color: "success" },
    { label: "Sleep Quality", value: 8.1, max: 10, color: "primary" },
    { label: "Digestion", value: 6.8, max: 10, color: "warning" },
    { label: "Stress Level", value: 4.2, max: 10, color: "accent" }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Patient Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || 'Patient'}. Here's your therapy progress and upcoming sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Next Session Card */}
            <Card className="shadow-card border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Next Therapy Session
                  </CardTitle>
                  <Badge className="bg-success/10 text-success">
                    {upcomingSession.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-card-foreground mb-1">
                      {upcomingSession.therapy}
                    </h3>
                    <p className="text-muted-foreground">{upcomingSession.date}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-border/50">
                    <div>
                      <p className="text-sm text-muted-foreground">Practitioner</p>
                      <p className="font-medium">{upcomingSession.practitioner}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{upcomingSession.room}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button size="sm" className="bg-gradient-primary">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      Reschedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Therapy Scheduler */}
            <TherapyScheduler />

            {/* Progress Tracking */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Therapy Progress
                </CardTitle>
                <CardDescription>
                  Your 21-day Panchakarma program progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Sessions Completed</span>
                    <span className="text-sm text-muted-foreground">
                      {therapyProgress.current} of {therapyProgress.total}
                    </span>
                  </div>
                  <Progress value={therapyProgress.percentage} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {vitals.map((vital, index) => (
                    <div key={index} className="text-center p-3 rounded-lg bg-muted/30">
                      <p className="text-sm text-muted-foreground mb-1">{vital.label}</p>
                      <p className="text-lg font-semibold text-card-foreground">
                        {vital.value}/{vital.max}
                      </p>
                      <div className="mt-2">
                        <Progress 
                          value={(vital.value / vital.max) * 100} 
                          className="h-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full bg-gradient-accent">
                  <FileText className="h-4 w-4 mr-2" />
                  Complete Daily Assessment
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Notifications & Quick Actions */}
          <div className="space-y-6">
            
            {/* Notifications */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Recent Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentNotifications.map((notification, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/30 border-l-4 border-l-accent">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {notification.priority === 'high' && <AlertCircle className="h-4 w-4 text-destructive" />}
                        {notification.priority === 'medium' && <Clock className="h-4 w-4 text-warning" />}
                        {notification.priority === 'low' && <CheckCircle2 className="h-4 w-4 text-success" />}
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                        >
                          {notification.type}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-card-foreground">{notification.message}</p>
                  </div>
                ))}
                
                <Button variant="outline" size="sm" className="w-full">
                  View All Notifications
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Schedule
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Treatment History
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Notification Settings
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  Health Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;