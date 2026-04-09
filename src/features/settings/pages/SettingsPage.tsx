// features/settings/pages/SettingsPage.tsx

import { Settings as SettingsIcon, Database, Download, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Separator } from '@/shared/components/ui/separator';
import { toast } from 'sonner';

export function SettingsPage() {
  function handleExportData() {
    try {
      const data = {
        students: JSON.parse(localStorage.getItem('students') || '[]'),
        classTypes: JSON.parse(localStorage.getItem('classTypes') || '[]'),
        notes: JSON.parse(localStorage.getItem('notes') || '[]'),
        melodies: JSON.parse(localStorage.getItem('melodies') || '[]'),
        classPlans: JSON.parse(localStorage.getItem('classPlans') || '[]'),
        classRecords: JSON.parse(localStorage.getItem('classRecords') || '[]'),
        progressEntries: JSON.parse(localStorage.getItem('progressEntries') || '[]'),
        attendanceRecords: JSON.parse(localStorage.getItem('attendanceRecords') || '[]'),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vocal-coach-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Datos exportados correctamente');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Error al exportar datos');
    }
  }

  function handleImportData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      try {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const text = await file.text();
        const data = JSON.parse(text);

        // Validar estructura básica
        const requiredKeys = ['students', 'classTypes', 'notes', 'melodies'];
        const hasValidStructure = requiredKeys.every(key => Array.isArray(data[key]));

        if (!hasValidStructure) {
          toast.error('Archivo de respaldo inválido');
          return;
        }

        // Restaurar datos
        Object.entries(data).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });

        toast.success('Datos importados correctamente. Recarga la página.');
      } catch (error) {
        console.error('Error importing data:', error);
        toast.error('Error al importar datos');
      }
    };
    input.click();
  }

  function handleClearAllData() {
    if (!confirm('¿Estás seguro de que deseas eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const keys = ['students', 'classTypes', 'notes', 'melodies', 'classPlans', 'classRecords', 'progressEntries', 'attendanceRecords'];
      keys.forEach(key => localStorage.removeItem(key));
      
      toast.success('Todos los datos han sido eliminados. Recarga la página.');
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error('Error al eliminar datos');
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Gestiona catálogos, plantillas y respaldos de datos
        </p>
      </div>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Datos</CardTitle>
          <CardDescription>
            Exporta, importa o elimina tus datos locales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Exportar Datos</p>
              <p className="text-sm text-muted-foreground">
                Descarga un respaldo JSON de todos tus datos
              </p>
            </div>
            <Button onClick={handleExportData} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Importar Datos</p>
              <p className="text-sm text-muted-foreground">
                Restaura datos desde un archivo de respaldo JSON
              </p>
            </div>
            <Button onClick={handleImportData} variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Importar
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Eliminar Todos los Datos</p>
              <p className="text-sm text-muted-foreground">
                Borra permanentemente todos los datos de la aplicación
              </p>
            </div>
            <Button onClick={handleClearAllData} variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar Todo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder Sections */}
      <Alert>
        <SettingsIcon className="h-4 w-4" />
        <AlertTitle>🔴 PLACEHOLDER: Configuración Avanzada</AlertTitle>
        <AlertDescription className="mt-2 space-y-2">
          <p>Secciones de configuración pendientes de implementación:</p>
          
          <div className="mt-4 space-y-3">
            <div>
              <p className="font-semibold text-sm">📋 Gestión de Catálogos:</p>
              <ul className="list-disc list-inside space-y-1 text-xs ml-4">
                <li>Editar tipos de clases</li>
                <li>Gestionar niveles personalizados</li>
                <li>Administrar etiquetas globales</li>
                <li>Categorías de notas</li>
                <li>Opciones de evaluación técnica</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-sm">📝 Plantillas:</p>
              <ul className="list-disc list-inside space-y-1 text-xs ml-4">
                <li>Plantillas de planificación de clases</li>
                <li>Plantillas de evaluación</li>
                <li>Plantillas de reportes</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-sm">⚙️ Preferencias de Usuario:</p>
              <ul className="list-disc list-inside space-y-1 text-xs ml-4">
                <li>Tema claro/oscuro</li>
                <li>Formato de fecha predeterminado</li>
                <li>Vista predeterminada (lista/grid)</li>
                <li>Notificaciones y recordatorios</li>
              </ul>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Database className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2">💾 Sobre el Almacenamiento Local</h3>
              <p className="text-sm text-muted-foreground">
                Esta aplicación MVP usa localStorage del navegador para almacenar todos los datos. 
                Los datos persisten mientras no limpies el caché del navegador. Se recomienda hacer 
                respaldos periódicos usando la función de exportación.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>Migración futura:</strong> Cuando se implemente el backend, los datos se 
                sincronizarán automáticamente con el servidor y estarán disponibles desde cualquier 
                dispositivo.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Versión:</span>
              <span className="font-medium">0.1.0 (MVP)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Persistencia:</span>
              <span className="font-medium">localStorage (temporal)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado:</span>
              <span className="font-medium">Frontend-only MVP</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
