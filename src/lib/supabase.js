import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const auth = {
  signUp: async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helper functions
export const db = {
  // Profiles
  getProfile: async (id) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  updateProfile: async (id, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id);
    return { data, error };
  },

  // Therapy Types
  getTherapyTypes: async () => {
    const { data, error } = await supabase
      .from('therapy_types')
      .select('*')
      .order('name');
    return { data, error };
  },

  // Practitioners
  getPractitioners: async () => {
    const { data, error } = await supabase
      .from('practitioners')
      .select(`
        *,
        profiles:profile_id (
          full_name,
          email,
          phone
        )
      `);
    return { data, error };
  },

  // Treatment Rooms
  getTreatmentRooms: async () => {
    const { data, error } = await supabase
      .from('treatment_rooms')
      .select('*')
      .eq('is_active', true)
      .order('name');
    return { data, error };
  },

  // Appointments
  createAppointment: async (appointmentData) => {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select();
    return { data, error };
  },

  getAppointments: async (userId, role = 'patient') => {
    let query = supabase
      .from('appointments')
      .select(`
        *,
        therapy_types (name, duration_minutes),
        treatment_rooms (name),
        practitioners (
          profiles:profile_id (full_name)
        )
      `);

    if (role === 'patient') {
      query = query.eq('patient_id', userId);
    } else if (role === 'practitioner') {
      // Get practitioner ID first, then filter
      const { data: practitionerData } = await supabase
        .from('practitioners')
        .select('id')
        .eq('profile_id', userId)
        .single();
      
      if (practitionerData) {
        query = query.eq('practitioner_id', practitionerData.id);
      }
    }

    const { data, error } = await query.order('appointment_date', { ascending: true });
    return { data, error };
  },

  updateAppointmentStatus: async (appointmentId, status) => {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId);
    return { data, error };
  },

  // Progress Records
  createProgressRecord: async (recordData) => {
    const { data, error } = await supabase
      .from('progress_records')
      .insert(recordData)
      .select();
    return { data, error };
  },

  getProgressRecords: async (patientId) => {
    const { data, error } = await supabase
      .from('progress_records')
      .select(`
        *,
        appointments (
          appointment_date,
          therapy_types (name)
        )
      `)
      .eq('patient_id', patientId)
      .order('recorded_at', { ascending: false });
    return { data, error };
  },

  // Notifications
  createNotification: async (notificationData) => {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select();
    return { data, error };
  },

  getNotifications: async (userId) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  markNotificationAsRead: async (notificationId) => {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    return { data, error };
  }
};