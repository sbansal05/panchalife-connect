import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, TrendingUp, CheckCircle2, AlertTriangle, User } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const PractitionerDashboard = () => {
  const todayStats = {
    totalPatients: 12,
    completedSessions: 8,
    upcomingSessions: 4,
    cancellations: 1
  };

  const upcomingSessions = [
    {
      time: "2:00 PM",
      patient: "Arjun Mehta",
      therapy: "Abhyanga",
      room: "Room 2",
      duration: "90 min",
      status: "confirmed"
    },
    {
      time: "4:00 PM", 
      patient: "Priya Singh",
      therapy: "Shirodhara",
      room: "Room 1",
      duration: "60 min",
      status: "confirmed"
    },
    {
      time: "5:30 PM",
      patient: "Raj Patel",
      therapy: "Steam Therapy",
      room: "Room 3", 
      duration: "45 min",
      status: "pending"
    }
  ];

  const patientAlerts = [
    {
      patient: "Arjun Mehta",
      message: "High stress levels reported in last assessment",
      priority: "high",
      time: "30 mins ago"
    },
    {
      patient: "Priya Singh",
      message: "Requested schedule change for next week",
      priority: "medium",
      time: "2 hours ago"
    },
    {
      patient: "Raj Patel",
      message: "Completed daily wellness questionnaire",
      priority: "low",
      time: "4 hours ago"
    }
  ];

  const therapyRooms = [
    { room: "Room 1", status: "occupied", therapy: "Shirodhara", endTime: "1:45 PM" },
    { room: "Room 2", status: "available", therapy: null, endTime: null },
    { room: "Room 3", status: "maintenance", therapy: null, endTime: "3:00 PM" },
    { room: "Room 4", status: "occupied", therapy: "Abhyanga", endTime: "2:30 PM" }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Practitioner Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Dr. Priya Sharma. Manage your therapy sessions and patient care.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Patients</p>
                  <p className="text-2xl font-bold text-card-foreground">{todayStats.totalPatients}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-success">{todayStats.completedSessions}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold text-warning">{todayStats.upcomingSessions}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Efficiency</p>
                  <p className="text-2xl font-bold text-accent">92%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Today's Schedule */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>
                  Manage your upcoming therapy sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/30">
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[60px]">
                          <p className="font-semibold text-card-foreground">{session.time}</p>
                          <p className="text-sm text-muted-foreground">{session.duration}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-card-foreground">{session.patient}</h4>
                          <p className="text-sm text-muted-foreground">{session.therapy} • {session.room}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={session.status === 'confirmed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}
                        >
                          {session.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex gap-3">
                  <Button className="bg-gradient-primary">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule New Session
                  </Button>
                  <Button variant="outline">
                    View Full Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Room Status */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Therapy Room Status</CardTitle>
                <CardDescription>
                  Real-time availability of treatment rooms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {therapyRooms.map((room, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border/30 text-center">
                      <h4 className="font-medium text-card-foreground mb-2">{room.room}</h4>
                      <Badge 
                        className={
                          room.status === 'available' ? 'bg-success/10 text-success' :
                          room.status === 'occupied' ? 'bg-warning/10 text-warning' :
                          'bg-destructive/10 text-destructive'
                        }
                      >
                        {room.status}
                      </Badge>
                      {room.therapy && (
                        <p className="text-sm text-muted-foreground mt-1">{room.therapy}</p>
                      )}
                      {room.endTime && (
                        <p className="text-xs text-muted-foreground">Until {room.endTime}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Alerts & Actions */}
          <div className="space-y-6">
            
            {/* Patient Alerts */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Patient Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {patientAlerts.map((alert, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/30 border-l-4 border-l-accent">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-card-foreground">{alert.patient}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                    <p className="text-sm text-card-foreground">{alert.message}</p>
                    <Badge 
                      className={`mt-2 ${
                        alert.priority === 'high' ? 'bg-destructive/10 text-destructive' :
                        alert.priority === 'medium' ? 'bg-warning/10 text-warning' :
                        'bg-success/10 text-success'
                      }`}
                    >
                      {alert.priority} priority
                    </Badge>
                  </div>
                ))}
                
                <Button variant="outline" size="sm" className="w-full">
                  View All Alerts
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button size="sm" className="w-full justify-start bg-gradient-accent">
                  <Users className="h-4 w-4 mr-2" />
                  Add New Patient
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Block Time Slot
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Progress Reports
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Treatment Protocols
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PractitionerDashboard;