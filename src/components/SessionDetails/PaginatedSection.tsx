// PaginatedSection.tsx
import React from 'react'
import PaginationControls from '../PaginationControls'
import NotFoundElement from '../NotFoundElement'

interface PaginatedSectionProps {
  title: string
  total: number
  totalPages: number
  currentPage: number
  limit: number
  notFoundMessage: string
  countLabel: string
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  extraHeaderContent?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export default function PaginatedSection({
  title,
  total,
  totalPages,
  currentPage,
  limit,
  notFoundMessage,
  countLabel,
  onPageChange,
  onLimitChange,
  extraHeaderContent,
  children,
  className = "",
}: PaginatedSectionProps) {
  const handleWithinBounds = (num: number) => {
    if (num < 1) return 1
    if (num > totalPages) return totalPages
    return num
  }

  const handleNextPrev = (num: number) => {
    const oldPage = Number(currentPage)
    const newPage = oldPage + num
    const guardedPage = handleWithinBounds(newPage)
    onPageChange(guardedPage)
  }

  return (
    <div className={`bg-white shadow-md rounded-lg p-4 sm:p-8 ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-xl font-semibold">{title}</h2>
        {extraHeaderContent && <div>{extraHeaderContent}</div>}
      </div>
      <div className="space-y-4">
        {total === 0 ? (
          <NotFoundElement message={notFoundMessage} />
        ) : (
          <>
            <p className="text-sm">
              {total} {countLabel}
            </p>
            {children}
            {totalPages > 1 && (
              <PaginationControls
                className="mt-4"
                pageCount={totalPages}
                pageIndex={currentPage}
                pageSize={limit}
                setPageIndex={(num: number) => onPageChange(handleWithinBounds(num))}
                setPageSize={onLimitChange}
                nextPage={() => handleNextPrev(1)}
                previousPage={() => handleNextPrev(-1)}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
