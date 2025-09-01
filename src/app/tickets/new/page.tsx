'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useRole } from '@/providers/RoleProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Upload, User, Tag } from 'lucide-react';
import Link from 'next/link';

const categories = [
  { value: 'tech-support', label: 'Supporto Tecnico' },
  { value: 'maintenance', label: 'Manutenzione' },
  { value: 'software', label: 'Software' },
  { value: 'hardware', label: 'Hardware' },
  { value: 'network', label: 'Rete' },
];

const priorities = [
  { value: 'low', label: 'Bassa' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
  { value: 'urgent', label: 'Urgente' },
];

export default function NewTicketPage() {
  const { user } = useRole();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    visibility: 'public',
    tags: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simula invio
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert('Ticket creato con successo! #1237');
    setIsSubmitting(false);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna alla Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nuovo Ticket</h1>
            <p className="text-gray-600">Crea una nuova richiesta di supporto</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dettagli del Ticket</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Titolo *"
                    placeholder="Descrivi brevemente il problema..."
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                  
                  <Textarea
                    label="Descrizione *"
                    placeholder="Fornisci una descrizione dettagliata del problema, inclusi i passaggi per riprodurlo..."
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Categoria *"
                      options={[{ value: '', label: 'Seleziona categoria...' }, ...categories]}
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      required
                    />
                    
                    <Select
                      label="Priorità"
                      options={priorities}
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    />
                  </div>

                  <Input
                    label="Tag"
                    placeholder="Aggiungi tag separati da virgola (es: urgente, server, database)"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    helperText="I tag aiutano a categorizzare e trovare i ticket più facilmente"
                  />
                </CardContent>
              </Card>

              {/* Allegati */}
              <Card>
                <CardHeader>
                  <CardTitle>Allegati</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Trascina i file qui o <span className="text-blue-600 font-medium">clicca per selezionare</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supportati: PDF, DOC, DOCX, JPG, PNG (max 10MB)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Informazioni */}
              <Card>
                <CardHeader>
                  <CardTitle>Informazioni</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.clinic}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Visibilità</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="visibility"
                          value="public"
                          checked={formData.visibility === 'public'}
                          onChange={(e) => setFormData({...formData, visibility: e.target.value})}
                          className="text-blue-600"
                        />
                        <span className="text-sm">Pubblico - Visibile a tutta la clinica</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="visibility"
                          value="private"
                          checked={formData.visibility === 'private'}
                          onChange={(e) => setFormData({...formData, visibility: e.target.value})}
                          className="text-blue-600"
                        />
                        <span className="text-sm">Privato - Solo per me</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preview Priority */}
              {formData.priority && (
                <Card>
                  <CardHeader>
                    <CardTitle>Anteprima</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4 text-gray-500" />
                        <Badge 
                          variant={
                            formData.priority === 'urgent' ? 'danger' : 
                            formData.priority === 'high' ? 'warning' : 
                            formData.priority === 'medium' ? 'info' : 'default'
                          }
                        >
                          {priorities.find(p => p.value === formData.priority)?.label}
                        </Badge>
                      </div>
                      {formData.visibility && (
                        <div className="flex items-center space-x-2">
                          <Badge variant={formData.visibility === 'public' ? 'success' : 'default'}>
                            {formData.visibility === 'public' ? 'Pubblico' : 'Privato'}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={!formData.title || !formData.description || !formData.category || isSubmitting}
                >
                  {isSubmitting ? 'Creazione in corso...' : 'Crea Ticket'}
                </Button>
                <Link href="/dashboard" className="block">
                  <Button variant="outline" className="w-full">
                    Annulla
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}