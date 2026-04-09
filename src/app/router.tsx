// app/router.tsx

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import { AppLayout } from './layout/AppLayout';

const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const StudentsListPage = lazy(() => import('@/features/students/pages/StudentsListPage').then(m => ({ default: m.StudentsListPage })));
const StudentDetailPage = lazy(() => import('@/features/students/pages/StudentDetailPage').then(m => ({ default: m.StudentDetailPage })));
const StudentFormPage = lazy(() => import('@/features/students/pages/StudentFormPage').then(m => ({ default: m.StudentFormPage })));
const NotesPage = lazy(() => import('@/features/notes/pages/NotesPage').then(m => ({ default: m.NotesPage })));
const ClassTypesPage = lazy(() => import('@/features/classes/pages/ClassTypesPage').then(m => ({ default: m.ClassTypesPage })));
const ClassPlansPage = lazy(() => import('@/features/classes/pages/ClassPlansPage').then(m => ({ default: m.ClassPlansPage })));
const ClassRecordsPage = lazy(() => import('@/features/classes/pages/ClassRecordsPage').then(m => ({ default: m.ClassRecordsPage })));
const LibraryPage = lazy(() => import('@/features/library/pages/LibraryPage').then(m => ({ default: m.LibraryPage })));
const CalendarPage = lazy(() => import('@/features/calendar/pages/CalendarPage').then(m => ({ default: m.CalendarPage })));
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'students',
        children: [
          {
            index: true,
            element: <StudentsListPage />,
          },
          {
            path: 'new',
            element: <StudentFormPage />,
          },
          {
            path: ':id',
            element: <StudentDetailPage />,
          },
          {
            path: ':id/edit',
            element: <StudentFormPage />,
          },
        ],
      },
      {
        path: 'classes',
        children: [
          {
            index: true,
            element: <Navigate to="/classes/types" replace />,
          },
          {
            path: 'types',
            element: <ClassTypesPage />,
          },
          {
            path: 'plans',
            element: <ClassPlansPage />,
          },
          {
            path: 'records',
            element: <ClassRecordsPage />,
          },
        ],
      },
      {
        path: 'notes',
        element: <NotesPage />,
      },
      {
        path: 'library',
        element: <LibraryPage />,
      },
      {
        path: 'calendar',
        element: <CalendarPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);