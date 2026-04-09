// features/calendar/pages/CalendarPlaceholderPage.tsx

import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Card, CardContent } from '@/shared/components/ui/card';

export function CalendarPlaceholderPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendario</h1>
          <p className="text-muted-foreground">
            Agenda y visualización de clases y eventos
          </p>
        </div>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Evento
        </Button>
      </div>

      {/* Placeholder Alert */}
      <Alert>
        <CalendarIcon className="h-4 w-4" />
        <AlertTitle>🔴 PLACEHOLDER: Calendario y Agenda</AlertTitle>
        <AlertDescription className="mt-2 space-y-2">
          <p>
            Esta vista mostrará un calendario interactivo con todas las clases planificadas, 
            eventos y compromisos del profesor.
          </p>
          
          <div className="mt-4">
            <p className="font-semibold mb-2">Funcionalidades v2 planificadas:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Vista de calendario mensual/semanal interactiva</li>
              <li>Drag & drop para reprogramar clases</li>
              <li>Sincronización con Google Calendar / Outlook</li>
              <li>Recordatorios automáticos (email/push)</li>
              <li>Gestión de disponibilidad horaria</li>
              <li>Bloques de tiempo recurrentes</li>
              <li>Vista de agenda diaria</li>
              <li>Conflictos de horarios automáticos</li>
              <li>Exportación a iCal/ICS</li>
            </ul>
          </div>

          <div className="mt-4">
            <p className="font-semibold mb-2">Requisitos técnicos v2:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Librería: react-big-calendar o FullCalendar</li>
              <li>Backend: endpoints para eventos CRUD + webhooks calendario externo</li>
              <li>Features: timezone handling, recurrencia, notificaciones push</li>
              <li>Integración: Google Calendar API / Microsoft Graph API</li>
              <li>Storage: eventos persistidos en DB relacional</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Mockup Visual */}
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 text-center">
            <CalendarIcon className="mx-auto h-20 w-20 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">
              Vista de Calendario Interactivo
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Aquí se mostrará el calendario mensual con todas las clases y eventos
            </p>
          </div>
        </CardContent>
      </Card>

      {/* MVP Alternative */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">📅 Alternativa MVP</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Mientras se implementa el calendario completo, puedes usar:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span>•</span>
              <span>
                <strong>Dashboard:</strong> Ver "Próximas Clases" planificadas
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                <strong>Planificación de Clases:</strong> Crear clases con fecha específica
              </span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>
                <strong>Google Calendar:</strong> Exportar eventos manualmente (funcionalidad futura)
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
