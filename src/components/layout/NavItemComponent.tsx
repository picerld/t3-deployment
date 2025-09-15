import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";

export interface INavItem {
  name: string;
  href: string;
  active: boolean;
  children?: INavItem[];
}

const NavItemComponent: React.FC<{ 
  item: INavItem; 
  isMobile?: boolean;
  expandedItems: Set<string>;
  toggleExpanded: (name: string) => void;
}> = ({ item, isMobile = false, expandedItems, toggleExpanded }) => {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems.has(item.name);

  if (!hasChildren) {
    return (
      <Link key={item.name} href={item.href} className="group">
        <div
          className={`flex items-center border-b-4 border-black py-4 pl-5 text-lg ${
            item.active
              ? "bg-main group-hover:bg-main font-bold"
              : "group-hover:bg-main/70 font-semibold"
          }`}
        >
          {item.name}
        </div>
      </Link>
    );
  }

  return (
    <div key={item.name}>
      <div
        className={`flex items-center justify-between border-b-4 border-black py-4 pl-5 pr-3 text-lg cursor-pointer group ${
          item.active
            ? "bg-main group-hover:bg-main font-semibold"
            : "group-hover:bg-main/70"
        }`}
        onClick={() => toggleExpanded(item.name)}
      >
        <span>{item.name}</span>
        {isExpanded ? (
          <ChevronDown className="size-5" strokeWidth={2.5} />
        ) : (
          <ChevronRight className="size-5" strokeWidth={2.5} />
        )}
      </div>
      {isExpanded && (
        <div className="bg-gray-50 dark:bg-gray-800">
          {item.children!.map((child) => (
            <Link key={child.name} href={child.href} className="group">
              <div
                className={`flex items-center border-b-4 border-black py-3 pl-8 text-base ${
                  child.active
                    ? "bg-main group-hover:bg-main font-medium"
                    : "group-hover:bg-main/50"
                }`}
              >
                {child.name}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavItemComponent;