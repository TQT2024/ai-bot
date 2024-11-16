import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp as ReactRouteProp } from '@react-navigation/native'; 

export type RootStackParamList = {
  ChatScreen: undefined;
  HomeScreen: undefined;
  SettingsScreen: undefined;
  AddScreen: undefined;
  NotificationsScreen: undefined;
  ProfileScreen: undefined;
  AddNoteDrawer: { note?: { id: string; title: string; content: string } };
  AddCalendarDrawer: undefined;
  NotesListScreen: undefined;
  NoteDetailScreen: { noteId: string }; 
};