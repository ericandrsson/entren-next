import Icons from "@/src/components/icons";
import { categoryToIconNameMap } from "../utils/icons";

type IconCategory = keyof typeof Icons;
type IconName<T extends IconCategory> = keyof (typeof Icons)[T];

interface IconProps<T extends IconCategory> {
  category: T;
  name: IconName<T>;
  size?: "small" | "medium" | "large";
  color?: string;
  // Add any other props you need
}

const sizeMap = {
  small: "w-4 h-4",
  medium: "w-6 h-6",
  large: "w-8 h-8",
};

export const Icon = <T extends IconCategory>({
  category,
  name,
  size = "medium",
  color,
  ...props
}: IconProps<T>) => {
  const IconComponent = Icons[category][name] as React.ComponentType<any>;

  if (typeof IconComponent !== "function") {
    console.warn(
      `Icon "${category}.${name}" not found or is not a valid component`,
    );
    return null;
  }

  const sizeClass = sizeMap[size];

  return (
    <IconComponent
      className={`${sizeClass} ${color ? `text-${color}` : ""}`}
      {...props}
    />
  );
};

export const MainCategoryIcon = ({
  category,
  size = "medium",
  color,
  ...props
}: Omit<IconProps<"mainCategories">, "name" | "category"> & {
  category: string;
}) => {
  const iconName = categoryToIconNameMap(category) || "undefined";
  return (
    <Icon
      category="mainCategories"
      name={iconName as IconName<"mainCategories">}
      size={size}
      color={color}
      {...props}
    />
  );
};
