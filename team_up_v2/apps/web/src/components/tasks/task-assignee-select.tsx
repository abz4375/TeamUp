"use client";

import * as React from "react";
import { trpc } from "@/lib/trpc/client";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Users, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TaskAssigneeSelectProps {
  projectId: string;
  selectedUserIds: string[];
  onChange: (userIds: string[]) => void;
}

export function TaskAssigneeSelect({
  projectId,
  selectedUserIds,
  onChange,
}: TaskAssigneeSelectProps) {
  const { data: members, isLoading } = trpc.project.getMembers.useQuery({
    id: projectId,
  });

  const handleToggle = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      onChange(selectedUserIds.filter((id) => id !== userId));
    } else {
      onChange([...selectedUserIds, userId]);
    }
  };

  return (
    <div className="space-y-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="w-full justify-between gap-2 h-9 px-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <Users className="h-4 w-4 shrink-0 opacity-70" />
              <span className="truncate">
                {selectedUserIds.length === 0
                  ? "Assign to..."
                  : `${selectedUserIds.length} Assigned`}
              </span>
            </div>
            {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin opacity-50" />
            ) : (
                <div className="flex items-center gap-1">
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full font-medium">
                        {members?.length || 0}
                    </span>
                </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="start">
          <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Project Members</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          ) : !members || members.length === 0 ? (
            <div className="px-2 py-6 text-center text-sm text-muted-foreground">
              No members found in this project.
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto">
                {members.map((user) => (
                <DropdownMenuCheckboxItem
                    key={user.id}
                    checked={selectedUserIds.includes(user.id)}
                    onCheckedChange={() => handleToggle(user.id)}
                    className="gap-2 cursor-pointer py-2"
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                    <div className="h-6 w-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
                        {(user.name || "U").charAt(0)}
                    </div>
                    <span className="truncate text-sm font-medium">{user.name}</span>
                    </div>
                </DropdownMenuCheckboxItem>
                ))}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedUserIds.length > 0 && members && (
        <div className="flex flex-wrap gap-1.5 px-0.5">
          {members
            .filter((m) => selectedUserIds.includes(m.id))
            .map((user) => (
              <Badge key={user.id} variant="secondary" className="text-[10px] py-0.5 pl-1.5 pr-2 gap-1.5 items-center">
                <div className="w-3.5 h-3.5 rounded-full bg-primary/20 flex items-center justify-center text-[7px] font-bold">
                    {(user.name || "U").charAt(0)}
                </div>
                {user.name}
              </Badge>
            ))}
        </div>
      )}
    </div>
  );
}
