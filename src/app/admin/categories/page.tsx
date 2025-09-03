'use client'

import React, { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { 
  Tags,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Hash,
  Palette,
  Zap,
  Brain,
  Users,
  TrendingUp
} from 'lucide-react'

// Mock data - in produzione verrebbe da Convex
const mockCategories = [
  {
    _id: '1',
    name: 'Manutenzioni',
    slug: 'manutenzioni',
    description: 'Richieste di manutenzione strutture e impianti',
    isActive: true,
    depth: 0,
    order: 0,
    synonyms: ['manutenzione', 'riparazione', 'guasto', 'impianti'],
    tagCount: 12,
    ticketCount: 45,
    usageCount: 234
  },
  {
    _id: '2',
    name: 'Elettromedicali',
    slug: 'elettromedicali',
    description: 'Assistenza e manutenzione apparecchiature elettromedicali',
    isActive: true,
    depth: 0,
    order: 1,
    synonyms: ['elettromedicale', 'apparecchiature', 'calibrazione', 'biomed'],
    tagCount: 8,
    ticketCount: 32,
    usageCount: 189
  },
  {
    _id: '3',
    name: 'Hardware Computer',
    slug: 'hardware-computer',
    description: 'Supporto hardware per computer e dispositivi IT',
    isActive: true,
    depth: 0,
    order: 2,
    synonyms: ['hardware', 'computer', 'pc', 'stampante', 'rete'],
    tagCount: 15,
    ticketCount: 67,
    usageCount: 345
  }
]

const mockTags = [
  {
    _id: '1',
    name: 'urgente',
    slug: 'urgente',
    description: 'Richiesta che richiede attenzione immediata',
    categoryId: '1',
    categoryName: 'Manutenzioni',
    color: '#ef4444',
    usageCount: 89,
    aiGenerated: false,
    isActive: true
  },
  {
    _id: '2',
    name: 'calibrazione',
    slug: 'calibrazione',
    description: 'Richiesta di calibrazione strumenti',
    categoryId: '2',
    categoryName: 'Elettromedicali',
    color: '#3b82f6',
    usageCount: 45,
    aiGenerated: true,
    isActive: true
  },
  {
    _id: '3',
    name: 'rete-wifi',
    slug: 'rete-wifi',
    description: 'Problemi connettività WiFi',
    categoryId: '3',
    categoryName: 'Hardware Computer',
    color: '#10b981',
    usageCount: 123,
    aiGenerated: false,
    isActive: true
  }
]

export default function AdminCategoriesPage() {
  const [activeTab, setActiveTab] = useState<'categories' | 'tags'>('categories')
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createType, setCreateType] = useState<'category' | 'tag'>('category')

  const filteredCategories = mockCategories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.synonyms.some(syn => syn.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const filteredTags = mockTags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Tags className="h-8 w-8 mr-3 text-blue-600" />
              Gestione Categorie e Tag
            </h1>
            <p className="text-gray-600 mt-2">
              Gestisci categorie e tag per la classificazione intelligente dei ticket
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => {
                setCreateType('tag')
                setShowCreateForm(true)
              }}
            >
              <Hash className="w-4 h-4 mr-2" />
              Nuovo Tag
            </Button>
            <Button 
              onClick={() => {
                setCreateType('category')
                setShowCreateForm(true)
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuova Categoria
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Categorie Totali</p>
                  <p className="text-2xl font-bold text-gray-900">{mockCategories.length}</p>
                </div>
                <Tags className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tag Totali</p>
                  <p className="text-2xl font-bold text-gray-900">{mockTags.length}</p>
                </div>
                <Hash className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tag AI Generati</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockTags.filter(t => t.aiGenerated).length}
                  </p>
                </div>
                <Brain className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Utilizzi Totali</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockTags.reduce((sum, t) => sum + t.usageCount, 0)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cerca categorie, tag, descrizioni..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'categories' ? 'default' : 'outline'}
              onClick={() => setActiveTab('categories')}
            >
              <Tags className="w-4 h-4 mr-2" />
              Categorie ({mockCategories.length})
            </Button>
            <Button
              variant={activeTab === 'tags' ? 'default' : 'outline'}
              onClick={() => setActiveTab('tags')}
            >
              <Hash className="w-4 h-4 mr-2" />
              Tag ({mockTags.length})
            </Button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'categories' ? (
          /* Categories View */
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Card key={category._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                        {category.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {category.description}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{category.tagCount}</div>
                      <div className="text-xs text-blue-600">Tag</div>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{category.ticketCount}</div>
                      <div className="text-xs text-green-600">Ticket</div>
                    </div>
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">{category.usageCount}</div>
                      <div className="text-xs text-purple-600">Utilizzi</div>
                    </div>
                  </div>
                  
                  {/* Synonyms */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Sinonimi:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.synonyms.slice(0, 4).map((synonym, index) => (
                        <Badge key={index} variant="secondary" size="sm">
                          {synonym}
                        </Badge>
                      ))}
                      {category.synonyms.length > 4 && (
                        <Badge variant="secondary" size="sm">
                          +{category.synonyms.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <Badge variant={category.isActive ? 'success' : 'secondary'}>
                      {category.isActive ? 'Attiva' : 'Inattiva'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Ordine: {category.order}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Tags View */
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTags.map((tag) => (
              <Card key={tag._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: tag.color }}
                      />
                      <h3 className="font-semibold text-gray-900">#{tag.name}</h3>
                      {tag.aiGenerated && (
                        <Badge variant="secondary" size="sm">
                          <Brain className="h-3 w-3 mr-1" />
                          AI
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {tag.description && (
                    <p className="text-sm text-gray-600 mb-3">{tag.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-500">
                        📁 {tag.categoryName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{tag.usageCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Form Modal (placeholder) */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>
                  Crea Nuov{createType === 'category' ? 'a Categoria' : 'o Tag'}
                </CardTitle>
                <CardDescription>
                  {createType === 'category' 
                    ? 'Aggiungi una nuova categoria per classificare i ticket'
                    : 'Aggiungi un nuovo tag per dettagliare le problematiche'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Nome" />
                <Textarea placeholder="Descrizione (opzionale)" />
                {createType === 'tag' && (
                  <>
                    <select className="w-full p-2 border rounded-md">
                      <option>Seleziona categoria (opzionale)</option>
                      {mockCategories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                    <Input placeholder="Colore (es. #3b82f6)" />
                  </>
                )}
                <Input placeholder="Sinonimi (separati da virgola)" />
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                  >
                    Annulla
                  </Button>
                  <Button onClick={() => setShowCreateForm(false)}>
                    Crea {createType === 'category' ? 'Categoria' : 'Tag'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
