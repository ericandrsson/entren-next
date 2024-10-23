"use client";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/components/ui/tooltip";
import { Info } from "lucide-react";

export default function AdminPage() {
  function navigateTo(section: string) {
    // In a real application, you would use a router to navigate to the appropriate page
    console.log(`Navigating to ${section}`);
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending Places</TabsTrigger>
            <TabsTrigger value="recent">Recent Approvals</TabsTrigger>
            <TabsTrigger value="flagged">Flagged Reports</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <InfoCard
          title="Total Places"
          value="1,234"
          description="Number of registered places"
          color="bg-green-100"
          textColor="text-green-800"
          tooltip="Includes all approved and pending places in the database"
          onClick={() => navigateTo("places")}
        />
        <InfoCard
          title="Total Entrances"
          value="5,678"
          description="Number of registered entrances"
          color="bg-blue-100"
          textColor="text-blue-800"
          tooltip="Sum of all entrances across all registered places"
          onClick={() => navigateTo("entrances")}
        />
        <InfoCard
          title="Pending Reviews"
          value="42"
          description="User contributions awaiting review"
          color="bg-yellow-100"
          textColor="text-yellow-800"
          tooltip="Includes new places (15), entrance updates (20), and photos (7)"
          onClick={() => navigateTo("contributions")}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <ActivityFeed />
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Key metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>New Users (Last 7 days)</span>
                <span className="font-semibold">127</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Active Moderators</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Average Review Time</span>
                <span className="font-semibold">2.3 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Places Added (This Month)</span>
                <span className="font-semibold">342</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoCard({ title, value, description, color, textColor, tooltip, onClick }) {
  return (
    <TooltipProvider>
      <Card className={`${color} cursor-pointer transition-transform hover:scale-105`} onClick={onClick}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className={textColor}>{title}</CardTitle>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className={`text-4xl font-bold ${textColor}`}>{value}</p>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

function ActivityFeed() {
  const activities = [
    { type: "place", action: "added", name: "Central Park", time: "5 minutes ago" },
    { type: "entrance", action: "updated", name: "Main St. Library", time: "15 minutes ago" },
    { type: "report", action: "submitted", name: "Incorrect hours for City Hall", time: "1 hour ago" },
    { type: "place", action: "approved", name: "Downtown Cafe", time: "2 hours ago" },
    { type: "entrance", action: "rejected", name: "Sports Arena Gate B", time: "3 hours ago" },
    { type: "user", action: "registered", name: "John Doe", time: "5 hours ago" },
  ];

  function getIcon(type) {
    switch (type) {
      case "place":
        return "🏢";
      case "entrance":
        return "🚪";
      case "report":
        return "⚠️";
      case "user":
        return "👤";
      default:
        return "📝";
    }
  }

  function getActionColor(action) {
    switch (action) {
      case "added":
      case "approved":
        return "text-green-600";
      case "updated":
        return "text-blue-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  }

  return (
    <ul className="space-y-4">
      {activities.map((activity, index) => (
        <li key={index} className="flex items-start space-x-2 rounded-md p-2 hover:bg-gray-50">
          <span className="text-2xl">{getIcon(activity.type)}</span>
          <div className="flex-1">
            <p className="text-sm">
              <span className={getActionColor(activity.action)}>{activity.action}</span> {activity.name}
            </p>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              View
            </Button>
            {activity.type !== "user" && (
              <Button variant="outline" size="sm">
                {activity.action === "rejected" ? "Approve" : "Edit"}
              </Button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
