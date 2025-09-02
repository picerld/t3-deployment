import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type DocumentItemPaginationProps = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

export const DocumentItemPagination: React.FC<DocumentItemPaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  return (
    <div className="flex items-center justify-center space-x-2 pt-10">
      <Button
        variant="neutral"
        size="sm"
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
        Sebelumnya
      </Button>

      <div className="flex items-center space-x-1">
        {(() => {
          const delta = 2;
          const range = [];
          const rangeWithDots = [];

          for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
          ) {
            range.push(i);
          }

          if (currentPage - delta > 2) {
            rangeWithDots.push(1, "...");
          } else {
            rangeWithDots.push(1);
          }

          rangeWithDots.push(...range);

          if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push("...", totalPages);
          } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
          }

          return rangeWithDots.map((page, index) => {
            if (page === "...") {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                  ...
                </span>
              );
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "neutral"}
                size="sm"
                onClick={() => setCurrentPage(page as number)}
                className="w-10"
              >
                {page}
              </Button>
            );
          });
        })()}
      </div>

      <Button
        variant="neutral"
        size="sm"
        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}
      >
        Selanjutnya
        <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
      </Button>
    </div>
  );
};
