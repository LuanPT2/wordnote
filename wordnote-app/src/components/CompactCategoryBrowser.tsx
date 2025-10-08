import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Folder, 
  FolderOpen, 
  FileText,
  Settings
} from 'lucide-react';
import { vocabularyLibrary } from '../lib/vocabulary-library';
import { Category, VocabularyItem } from '../lib/vocabulary-types';
import { CategoryManager } from './CategoryManager';

interface CategoryNode extends Category {
  children: CategoryNode[];
  vocabularyCount: number;
  level: number;
}

interface CompactCategoryBrowserProps {
  onCategorySelect?: (category: Category | null) => void;
  onVocabularySelect?: (vocabulary: VocabularyItem[]) => void;
  selectedCategoryId?: string;
  showManageButton?: boolean;
  className?: string;
}

export function CompactCategoryBrowser({ 
  onCategorySelect, 
  onVocabularySelect,
  selectedCategoryId,
  showManageButton = true,
  className = '' 
}: CompactCategoryBrowserProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    buildCategoryTree();
  }, [categories, vocabulary, expandedCategories]);

  const loadData = () => {
    const cats = vocabularyLibrary.getCategories();
    const vocab = vocabularyLibrary.getAllVocabulary();
    setCategories(cats);
    setVocabulary(vocab);
  };

  const buildCategoryTree = () => {
    const buildTree = (parentId?: string, level: number = 0): CategoryNode[] => {
      return categories
        .filter(cat => cat.parentId === parentId)
        .map(cat => {
          const vocabularyCount = vocabulary.filter(v => v.category === cat.name).length;
          const children = buildTree(cat.id, level + 1);
          return {
            ...cat,
            children,
            vocabularyCount,
            level
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name));
    };

    setCategoryTree(buildTree());
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategoryClick = (category: CategoryNode) => {
    // If has children, toggle expand
    if (category.children.length > 0) {
      toggleCategory(category.id);
    }
    
    // Always select the category
    onCategorySelect?.(category);
    
    // Get vocabulary for this category
    const categoryVocab = vocabulary.filter(v => v.category === category.name);
    onVocabularySelect?.(categoryVocab);
  };

  const renderCategoryTree = (nodes: CategoryNode[]): React.ReactNode => {
    return nodes.map(node => {
      const isExpanded = expandedCategories.has(node.id);
      const hasChildren = node.children.length > 0;
      const isSelected = selectedCategoryId === node.id;

      return (
        <div key={node.id}>
          <div 
            className={`flex items-center py-1.5 px-2 cursor-pointer hover:bg-muted/50 rounded text-sm transition-colors ${
              isSelected ? 'bg-primary/10 border border-primary/20' : ''
            }`}
            onClick={() => handleCategoryClick(node)}
            style={{ paddingLeft: `${8 + node.level * 8}px` }}
          >
            {hasChildren ? (
              isExpanded ? (
                <FolderOpen className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              ) : (
                <Folder className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              )
            ) : (
              <FileText className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
            )}
            
            <div className="flex-1 flex items-center space-x-2">
              <span className="text-xs">{node.name}</span>
              <Badge className={`text-xs ${node.color || 'bg-gray-100 text-gray-800'}`}>
                {node.vocabularyCount}
              </Badge>
            </div>
          </div>
          
          {hasChildren && isExpanded && (
            <div>
              {renderCategoryTree(node.children)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Danh mục ({categories.length})</h4>
        {showManageButton && (
          <CategoryManager 
            trigger={
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            }
            onCategorySelect={onCategorySelect}
            onVocabularySelect={onVocabularySelect}
          />
        )}
      </div>

      <ScrollArea className="h-[300px]">
        {categoryTree.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Chưa có danh mục nào</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {renderCategoryTree(categoryTree)}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}