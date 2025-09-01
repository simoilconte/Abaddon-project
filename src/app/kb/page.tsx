'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useRole } from '@/providers/RoleProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  Search, 
  BookOpen, 
  Star, 
  Clock, 
  Eye, 
  ThumbsUp,
  Filter,
  Plus,
  ArrowRight
} from 'lucide-react';

const kbArticles = [
  {
    id: 1,
    title: 'Come resettare la password del sistema',
    excerpt: 'Guida passo-passo per il reset della password in caso di smarrimento...',
    category: 'Account',
    views: 245,
    likes: 18,
    lastUpdated: '2 giorni fa',
    featured: true,
    difficulty: 'Facile'
  },
  {
    id: 2,
    title: 'Configurazione stampante di rete',
    excerpt: 'Procedura completa per configurare le stampanti condivise nella rete clinica...',
    category: 'Hardware',
    views: 189,
    likes: 12,
    lastUpdated: '1 settimana fa',
    featured: false,
    difficulty: 'Medio'
  },
  {
    id: 3,
    title: 'Backup automatico dei dati paziente',
    excerpt: 'Come verificare e configurare il sistema di backup automatico per garantire la sicurezza dei dati...',
    category: 'Sicurezza',
    views: 156,
    likes: 24,
    lastUpdated: '3 giorni fa',
    featured: true,
    difficulty: 'Avanzato'
  },
  {
    id: 4,
    title: 'Gestione appuntamenti: problemi comuni',
    excerpt: 'Risoluzione dei problemi più frequenti nel sistema di gestione appuntamenti...',
    category: 'Software',
    views: 298,
    likes: 31,
    lastUpdated: '5 giorni fa',
    featured: false,
    difficulty: 'Facile'
  },
  {
    id: 5,
    title: 'Connessione VPN per lavoro remoto',
    excerpt: 'Guida completa per configurare la VPN e accedere ai sistemi clinici da remoto...',
    category: 'Rete',
    views: 167,
    likes: 15,
    lastUpdated: '1 settimana fa',
    featured: false,
    difficulty: 'Medio'
  }
];

const categories = ['Tutti', 'Account', 'Hardware', 'Software', 'Rete', 'Sicurezza'];

export default function KnowledgeBasePage() {
  const { user } = useRole();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tutti');
  const [sortBy, setSortBy] = useState('popular');

  const filteredArticles = kbArticles
    .filter(article => 
      (selectedCategory === 'Tutti' || article.category === selectedCategory) &&
      (searchTerm === '' || 
       article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'popular') return b.views - a.views;
      if (sortBy === 'recent') return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      if (sortBy === 'liked') return b.likes - a.likes;
      return 0;
    });

  const featuredArticles = kbArticles.filter(article => article.featured);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BookOpen className="h-6 w-6 mr-2 text-blue-600" />
              Knowledge Base
            </h1>
            <p className="text-gray-600">Trova risposte rapide ai problemi più comuni</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Suggerisci Articolo
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Cerca articoli, guide, soluzioni..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popular">Più Popolari</option>
                  <option value="recent">Più Recenti</option>
                  <option value="liked">Più Apprezzati</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Articles */}
        {searchTerm === '' && selectedCategory === 'Tutti' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Articoli in Evidenza
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="warning" size="sm">In Evidenza</Badge>
                      <Badge 
                        variant={
                          article.difficulty === 'Facile' ? 'success' : 
                          article.difficulty === 'Medio' ? 'warning' : 'danger'
                        }
                        size="sm"
                      >
                        {article.difficulty}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {article.views}
                        </span>
                        <span className="flex items-center">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {article.likes}
                        </span>
                      </div>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {article.lastUpdated}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Articles */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {searchTerm || selectedCategory !== 'Tutti' ? 'Risultati' : 'Tutti gli Articoli'} 
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredArticles.length} articoli)
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="default" size="sm">{article.category}</Badge>
                        <Badge 
                          variant={
                            article.difficulty === 'Facile' ? 'success' : 
                            article.difficulty === 'Medio' ? 'warning' : 'danger'
                          }
                          size="sm"
                        >
                          {article.difficulty}
                        </Badge>
                        {article.featured && (
                          <Badge variant="warning" size="sm">
                            <Star className="h-3 w-3 mr-1" />
                            In Evidenza
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                      <p className="text-gray-600 mb-3">{article.excerpt}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {article.views} visualizzazioni
                        </span>
                        <span className="flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {article.likes} mi piace
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Aggiornato {article.lastUpdated}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun articolo trovato</h3>
                <p className="text-gray-600 mb-4">
                  Non abbiamo trovato articoli che corrispondono ai tuoi criteri di ricerca.
                </p>
                <Button variant="outline">
                  Suggerisci un nuovo articolo
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}