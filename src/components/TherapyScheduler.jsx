import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Clock, User, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const TherapyScheduler = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTherapy, setSelectedTherapy] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [therapies, setTherapies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadSchedulerData();
  }, []);

  const loadSchedulerData = async () => {
    try {
      // Load therapy types
      const { data: therapyData, error: therapyError } = await db.getTherapyTypes();
      if (therapyError) throw therapyError;
      setTherapies(therapyData || []);

      // Load treatment rooms
      const { data: roomData, error: roomError } = await db.getTreatmentRooms();
      if (roomError) throw roomError;
      setRooms(roomData || []);

      // Load practitioners
      const { data: practitionerData, error: practitionerError } = await db.getPractitioners();
      if (practitionerError) throw practitionerError;
      setPractitioners(practitionerData || []);

    } catch (error) {
      console.error('Error loading scheduler data:', error);
      toast({
        title: 'Error loading data',
        description: 'Please try refreshing the page.',
        variant: 'destructive'
      });
    }
  };

  const timeSlots = [
    "9:00 AM", "10:30 AM", "12:00 PM", "1:30 PM", 
    "3:00 PM", "4:30 PM", "6:00 PM"
  ];

  const rooms = [
    { id: "room1", name: "Therapy Room 1", type: "Standard" },
    { id: "room2", name: "Therapy Room 2", type: "Premium" },
    { id: "room3", name: "Therapy Room 3", type: "Deluxe" },
    { id: "room4", name: "Steam Room", type: "Specialized" }
  ];

  const handleSchedule = async () => {
    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to schedule appointments.',
        variant: 'destructive'
      });
      return;
    }

    if (!selectedDate || !selectedTime || !selectedTherapy || !selectedRoom) {
      toast({
        title: 'Missing information',
        description: 'Please select all required fields.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const selectedTherapyData = therapies.find(t => t.id === selectedTherapy);
      const selectedRoomData = rooms.find(r => r.id === selectedRoom);
      
      // Convert time to 24-hour format
      const [time, period] = selectedTime.split(' ');
      let [hours, minutes] = time.split(':');
      hours = parseInt(hours);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      
      const startTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
      
      // Calculate end time based on therapy duration
      const durationMinutes = selectedTherapyData?.duration_minutes || 60;
      const endDate = new Date(selectedDate);
      endDate.setHours(hours, parseInt(minutes));
      endDate.setMinutes(endDate.getMinutes() + durationMinutes);
      const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

      const appointmentData = {
        patient_id: user.id,
        practitioner_id: practitioners[0]?.id || null, // Auto-assign first available practitioner
        therapy_type_id: selectedTherapy,
        room_id: selectedRoom,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        start_time: startTime,
        end_time: endTime,
        status: 'scheduled'
      };

      const { data, error } = await db.createAppointment(appointmentData);
      if (error) throw error;

      // Create notification for the appointment
      await db.createNotification({
        user_id: user.id,
        title: 'Appointment Scheduled',
        message: `Your ${selectedTherapyData?.name} session has been scheduled for ${format(selectedDate, 'PPP')} at ${selectedTime}`,
        type: 'appointment_reminder',
        scheduled_for: new Date(selectedDate).toISOString()
      });

      toast({
        title: 'Appointment Scheduled!',
        description: `Your ${selectedTherapyData?.name} session has been booked for ${format(selectedDate, 'PPP')} at ${selectedTime}`,
      });

      // Reset form
      setSelectedTime("");
      setSelectedTherapy("");
      setSelectedRoom("");
      
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast({
        title: 'Scheduling failed',
        description: error.message || 'Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-card border-border/50 max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          Schedule Therapy Session
        </CardTitle>
        <CardDescription>
          Book your Panchakarma therapy with automated scheduling and room allocation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Therapy Selection */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-card-foreground">Select Therapy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {therapies.map((therapy) => (
              <div 
                key={therapy.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedTherapy === therapy.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedTherapy(therapy.id)}
              >
                <h4 className="font-medium text-card-foreground">{therapy.name}</h4>
                <p className="text-sm text-muted-foreground">{therapy.duration_minutes} minutes</p>
                <p className="text-sm text-muted-foreground mt-1">${therapy.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Date and Time Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Calendar */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-card-foreground">Select Date</h3>
            <div className="border rounded-lg p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full"
                disabled={(date) => date < new Date()}
              />
            </div>
          </div>

          {/* Time Slots */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-card-foreground">Available Times</h3>
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                  className={selectedTime === time ? "bg-gradient-primary" : ""}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Room Selection */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-card-foreground">Select Room</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedRoom === room.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedRoom(room.id)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-card-foreground">{room.name}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {room.type}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Summary and Action */}
        <div className="border-t pt-6">
          <div className="bg-muted/30 p-4 rounded-lg mb-4">
            <h4 className="font-medium text-card-foreground mb-3">Booking Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="text-card-foreground">
                  {selectedDate ? format(selectedDate, "PPP") : "Not selected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="text-card-foreground">{selectedTime || "Not selected"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Therapy:</span>
                <span className="text-card-foreground">
                  {selectedTherapy ? therapies.find(t => t.id === selectedTherapy)?.name : "Not selected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room:</span>
                <span className="text-card-foreground">
                  {selectedRoom ? rooms.find(r => r.id === selectedRoom)?.name : "Not selected"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              className="flex-1 bg-gradient-primary"
              disabled={!selectedDate || !selectedTime || !selectedTherapy || !selectedRoom || loading}
              onClick={handleSchedule}
            >
              {loading ? 'Scheduling...' : 'Schedule Therapy Session'}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  Set Notifications
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Notification Preferences</DialogTitle>
                  <DialogDescription>
                    Configure when and how you'd like to receive reminders for your therapy session.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Pre-procedure Notifications</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">24 hours before (preparation instructions)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">2 hours before (final reminders)</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Post-procedure Notifications</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Immediately after (care instructions)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">24 hours later (follow-up check)</span>
                      </label>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-primary">Save Notification Settings</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};