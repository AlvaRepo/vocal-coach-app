// features/students/pages/StudentsListPage.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, UserCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { studentRepository } from '@/entities/student/repository';
import {
  getStudentFullName,
  getStudentInitials,
  getStatusColor,
  getStatusLabel,
  getLevelLabel,
} from '@/entities/student/utils';
import type { Student } from '@/shared/types/domain';

export function StudentsListPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = students.filter(
        (student) =>
          getStudentFullName(student).toLowerCase().includes(query) ||
          student.email?.toLowerCase().includes(query) ||
          student.vocalRange?.toLowerCase().includes(query) ||
          student.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  async function loadStudents() {
    try {
      const data = await studentRepository.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Cargando alumnos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alumnos</h1>
          <p className="text-muted-foreground">
            Gestiona tu lista de alumnos
          </p>
        </div>
        <Button asChild>
          <Link to="/students/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Alumno
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar alumnos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <UserCircle className="h-16 w-16 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium">
              {searchQuery ? 'No se encontraron alumnos' : 'No hay alumnos aún'}
            </p>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? 'Intenta con otra búsqueda'
                : 'Comienza agregando tu primer alumno'}
            </p>
            {!searchQuery && (
              <Button asChild className="mt-4">
                <Link to="/students/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Alumno
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => (
            <Link key={student.id} to={`/students/${student.id}`}>
              <Card className="transition-all hover:shadow-md hover:border-primary/50 overflow-hidden">
                {student.photoUrl && (
                  <div className="h-32 overflow-hidden">
                    <img 
                      src={student.photoUrl} 
                      alt={getStudentFullName(student)}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start gap-4">
                    {student.photoUrl ? (
                      <Avatar className="h-12 w-12">
                        <img 
                          src={student.photoUrl} 
                          alt={getStudentFullName(student)}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.textContent = getStudentInitials(student);
                          }}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getStudentInitials(student)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getStudentInitials(student)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">
                        {getStudentFullName(student)}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={getStatusColor(student.status)}>
                          {getStatusLabel(student.status)}
                        </Badge>
                        {student.vocalRange && student.vocalRange !== 'undefined' && (
                          <Badge variant="outline">
                            {student.vocalRange}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nivel:</span>
                      <span className="font-medium">{getLevelLabel(student.level)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span className="font-medium">
                        {student.type === 'choir' && 'Coro'}
                        {student.type === 'private' && 'Particular'}
                        {student.type === 'both' && 'Ambos'}
                      </span>
                    </div>
                    {student.tags && student.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-2">
                        {student.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {student.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{student.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Results count */}
      {filteredStudents.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Mostrando {filteredStudents.length} de {students.length} alumnos
        </p>
      )}
    </div>
  );
}
