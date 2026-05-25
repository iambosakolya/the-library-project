'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import {
  mergeBookSubmission,
  searchCatalog,
} from '@/lib/actions/book-submission.actions';
import type { SearchResult } from '../shared/types';
import { mergeDialogStyles as styles } from './styles';
import { MergeDialogProps } from '../shared/types';

export default function MergeDialog({
  open,
  onOpenChange,
  submissionId,
  initialQuery,
}: MergeDialogProps) {
  const { toast } = useToast();
  const [isMerging, setIsMerging] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const result = await searchCatalog(searchQuery);
      if (result.success && result.data) {
        setSearchResults(result.data);
        if (result.data.length === 0) {
          toast({ description: 'No matching books found in catalog' });
        }
      }
    } catch {
      toast({
        variant: 'destructive',
        description: 'Error searching catalog',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleMerge = async () => {
    if (!selectedProductId) {
      toast({
        variant: 'destructive',
        description: 'Please select a product to merge with',
      });
      return;
    }

    setIsMerging(true);
    try {
      const result = await mergeBookSubmission(submissionId, selectedProductId);
      if (result.success) {
        toast({ description: result.message });
        onOpenChange(false);
        setSelectedProductId(null);
        setSearchQuery('');
        setSearchResults([]);
      } else {
        toast({ variant: 'destructive', description: result.message });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description:
          error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.content}>
        <DialogHeader>
          <DialogTitle>Merge with Existing Book</DialogTitle>
          <DialogDescription>
            Search for an existing book in the catalog to merge this submission
            with.
          </DialogDescription>
        </DialogHeader>
        <div className={styles.formSection}>
          <div className={styles.searchRow}>
            <Input
              placeholder='Search by title or author...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Search className='h-4 w-4' />
              )}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className={styles.resultsWrapper}>
              <p className={styles.resultsHint}>Select a book to merge with:</p>
              {searchResults.map((book) => (
                <button
                  type='button'
                  key={book.id}
                  onClick={() => setSelectedProductId(book.id)}
                  className={`${styles.card} ${
                    selectedProductId === book.id ? styles.cardSelected : ''
                  }`}
                >
                  {book.images && book.images[0] && (
                    <Image
                      src={book.images[0]}
                      alt={book.name}
                      width={60}
                      height={90}
                      className={styles.cardImage}
                    />
                  )}
                  <div className={styles.cardInfo}>
                    <p className={styles.cardTitle}>{book.name}</p>
                    <p className={styles.cardAuthor}>{book.author}</p>
                    {selectedProductId === book.id && (
                      <p className={styles.cardCheck}>✓ Selected</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleMerge}
            disabled={isMerging || !selectedProductId}
          >
            {isMerging ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Merging...
              </>
            ) : (
              'Merge Submission'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
