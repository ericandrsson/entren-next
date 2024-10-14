import Icons from "@/src/components/icons";

type IconCategory = keyof typeof Icons;
type IconName<T extends IconCategory> = keyof (typeof Icons)[T];

interface IconProps<T extends IconCategory> {
  category: T;
  name: IconName<T>;
  size?: "small" | "medium" | "large";
  color?: string;
  // Add any other props you need
}

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

  return <IconComponent size={size} color={color} {...props} />;
};
