import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { Item } from "@/types/item";
import { Hash, MapPin, Package, Palette, User } from "lucide-react";

export const MultiPrintItemCard = ({
  item,
  selectedItems,
  handleItemSelect,
}: {
  item: Item;
  selectedItems: string[];
  handleItemSelect: (id: string, checked: boolean) => void;
}) => {
  return (
    <Card
      key={item.id}
      className={`cursor-pointer transition-all ${
        selectedItems.includes(item.id) ? "bg-main" : ""
      }`}
      onClick={() =>
        handleItemSelect(item.id, !selectedItems.includes(item.id))
      }
    >
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <Checkbox
            checked={selectedItems.includes(item.id)}
            onChange={() => {}}
            className="mt-1"
          />
          <Badge variant="neutral" className="text-xs">
            {item.condition}
          </Badge>
        </div>

        <div className="space-y-2">
          <h3 className="line-clamp-2 text-lg font-bold">{item.name}</h3>

          <div className="space-y-1 text-xs text-gray-600">
            {item.serialNumber && (
              <div className="flex items-center gap-1">
                <Hash className="h-3 w-3" />
                <span>{item.serialNumber}</span>
              </div>
            )}

            {item.category?.name && (
              <div className="flex items-center gap-1">
                <Package className="h-3 w-3" />
                <span>{item.category.name}</span>
              </div>
            )}

            {item.location?.name && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{item.location.name}</span>
              </div>
            )}

            {item?.user?.name && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{item.user.name}</span>
              </div>
            )}

            {item.color && (
              <div className="flex items-center gap-1">
                <Palette className="h-3 w-3" />
                <span>{item.color}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium">
              Kuantiti: {item.quantity}
            </span>
            {item.merk && (
              <Badge variant="neutral" className="text-xs">
                {item.merk}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
