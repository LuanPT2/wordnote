import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  ChevronRight, 
  ChevronLeft, 
  Filter, 
  X,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FilterSidebarProps {
  children: React.ReactNode;
  title?: string;
  filterCount?: number;
}

export function FilterSidebar({ 
  children, 
  title = "Bộ lọc",
  filterCount = 0
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Thin Bar - Always visible on the left */}
      <div className="fixed left-0 top-0 h-full z-40 flex items-center">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative h-40 w-6 flex flex-col items-center justify-center gap-3 rounded-r-xl shadow-xl transition-all duration-300 ${
            isOpen 
              ? 'bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 text-white' 
              : 'bg-gradient-to-b from-slate-700 via-slate-600 to-slate-500 text-white hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600'
          }`}
          whileHover={{ scale: 1.05, width: 28 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Top icon - vertical line */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-0.5 h-8 bg-white/40 rounded-full"></div>
          </div>
          
          {/* Middle icon - arrow */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.div>
          
          {/* Bottom icon - vertical line */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-0.5 h-8 bg-white/40 rounded-full"></div>
          </div>
          
          {/* Filter count badge */}
          {!isOpen && filterCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white"
            >
              {filterCount}
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Sidebar Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: -350 }}
              animate={{ x: 0 }}
              exit={{ x: -350 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-[350px] shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Background with gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/50"></div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100/40 to-purple-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100/40 to-indigo-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
              
              {/* Content */}
              <div className="relative flex flex-col h-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm ring-2 ring-white/30">
                        <Filter className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                          {title}
                          {filterCount > 0 && (
                            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg">
                              {filterCount}
                            </Badge>
                          )}
                        </h2>
                        <p className="text-xs text-white/80 mt-0.5 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Tìm kiếm nâng cao
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:bg-white/20 h-9 w-9 p-0 rounded-xl"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-6">
                    {children}
                  </div>
                </ScrollArea>

                {/* Footer */}
                <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm p-4 shadow-lg relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-pink-50/50"></div>
                  <div className="relative flex items-center justify-between">
                    <div className="text-xs text-gray-600 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">Đồng bộ tự động</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="rounded-xl border-2 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Đóng
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
