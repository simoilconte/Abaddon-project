import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-blue-600 mb-4 animate-bounce">
            404
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Pagina non trovata
        </h1>
        <p className="text-gray-600 mb-8">
          Ops! La pagina che stai cercando non esiste o è stata spostata.
          Torna alla dashboard o usa la ricerca per trovare quello che cerchi.
        </p>

        {/* Actions */}
        <div className="space-y-4">
          <Link href="/dashboard" className="block">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <Home className="w-4 h-4 mr-2" />
              Torna alla Dashboard
            </Button>
          </Link>
          
          <div className="flex space-x-3">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/kb" className="flex-1">
              <Button variant="outline" className="w-full">
                <HelpCircle className="w-4 h-4 mr-2" />
                Aiuto
              </Button>
            </Link>
          </div>
        </div>

        {/* Suggestions */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Pagine popolari:
          </h3>
          <div className="space-y-2 text-sm">
            <Link href="/tickets/new" className="block text-blue-600 hover:text-blue-800">
              • Crea nuovo ticket
            </Link>
            <Link href="/kb" className="block text-blue-600 hover:text-blue-800">
              • Knowledge Base
            </Link>
            <Link href="/dashboard" className="block text-blue-600 hover:text-blue-800">
              • I miei ticket
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}